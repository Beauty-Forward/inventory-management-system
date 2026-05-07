import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface CrumbItem {
  label: string;
  link?: string | string[];
}

@Component({
  selector: 'app-crumb',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './crumb.component.html',
  styleUrl: './crumb.component.scss',
})
export class CrumbComponent {
  @Input() items: CrumbItem[] = [];
}
