import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  signal,
} from '@angular/core';
import { PRODUCT_TYPE_CATEGORIES, UNGROUPED_PRODUCT_TYPES } from '../../../core/models/product-types';
import type { ProductFormInput } from '../../../core/validators/donation.validators';

export interface ProductFormCardModel {
  name: string;
  brand: string;
  type: string;
  quantity: number;
  price: string;
  color: string;
  colorCategory: string;
  keyIngredients: string;
  hairType: string;
  skinType: string;
  scentFamily: string;
  size: string;
  expirationDate: string;
  barcode: string;
}

export const EMPTY_PRODUCT_CARD = (): ProductFormCardModel => ({
  name: '',
  brand: '',
  type: '',
  quantity: 1,
  price: '',
  color: '',
  colorCategory: '',
  keyIngredients: '',
  hairType: '',
  skinType: '',
  scentFamily: '',
  size: '',
  expirationDate: '',
  barcode: '',
});

export function toProductFormInput(
  m: ProductFormCardModel,
): ProductFormInput {
  const details: ProductFormInput['details'] = {};
  if (m.hairType) details.hairType = m.hairType;
  if (m.skinType) details.skinType = m.skinType;
  if (m.scentFamily) details.scentFamily = m.scentFamily;
  if (m.size) details.size = m.size;

  return {
    name: m.name.trim(),
    brand: m.brand.trim(),
    type: m.type,
    quantity: m.quantity,
    price: m.price.trim() || undefined,
    color: m.color.trim() || undefined,
    colorCategory: m.colorCategory.trim() || undefined,
    keyIngredients: m.keyIngredients.trim() || undefined,
    details: Object.keys(details).length > 0 ? details : undefined,
    expirationDate: m.expirationDate || undefined,
    barcode: m.barcode.trim() || undefined,
  };
}

@Component({
  selector: 'app-product-form-card',
  standalone: true,
  templateUrl: './product-form-card.component.html',
  styleUrl: './product-form-card.component.scss',
})
export class ProductFormCardComponent {
  @Input({ required: true }) index = 0;
  @Input({ required: true }) model: ProductFormCardModel = EMPTY_PRODUCT_CARD();
  @Input() errors: Record<string, string> = {};
  @Input() canRemove = true;

  @Output() modelChange = new EventEmitter<ProductFormCardModel>();
  @Output() remove = new EventEmitter<void>();
  @Output() scanBarcode = new EventEmitter<void>();
  @Output() capturePhoto = new EventEmitter<void>();

  readonly categories = PRODUCT_TYPE_CATEGORIES;
  readonly ungroupedTypes = UNGROUPED_PRODUCT_TYPES;
  readonly expanded = signal(false);

  readonly isHairCare = computed(() =>
    ['shampoo', 'conditioner', 'hair_oil', 'hair_mask', 'styling_product'].includes(
      this.model.type,
    ),
  );

  readonly isSkinCare = computed(() =>
    ['moisturizer', 'cleanser', 'serum', 'sunscreen', 'toner'].includes(
      this.model.type,
    ),
  );

  readonly isFragrance = computed(() =>
    ['perfume', 'body_spray'].includes(this.model.type),
  );

  updateField<K extends keyof ProductFormCardModel>(
    key: K,
    value: ProductFormCardModel[K],
  ): void {
    this.model = { ...this.model, [key]: value };
    this.modelChange.emit(this.model);
  }

  toggleExpanded(): void {
    this.expanded.update((v) => !v);
  }

  onRemove(): void {
    this.remove.emit();
  }

  onScanBarcode(): void {
    this.scanBarcode.emit();
  }

  onCapturePhoto(): void {
    this.capturePhoto.emit();
  }
}
