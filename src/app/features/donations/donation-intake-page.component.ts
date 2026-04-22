import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ProductFormCardComponent,
  ProductFormCardModel,
  EMPTY_PRODUCT_CARD,
  toProductFormInput,
} from '../../shared/components/product-form-card/product-form-card.component';
import { CameraScannerComponent } from '../../shared/components/camera-scanner/camera-scanner.component';
import {
  CapturedPhoto,
  PhotoCaptureComponent,
} from '../../shared/components/photo-capture/photo-capture.component';
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
    RouterLink,
    ProductFormCardComponent,
    CameraScannerComponent,
    PhotoCaptureComponent,
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

  readonly scannerOpen = signal(false);
  readonly scannerTargetIndex = signal<number | null>(null);
  readonly photoCaptureOpen = signal(false);
  readonly photoTargetIndex = signal<number | null>(null);
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

  openScanner(index: number): void {
    this.scannerTargetIndex.set(index);
    this.scannerOpen.set(true);
    this.lookupMessage.set(null);
  }

  closeScanner(): void {
    this.scannerOpen.set(false);
    this.scannerTargetIndex.set(null);
  }

  async onBarcodeScanned(barcode: string): Promise<void> {
    const index = this.scannerTargetIndex();
    this.scannerOpen.set(false);
    if (index === null) return;

    this.lookupMessage.set(`Looking up ${barcode}…`);
    const result = await this.barcodeService.lookup(barcode);

    this.products.update((list) => {
      const next = [...list];
      const current = next[index] ?? EMPTY_PRODUCT_CARD();
      next[index] = {
        ...current,
        barcode,
        name: result.name || current.name,
        brand: result.brand || current.brand,
        keyIngredients: result.keyIngredients || current.keyIngredients,
        price: result.price || current.price,
        color: result.color || current.color,
        type: result.type || current.type,
      };
      return next;
    });

    if (result.found) {
      const sourceLabel =
        result.source === 'catalog'
          ? 'from catalog'
          : result.source === 'open_beauty_facts'
            ? 'from Open Beauty Facts'
            : 'from Open Food Facts';
      this.lookupMessage.set(`Pre-populated ${sourceLabel}.`);
    } else {
      this.lookupMessage.set(
        `No match found — barcode ${barcode} saved, fill in the rest manually.`,
      );
    }

    // Clear the message after 4 seconds
    setTimeout(() => this.lookupMessage.set(null), 4000);
  }

  // --- Photo capture + Gemini extraction ---

  openPhotoCapture(index: number): void {
    this.photoTargetIndex.set(index);
    this.photoCaptureOpen.set(true);
    this.lookupMessage.set(null);
  }

  closePhotoCapture(): void {
    this.photoCaptureOpen.set(false);
    this.photoTargetIndex.set(null);
  }

  async onPhotoCaptured(photo: CapturedPhoto): Promise<void> {
    const index = this.photoTargetIndex();
    this.photoCaptureOpen.set(false);
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
        name: result.name || current.name,
        brand: result.brand || current.brand,
        type: result.type || current.type,
        color: result.color || current.color,
        colorCategory: result.colorCategory || current.colorCategory,
        keyIngredients: result.keyIngredients || current.keyIngredients,
        size: result.size || current.size,
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
