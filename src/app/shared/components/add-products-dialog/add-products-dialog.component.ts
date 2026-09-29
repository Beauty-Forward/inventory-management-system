import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { AllocationResult, BatchService } from '../../../core/services/batch.service';
import { AvailableForShelterRow, ProductService } from '../../../core/services/product.service';
import { DialogComponent } from '../dialog/dialog.component';
import { ProductPickerComponent } from '../product-picker/product-picker.component';

// "+ add products" on a draft batch: the same picker as the new-batch form,
// scoped to the shelter's accepted types, allocated in a single request.
@Component({
  selector: 'app-add-products-dialog',
  standalone: true,
  imports: [DialogComponent, ProductPickerComponent],
  templateUrl: './add-products-dialog.component.html',
  styleUrl: './add-products-dialog.component.scss',
})
export class AddProductsDialogComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly batchService = inject(BatchService);

  readonly batchId = input.required<string>();
  readonly shelterName = input.required<string>();
  readonly acceptedTypes = input<string[]>([]);

  readonly added = output<AllocationResult>();
  readonly cancelled = output<void>();

  readonly available = signal<AvailableForShelterRow[]>([]);
  readonly selected = signal<Set<string>>(new Set());
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      this.available.set(await this.productService.listAvailableForShelter(this.acceptedTypes()));
    } catch (err) {
      console.error(err);
      this.error.set('Could not load available inventory.');
    } finally {
      this.loading.set(false);
    }
  }

  async save(): Promise<void> {
    if (this.selected().size === 0) return;
    this.saving.set(true);
    this.error.set(null);
    try {
      this.added.emit(await this.batchService.addProducts([...this.selected()], this.batchId()));
    } catch (err) {
      console.error(err);
      this.error.set('Could not add products. The batch may no longer be a draft.');
      this.saving.set(false);
    }
  }
}
