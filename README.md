# Beauty Forward — Inventory Management System (IMS)

The warehouse tool in the Beauty Forward ecosystem (alongside the
[donation-delivery-app](https://github.com/Beauty-Forward/donation-delivery-app) and the
[data-dashboard](https://github.com/Beauty-Forward/data-dashboard)). Staff sign in to
catalog donated products (barcode scan or AI photo capture), track stock, group items into
**batches**, and ship them to **shelters**. Donations arranged in the public app **sync in
automatically**.

## 📚 Documentation

Team & maintainer docs live in [`docs/`](docs/):

- **[Architecture](docs/architecture-ims.md)** — the pieces and how they connect _([quick](docs/architecture-ims-simple.md))_
- **[Inventory Lifecycle & State Machine](docs/inventory-lifecycle-state-machine.md)** — Product + Batch statuses, and troubleshooting _([quick](docs/inventory-lifecycle-simple.md))_
- **[Internal User Guide](docs/user-guide-internal.md)** — running the warehouse day to day _([quick](docs/user-guide-internal-simple.md))_
- **[Accounts & Services](docs/accounts-and-services.md)** — every account & key, shared across all three apps _([quick](docs/accounts-and-services-simple.md))_

Whole-system map: the [System Overview](https://github.com/Beauty-Forward/donation-delivery-app/blob/main/docs/system-overview.md).

## Stack

- **Frontend:** Angular 21 (standalone, SCSS); barcode scanning via `@zxing`
- **Data:** **Firebase Data Connect → Postgres** (Cloud SQL `beauty-forward-fdc`) — the system of record for inventory
- **Backend:** Firebase Cloud Functions v2 (codebase `ims`, region `us-central1`) — barcode lookup, Gemini photo/AI extraction, and the donation sync
- **AI:** Gemini (`gemini-2.5-flash`) via Vertex AI
- **Auth:** Firebase Auth (staff sign-in required)
- **Hosting:** Firebase App Hosting (backend `inventory-management-system`)
- Shares the `beauty-forward` Firebase project with the sibling apps.

## Local development

```bash
npm install
npm --prefix functions install

# Emulators (auth + dataconnect Postgres + firestore + functions), seed, then serve:
npm run start-with-seed

# …or individually:
npm run emulators      # firebase emulators (imports/exports ./seed/snapshot)
npm run seed           # node seed/seed.mjs
npm run start          # ng serve -> http://localhost:4200
```

> The Data Connect emulator's Postgres is in-memory — re-run `npm run seed` after
> restarting. `npm run reset-dc-sdk` restores the generated Data Connect SDK under
> `src/app/core/dataconnect/`.

## Tests

```bash
npm test               # ng test (Vitest)
```

## Data model

`Donor`, `Donation`, `Product`, `Batch`, `Shelter` (see
`dataconnect/schema/schema.gql`). Product and Batch lifecycles, and the cross-app donation
sync, are documented in the
**[Inventory Lifecycle](docs/inventory-lifecycle-state-machine.md)** doc.
