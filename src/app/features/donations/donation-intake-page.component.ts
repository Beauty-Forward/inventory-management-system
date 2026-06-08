import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { BarcodeLookupService } from '../../core/services/barcode.service';
import { DonationService } from '../../core/services/donation.service';
import { generateWalkInReference } from '../../core/utils/warehouse-reference';
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

type Step = 'donor' | 'products' | 'saving';

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

function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

// Brand is a de-dup target: same brand from different lookup sources
// must converge to one display string, or it shows up as multiple brands
// in inventory filters / reports / shelter preferences. Always coerce
// to title-case from lowercased so "CeraVe", "CERAVE", and "cerave" all
// land as "Cerave". Trade-off: loses internal capitals (CeraVe → Cerave,
// SuperStay → Superstay). Acceptable cost of consistency.
function normalizeBrand(value: string | undefined): string | undefined {
  if (!value) return value;
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return titleCase(trimmed);
}

// Product names are largely unique per donation — de-dup isn't the goal.
// Only flatten shouty all-caps or all-lowercase strings (which UPCitemdb
// and OBF often return) for readability. Mixed case is preserved as
// intentional ("SuperStay Matte Ink Pioneer", "Dr. Bronner's Soap").
function normalizeName(value: string | undefined): string | undefined {
  if (!value) return value;
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  const hasUpper = /[A-Z]/.test(trimmed);
  const hasLower = /[a-z]/.test(trimmed);
  if (hasUpper && hasLower) return trimmed;
  return titleCase(trimmed);
}

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
export class DonationIntakePageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly donationService = inject(DonationService);
  private readonly barcodeService = inject(BarcodeLookupService);

  // When set, the intake skips the donor step and lands straight on
  // products — the donation already exists (created by the delivery-app
  // sync), the manager just needs to attach products to it.
  readonly preLoadedDonationId = signal<string | null>(null);

  readonly identifyOpen = signal(false);
  readonly identifyTargetIndex = signal<number | null>(null);
  // 'failed' re-opens the camera modal with the error overlay so the
  // volunteer can retake or switch to barcode mode without re-tapping
  // Identify. While Gemini is analyzing, the modal is closed and the
  // inline lookupMessage handles the feedback.
  readonly identifyState = signal<'idle' | 'failed'>('idle');
  readonly identifyError = signal<string>('');
  readonly lookupMessage = signal<string | null>(null);

  // Walk-in intake starts on the donor step — the donations-list "register
  // walk-in" CTA already commits to a walk-in, so the reference-code lookup
  // step it used to open on is gone. (Pre-load path jumps to 'products'.)
  readonly step = signal<Step>('donor');
  readonly referenceCode = signal('');
  // Only surfaced by the pre-load path when ?donationId points at a missing
  // donation; the walk-in path no longer does any reference lookup.
  readonly lookupError = signal<string | null>(null);

  readonly donationRequestId = signal('');
  readonly warehouseReference = signal('');
  readonly donationMethod = signal<'pickup' | 'shipping' | 'dropoff' | 'walk-in'>(
    'walk-in',
  );
  readonly donationDate = signal(TODAY());
  readonly donationNotes = signal('');

  readonly donor = signal<DonorFormState>(EMPTY_DONOR());
  readonly donorLocked = signal(false);

  readonly products = signal<ProductFormCardModel[]>([EMPTY_PRODUCT_CARD()]);
  // Field keys per product index that were just auto-populated from a
  // medium/low-confidence Gemini result. Drives the red-ring "needs verify"
  // highlight on the product card. Cleared when the volunteer edits the field.
  readonly lowConfidenceFlags = signal<Record<number, string[]>>({});

  readonly saving = signal(false);
  readonly savingError = signal<string | null>(null);
  readonly fieldErrors = signal<Record<string, string>>({});

  readonly productCount = computed(() => this.products().length);

  readonly stepperSteps: StepperStep[] = [
    { label: 'donor' },
    { label: 'products' },
  ];

  readonly currentStepNum = computed(() => (this.step() === 'donor' ? 1 : 2));

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

  // --- Pre-load path: open this page with ?donationId=xxx to add products
  // to an existing Donation (created by the delivery-app sync). ---

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.queryParamMap.get('donationId');
    if (id) await this.preLoadDonation(id);
  }

  private async preLoadDonation(id: string): Promise<void> {
    const donation = await this.donationService.get(id);
    if (!donation) {
      this.lookupError.set('Could not find that donation.');
      return;
    }
    this.preLoadedDonationId.set(id);
    this.donationRequestId.set(donation.donationRequestId ?? '');
    this.warehouseReference.set(donation.warehouseReference);
    this.referenceCode.set(donation.warehouseReference);
    this.donationMethod.set(
      donation.method === 'pickup'
        ? 'pickup'
        : donation.method === 'shipping'
          ? 'shipping'
          : donation.method === 'walk-in'
            ? 'walk-in'
            : 'dropoff',
    );
    this.donationDate.set(donation.date);
    this.donor.set({
      fullName: donation.donor.fullName,
      email: donation.donor.email,
      phone: donation.donor.phone,
      smsOptIn: false,
      city: donation.donor.city,
      state: donation.donor.state,
      instagramHandle: '',
    });
    this.donorLocked.set(true);
    this.step.set('products');
  }

  // --- Step 1: donor info (walk-in only) ---

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

  // --- Step 2: products ---

  addProduct(): void {
    this.products.update((list) => [...list, EMPTY_PRODUCT_CARD()]);
  }

  removeProduct(index: number): void {
    this.products.update((list) => list.filter((_, i) => i !== index));
    // Re-key the flags map so it stays aligned with the new array indices.
    this.lowConfidenceFlags.update((m) => {
      const next: Record<number, string[]> = {};
      for (const [k, v] of Object.entries(m)) {
        const idx = parseInt(k, 10);
        if (idx < index) next[idx] = v;
        else if (idx > index) next[idx - 1] = v;
      }
      return next;
    });
  }

  updateProduct(index: number, model: ProductFormCardModel): void {
    this.products.update((list) => {
      const next = [...list];
      next[index] = model;
      return next;
    });
  }

  flagsFor(index: number): string[] {
    return this.lowConfidenceFlags()[index] ?? [];
  }

  onFieldEdited(index: number, key: keyof ProductFormCardModel): void {
    this.lowConfidenceFlags.update((m) => {
      const current = m[index];
      if (!current || !current.includes(key as string)) return m;
      return { ...m, [index]: current.filter((k) => k !== key) };
    });
  }

  // --- Back nav ---

  // Donor step "← back" and products step "← cancel": abandon the intake and
  // return to the donations list (there's no lookup step to fall back to).
  cancelIntake(): void {
    void this.router.navigate(['/donations']);
  }

  // Products step "start over": hop back to the donor step to re-edit, keeping
  // whatever's already entered.
  goBackToDonor(): void {
    this.step.set('donor');
    this.savingError.set(null);
  }

  // --- Final submit ---

  async completeDonation(): Promise<void> {
    this.savingError.set(null);
    this.fieldErrors.set({});

    // Pre-load path: Donation already exists, just create products.
    const preLoadedId = this.preLoadedDonationId();
    if (preLoadedId) {
      const productInputs = this.products().map(toProductFormInput);
      if (
        productInputs.some(
          (p) => !p.name || !p.brand || !p.type || !p.quantity,
        )
      ) {
        this.savingError.set(
          'Each product needs a name, brand, type, and quantity.',
        );
        return;
      }
      this.saving.set(true);
      this.step.set('saving');
      try {
        await this.donationService.addProductsToDonation(
          preLoadedId,
          productInputs,
        );
        await this.router.navigate(['/donations', preLoadedId]);
      } catch (err) {
        console.error(err);
        this.savingError.set('Save failed. Please try again.');
        this.step.set('products');
      } finally {
        this.saving.set(false);
      }
      return;
    }

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
      const result = await this.donationService.processIntake(parsed.data);
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
    this.identifyState.set('idle');
    this.identifyError.set('');
    this.lookupMessage.set(null);
  }

  closeIdentifier(): void {
    this.identifyOpen.set(false);
    this.identifyTargetIndex.set(null);
    this.identifyState.set('idle');
    this.identifyError.set('');
  }

  // Camera-scanner's error overlay "Try again" / "Scan barcode" button —
  // clear the failed state so the volunteer is back in the live camera.
  retryIdentify(): void {
    this.identifyState.set('idle');
    this.identifyError.set('');
  }

  async onBarcodeScanned(barcode: string): Promise<void> {
    const index = this.identifyTargetIndex();
    this.identifyOpen.set(false);
    if (index === null) return;

    this.lookupMessage.set(`Looking up ${barcode}…`);
    const result = await this.barcodeService.lookup(barcode);

    const isLowConf =
      result.confidence === 'medium' || result.confidence === 'low';
    const flagged: string[] = [];
    this.products.update((list) => {
      const next = [...list];
      const current = next[index] ?? EMPTY_PRODUCT_CARD();
      // User-typed values always win — auto-populate only fills blanks.
      // `fill` also collects field names that came from a low-confidence
      // result so we can ring them in the UI for verification.
      const fill = <K extends keyof ProductFormCardModel>(
        key: K,
        incoming: ProductFormCardModel[K] | undefined,
      ): ProductFormCardModel[K] => {
        if (current[key]) return current[key];
        if (!incoming) return current[key];
        if (isLowConf) flagged.push(key as string);
        return incoming;
      };
      next[index] = {
        ...current,
        barcode,
        name: fill('name', normalizeName(result.name)),
        brand: fill('brand', normalizeBrand(result.brand)),
        keyIngredients: fill('keyIngredients', result.keyIngredients),
        price: fill('price', result.price),
        color: fill('color', result.color),
        // Default to 'other' so the volunteer is never left with a blank
        // type after an Identify — they can still change it manually.
        type: fill('type', result.type) || 'other',
      };
      return next;
    });
    this.lowConfidenceFlags.update((m) => ({ ...m, [index]: flagged }));

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

  // --- Photo capture: scanner emits `captured` when the volunteer taps the
  // big capture button. Close the modal immediately so they're not holding
  // the camera up as if the photo is still being taken; show progress
  // inline above the form. On failure we re-open the modal in 'failed'
  // state so retake/scan-barcode are one tap away. ---

  async onPhotoCaptured(photo: CapturedPhoto): Promise<void> {
    const index = this.identifyTargetIndex();
    if (index === null) return;

    // Photo's already in flight — let them put the product down.
    this.identifyOpen.set(false);
    this.identifyState.set('idle');
    this.identifyError.set('');
    this.lookupMessage.set('Identifying product from photo…');

    const result = await this.barcodeService.identifyFromImage(
      photo.base64,
      photo.mimeType,
    );

    if (!result.found) {
      // Re-open the camera modal with the error overlay so retake / scan
      // barcode are one tap away.
      this.lookupMessage.set(null);
      this.identifyState.set('failed');
      this.identifyError.set(
        'Try a clearer shot of the front, or scan the barcode if there is one.',
      );
      this.identifyOpen.set(true);
      return;
    }

    // Success — modal stays closed, message goes inline.

    const isLowConf =
      result.confidence === 'medium' || result.confidence === 'low';
    const flagged: string[] = [];
    this.products.update((list) => {
      const next = [...list];
      const current = next[index] ?? EMPTY_PRODUCT_CARD();
      const fill = <K extends keyof ProductFormCardModel>(
        key: K,
        incoming: ProductFormCardModel[K] | undefined,
      ): ProductFormCardModel[K] => {
        if (current[key]) return current[key];
        if (!incoming) return current[key];
        if (isLowConf) flagged.push(key as string);
        return incoming;
      };
      next[index] = {
        ...current,
        name: fill('name', normalizeName(result.name)),
        brand: fill('brand', normalizeBrand(result.brand)),
        type: fill('type', result.type) || 'other',
        color: fill('color', result.color),
        colorCategory: fill('colorCategory', result.colorCategory),
        keyIngredients: fill('keyIngredients', result.keyIngredients),
        size: fill('size', result.size),
      };
      return next;
    });
    this.lowConfidenceFlags.update((m) => ({ ...m, [index]: flagged }));

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
