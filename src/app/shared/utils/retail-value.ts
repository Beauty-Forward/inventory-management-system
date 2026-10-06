// Product `price` is stored as a free-text string (unit retail price); these
// helpers turn it into numbers for totals.

export function parsePrice(price: string | null | undefined): number | null {
  if (!price) return null;
  const n = parseFloat(String(price).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : null;
}

export interface ValuedItem {
  quantity: number;
  price?: string | null;
}

// Estimated retail value of a set of products (unit price × quantity). Items
// with no price contribute nothing; `unpriced` counts them so the UI can say
// the total is partial.
export function retailValue(items: ValuedItem[]): { total: number; unpriced: number } {
  let total = 0;
  let unpriced = 0;
  for (const item of items) {
    const unit = parsePrice(item.price);
    if (unit === null) unpriced++;
    else total += unit * (item.quantity ?? 0);
  }
  return { total, unpriced };
}

export function formatUsd(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}
