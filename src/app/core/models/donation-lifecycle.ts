import type { StatusPillVariant } from '../../shared/components/status-pill/status-pill.component';

// ============================================================
// Donation lifecycle — single source of truth
// ============================================================
// A donation's meaningful journey is its trip *to* the warehouse, followed by
// being catalogued into inventory. Once processed, its products join the
// general stock pool and are distributed generically — they aren't tracked
// per-donation to a shelter — so the lifecycle stops at "processed" rather
// than following items outbound.
//
//   awaiting → on the way → arrived → processed
//
// The inbound leg comes from the delivery app via `logisticsStatus` (mirrored
// into the IMS by the Firestore trigger); "arrived" is set when the donation
// is physically received; "processed" means products have been catalogued.
// Both the list and the detail page derive their labels, pills, and buckets
// from `deriveLifecycle` so "where is this donation" reads the same everywhere.

export type LifecyclePhase =
  | 'awaiting' // scheduled — the donor still has it (awaiting pickup / shipment / drop-off)
  | 'in_transit' // dispatched — on the way to the warehouse
  | 'arrived' // physically received, not yet catalogued
  | 'processed'; // catalogued into inventory — a visible end state

// The stops shown on the detail timeline, in order.
export const LIFECYCLE_RAIL: readonly LifecyclePhase[] = [
  'awaiting',
  'in_transit',
  'arrived',
  'processed',
] as const;

export const RAIL_LABELS: Record<LifecyclePhase, string> = {
  awaiting: 'awaiting',
  in_transit: 'in transit',
  arrived: 'arrived',
  processed: 'processed',
};

export interface LifecycleView {
  phase: LifecyclePhase;
  /** Short, lowercase pill label, e.g. "awaiting pickup", "on the way". */
  label: string;
  variant: StatusPillVariant;
  /** True for states that need a human to look (e.g. a failed dispatch). */
  attention?: boolean;
}

// Structural shape — deliberately minimal so both the list row and the detail
// record satisfy it. Only `logisticsStatus`, `method`, and whether any
// products exist matter; product/inventory status is not part of the donation
// lifecycle.
export interface LifecycleInput {
  logisticsStatus: string;
  method: string;
  products?: readonly unknown[] | null;
}

// A donation counts as physically "here" once the delivery app marks it
// completed, a walk-in created it locally, or a manager manually confirmed
// arrival (shipping/drop-off donations never auto-complete).
const HERE_STATUSES = new Set(['completed', 'walk_in', 'arrived']);
export function isDonationHere(d: LifecycleInput): boolean {
  return HERE_STATUSES.has(d.logisticsStatus);
}

// Delivery-app statuses that mean a courier is dispatched and the donation is
// on its way to the warehouse. Kept as a set (rather than a single value) so
// forward-looking statuses the delivery app might add map sensibly without an
// IMS change; anything else inbound is treated as still "awaiting".
const IN_TRANSIT_STATUSES = new Set([
  'queued_for_dispatch',
  'in_transit',
  'out_for_pickup',
  'picked_up',
]);

// Method-specific "awaiting" wording — what the donation is waiting on.
function awaitingLabel(method: string): string {
  switch (method) {
    case 'pickup':
      return 'awaiting pickup';
    case 'shipping':
      return 'awaiting shipment';
    case 'dropoff':
      return 'drop-off scheduled';
    default:
      return 'scheduled';
  }
}

function inboundView(status: string, method: string): LifecycleView {
  // A pickup whose courier booking failed needs a human to re-book it.
  if (status === 'dispatch_failed') {
    return { phase: 'awaiting', label: 'pickup failed', variant: 'flagged', attention: true };
  }
  if (IN_TRANSIT_STATUSES.has(status)) {
    return { phase: 'in_transit', label: 'on the way', variant: 'route' };
  }
  return { phase: 'awaiting', label: awaitingLabel(method), variant: 'soft' };
}

/**
 * The one function that decides where a donation sits in its lifecycle.
 * Precedence: has products → processed; else physically here → arrived; else
 * it's still inbound (awaiting / on the way).
 */
export function deriveLifecycle(d: LifecycleInput): LifecycleView {
  const hasProducts = (d.products?.length ?? 0) > 0;

  if (hasProducts) {
    return { phase: 'processed', label: 'processed', variant: 'ready' };
  }
  if (isDonationHere(d)) {
    return { phase: 'arrived', label: 'arrived', variant: 'intake' };
  }
  return inboundView(d.logisticsStatus, d.method);
}

// --- Bucket helpers for the list filters -------------------------------

export type DonationBucket = 'incoming' | 'arrived' | 'processed';

export function bucketOf(phase: LifecyclePhase): DonationBucket {
  switch (phase) {
    case 'awaiting':
    case 'in_transit':
      return 'incoming';
    case 'arrived':
      return 'arrived';
    case 'processed':
      return 'processed';
  }
}

// Position of a phase on LIFECYCLE_RAIL, for the detail timeline.
export function railIndexOf(phase: LifecyclePhase): number {
  return LIFECYCLE_RAIL.indexOf(phase);
}
