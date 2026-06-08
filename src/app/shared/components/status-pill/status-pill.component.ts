import { Component, Input } from '@angular/core';

export type StatusPillVariant =
  | 'ready'
  | 'ready-strong'
  | 'draft'
  | 'route'
  | 'expiring'
  | 'expiring-strong'
  | 'intake'
  | 'walk'
  | 'shipped'
  | 'delivered'
  | 'flagged'
  | 'expired'
  | 'discarded'
  | 'soft';

@Component({
  selector: 'app-status-pill',
  standalone: true,
  templateUrl: './status-pill.component.html',
  styleUrl: './status-pill.component.scss',
})
export class StatusPillComponent {
  @Input() variant: StatusPillVariant = 'soft';
}
