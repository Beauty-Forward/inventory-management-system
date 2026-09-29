import { Component, HostListener, input, output } from '@angular/core';

// Minimal modal shell: backdrop, titled panel with a scrolling body, and a
// [dialog-footer] slot pinned to the bottom. Closes on backdrop click / Escape.
@Component({
  selector: 'app-dialog',
  standalone: true,
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  readonly heading = input.required<string>();
  readonly closed = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closed.emit();
  }
}
