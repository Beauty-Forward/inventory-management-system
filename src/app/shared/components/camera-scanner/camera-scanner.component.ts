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
import { Html5Qrcode } from 'html5-qrcode';

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

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });
      video.srcObject = this.mediaStream;
      await video.play();
      this.status.set('scanning');

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
        try {
          const results = await detector.detect(video);
          if (results.length > 0 && results[0]?.rawValue) {
            this.emitResult(results[0].rawValue);
          }
        } catch {
          // Ignore transient detect errors
        }
      }, 250);
    } catch (err) {
      console.error('Native scanner failed, trying fallback', err);
      await this.startFallback();
    }
  }

  private async startFallback(): Promise<void> {
    const region = this.qrRegionRef?.nativeElement;
    if (!region) return;

    try {
      this.html5Qrcode = new Html5Qrcode(region.id);
      await this.html5Qrcode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 280, height: 180 },
        },
        (decoded) => this.emitResult(decoded),
        () => {
          // suppress per-frame decode errors
        },
      );
      this.status.set('scanning');
    } catch (err) {
      console.error('Fallback scanner failed', err);
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
