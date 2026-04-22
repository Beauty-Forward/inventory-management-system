import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PRODUCT_TYPE_CATEGORIES } from '../../core/models/product-types';
import { ShelterService } from '../../core/services/shelter.service';
import {
  shelterFormSchema,
  type ShelterFormInput,
} from '../../core/validators/shelter.validators';

type FormState = {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  acceptedTypes: Set<string>;
  rejectedTypes: Set<string>;
  preferredBrandsRaw: string;
  notes: string;
  capacityPerBatch: number | null;
};

const EMPTY_FORM = (): FormState => ({
  name: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  acceptedTypes: new Set(),
  rejectedTypes: new Set(),
  preferredBrandsRaw: '',
  notes: '',
  capacityPerBatch: null,
});

@Component({
  selector: 'app-shelter-form-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './shelter-form-page.component.html',
  styleUrl: './shelter-form-page.component.scss',
})
export class ShelterFormPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly shelterService = inject(ShelterService);

  readonly categories = PRODUCT_TYPE_CATEGORIES;
  readonly shelterId = signal<string | null>(null);
  readonly saving = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly fieldErrors = signal<Record<string, string>>({});
  readonly form = signal<FormState>(EMPTY_FORM());

  readonly isEditMode = computed(() => this.shelterId() !== null);
  readonly pageTitle = computed(() =>
    this.isEditMode() ? 'Edit Shelter' : 'New Shelter',
  );

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.shelterId.set(id);
      await this.loadShelter(id);
    }
  }

  private async loadShelter(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const shelter = await this.shelterService.get(id);
      if (!shelter) {
        this.error.set('Shelter not found');
        return;
      }
      this.form.set({
        name: shelter.name,
        addressLine1: shelter.addressLine1,
        addressLine2: shelter.addressLine2 ?? '',
        city: shelter.city,
        state: shelter.state,
        postalCode: shelter.postalCode,
        contactName: shelter.contactName,
        contactEmail: shelter.contactEmail ?? '',
        contactPhone: shelter.contactPhone ?? '',
        acceptedTypes: new Set(shelter.acceptedTypes ?? []),
        rejectedTypes: new Set(shelter.rejectedTypes ?? []),
        preferredBrandsRaw: (shelter.preferredBrands ?? []).join(', '),
        notes: shelter.notes ?? '',
        capacityPerBatch: shelter.capacityPerBatch ?? null,
      });
    } catch (err) {
      console.error(err);
      this.error.set('Could not load shelter.');
    } finally {
      this.loading.set(false);
    }
  }

  // --- Field change helpers (used by template bindings) ---

  updateField<K extends keyof FormState>(key: K, value: FormState[K]): void {
    this.form.update((f) => ({ ...f, [key]: value }));
  }

  toggleAccepted(type: string): void {
    this.form.update((f) => {
      const next = new Set(f.acceptedTypes);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
        const rej = new Set(f.rejectedTypes);
        rej.delete(type); // a type can't be both accepted and rejected
        return { ...f, acceptedTypes: next, rejectedTypes: rej };
      }
      return { ...f, acceptedTypes: next };
    });
  }

  toggleRejected(type: string): void {
    this.form.update((f) => {
      const next = new Set(f.rejectedTypes);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
        const acc = new Set(f.acceptedTypes);
        acc.delete(type);
        return { ...f, rejectedTypes: next, acceptedTypes: acc };
      }
      return { ...f, rejectedTypes: next };
    });
  }

  isAccepted(type: string): boolean {
    return this.form().acceptedTypes.has(type);
  }

  isRejected(type: string): boolean {
    return this.form().rejectedTypes.has(type);
  }

  async save(): Promise<void> {
    this.error.set(null);
    this.fieldErrors.set({});

    const f = this.form();
    const candidate: ShelterFormInput = {
      name: f.name,
      addressLine1: f.addressLine1,
      addressLine2: f.addressLine2 || undefined,
      city: f.city,
      state: f.state,
      postalCode: f.postalCode,
      contactName: f.contactName,
      contactEmail: f.contactEmail || undefined,
      contactPhone: f.contactPhone || undefined,
      acceptedTypes: Array.from(f.acceptedTypes),
      rejectedTypes: Array.from(f.rejectedTypes),
      preferredBrands: f.preferredBrandsRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      notes: f.notes || undefined,
      capacityPerBatch:
        f.capacityPerBatch && f.capacityPerBatch > 0 ? f.capacityPerBatch : undefined,
    };

    const parsed = shelterFormSchema.safeParse(candidate);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString() ?? 'form';
        errs[key] = issue.message;
      }
      this.fieldErrors.set(errs);
      this.error.set('Please fix the errors above.');
      return;
    }

    this.saving.set(true);
    try {
      const id = this.shelterId();
      if (id) {
        await this.shelterService.update(id, parsed.data);
        await this.router.navigate(['/shelters', id]);
      } else {
        const newId = await this.shelterService.create(parsed.data);
        await this.router.navigate(['/shelters', newId]);
      }
    } catch (err) {
      console.error(err);
      this.error.set('Save failed. Please try again.');
    } finally {
      this.saving.set(false);
    }
  }
}
