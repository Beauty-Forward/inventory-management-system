import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
  signal,
} from '@angular/core';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType, NotFoundException } from '@zxing/library';

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

  @Output() scanned = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  readonly status = signal<'starting' | 'scanning' | 'error'>('starting');
  readonly errorMessage = signal<string>('');

  // DEBUG: on-screen diagnostics for troubleshooting iOS WebKit. Remove once fixed.
  readonly debugPath = signal<'native' | 'fallback' | 'none'>('none');
  readonly debugAttempts = signal(0);
  readonly debugLastError = signal<string>('');
  readonly debugSupportedFormats = signal<string>('');
  readonly debugVideoState = signal<string>('');

  private mediaStream: MediaStream | null = null;
  private detectInterval: number | null = null;
  private zxingControls: IScannerControls | null = null;

  async ngAfterViewInit(): Promise<void> {
    const NativeDetector = getNativeDetector();
    if (NativeDetector) {
      await this.startNative(NativeDetector);
    } else {
      await this.startFallback();
    }
  }

  private async startNative(Ctor: BarcodeDetectorCtor): Promise<void> {
    const video = this.videoElRef?.nativeElement;
    if (!video) return;

    this.debugPath.set('native');

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });
      video.srcObject = this.mediaStream;
      await video.play();
      this.status.set('scanning');

      // DEBUG: report supported formats so we know whether our list is valid.
      try {
        const w = window as unknown as { BarcodeDetector?: { getSupportedFormats?: () => Promise<string[]> } };
        const fmts = (await w.BarcodeDetector?.getSupportedFormats?.()) ?? [];
        this.debugSupportedFormats.set(fmts.join(','));
      } catch (e) {
        this.debugSupportedFormats.set(`fmt-error: ${String(e).slice(0, 40)}`);
      }

      const detector = new Ctor({
        formats: [
          'ean_13',
          'ean_8',
          'upc_a',
          'upc_e',
          'code_128',
          'code_39',
        ],
      });

      this.detectInterval = window.setInterval(async () => {
        this.debugAttempts.update((n) => n + 1);
        this.debugVideoState.set(`${video.videoWidth}x${video.videoHeight} rs=${video.readyState}`);
        try {
          const results = await detector.detect(video);
          if (results.length > 0 && results[0]?.rawValue) {
            this.emitResult(results[0].rawValue);
          }
        } catch (e) {
          this.debugLastError.set(String(e).slice(0, 80));
        }
      }, 250);
    } catch (err) {
      console.error('Native scanner failed, trying fallback', err);
      this.debugLastError.set(`native-init: ${String(err).slice(0, 60)}`);
      await this.startFallback();
    }
  }

  private async startFallback(): Promise<void> {
    const video = this.videoElRef?.nativeElement;
    if (!video) {
      this.debugLastError.set('no video element');
      return;
    }

    this.debugPath.set('fallback');

    try {
      // Pass format hints directly to ZXing-JS. Unlike html5-qrcode's
      // formatsToSupport (which doesn't reliably bundle the right readers
      // on iOS WebKit), @zxing/browser hints construct the MultiFormatReader
      // synchronously with the exact reader set we ask for.
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

      this.zxingControls = await reader.decodeFromConstraints(
        { video: { facingMode: { ideal: 'environment' } } },
        video,
        (result, err) => {
          this.debugAttempts.update((n) => n + 1);
          this.debugVideoState.set(
            `${video.videoWidth}x${video.videoHeight} rs=${video.readyState}`,
          );
          if (result) {
            this.emitResult(result.getText());
            return;
          }
          // NotFoundException fires every frame that simply contained no
          // detectable code — it's the normal "keep scanning" signal, not
          // an error. Only capture other errors.
          if (err && !(err instanceof NotFoundException)) {
            this.debugLastError.set(
              (err.message ?? String(err)).slice(0, 80),
            );
          }
        },
      );
      this.status.set('scanning');
    } catch (err) {
      console.error('Fallback scanner failed', err);
      this.debugLastError.set(`fallback-init: ${String(err).slice(0, 60)}`);
      this.status.set('error');
      this.errorMessage.set(
        'Could not access camera. Check browser permissions.',
      );
    }
  }

  private emitResult(code: string): void {
    const trimmed = code.trim();
    if (!trimmed) return;
    this.stopAll();
    this.scanned.emit(trimmed);
  }

  async onCancel(): Promise<void> {
    await this.stopAll();
    this.cancelled.emit();
  }

  private async stopAll(): Promise<void> {
    if (this.detectInterval !== null) {
      clearInterval(this.detectInterval);
      this.detectInterval = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
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

  async ngOnDestroy(): Promise<void> {
    await this.stopAll();
  }
}
