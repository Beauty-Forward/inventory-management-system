import { Component, Input } from '@angular/core';

export type StatTileVariant =
  | 'butter'
  | 'eucalyptus'
  | 'dust'
  | 'rose'
  | 'apricot'
  | 'hunter'
  | 'cobalt';

@Component({
  selector: 'app-stat-tile',
  standalone: true,
  templateUrl: './stat-tile.component.html',
  styleUrl: './stat-tile.component.scss',
})
export class StatTileComponent {
  @Input() variant: StatTileVariant = 'butter';
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() detail = '';
  @Input() size: 'lg' | 'sm' = 'lg';
}
