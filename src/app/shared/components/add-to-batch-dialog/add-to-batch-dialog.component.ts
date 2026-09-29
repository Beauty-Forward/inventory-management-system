import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { BatchStatus } from '../../../core/dataconnect';
import { AllocationResult, BatchListRow, BatchService } from '../../../core/services/batch.service';
import { ShelterListRow, ShelterService } from '../../../core/services/shelter.service';
import { DialogComponent } from '../dialog/dialog.component';

export interface AddToBatchResult extends AllocationResult {
  batchId: string;
  shelterName: string;
  createdBatch: boolean;
}

type Choice = { kind: 'draft'; batchId: string } | { kind: 'new'; shelterId: string };

// "Add to batch…" target chooser: lists existing draft batches first and
// only then offers to start a new one. Used from the inventory grid (many
// products) and the product page (one product); it performs the allocation
// itself and reports the outcome.
@Component({
  selector: 'app-add-to-batch-dialog',
  standalone: true,
  imports: [DatePipe, DialogComponent],
  templateUrl: './add-to-batch-dialog.component.html',
  styleUrl: './add-to-batch-dialog.component.scss',
})
export class AddToBatchDialogComponent implements OnInit {
  private readonly batchService = inject(BatchService);
  private readonly shelterService = inject(ShelterService);

  readonly products = input.required<{ id: string; type: string }[]>();

  readonly done = output<AddToBatchResult>();
  readonly cancelled = output<void>();

  readonly drafts = signal<BatchListRow[]>([]);
  private readonly shelters = signal<ShelterListRow[]>([]);
  readonly activeShelters = computed(() => this.shelters().filter((s) => s.isActive));
  readonly choice = signal<Choice | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      const [drafts, shelters] = await Promise.all([
        this.batchService.listByStatus(BatchStatus.DRAFT),
        this.shelterService.listAll(),
      ]);
      this.drafts.set(drafts);
      this.shelters.set(shelters);
    } catch (err) {
      console.error(err);
      this.error.set('Could not load batches and shelters.');
    } finally {
      this.loading.set(false);
    }
  }

  isDraftChosen(id: string): boolean {
    const c = this.choice();
    return c?.kind === 'draft' && c.batchId === id;
  }

  isShelterChosen(id: string): boolean {
    const c = this.choice();
    return c?.kind === 'new' && c.shelterId === id;
  }

  // How many of the products fall outside the shelter's accepted types.
  // Advisory only — an empty accepted list means the shelter takes anything.
  mismatchHint(shelterId: string): string | null {
    const accepted = this.shelters().find((s) => s.id === shelterId)?.acceptedTypes ?? [];
    if (accepted.length === 0) return null;
    const outside = this.products().filter((p) => !accepted.includes(p.type)).length;
    return outside === 0 ? null : `${outside} of ${this.products().length} outside accepted types`;
  }

  async confirm(): Promise<void> {
    const c = this.choice();
    if (!c) return;
    const ids = this.products().map((p) => p.id);
    this.saving.set(true);
    this.error.set(null);
    try {
      if (c.kind === 'draft') {
        const shelterName = this.drafts().find((b) => b.id === c.batchId)?.shelter.name ?? '';
        const result = await this.batchService.addProducts(ids, c.batchId);
        this.done.emit({ ...result, batchId: c.batchId, shelterName, createdBatch: false });
      } else {
        const shelterName = this.shelters().find((s) => s.id === c.shelterId)?.name ?? '';
        const result = await this.batchService.createWithProducts(c.shelterId, ids);
        this.done.emit({ ...result, shelterName, createdBatch: true });
      }
    } catch (err) {
      console.error(err);
      this.error.set('Could not add to batch. Please try again.');
      this.saving.set(false);
    }
  }
}
