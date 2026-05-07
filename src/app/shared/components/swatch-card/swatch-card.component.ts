import { Component, Input } from '@angular/core';

export type SwatchVariant =
  | 'rose'
  | 'butter'
  | 'dust'
  | 'eucalyptus'
  | 'apricot'
  | 'cobalt'
  | 'crimson'
  | 'hunter'
  | 'porcelain';

@Component({
  selector: 'app-swatch-card',
  standalone: true,
  templateUrl: './swatch-card.component.html',
  styleUrl: './swatch-card.component.scss',
})
export class SwatchCardComponent {
  @Input() swatch: SwatchVariant = 'porcelain';
  @Input() interactive = true;
}
