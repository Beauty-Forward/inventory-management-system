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
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

type BarcodeDetectorCtor = new (config?: {
  formats?: string[];
}) => {
  detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
};

// Native BarcodeDetector is available in Chromium browsers.
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
  @ViewChild('qrRegion') qrRegionRef?: ElementRef<HTMLDivElement>;

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
  private html5Qrcode: Html5Qrcode | null = null;

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
    const region = this.qrRegionRef?.nativeElement;
    if (!region) {
      this.debugLastError.set('no qr-region element');
      return;
    }

    this.debugPath.set('fallback');

    try {
      // Explicitly list barcode formats. Without this, html5-qrcode relies
      // on ZXing-JS's dynamic format discovery which doesn't reliably resolve
      // on iOS WebKit — every decode attempt then throws "no MultiFormatReader"
      // and silently fails. Listing formats up-front forces the right readers
      // to bundle and load synchronously.
      this.html5Qrcode = new Html5Qrcode(region.id, {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
        ],
        verbose: false,
      });
      await this.html5Qrcode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 280, height: 180 },
        },
        (decoded) => {
          this.debugAttempts.update((n) => n + 1);
          this.emitResult(decoded);
        },
        (errMsg) => {
          this.debugAttempts.update((n) => n + 1);
          // Capture only the most recent non-empty message to avoid spam.
          if (errMsg) this.debugLastError.set(String(errMsg).slice(0, 80));
          // Inject video state once we have a video element.
          const v = region.querySelector('video') as HTMLVideoElement | null;
          if (v) {
            this.debugVideoState.set(`${v.videoWidth}x${v.videoHeight} rs=${v.readyState}`);
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
    if (this.html5Qrcode) {
      try {
        await this.html5Qrcode.stop();
      } catch {
        // ignore
      }
      try {
        await this.html5Qrcode.clear();
      } catch {
        // ignore
      }
      this.html5Qrcode = null;
    }
  }

  async ngOnDestroy(): Promise<void> {
    await this.stopAll();
  }
}
