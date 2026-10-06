export interface ProductTypeCategory {
  label: string;
  types: ProductTypeOption[];
}

export interface ProductTypeOption {
  value: string;
  label: string;
}

export const PRODUCT_TYPE_CATEGORIES: ProductTypeCategory[] = [
  {
    label: 'Hair Care',
    types: [
      { value: 'shampoo', label: 'Shampoo' },
      { value: 'conditioner', label: 'Conditioner' },
      { value: 'hair_oil', label: 'Hair Oil' },
      { value: 'hair_mask', label: 'Hair Mask' },
      { value: 'styling_product', label: 'Styling Product' },
    ],
  },
  {
    label: 'Skin Care',
    types: [
      { value: 'moisturizer', label: 'Moisturizer' },
      { value: 'cleanser', label: 'Cleanser' },
      { value: 'serum', label: 'Serum' },
      { value: 'sunscreen', label: 'Sunscreen' },
      { value: 'toner', label: 'Toner' },
      { value: 'balm', label: 'Balm' },
    ],
  },
  {
    label: 'Makeup',
    types: [
      { value: 'lipstick', label: 'Lipstick' },
      { value: 'lip_gloss', label: 'Lip Gloss' },
      { value: 'foundation', label: 'Foundation' },
      { value: 'concealer', label: 'Concealer' },
      { value: 'eyeshadow', label: 'Eyeshadow' },
      { value: 'mascara', label: 'Mascara' },
      { value: 'blush', label: 'Blush' },
      { value: 'bronzer', label: 'Bronzer' },
    ],
  },
  {
    label: 'Hygiene',
    types: [
      { value: 'soap', label: 'Soap' },
      { value: 'body_wash', label: 'Body Wash' },
      { value: 'lotion', label: 'Lotion' },
      { value: 'deodorant', label: 'Deodorant' },
      { value: 'toothpaste', label: 'Toothpaste' },
      { value: 'toothbrush', label: 'Toothbrush' },
      { value: 'feminine_products', label: 'Feminine Products' },
    ],
  },
  {
    label: 'Nail Care',
    types: [
      { value: 'nail_polish', label: 'Nail Polish' },
      { value: 'nail_polish_remover', label: 'Nail Polish Remover' },
      { value: 'nail_tools', label: 'Nail Tools' },
    ],
  },
  {
    label: 'Fragrance',
    types: [
      { value: 'perfume', label: 'Perfume' },
      { value: 'body_spray', label: 'Body Spray' },
    ],
  },
];

// Top-level catch-all options shown ungrouped in the picker — chosen
// when nothing else fits. Sitting outside PRODUCT_TYPE_CATEGORIES so
// they don't render as an unselectable <optgroup> header.
export const UNGROUPED_PRODUCT_TYPES: ProductTypeOption[] = [
  { value: 'other', label: 'Other' },
];

export const ALL_PRODUCT_TYPES: ProductTypeOption[] = [
  ...PRODUCT_TYPE_CATEGORIES.flatMap((c) => c.types),
  ...UNGROUPED_PRODUCT_TYPES,
];

export const PRODUCT_TYPE_VALUES: string[] =
  ALL_PRODUCT_TYPES.map((t) => t.value);

// Extra words a person might type for a category, beyond its label.
const CATEGORY_ALIASES: Record<string, string[]> = {
  'Hair Care': ['hair', 'haircare'],
  'Skin Care': ['skin', 'skincare'],
  Makeup: ['make up', 'cosmetics', 'cosmetic'],
  Hygiene: ['personal care', 'bath', 'body'],
  'Nail Care': ['nail', 'nails', 'nailcare'],
  Fragrance: ['scent', 'cologne'],
};

export function productCategoryLabel(type: string): string | undefined {
  return PRODUCT_TYPE_CATEGORIES.find((c) => c.types.some((t) => t.value === type))?.label;
}

// Lowercased text a product's type/category search should match against, so
// "skincare", "makeup", "shampoo" or "deodorant" all find the right products.
export function productTypeSearchText(type: string): string {
  const label = ALL_PRODUCT_TYPES.find((t) => t.value === type)?.label ?? type;
  const category = productCategoryLabel(type);
  const aliases = category ? [category, ...(CATEGORY_ALIASES[category] ?? [])] : [];
  return [type.replace(/_/g, ' '), label, ...aliases].join(' ').toLowerCase();
}
