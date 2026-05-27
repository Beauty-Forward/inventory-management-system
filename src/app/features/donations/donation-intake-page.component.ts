import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  ProductFormCardComponent,
  ProductFormCardModel,
  EMPTY_PRODUCT_CARD,
  toProductFormInput,
} from '../../shared/components/product-form-card/product-form-card.component';
import { CameraScannerComponent } from '../../shared/components/camera-scanner/camera-scanner.component';
import { CapturedPhoto } from '../../shared/components/photo-capture/photo-capture.component';
import { CrumbComponent } from '../../shared/components/crumb/crumb.component';
import { StepperComponent, StepperStep } from '../../shared/components/stepper/stepper.component';
import { AuthService } from '../../core/services/auth.service';
import { BarcodeLookupService } from '../../core/services/barcode.service';
import { DonationService } from '../../core/services/donation.service';
import {
  ReferenceLookupService,
  type ReferenceLookupResult,
} from '../../core/services/reference-lookup.service';
import {
  generateDeliveryFallbackReference,
  generateWalkInReference,
} from '../../core/utils/warehouse-reference';
import {
  donationIntakeSchema,
  type DonationIntakeInput,
} from '../../core/validators/donation.validators';

type DonorFormState = {
  fullName: string;
  email: string;
  phone: string;
  smsOptIn: boolean;
  city: string;
  state: string;
  instagramHandle: string;
};

type Step = 'lookup' | 'donor' | 'products' | 'saving';

const EMPTY_DONOR = (): DonorFormState => ({
  fullName: '',
  email: '',
  phone: '',
  smsOptIn: false,
  city: '',
  state: '',
  instagramHandle: '',
});

const TODAY = (): string => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

@Component({
  selector: 'app-donation-intake-page',
  standalone: true,
  imports: [
    ProductFormCardComponent,
    CameraScannerComponent,
    CrumbComponent,
    StepperComponent,
  ],
  templateUrl: './donation-intake-page.component.html',
  styleUrl: './donation-intake-page.component.scss',
})
export class DonationIntakePageComponent {
  private readonly router = inject(Router);
  private readonly donationService = inject(DonationService);
  private readonly referenceService = inject(ReferenceLookupService);
  private readonly authService = inject(AuthService);
  private readonly barcodeService = inject(BarcodeLookupService);

  readonly identifyOpen = signal(false);
  readonly identifyTargetIndex = signal<number | null>(null);
  readonly lookupMessage = signal<string | null>(null);

  readonly step = signal<Step>('lookup');
  readonly referenceCode = signal('');
  readonly lookupLoading = signal(false);
  readonly lookupError = signal<string | null>(null);

  readonly donationRequestId = signal('');
  readonly warehouseReference = signal('');
  readonly donationMethod = signal<'pickup' | 'shipping' | 'dropoff' | 'walk-in'>(
    'dropoff',
  );
  readonly donationDate = signal(TODAY());
  readonly donationNotes = signal('');
  readonly isWalkIn = signal(false);

  readonly donor = signal<DonorFormState>(EMPTY_DONOR());
  readonly donorLocked = signal(false);

  readonly products = signal<ProductFormCardModel[]>([EMPTY_PRODUCT_CARD()]);

  readonly saving = signal(false);
  readonly savingError = signal<string | null>(null);
  readonly fieldErrors = signal<Record<string, string>>({});

  readonly productCount = computed(() => this.products().length);

  readonly stepperSteps: StepperStep[] = [
    { label: 'start' },
    { label: 'donor' },
    { label: 'products' },
  ];

  readonly currentStepNum = computed(() => {
    const s = this.step();
    if (s === 'lookup') return 1;
    if (s === 'donor') return 2;
    return 3;
  });

  readonly totalUnits = computed(() =>
    this.products().reduce((acc, p) => {
      const q = parseInt(String(p.quantity ?? 0), 10);
      return acc + (isNaN(q) ? 0 : q);
    }, 0),
  );

  readonly estimatedValue = computed(() =>
    this.products().reduce((acc, p) => {
      const q = parseInt(String(p.quantity ?? 0), 10);
      const price = parseFloat(String(p.price ?? 0));
      if (isNaN(q) || isNaN(price)) return acc;
      return acc + q * price;
    }, 0),
  );

  // --- Step 1: reference code lookup ---

  async lookupReference(): Promise<void> {
    const code = this.referenceCode().trim();
    if (!code) {
      this.lookupError.set('Enter a reference code');
      return;
    }
    this.lookupLoading.set(true);
    this.lookupError.set(null);
    try {
      const result = await this.referenceService.lookup(code);
      if (!result.found) {
        this.lookupError.set('No donation found with that code.');
        return;
      }
      this.applyLookupResult(result);
      this.step.set('products');
    } catch (err) {
      console.error(err);
      this.lookupError.set(
        'Lookup failed. The Cloud Function may not be deployed yet.',
      );
    } finally {
      this.lookupLoading.set(false);
    }
  }

  private applyLookupResult(result: ReferenceLookupResult): void {
    if (!result.requestId || !result.donor) return;
    this.donationRequestId.set(result.requestId);
    // Prefer the donor-facing dropoff reference if available; otherwise mint a fallback.
    this.warehouseReference.set(
      result.dropoff?.referenceCode || generateDeliveryFallbackReference(),
    );
    this.donationMethod.set(result.donationType ?? 'dropoff');
    this.donationDate.set(
      result.dropoff?.preferredDate ||
        result.pickup?.preferredDate ||
        result.createdAt?.slice(0, 10) ||
        TODAY(),
    );
    this.donor.set({
      fullName: result.donor.fullName,
      email: result.donor.email,
      phone: result.donor.phone,
      smsOptIn: false,
      city: '',
      state: '',
      instagramHandle: '',
    });
    this.donorLocked.set(false); // allow manager to fill in missing city/state
    this.isWalkIn.set(false);
  }

  skipLookup(): void {
    // Walk-in path: no reference code, enter donor manually
    this.isWalkIn.set(true);
    this.donationMethod.set('walk-in');
    this.donationDate.set(TODAY());
    this.donor.set(EMPTY_DONOR());
    this.step.set('donor');
  }

  // --- Step 2: donor info (walk-in only) ---

  updateDonor<K extends keyof DonorFormState>(
    key: K,
    value: DonorFormState[K],
  ): void {
    this.donor.update((d) => ({ ...d, [key]: value }));
  }

  continueFromDonor(): void {
    // Walk-in: the IMS is the system of record. No Cloud Function call needed —
    // we mint a local BFW reference and proceed to products. The donation row
    // is created in Data Connect when the manager clicks "Complete Donation".
    const d = this.donor();
    if (!d.fullName || !d.email || !d.phone) {
      this.fieldErrors.set({ donor: 'Name, email, and phone are required' });
      return;
    }
    this.fieldErrors.set({});
    const reference = generateWalkInReference();
    this.warehouseReference.set(reference);
    this.referenceCode.set(reference); // display in summary header
    this.donationRequestId.set(''); // no upstream donation_request for walk-ins
    this.step.set('products');
  }

  // --- Step 3: products ---

  addProduct(): void {
    this.products.update((list) => [...list, EMPTY_PRODUCT_CARD()]);
  }

  removeProduct(index: number): void {
    this.products.update((list) => list.filter((_, i) => i !== index));
  }

  updateProduct(index: number, model: ProductFormCardModel): void {
    this.products.update((list) => {
      const next = [...list];
      next[index] = model;
      return next;
    });
  }

  // --- Back nav ---

  goBackToLookup(): void {
    this.step.set('lookup');
    this.lookupError.set(null);
    this.savingError.set(null);
  }

  // --- Final submit ---

  async completeDonation(): Promise<void> {
    this.savingError.set(null);
    this.fieldErrors.set({});

    const donorForm = this.donor();
    const candidate: DonationIntakeInput = {
      donor: {
        fullName: donorForm.fullName,
        email: donorForm.email,
        phone: donorForm.phone,
        smsOptIn: donorForm.smsOptIn,
        city: donorForm.city || 'Unknown',
        state: donorForm.state || 'NY',
        instagramHandle: donorForm.instagramHandle || undefined,
      },
      donationRequestId: this.donationRequestId() || undefined,
      warehouseReference: this.warehouseReference(),
      date: this.donationDate(),
      method: this.donationMethod(),
      notes: this.donationNotes() || undefined,
      products: this.products().map(toProductFormInput),
    };

    const parsed = donationIntakeSchema.safeParse(candidate);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.');
        errs[path] = issue.message;
      }
      this.fieldErrors.set(errs);
      this.savingError.set(
        'Please fix the errors above. Each product needs a name, brand, type, and quantity.',
      );
      return;
    }

    this.saving.set(true);
    this.step.set('saving');
    try {
      const processedBy = this.authService.user()?.uid ?? 'unauthenticated';
      const result = await this.donationService.processIntake(
        parsed.data,
        processedBy,
      );
      await this.router.navigate(['/donations', result.donationId]);
    } catch (err) {
      console.error(err);
      this.savingError.set('Save failed. Please try again.');
      this.step.set('products');
    } finally {
      this.saving.set(false);
    }
  }

  hasFieldError(path: string): boolean {
    return this.fieldErrors()[path] !== undefined;
  }

  getFieldError(path: string): string | undefined {
    return this.fieldErrors()[path];
  }

  productErrorsAt(index: number): Record<string, string> {
    const prefix = `products.${index}.`;
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(this.fieldErrors())) {
      if (key.startsWith(prefix)) {
        out[key.slice(prefix.length)] = value;
      }
    }
    return out;
  }

  openIdentifier(index: number): void {
    this.identifyTargetIndex.set(index);
    this.identifyOpen.set(true);
    this.lookupMessage.set(null);
  }

  closeIdentifier(): void {
    this.identifyOpen.set(false);
    this.identifyTargetIndex.set(null);
  }

  async onBarcodeScanned(barcode: string): Promise<void> {
    const index = this.identifyTargetIndex();
    this.identifyOpen.set(false);
    if (index === null) return;

    this.lookupMessage.set(`Looking up ${barcode}…`);
    const result = await this.barcodeService.lookup(barcode);

    this.products.update((list) => {
      const next = [...list];
      const current = next[index] ?? EMPTY_PRODUCT_CARD();
      // User-typed values always win — auto-populate only fills blanks.
      // The actual workflow is Identify first, then manual corrections, so
      // this is a quiet safety net for the rare re-scan-after-edit case.
      next[index] = {
        ...current,
        barcode,
        name: current.name || result.name || '',
        brand: current.brand || result.brand || '',
        keyIngredients: current.keyIngredients || result.keyIngredients || '',
        price: current.price || result.price || '',
        color: current.color || result.color || '',
        // Default to 'other' so the volunteer is never left with a blank
        // type after an Identify — they can still change it manually.
        type: current.type || result.type || 'other',
      };
      return next;
    });

    if (result.found) {
      const sourceLabel = {
        catalog: 'from catalog',
        open_beauty_facts: 'from Open Beauty Facts',
        open_food_facts: 'from Open Food Facts',
        upcitemdb: 'from UPCitemdb',
        gemini_text: 'from AI (please verify)',
      }[result.source ?? 'catalog'];
      const verifyHint =
        result.source === 'gemini_text' || result.confidence === 'low'
          ? ' Double-check the product before saving.'
          : '';
      this.lookupMessage.set(`Pre-populated ${sourceLabel}.${verifyHint}`);
    } else {
      this.lookupMessage.set(
        `No match found — barcode ${barcode} saved, fill in the rest manually.`,
      );
    }

    // Clear the message after 4 seconds
    setTimeout(() => this.lookupMessage.set(null), 4000);
  }

  // --- Photo fallback: scanner emits `captured` after barcode timeout ---

  async onPhotoCaptured(photo: CapturedPhoto): Promise<void> {
    const index = this.identifyTargetIndex();
    this.identifyOpen.set(false);
    if (index === null) return;

    this.lookupMessage.set('Identifying product from photo…');
    const result = await this.barcodeService.identifyFromImage(
      photo.base64,
      photo.mimeType,
    );

    if (!result.found) {
      this.lookupMessage.set(
        'Could not identify the product. Try a clearer photo, or fill in manually.',
      );
      setTimeout(() => this.lookupMessage.set(null), 5000);
      return;
    }

    this.products.update((list) => {
      const next = [...list];
      const current = next[index] ?? EMPTY_PRODUCT_CARD();
      next[index] = {
        ...current,
        name: current.name || result.name || '',
        brand: current.brand || result.brand || '',
        type: current.type || result.type || 'other',
        color: current.color || result.color || '',
        colorCategory: current.colorCategory || result.colorCategory || '',
        keyIngredients: current.keyIngredients || result.keyIngredients || '',
        size: current.size || result.size || '',
      };
      return next;
    });

    const confLabel =
      result.confidence === 'high'
        ? ''
        : result.confidence === 'medium'
          ? ' (medium confidence — double-check)'
          : ' (low confidence — verify carefully)';
    this.lookupMessage.set(`Pre-populated from photo${confLabel}.`);
    setTimeout(() => this.lookupMessage.set(null), 5000);
  }
}
