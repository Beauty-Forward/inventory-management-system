# Beauty Forward Inventory Management System — Product Design Doc & Engineering Plan

## Context

Beauty Forward collects donated beauty/personal care products and distributes them to shelters. The **donation delivery app** (Angular 21, Firebase/Firestore, Cloud Functions v2) handles the donor-facing flow — scheduling pickups, shipping, and drop-offs. Once donations physically arrive at the warehouse, there is no system to catalog products, track inventory, or manage outgoing batches to shelters. The warehouse manager does this manually.

This plan covers a new **Inventory Management System (IMS)** — an internal web app for the warehouse manager to process incoming donations, track inventory, assemble outgoing batches, and manage shelter profiles. It shares the same Firebase project (`beauty-forward`) and Firestore database as the delivery app.

---

## PART 1: PRODUCT DESIGN

### User Persona

**Warehouse Manager (primary):** Receives 5–20 donation packages/day. Needs to quickly log products (under 3 minutes per donation), assemble weekly outgoing batches for 8–15 shelter partners, and know what each shelter accepts. Uses laptop at desk, occasionally tablet on warehouse floor.

### Core User Flows

**1. Donation Intake**

1. Click "Process New Donation"

2. Enter drop-off reference code (pulls donor info from existing `donation_requests`) OR enter donor info manually (name, email, phone, city/state, optional Instagram)

3. Set donation date (defaults today) and method (pickup/shipping/dropoff)

4. For each product: enter name, brand, type (controlled dropdown), quantity, and optional fields (price, color, color category, key ingredients, expiration, details like hair type). Phase 2: scan barcode to pre-populate.

5. Click "Complete Donation" — saves donation + products, updates inventory

**2. Inventory Browsing**

- Searchable, filterable table of all in-stock products

- Filter by type, brand, expiration range; sort by any column

- Summary bar: total in stock, expiring within 30 days, top types

**3. Outgoing Batch Creation**

1. Select a shelter → system shows their accepted product types

2. Browse available inventory filtered to accepted types, select products

3. Running summary of batch contents

4. Finalize → marks products as allocated, removes from available inventory

5. Later: mark as shipped → delivered

**4. Shelter Profile Management**

- CRUD for shelters: name, address, contact info

- Manage accepted/rejected product types (checkbox grid by category)

- Preferred brands, notes, capacity estimate

### Feature Priority

| Priority | Features |

|----------|----------|

| **MVP** | Donation intake form, reference code lookup, product type taxonomy, inventory list, shelter CRUD with preferences, batch creation + status tracking, Firebase Auth (single user login), dashboard summary |

| **Phase 2** | Camera barcode scanning, local product catalog cache, batch suggestions based on shelter prefs, donor SMS opt-in, bulk "quick add" for known products |

| **Phase 3** | Image scanning (Cloud Vision), exportable reports, donor history view, automated expiration alerts, shelter demand matching |

### Key Screens

- **Dashboard:** Sidebar nav + 4 stat cards (In Stock, Received This Week, Shipped This Week, Expiring Soon) + Recent Donations table + Pending Batches table

- **Donation Form:** Reference code lookup → OR manual donor fields → date/method → repeating product cards with "Add Product" button → Save

- **Inventory List:** Search bar + type/brand/expiration filters → sortable data table → click for detail

- **Shelter Profile:** Contact info header → product type checkboxes grouped by category (Hair Care, Skin Care, Makeup, Hygiene, Nail Care, Fragrance) → notes → recent batches

- **Batch Form:** Two panels — available inventory (filtered to shelter's accepted types) + batch being assembled with running summary

---

## PART 2: ENGINEERING PLAN

### Firestore Data Model

Key adaptations from the proposed SQL schema to Firestore NoSQL:

- **Products** → subcollection of donations (not inline), queried via collection group queries for inventory views

- **Donor-donation link** → `donorId` on donation document (not array of IDs on donor — arrays of foreign keys don't scale in Firestore)

- **Inventory tracking** → `status` field on each product (`in_stock` | `allocated` | `shipped` | `expired` | `discarded`) — no separate inventory table needed

- **Phone numbers** → strings, not ints (formatting, leading zeros, country codes)

#### `donors/{donorId}`

`fullName` (string), `email` (string), `phone` (string), `smsOptIn` (boolean), `city` (string), `state` (string, 2-letter), `instagramHandle` (string?), `donationCount` (number, denormalized), `createdAt`, `updatedAt`

#### `donations/{donationId}`

`donorId` (string), `donorSnapshot` ({ fullName, email }), `date` (Timestamp), `method` (pickup|shipping|dropoff), `productCount` (number), `linkedRequestId` (string? — ties to delivery app's `donation_requests`), `notes` (string?), `processedBy` (string), `createdAt`, `updatedAt`

#### `donations/{donationId}/products/{productId}`

`name`, `brand`, `type` (from controlled enum), `quantity` (number ≥ 1), `price` (string?), `color` (string?), `colorCategory` (string?), `keyIngredients` (string?), `details` ({ hairType?, skinType?, scentFamily?, size? }), `expirationDate` (Timestamp?), `barcode` (string?), `status` (in_stock|allocated|shipped|expired|discarded), `batchId` (string? — set on allocation), `donationId` (denormalized), `donorId` (denormalized), `createdAt`, `updatedAt`

#### `shelters/{shelterId}`

`name`, `address` ({ line1, line2?, city, state, postalCode }), `contact` ({ name, email, phone }), `acceptedTypes` (string[]), `rejectedTypes` (string[]), `preferredBrands` (string[]?), `notes` (string?), `capacityPerBatch` (number?), `isActive` (boolean), `batchCount` (number), `createdAt`, `updatedAt`

#### `batches/{batchId}`

`shelterId`, `shelterSnapshot` ({ name, city, state }), `status` (draft|finalized|shipped|delivered), `productIds` (string[] — full document paths), `productCount` (number), `productSummary` ({ shampoo: 8, conditioner: 5, ... }), `notes` (string?), `finalizedAt?`, `shippedAt?`, `deliveredAt?`, `createdBy`, `createdAt`, `updatedAt`

#### `product_catalog/{barcode}` (Phase 2)

Cache of previously-seen products for instant barcode lookup. Fields: `barcode`, `name`, `brand`, `type`, `price?`, `color?`, `keyIngredients?`, `timesUsed`, `lastUsedAt`, `createdAt`

### Firestore Indexes Required

- `products` (COLLECTION_GROUP): `status` ASC + `createdAt` DESC

- `products` (COLLECTION_GROUP): `status` ASC + `type` ASC + `createdAt` DESC

- `products` (COLLECTION_GROUP): `status` ASC + `expirationDate` ASC

- `donations`: `donorId` ASC + `createdAt` DESC

- `batches`: `status` ASC + `createdAt` DESC

- `batches`: `shelterId` ASC + `createdAt` DESC

### Project Structure

Mirrors the sister app's conventions (standalone components, core/features/shared, SCSS, Zod validation).

```

src/app/

  core/

    models/        → donor, donation, product, shelter, batch interfaces + product-types enum

    services/      → firebase-client, auth, donor, donation, product, shelter, batch, reference-lookup, barcode (phase 2)

    guards/        → auth.guard.ts

    validators/    → Zod schemas for donation, shelter, batch

  features/

    dashboard/     → stat cards + recent activity tables

    donations/     → list, form (with dynamic product rows), detail

    inventory/     → list (collection group query), detail

    shelters/      → list, form (type checkbox grid), detail

    batches/       → list, form (two-panel product selection), detail

    login/         → email/password auth

  shared/components/

    sidebar, stat-card, data-table, product-form-row, filter-bar, status-badge, confirm-dialog

functions/src/     → new Cloud Functions added to existing deployment

```

### Implementation Phases

**Phase 1 — Scaffolding & Auth (Week 1)**

- Scaffold Angular 21 project, match sister app config (tsconfig strict mode, SCSS, Vitest)

- Install deps: `firebase`, `zod`, `rxjs`

- Create `FirebaseClientService` (pattern from `donation-delivery-app/src/app/core/services/firebase-client.service.ts`)

- Add Firebase Auth: `AuthService` + `auth.guard.ts` + `LoginPageComponent`

- Build root layout: sidebar + router-outlet

- Configure lazy-loaded routes with auth guard

**Phase 2 — Shelter Management (Week 2)**

- Define shelter models + Zod validators (pattern from `donation-delivery-app/functions/src/validators.ts`)

- Define `product-types.ts` enum organized by category (Hair Care, Skin Care, Makeup, Hygiene, Nail Care, Fragrance)

- `ShelterService` with Firestore CRUD + soft delete

- Shelter list, form (accepted types checkbox grid), and detail pages

**Phase 3 — Donation Intake (Weeks 3–4)**

- Define donor, donation, product models + validators

- `DonorService`: lookup by email, create, increment donationCount

- `DonationService`: Firestore **batched writes** to atomically create donation + products + update donor

- `ReferenceLookupService` + Cloud Function `lookupDonationByReference` (queries `donation_requests` via Admin SDK — added to existing `donation-delivery-app/functions/src/index.ts`)

- `ProductFormRowComponent` (reusable product entry card)

- `DonationFormPageComponent`: reference lookup → donor info → products → save

- Donation list + detail pages

**Phase 4 — Inventory Views (Week 5)**

- `ProductService` using collection group queries (`collectionGroup('products')` where `status == 'in_stock'`)

- Add collection group indexes to `firestore.indexes.json`

- Inventory list with search, filters, sort, cursor-based pagination

- Shared `DataTableComponent` and `FilterBarComponent`

**Phase 5 — Batch Management (Week 6)**

- `BatchService`: create draft → add/remove products (batched writes updating product status) → finalize → ship → deliver

- Batch list, form (two-panel: available inventory filtered to shelter's accepted types + batch summary), detail (status transitions)

- `StatusBadgeComponent` for draft/finalized/shipped/delivered

**Phase 6 — Dashboard (Week 7)**

- `DashboardPageComponent` with `StatCardComponent` instances

- Data from product counts, recent donations, pending batches

- If needed: Cloud Function trigger to maintain aggregate counts in a `stats` document

**Phase 7 — Barcode Scanning (Week 8, Phase 2 feature)**

- `BarcodeService`: native `BarcodeDetector` API + `html5-qrcode` fallback for Safari/Firefox

- `ProductLookupService`: check `product_catalog/{barcode}` → fallback to Cloud Function calling Open Food Facts API

- Scan button on `ProductFormRowComponent` → camera overlay → auto-fill fields

- Upsert to `product_catalog` after successful entry

### Connection to Donation Delivery App

- **Same Firebase project** — shared Firestore database, Cloud Functions, Auth user pool

- **Reference code lookup** goes through a Cloud Function (Admin SDK bypasses security rules) — no changes needed to delivery app's Firestore rules

- **New Cloud Functions** added to existing `donation-delivery-app/functions/src/index.ts` following the same `onCall` + Zod pattern

- **Deployment** as a separate Firebase Hosting site (`beauty-forward-inventory`) within the same project — independent URL and deploy cycle, shared backend

- **Firestore rules** extended (not modified) — add new collection rules alongside existing delivery app rules

### Security Rules

All new collections require authentication (unlike the public-write delivery app):

```

function isAuthenticated() { return request.auth != null; }



match /donors/{donorId} { allow read, write: if isAuthenticated(); }

match /donations/{donationId} {

  allow read, write: if isAuthenticated();

  match /products/{productId} { allow read, write: if isAuthenticated(); }

}

match /shelters/{shelterId} { allow read, write: if isAuthenticated(); }

match /batches/{batchId} { allow read, write: if isAuthenticated(); }

match /product_catalog/{barcode} { allow read, write: if isAuthenticated(); }

```

### Verification Plan

1. **Local dev**: Run Angular dev server + Firebase emulators (Firestore on 8080, Functions on 5001, Auth on 9099)

2. **Donation intake**: Create a donation with 3 products → verify donor doc, donation doc, and 3 product subdocs appear in Firestore emulator UI → verify all products have `status: in_stock`

3. **Reference lookup**: Seed a `donation_requests` doc with a reference code in emulator → enter code in donation form → verify donor fields auto-populate

4. **Inventory**: After creating donations, navigate to inventory list → verify all in-stock products appear → filter by type → verify filter works

5. **Shelter**: Create a shelter with accepted types → verify doc in Firestore → edit → verify update

6. **Batch flow**: Create batch for shelter → add products → verify products move to `allocated` status → finalize → ship → verify products move to `shipped` → verify batch status transitions

7. **Auth**: Try accessing any page without login → verify redirect to login → sign in → verify access

8. **Tests**: `npm test` runs Vitest suite for all services, validators, and key components
