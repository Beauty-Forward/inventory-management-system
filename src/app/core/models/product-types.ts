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
  {
    label: 'Other',
    types: [{ value: 'other', label: 'Other' }],
  },
];

export const ALL_PRODUCT_TYPES: ProductTypeOption[] =
  PRODUCT_TYPE_CATEGORIES.flatMap((c) => c.types);

export const PRODUCT_TYPE_VALUES: string[] =
  ALL_PRODUCT_TYPES.map((t) => t.value);
