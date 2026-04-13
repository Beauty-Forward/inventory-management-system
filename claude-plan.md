# Beauty Forward Inventory Management System — Product Design Doc & Engineering Plan

## Context

Beauty Forward collects donated beauty/personal care products and distributes them to shelters. The **donation delivery app** (Angular 21, Firebase/Firestore, Cloud Functions v2) handles the donor-facing flow — scheduling pickups, shipping, and drop-offs. Once donations physically arrive at the warehouse, there is no system to catalog products, track inventory, or manage outgoing batches to shelters. The warehouse manager does this manually.

This plan covers a new **Inventory Management System (IMS)** — an internal web app for the warehouse manager to process incoming donations, track inventory, assemble outgoing batches, and manage shelter profiles. It shares the same Firebase project (`beauty-forward`) as the delivery app.

**Database:** Firebase Data Connect (PostgreSQL) — gives us relational SQL with Firebase's auth and ecosystem integration.

**Primary device:** Phone — the warehouse manager processes donations on their phone (camera for product photos/scanning), with laptop as secondary for batch assembly and reporting.

---

## PART 1: PRODUCT DESIGN

### User Persona

**Warehouse Manager (primary):** Receives 5–20 donation packages/day. Needs to quickly log products (under 3 minutes per donation), assemble weekly outgoing batches for 8–15 shelter partners, and know what each shelter accepts. **Primary device is phone** — uses camera to scan barcodes and photograph products during intake. Laptop used for batch assembly, shelter management, and reporting.

### Decision for CEO: Donation Intake Model

The IMS processes items from donations, but how should donations enter the system? Three options with tradeoffs:

| Approach | How it works | Pros | Cons |
|----------|-------------|------|------|
| **A. Always linked (reference code required)** | Every warehouse intake maps to an existing donation from the delivery app. Warehouse manager enters reference code → system pulls donation + donor info → manager adds product line items. | Single source of truth; no duplicate donors; every donation traceable end-to-end; cleanest data | Can't process walk-in donations, community drives, or packages that arrive without codes; creates hard dependency on delivery app |
| **B. Walk-in creation through delivery app backend** | IMS has a "Walk-in Donation" button that calls a Cloud Function to create a `donation_request` in the delivery app (method: `walk-in`) → then proceeds to item processing. Warehouse manager never leaves the IMS, but data flows through canonical pipeline. | Single source of truth preserved; handles edge cases; warehouse manager stays in one app; delivery app remains the record system for all donations | Slightly more complex backend; walk-in donations won't have full scheduling metadata |
| **C. Fully independent manual creation** | IMS can create its own donation records with manual donor info entry, completely independent of the delivery app. | Maximum flexibility; no dependency on delivery app | Duplicate donor records across systems; data quality issues; no traceability; two sources of truth |

**Recommendation:** Option B. It preserves the delivery app as the single source of truth while letting the warehouse manager handle edge cases without switching apps. The Cloud Function is straightforward — it creates a minimal `donation_request` with method `walk-in` and donor info.

### Core User Flows

**1. Donation Intake (phone-first)**
1. Open IMS on phone → tap "Process Donation"
2. Scan or enter reference code → system pulls existing donation + donor info from delivery app
3. For each product in the package:
   - **Primary:** Scan barcode with phone camera → auto-populate product fields
   - **Fallback:** Manually enter name, brand, type (controlled dropdown), quantity
   - Optional fields: price, color, color category, key ingredients, expiration, details (hair type, etc.)
4. Tap "Complete" → saves all products to inventory with status `in_stock`

Note: Donation date and method are already set by the delivery app's existing donation record — they are not re-entered in the IMS.

**2. Inventory Browsing**
- Searchable, filterable table of all in-stock products
- Filter by type, brand, expiration range; sort by any column
- Summary bar: total in stock, expiring within 30 days, top types

**3. Outgoing Batch Creation (laptop)**
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
| **MVP** | Donation intake (reference code lookup + item processing), product type taxonomy, inventory list, shelter CRUD with preferences, batch creation + status tracking, Firebase Auth, dashboard summary, mobile-responsive UI |
| **Phase 2** | Camera barcode scanning with auto-populate, product catalog cache, walk-in donation flow (Option B), batch suggestions based on shelter prefs, donor SMS opt-in, bulk "quick add" for known products |
| **Phase 3** | Image recognition (Cloud Vision for product photos), exportable reports, donor history view, automated expiration alerts, shelter demand matching |

### Key Screens

- **Dashboard:** Double Espresso bottom nav (mobile) / sidebar (desktop) with Beauty Forward wordmark. Porcelain page background. 4 white stat cards with left-edge accent stripes (Eucalyptus, Buttercup, Cobalt, Crimson). Alte Haas Grotesk H4 for stat labels, Open Sauce Sans P2 for values. Below: Recent Donations and Pending Batches tables with status badges.
- **Donation Intake (mobile-first):** Large Hunter Green pill button "Scan Code" → product list as white rounded cards on Porcelain background → each card has barcode scan button + Open Sauce Sans form fields with 8px radius inputs → "Complete Donation" sticky footer in Hunter Green pill.
- **Inventory List:** Search bar (8px radius, warm gray border) + Buttercup-tinted filter chips (pill shape) → card list on mobile / data table on desktop with subtitle-style headers (All Caps, 13px Alte Haas Grotesk) → status badges per item → tap for detail.
- **Shelter Profile:** Alte Haas Grotesk H3 shelter name, Open Sauce Sans contact info. Product type checkboxes grouped by category in a grid of rounded cards. Hunter Green "Create Batch" pill button.
- **Batch Form (desktop-optimized):** Two white card panels on Porcelain background — left panel shows available inventory filtered to shelter's accepted types with checkboxes, right panel shows batch summary with type-by-type Eucalyptus count pills. Hunter Green "Finalize Batch" pill button.

---

## DESIGN SYSTEM (from Beauty Access Brand Guide)

The IMS is an internal tool, but it should feel like part of the Beauty Access / Beauty Forward ecosystem — not a generic admin panel. The brand guide establishes a "looks like a beauty brand, is a beauty brand" identity. For an internal warehouse tool, we apply the brand's type, color, and shape language at reduced intensity: clean and functional, but unmistakably Beauty Forward.

### Color Palette

**Primary (50% of surface area):**
- **Porcelain** — off-white/warm cream (`~#F5F0E8`) — page backgrounds, cards
- **Double Espresso** — near-black deep brown (`~#1A1A1A`) — primary text, nav, headers

**Primary Accents (30%):**
- **Buttercup** — warm yellow (`~#F2DC8C`) — highlights, selected states, attention
- **Dusty Blue** — muted blue (`~#8AAEC4`) — informational badges, links
- **Crimson** — muted red (`~#B94A3E`) — errors, expiring-soon alerts, destructive actions
- **Eucalyptus** — sage green (`~#B5C4A1`) — success states, "in stock" badges

**Secondary Accents (20%):**
- **Rosewater** — soft pink (`~#E8C4C0`) — empty states, secondary highlights
- **Cobalt** — blue (`~#4A6FA5`) — batch/shipping status
- **Apricot** — peach/salmon (`~#E09070`) — warnings, pending states
- **Hunter Green** — deep green (`~#3D6B35`) — primary action buttons, CTA fills

**Usage in the IMS:**
- Page background: Porcelain
- Cards/containers: white (`#FFFFFF`) with subtle Porcelain borders
- Primary text: Double Espresso
- Nav sidebar/bottom bar: Double Espresso background, Porcelain text
- Status badges: Eucalyptus (in stock), Buttercup (allocated/draft), Cobalt (shipped), Apricot (pending), Crimson (expired/error)
- Primary action buttons: Hunter Green fill, white text (rounded pill shape)
- Secondary buttons: Double Espresso outline, transparent fill (rounded pill shape)
- Stat cards: white background with a left-edge accent stripe in a Primary Accent color

### Typography

**Headings — Alte Haas Grotesk:**
- H1: 60px / line-height 96px / -2% letter-spacing (dashboard title, page headers on desktop)
- H2: 50px / 67px / -2% (section headers — not needed for mobile views at this size, scale down)
- H3: 40px / 48px / -2% (card group headers)
- H4: 20px / 21px / -2% (stat card labels, list section headers)
- Color: Double Espresso

**Body — Open Sauce Sans:**
- P1: 24px / 33.6px / 1.4em (large body, hero descriptions — rarely used in IMS)
- P2: 20px / 28px / 1.4em (primary body text, form labels, table cells on desktop)
- P3: 18px / 25.2px / 1.4em (secondary body, descriptions, table cells on mobile)
- Color: Double Espresso, with muted variants for secondary text

**Buttons & Interactive — Alte Haas Grotesk Bold:**
- Buttons: Sentence Case / 16px / line-height 16px / 1em
- Subtitles/metadata: All Caps / 13px / 13px / 1em / 5% letter-spacing
- Nav labels, filter chips, status badges use the subtitle style

**Mobile scaling:** On viewports < 768px, scale heading sizes down proportionally (H1 → ~32px, H4 → 16px). Body sizes stay at P2/P3.

**Font loading:** Both Alte Haas Grotesk and Open Sauce Sans are free/open-source. Self-host from `/fonts/` directory (same pattern as sister app). Include Regular and Bold weights for both.

### Shape Language

- **Rounded corners** on all containers: 12px for cards, 8px for inputs, 24px (full pill) for buttons
- **Circular shapes** echo the connected circles motif from the Beauty Forward logo (the "oo" in "forward")
- **Stat card icons** can use circular indicators
- **No sharp rectangles** — everything should feel soft and approachable
- **Thin horizontal rules** (1px, Porcelain-dark or border color) for section separation — not heavy dividers

### Component Styling Specifics

**Buttons:**
- Primary: Hunter Green fill, white Alte Haas Grotesk Bold 16px, pill shape (border-radius: 24px), 48px min-height for touch targets
- Secondary: transparent fill, Double Espresso 1px border, pill shape
- Destructive: Crimson fill, white text, pill shape
- Disabled: 40% opacity

**Form Inputs:**
- Border: 1px solid border-color (warm gray `~#D8D0C8`)
- Border-radius: 8px
- Background: white
- Focus: 2px Hunter Green outline
- Label: Open Sauce Sans P3, Double Espresso
- Placeholder: muted warm gray

**Cards:**
- Background: white
- Border: 1px solid `~#E8E2DA` (warm Porcelain border)
- Border-radius: 12px
- Shadow: subtle `0 1px 3px rgba(26,26,26,0.06)`
- Padding: 16px mobile, 24px desktop

**Status Badges:**
- Pill shape (border-radius: 12px)
- Alte Haas Grotesk Bold, All Caps, 11px, 5% letter-spacing
- Background: color at 15% opacity, text in full color
- `in_stock`: Eucalyptus, `allocated`/`draft`: Buttercup, `shipped`: Cobalt, `delivered`: Hunter Green, `expired`: Crimson, `finalized`: Dusty Blue

**Navigation (mobile bottom bar):**
- Background: Double Espresso
- Icons + labels in Porcelain
- Active tab: Buttercup accent (icon + underline)
- 5 tabs max: Dashboard, Intake, Inventory, Shelters, Batches

**Navigation (desktop sidebar):**
- Background: Double Espresso
- Width: 240px
- Beauty Forward wordmark at top (white, with connected-circles "oo")
- Nav items: Porcelain text, Alte Haas Grotesk 14px
- Active item: Porcelain background at 10% opacity, Buttercup left border accent

**Data Tables:**
- Header row: Alte Haas Grotesk Bold subtitle style (All Caps, 13px, 5% letter-spacing), muted color
- Cell text: Open Sauce Sans P3
- Row hover: Porcelain background
- Alternating rows: not needed (clean white is on-brand)
- Border between rows: 1px Porcelain-dark

---

## PART 2: ENGINEERING PLAN

### Database: Firebase Data Connect (PostgreSQL)

Firebase Data Connect provides a managed PostgreSQL database with Firebase Auth integration, GraphQL API generation, and client SDK generation for Angular. This gives us proper relational modeling while staying in the Firebase ecosystem.

### SQL Schema

```sql
-- Donors (users who donate products)
CREATE TABLE donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,  -- string, not int (formatting, leading zeros, country codes)
  sms_opt_in BOOLEAN DEFAULT FALSE,
  city VARCHAR NOT NULL,
  state VARCHAR(2) NOT NULL,
  instagram_handle VARCHAR,
  linked_request_id VARCHAR,  -- optional tie to delivery app's donation_requests doc ID
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donations (received at warehouse, linked to delivery app's donation_requests)
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES donors(id),
  donation_request_id VARCHAR NOT NULL,  -- Firestore doc ID from delivery app's donation_requests
  date DATE NOT NULL,           -- from the original donation request
  method VARCHAR NOT NULL,      -- from the original donation request (pickup/shipping/dropoff/walk-in)
  notes TEXT,
  processed_by VARCHAR NOT NULL, -- auth user ID of warehouse manager
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products (individual items from a donation, the core of inventory)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID NOT NULL REFERENCES donations(id),
  name VARCHAR NOT NULL,
  brand VARCHAR NOT NULL,
  type VARCHAR NOT NULL,        -- from controlled enum (shampoo, conditioner, lipstick, etc.)
  quantity INTEGER NOT NULL CHECK (quantity >= 1),
  price VARCHAR,                -- display string, not used in calculations
  color VARCHAR,
  color_category VARCHAR,
  key_ingredients TEXT,
  details JSONB,                -- flexible: {hair_type, skin_type, scent_family, size, etc.}
  expiration_date DATE,
  barcode VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'in_stock'
    CHECK (status IN ('in_stock', 'allocated', 'shipped', 'expired', 'discarded')),
  batch_id UUID REFERENCES batches(id),  -- set when allocated to a batch
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shelters (distribution partners)
CREATE TABLE shelters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  address_line1 VARCHAR NOT NULL,
  address_line2 VARCHAR,
  city VARCHAR NOT NULL,
  state VARCHAR(2) NOT NULL,
  postal_code VARCHAR NOT NULL,
  contact_name VARCHAR NOT NULL,
  contact_email VARCHAR,
  contact_phone VARCHAR,
  accepted_types TEXT[],        -- array of product type strings
  rejected_types TEXT[],
  preferred_brands TEXT[],
  notes TEXT,
  capacity_per_batch INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Batches (outgoing shipments to shelters)
CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shelter_id UUID NOT NULL REFERENCES shelters(id),
  status VARCHAR NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'finalized', 'shipped', 'delivered')),
  notes TEXT,
  created_by VARCHAR NOT NULL,  -- auth user ID
  finalized_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product catalog cache (Phase 2 — for barcode lookup)
CREATE TABLE product_catalog (
  barcode VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  brand VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  price VARCHAR,
  color VARCHAR,
  key_ingredients TEXT,
  source VARCHAR NOT NULL CHECK (source IN ('manual', 'open_food_facts', 'scan')),
  times_used INTEGER DEFAULT 1,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Useful indexes
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_status_type ON products(status, type);
CREATE INDEX idx_products_status_expiration ON products(status, expiration_date);
CREATE INDEX idx_products_donation ON products(donation_id);
CREATE INDEX idx_products_batch ON products(batch_id);
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_batches_shelter ON batches(shelter_id);
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_donors_email ON donors(email);

-- Useful views
CREATE VIEW inventory_summary AS
  SELECT type, COUNT(*) as count, SUM(quantity) as total_quantity
  FROM products WHERE status = 'in_stock'
  GROUP BY type;

CREATE VIEW expiring_soon AS
  SELECT * FROM products
  WHERE status = 'in_stock'
    AND expiration_date IS NOT NULL
    AND expiration_date <= CURRENT_DATE + INTERVAL '30 days'
  ORDER BY expiration_date ASC;
```

### Project Structure

Mirrors the sister app's conventions (standalone components, core/features/shared, SCSS, Zod validation). Mobile-first responsive design.

```
inventory-management-system/
  src/app/
    core/
      models/        → donor, donation, product, shelter, batch interfaces + product-types enum
      services/      → firebase-client, auth, donor, donation, product, shelter, batch,
                       reference-lookup, barcode (phase 2)
      guards/        → auth.guard.ts
      validators/    → Zod schemas for donation, shelter, batch
    features/
      dashboard/     → stat cards + recent activity tables
      donations/     → list, intake form (reference lookup → product entry)
      inventory/     → list (filterable, sortable), detail
      shelters/      → list, form (type checkbox grid), detail
      batches/       → list, form (two-panel product selection), detail
      login/         → email/password auth
    shared/components/
      bottom-nav/          → mobile navigation
      sidebar/             → desktop navigation
      stat-card/
      data-table/
      product-form-card/   → mobile-friendly product entry card
      filter-bar/
      status-badge/
      confirm-dialog/
      camera-scanner/      → barcode scanning overlay (Phase 2)
  functions/src/           → Cloud Functions (in delivery app's functions dir)
  dataconnect/             → Firebase Data Connect schema + queries
```

### Implementation Phases

**Phase 1 — Scaffolding, Auth, Design System & Layout (Week 1)**
- Scaffold Angular 21 project, match sister app config (tsconfig strict mode, SCSS, Vitest)
- Install deps: `firebase`, `zod`, `rxjs`
- **Design system setup in `styles.scss`:**
  - Self-host Alte Haas Grotesk (Regular + Bold) and Open Sauce Sans (Regular + Bold) in `/fonts/`
  - SCSS variables for full Beauty Access color palette (Porcelain, Double Espresso, Buttercup, Dusty Blue, Crimson, Eucalyptus, Rosewater, Cobalt, Apricot, Hunter Green)
  - Typography mixins: `@mixin heading($level)`, `@mixin body($size)`, `@mixin button-text`, `@mixin subtitle`
  - Component mixins: `@mixin card`, `@mixin pill-button($variant)`, `@mixin status-badge($color)`, `@mixin form-input`
  - Responsive breakpoint: `$mobile-breakpoint: 768px`
  - Global reset with Porcelain background, Double Espresso text color
- Create `FirebaseClientService` (pattern from `donation-delivery-app/src/app/core/services/firebase-client.service.ts`)
- Set up Firebase Data Connect: define schema, generate client SDK
- Add Firebase Auth: `AuthService` + `auth.guard.ts` + `LoginPageComponent`
- Build responsive root layout: Double Espresso bottom nav on mobile / sidebar with Beauty Forward wordmark on desktop + `<router-outlet>` on Porcelain background
- Configure lazy-loaded routes with auth guard

**Phase 2 — Shelter Management (Week 2)**
- Define shelter models + Zod validators (pattern from `donation-delivery-app/functions/src/validators.ts`)
- Define `product-types.ts` enum organized by category (Hair Care, Skin Care, Makeup, Hygiene, Nail Care, Fragrance)
- `ShelterService` with PostgreSQL CRUD via Data Connect + soft delete
- Shelter list, form (accepted types checkbox grid), and detail pages

**Phase 3 — Donation Intake (Weeks 3–4)**
- Define donor, donation, product models + validators
- `ReferenceLookupService` + Cloud Function `lookupDonationByReference` (queries `donation_requests` in Firestore via Admin SDK — added to existing `donation-delivery-app/functions/src/index.ts`)
- `DonorService`: look up existing donor by email, upsert on donation intake
- `DonationService`: creates donation + all products in a single PostgreSQL transaction
- `ProductFormCardComponent` (mobile-first reusable product entry card)
- `DonationIntakePageComponent` (mobile-first): reference code scan/entry → product cards → complete
- Donation list + detail pages

**Phase 4 — Inventory Views (Week 5)**
- `ProductService`: query products by status, type, brand, expiration with SQL `WHERE` clauses + pagination (`LIMIT`/`OFFSET`)
- Inventory list: card view on mobile, data table on desktop, with search + filter chips
- Inventory detail page
- Shared `DataTableComponent` and `FilterBarComponent`

**Phase 5 — Batch Management (Week 6)**
- `BatchService`: create draft → add/remove products (transaction: update product status + batch_id) → finalize → ship → deliver
- Batch list, form (desktop-optimized two-panel: available inventory filtered to shelter's accepted types + batch summary), detail (status transition buttons)
- `StatusBadgeComponent` for draft/finalized/shipped/delivered

**Phase 6 — Dashboard (Week 7)**
- `DashboardPageComponent` with `StatCardComponent` instances
- SQL queries: `SELECT COUNT(*) FROM products WHERE status = 'in_stock'`, inventory_summary view, expiring_soon view, recent donations, pending batches
- Mobile-friendly card layout

**Phase 7 — Barcode Scanning (Week 8, Phase 2 feature)**
- `BarcodeService`: native `BarcodeDetector` API + `html5-qrcode` fallback for Safari/Firefox
- `ProductLookupService`: check `product_catalog` table → fallback to Cloud Function calling Open Food Facts API
- Scan button on `ProductFormCardComponent` → camera overlay → auto-fill fields
- Upsert to `product_catalog` after successful entry with barcode

### Connection to Donation Delivery App

- **Same Firebase project** (`beauty-forward` / `beauty-forward-dev`) — shared Firebase Auth user pool
- **Different databases**: delivery app uses Firestore, IMS uses Data Connect (PostgreSQL). They coexist in the same Firebase project.
- **Reference code lookup**: Cloud Function reads from Firestore `donation_requests` collection (Admin SDK bypasses security rules) → returns donor info to IMS
- **Walk-in donations (Phase 2, Option B)**: Cloud Function creates a `donation_request` doc in Firestore with method `walk-in`, returns the new doc ID for the IMS to reference
- **New Cloud Functions** added to existing `donation-delivery-app/functions/src/index.ts` following the same `onCall` + Zod pattern
- **Deployment** as a separate Firebase Hosting site (`beauty-forward-inventory`) — independent URL and deploy cycle, shared backend

### Security

- Firebase Auth required for all Data Connect queries (enforced via Data Connect auth directives)
- Firestore rules for delivery app collections remain unchanged — IMS accesses them only through Cloud Functions (Admin SDK)
- All API calls from the Angular app go through authenticated Firebase client SDK

### Verification Plan

1. **Local dev**: Run Angular dev server + Firebase Data Connect emulator + Functions emulator
2. **Donation intake**: Enter reference code → verify donor info populates → add 3 products → complete → verify rows in `donors`, `donations`, and `products` tables with correct foreign keys and `status = 'in_stock'`
3. **Reference lookup**: Seed a `donation_requests` doc in Firestore emulator → enter code in IMS → verify donor fields auto-populate
4. **Inventory**: After creating donations, navigate to inventory list → verify all in-stock products appear → filter by type → verify SQL `WHERE` filtering works → verify expiring_soon view
5. **Shelter**: Create shelter with accepted types → verify row in `shelters` table → edit → verify update → deactivate → verify `is_active = false`
6. **Batch flow**: Create batch for shelter → add products → verify products move to `allocated` status and `batch_id` is set → finalize → ship → verify products move to `shipped` → verify batch status transitions and timestamps
7. **Auth**: Try accessing any page without login → verify redirect to login → sign in → verify access
8. **Mobile**: Test donation intake flow on phone-sized viewport → verify camera access for barcode scanning (Phase 2) → verify touch-friendly product cards
9. **Tests**: `npm test` runs Vitest suite for all services, validators, and key components
