import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  signal,
} from '@angular/core';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType, NotFoundException } from '@zxing/library';
import { CapturedPhoto } from '../photo-capture/photo-capture.component';

type BarcodeDetectorCtor = new (config?: {
  formats?: string[];
}) => {
  detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
};

// Native BarcodeDetector is available in Chromium browsers (Android Chrome).
// iOS WebKit (including Chrome on iPhone) lacks it — we fall back to @zxing/browser.
function getNativeDetector(): BarcodeDetectorCtor | null {
  const w = window as unknown as { BarcodeDetector?: BarcodeDetectorCtor };
  return w.BarcodeDetector ?? null;
}

@Component({
  selector: 'app-camera-scanner',
  standalone: true,
  templateUrl: './camera-scanner.component.html',
  styleUrl: './camera-scanner.component.scss',
})
export class CameraScannerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoEl') videoElRef?: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasEl') canvasElRef?: ElementRef<HTMLCanvasElement>;

  // Parent-driven identification state. `failed` shows an error overlay
  // with retry + "scan barcode" buttons. (Parent closes the modal during
  // the actual Gemini call, so there's no 'busy' state shown here — the
  // inline message in donation-intake handles that feedback.)
  @Input() identifyState: 'idle' | 'failed' = 'idle';
  @Input() errorMessage = '';

  @Output() scanned = new EventEmitter<string>();
  @Output() captured = new EventEmitter<CapturedPhoto>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();

  readonly cameraStatus = signal<'starting' | 'ready' | 'error'>('starting');
  readonly cameraError = signal<string>('');
  // Photo mode is the default. Barcode is an opt-in side path triggered by
  // the "Scan barcode" button. Detection only runs while in barcode mode.
  readonly mode = signal<'photo' | 'barcode'>('photo');

  // DEBUG: on-screen diagnostics for troubleshooting iOS WebKit. Remove once fixed.
  readonly debugAttempts = signal(0);
  readonly debugVideoState = signal<string>('');
  readonly debugLastError = signal<string>('');

  private mediaStream: MediaStream | null = null;
  private detectInterval: number | null = null;
  private zxingControls: IScannerControls | null = null;
  private barcodeRunning = false;

  async ngAfterViewInit(): Promise<void> {
    await this.setupCamera();
  }

  // Just get the camera stream rendering — barcode detection is held off
  // until the user explicitly switches into barcode mode (saves battery on
  // the common photo path).
  private async setupCamera(): Promise<void> {
    const video = this.videoElRef?.nativeElement;
    if (!video) return;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });
      video.srcObject = this.mediaStream;
      await video.play();
      this.cameraStatus.set('ready');
    } catch (err) {
      console.error('Camera setup failed', err);
      this.debugLastError.set(`setup: ${String(err).slice(0, 60)}`);
      this.cameraStatus.set('error');
      this.cameraError.set('Could not access camera. Check browser permissions.');
    }
  }

  private async startBarcodeDetection(): Promise<void> {
    if (this.barcodeRunning) return;
    const video = this.videoElRef?.nativeElement;
    if (!video) return;
    this.barcodeRunning = true;

    const NativeDetector = getNativeDetector();
    if (NativeDetector) {
      const detector = new NativeDetector({
        formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39'],
      });
      this.detectInterval = window.setInterval(async () => {
        if (!this.barcodeRunning) return;
        this.debugAttempts.update((n) => n + 1);
        this.debugVideoState.set(
          `${video.videoWidth}x${video.videoHeight} rs=${video.readyState}`,
        );
        try {
          const results = await detector.detect(video);
          if (results.length > 0 && results[0]?.rawValue && this.barcodeRunning) {
            this.emitScanned(results[0].rawValue);
          }
        } catch (e) {
          this.debugLastError.set(String(e).slice(0, 80));
        }
      }, 250);
    } else {
      // ZXing fallback for browsers without native BarcodeDetector (iOS Safari).
      // decodeFromVideoElement uses the existing stream — we don't want zxing to
      // grab a new MediaStream since setupCamera already owns one.
      const hints = new Map<DecodeHintType, unknown>();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
      ]);
      hints.set(DecodeHintType.TRY_HARDER, true);

      const reader = new BrowserMultiFormatReader(hints);
      this.zxingControls = await reader.decodeFromVideoElement(
        video,
        (result, err) => {
          if (!this.barcodeRunning) return;
          this.debugAttempts.update((n) => n + 1);
          if (result) {
            this.emitScanned(result.getText());
            return;
          }
          if (err && !(err instanceof NotFoundException)) {
            this.debugLastError.set((err.message ?? String(err)).slice(0, 80));
          }
        },
      );
    }
  }

  private stopBarcodeDetection(): void {
    this.barcodeRunning = false;
    if (this.detectInterval !== null) {
      clearInterval(this.detectInterval);
      this.detectInterval = null;
    }
    if (this.zxingControls) {
      try {
        this.zxingControls.stop();
      } catch {
        // ignore
      }
      this.zxingControls = null;
    }
  }

  async toggleMode(): Promise<void> {
    if (this.mode() === 'photo') {
      this.mode.set('barcode');
      await this.startBarcodeDetection();
    } else {
      this.mode.set('photo');
      this.stopBarcodeDetection();
    }
  }

  // User taps the big capture button. Immediately snapshot the current
  // video frame and emit — no countdown, no auto-fallback. The parent
  // takes the photo to Gemini and flips identifyState to 'busy' / 'failed'.
  async capturePhoto(): Promise<void> {
    const video = this.videoElRef?.nativeElement;
    const canvas = this.canvasElRef?.nativeElement;
    if (!video || !canvas || !video.videoWidth) {
      this.cancelled.emit();
      return;
    }

    // Downscale to a max dimension before encoding. A phone's rear camera
    // streams at 1080p–4K; uploading that frame full-resolution (base64 JPEG)
    // overruns the extractProductFromImage callable's request-size limit, so
    // the photo never reaches Gemini and the user sees a bogus "couldn't
    // identify." Clamping to 1024px keeps the payload small while staying
    // sharp enough for vision extraction. Desktop webcams (~720p) were under
    // the limit already, which is why this only bit on mobile.
    const maxDim = 1024;
    const ratio = Math.min(
      maxDim / video.videoWidth,
      maxDim / video.videoHeight,
      1,
    );
    canvas.width = Math.round(video.videoWidth * ratio);
    canvas.height = Math.round(video.videoHeight * ratio);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      this.cancelled.emit();
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const base64 = dataUrl.split(',')[1] ?? '';
    this.captured.emit({ base64, mimeType: 'image/jpeg' });
  }

  // Called from the error overlay's "Try again" button.
  onRetry(): void {
    this.retry.emit();
  }

  // Called from the error overlay's "Scan barcode" button — switch into
  // barcode mode while still cleared of the error state by the parent.
  async onSwitchToBarcode(): Promise<void> {
    this.retry.emit();
    if (this.mode() !== 'barcode') {
      await this.toggleMode();
    }
  }

  async onCancel(): Promise<void> {
    await this.shutdown();
    this.cancelled.emit();
  }

  private emitScanned(code: string): void {
    const trimmed = code.trim();
    if (!trimmed) return;
    this.stopBarcodeDetection();
    this.scanned.emit(trimmed);
  }

  private async shutdown(): Promise<void> {
    this.stopBarcodeDetection();
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
  }

  async ngOnDestroy(): Promise<void> {
    await this.shutdown();
  }
}
