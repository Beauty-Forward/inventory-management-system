import { DatePipe } from '@angular/common';
import { Component, computed, input, model, signal } from '@angular/core';
import { ALL_PRODUCT_TYPES, productTypeSearchText } from '../../../core/models/product-types';
import { CameraScannerComponent } from '../camera-scanner/camera-scanner.component';
import { PillFilter, PillToolbarComponent } from '../pill-toolbar/pill-toolbar.component';
import { SelectionBarComponent } from '../selection-bar/selection-bar.component';

export interface PickerProduct {
  id: string;
  name: string;
  brand: string;
  type: string;
  quantity: number;
  expirationDate?: string | null;
  barcode?: string | null;
}

interface ScanNote {
  kind: 'ok' | 'warn';
  text: string;
}

// Multi-select product list shared by the new-batch form and the "+ add
// products" dialog on a draft batch. Search + type chips, select-all-visible,
// shift-click ranges, a sticky "N selected" bar and barcode scan-to-add.
// Selection lives in the two-way `selectedIds` model so the host reads it
// directly; host-specific actions go in the [picker-actions] slot.
@Component({
  selector: 'app-product-picker',
  standalone: true,
  imports: [DatePipe, PillToolbarComponent, SelectionBarComponent, CameraScannerComponent],
  templateUrl: './product-picker.component.html',
  styleUrl: './product-picker.component.scss',
})
export class ProductPickerComponent {
  readonly products = input.required<PickerProduct[]>();
  readonly loading = input(false);
  readonly emptyMessage = input('No in-stock products available.');
  readonly selectedIds = model<Set<string>>(new Set());

  readonly searchQuery = signal('');
  readonly activeType = signal('all');
  readonly scanning = signal(false);
  readonly scanNote = signal<ScanNote | null>(null);

  // Anchor for shift-click range selection: the last row clicked.
  private anchorId: string | null = null;

  readonly typeFilters = computed<PillFilter[]>(() => {
    const counts = new Map<string, number>();
    for (const p of this.products()) counts.set(p.type, (counts.get(p.type) ?? 0) + 1);
    const chips = Array.from(counts.entries())
      .map(([type, count]) => ({ key: type, label: this.typeLabel(type), count }))
      .sort((a, b) => a.label.localeCompare(b.label));
    return [{ key: 'all', label: 'all', count: this.products().length }, ...chips];
  });

  readonly visible = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const type = this.activeType();
    return this.products().filter((p) => {
      if (type !== 'all' && p.type !== type) return false;
      if (q) {
        const hay = `${p.name} ${p.brand} ${productTypeSearchText(p.type)} ${p.barcode ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  });

  readonly selectedCount = computed(() => this.selectedIds().size);
  readonly visibleSelectedCount = computed(() => {
    const sel = this.selectedIds();
    return this.visible().reduce((n, p) => n + (sel.has(p.id) ? 1 : 0), 0);
  });
  readonly allVisibleSelected = computed(
    () => this.visible().length > 0 && this.visibleSelectedCount() === this.visible().length,
  );
  readonly someVisibleSelected = computed(
    () => this.visibleSelectedCount() > 0 && !this.allVisibleSelected(),
  );

  typeLabel(value: string): string {
    return ALL_PRODUCT_TYPES.find((t) => t.value === value)?.label ?? value;
  }

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  // Plain click toggles one row; shift-click applies the clicked row's new
  // state to every visible row between it and the previous click.
  onRowClick(event: MouseEvent, product: PickerProduct): void {
    const select = !this.isSelected(product.id);
    const rows = this.visible();
    const from = event.shiftKey && this.anchorId ? rows.findIndex((p) => p.id === this.anchorId) : -1;
    const to = rows.findIndex((p) => p.id === product.id);

    this.selectedIds.update((set) => {
      const next = new Set(set);
      const apply = (id: string) => (select ? next.add(id) : next.delete(id));
      if (from >= 0 && to >= 0) {
        const [lo, hi] = from < to ? [from, to] : [to, from];
        for (let i = lo; i <= hi; i++) apply(rows[i].id);
      } else {
        apply(product.id);
      }
      return next;
    });
    this.anchorId = product.id;
  }

  toggleAllVisible(): void {
    const rows = this.visible();
    const deselect = this.allVisibleSelected();
    this.selectedIds.update((set) => {
      const next = new Set(set);
      for (const p of rows) {
        if (deselect) next.delete(p.id);
        else next.add(p.id);
      }
      return next;
    });
  }

  clear(): void {
    this.selectedIds.set(new Set());
    this.anchorId = null;
  }

  openScanner(): void {
    this.scanNote.set(null);
    this.scanning.set(true);
  }

  // A scanned code adds the first matching lot that isn't already selected,
  // so scanning the same barcode again picks up the next lot of that product.
  onScanned(code: string): void {
    this.scanning.set(false);
    const matches = this.products().filter((p) => p.barcode?.trim() === code);
    if (matches.length === 0) {
      this.scanNote.set({ kind: 'warn', text: `No available product with barcode ${code}.` });
      return;
    }
    const next = matches.find((p) => !this.isSelected(p.id));
    if (!next) {
      const more = matches.length === 1 ? '' : ` (all ${matches.length} lots)`;
      this.scanNote.set({ kind: 'warn', text: `${matches[0].name} is already selected${more}.` });
      return;
    }
    this.selectedIds.update((set) => new Set(set).add(next.id));
    this.anchorId = next.id;
    const left = matches.filter((p) => !this.isSelected(p.id)).length;
    const more = left > 0 ? ` ${left} more lot${left === 1 ? '' : 's'} with this barcode.` : '';
    this.scanNote.set({ kind: 'ok', text: `Added ${next.name}.${more}` });
  }
}
