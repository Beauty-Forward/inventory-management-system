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

export interface CapturedPhoto {
  /** Base64-encoded image data (no data: prefix) */
  base64: string;
  mimeType: 'image/jpeg';
}

@Component({
  selector: 'app-photo-capture',
  standalone: true,
  templateUrl: './photo-capture.component.html',
  styleUrl: './photo-capture.component.scss',
})
export class PhotoCaptureComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoEl') videoElRef?: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasEl') canvasElRef?: ElementRef<HTMLCanvasElement>;

  @Output() captured = new EventEmitter<CapturedPhoto>();
  @Output() cancelled = new EventEmitter<void>();

  readonly status = signal<'starting' | 'ready' | 'preview' | 'error'>(
    'starting',
  );
  readonly errorMessage = signal('');
  readonly previewUrl = signal<string | null>(null);

  private mediaStream: MediaStream | null = null;
  private capturedBase64: string | null = null;

  async ngAfterViewInit(): Promise<void> {
    const video = this.videoElRef?.nativeElement;
    if (!video) return;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      video.srcObject = this.mediaStream;
      await video.play();
      this.status.set('ready');
    } catch (err) {
      console.error('Camera access failed', err);
      this.status.set('error');
      this.errorMessage.set('Camera unavailable. Check permissions.');
    }
  }

  capture(): void {
    const video = this.videoElRef?.nativeElement;
    const canvas = this.canvasElRef?.nativeElement;
    if (!video || !canvas) return;

    const maxDim = 1024; // shrink for faster upload + Gemini efficiency
    const ratio = Math.min(maxDim / video.videoWidth, maxDim / video.videoHeight, 1);
    canvas.width = Math.round(video.videoWidth * ratio);
    canvas.height = Math.round(video.videoHeight * ratio);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    this.capturedBase64 = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    this.previewUrl.set(dataUrl);
    this.status.set('preview');
    this.stopStream();
  }

  confirm(): void {
    if (!this.capturedBase64) return;
    this.captured.emit({
      base64: this.capturedBase64,
      mimeType: 'image/jpeg',
    });
  }

  async retake(): Promise<void> {
    this.capturedBase64 = null;
    this.previewUrl.set(null);
    this.status.set('starting');
    await this.ngAfterViewInit();
  }

  onCancel(): void {
    this.stopStream();
    this.cancelled.emit();
  }

  private stopStream(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
  }

  ngOnDestroy(): void {
    this.stopStream();
  }
}
