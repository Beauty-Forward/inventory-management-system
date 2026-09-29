import { Component, input } from '@angular/core';

// Sticky "N selected" bar with a slot for the actions. Stays pinned to the
// bottom of the viewport (above the mobile bottom nav) while a list scrolls.
// Inside a dialog, set --selection-bar-bottom: 0 on a parent to pin it flush.
@Component({
  selector: 'app-selection-bar',
  standalone: true,
  templateUrl: './selection-bar.component.html',
  styleUrl: './selection-bar.component.scss',
})
export class SelectionBarComponent {
  readonly count = input.required<number>();
}
