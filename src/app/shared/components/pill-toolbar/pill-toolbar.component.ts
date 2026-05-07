import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface PillFilter {
  key: string;
  label: string;
  variant?: 'default' | 'warn';
  count?: number;
}

@Component({
  selector: 'app-pill-toolbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pill-toolbar.component.html',
  styleUrl: './pill-toolbar.component.scss',
})
export class PillToolbarComponent {
  @Input() searchPlaceholder = 'search';
  @Input() searchValue = '';
  @Input() filters: PillFilter[] = [];
  @Input() activeKey = '';

  @Output() searchChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<string>();

  onSearchInput(v: string): void {
    this.searchValue = v;
    this.searchChange.emit(v);
  }

  onFilterClick(key: string): void {
    this.activeKey = key;
    this.filterChange.emit(key);
  }
}
