# Accounts & Services

> **Who this is for:** Whoever keeps Beauty Forward's software running. This is the key
> ring — every outside account the three apps depend on, who owns it, where to sign in,
> and where its keys live.
>
> **This document contains no passwords and no secret key values.** It says _where_ each
> secret lives and _how_ to change it — never the secret itself. Keep it that way.
>
> 🔁 **Replicated file.** This same document lives in all three Beauty Forward repos
> (`donation-delivery-app`, `inventory-management-system`, `data-dashboard`) because the
> apps share these accounts. **If you change it, update all three copies** so they don't
> drift.

---

## The three apps and what each uses

Beauty Forward runs three apps that **share one Google Firebase project** (`beauty-forward`):

| App | Uses these services |
| --- | --- |
| **Donation app** (public site) | Firebase/Google Cloud · Givebutter · Roadie · Resend |
| **Inventory system (IMS)** | Firebase/Google Cloud · Data Connect (Postgres) · Vertex AI (Gemini) · UPCitemdb + Open Beauty/Food Facts |
| **Data dashboard** | Firebase/Google Cloud · Data Connect (Postgres, read-only) |

**Firebase/Google Cloud is shared by all three.** Everything else is used by just one or
two apps, noted below.

---

## Ownership & handover status

| Service | Owned by | Status |
| --- | --- | --- |
| **Firebase / Google Cloud** | Currently the dev's personal Google account | ⏳ **To be transferred to Beauty Forward** as part of project close-out |
| **Givebutter** | Beauty Forward | ✅ Owned by BF — _confirm campaign visibility (below)_ |
| **Roadie** | Beauty Forward | ✅ Owned by BF; team has their own logins |
| **Resend** | Beauty Forward (`info@beauty-forward.org`) | ✅ Owned by BF |
| **GitHub** | Beauty Forward org | ✅ BF has admin on all three repos |
| **UPCitemdb / Open Beauty Facts** | No account needed (free tiers) | ✅ Optional paid key for UPCitemdb only |

> The two things that still need to happen are the **Firebase/Google Cloud transfer** and
> **confirming Givebutter campaign visibility** — both are in the _Handover checklist_ at
> the end.

---

## Firebase / Google Cloud — shared by all three apps

The backbone. One project, `beauty-forward`, hosts everything: all three websites, all
the backends, the databases, the secrets, and the AI.

- **Sign in:** [console.firebase.google.com](https://console.firebase.google.com) →
  project `beauty-forward`. The Google Cloud console (for billing, Cloud SQL, and Vertex
  AI) is the same project at [console.cloud.google.com](https://console.cloud.google.com).
- **Who owns it today:** the dev's personal Google account, on the dev's card. **This is
  the one account that still needs to be handed over** — the Firebase project _and_ the
  underlying Google Cloud billing account. See the handover checklist.
- **Amount spent to date:** ⬜ _(to be filled from the Google Cloud billing console for
  the handover conversation)_.
- **What lives under this one project:**
  - **Three websites** (Firebase App Hosting backends): `donation-delivery-app`,
    `inventory-management-system`, `data-dashboard`.
  - **Backends** (Cloud Functions): the donation app's (`donor`), the IMS's (`ims`), and
    the dashboard's.
  - **Two databases:** Firestore (the donation app's `donation_requests`, plus the
    dashboard's saved views) and **Postgres** (Cloud SQL, via Data Connect — see below).
  - **Secret Manager** (the sensitive keys) and **Vertex AI** (the IMS's product AI).
- **How access works:** there's no day-to-day API key to rotate for Firebase itself.
  Access is by **who's invited to the Google project** (permissions), plus the Firebase
  command-line tool for deploying. The Firebase web config that appears in each app's code
  (`src/environments/`) is **public by design** — not a secret; the database security
  rules and server-side checks are what actually protect the data.

---

## Data Connect / Postgres — used by IMS and the dashboard

The **inventory system's real database is Postgres** (not Firestore), managed through
Firebase **Data Connect**. The dashboard reads that same Postgres for its analytics.

- **Where it lives:** Cloud SQL instance **`beauty-forward-fdc`**, database **`fdcdb`**,
  region `us-central1` — inside the shared `beauty-forward` project. View it in the Google
  Cloud console under SQL.
- **Who writes it:** the **IMS** owns and writes the core tables (donors, donations,
  products, batches, shelters). The **dashboard only reads**, through a locked-down
  read-only database role (`dashboard_reader`) and its own `analytics` schema — it never
  changes IMS's data.
- **Keys:** the dashboard's backend connects with a Cloud SQL connection string
  (`ANALYTICS_DB_URL`). In local development, Data Connect runs an in-memory Postgres in
  the Firebase emulator — no cloud connection needed.

---

## Vertex AI (Gemini) — used by IMS

The inventory system uses Google's **Gemini** AI two ways: to **read a product photo** and
fill in its details, and as a **last-resort barcode lookup** when the barcode databases
come up empty.

- **No separate account or key.** It runs as **Vertex AI** inside the same `beauty-forward`
  Google Cloud project, authenticated by the project itself. To work in production, the
  **Vertex AI API must be enabled** on the project (it is part of Google Cloud).
- **It does cost money** per use (billed to the same Google Cloud account), so it's part of
  the ongoing running cost to keep an eye on.
- **Model:** `gemini-2.5-flash`.

---

## UPCitemdb + Open Beauty/Food Facts — used by IMS (barcode lookup)

When a volunteer scans a product barcode, the IMS looks the code up across a few free
databases before falling back to AI.

- **Open Beauty Facts / Open Food Facts** — free, open, **no account or key**.
- **UPCitemdb** — free trial tier (~100 lookups/day, shared) with **no key**. For more
  volume, set an optional paid API key (`UPCITEMDB_API_KEY`) in the IMS backend settings.
  Sign up at [upcitemdb.com](https://www.upcitemdb.com) only if the free tier isn't enough.

---

## Givebutter — donations _(donation app only)_

Takes the donor's pay-what-you-wish contribution. For pickups, a confirmed contribution
is what unlocks the courier.

- **Sign in:** [givebutter.com](https://givebutter.com). Public campaign:
  [givebutter.com/beauty-forward](https://givebutter.com/beauty-forward).
- **Owned by:** Beauty Forward. **The team logs in here today.**
- **⚠️ Confirm:** the campaigns were originally created from the dev's account. Verify that
  the Beauty Forward login sees **the same campaigns** — if not, they need to be
  shared/transferred to the BF account. _(Handover checklist item.)_
- **Minimum contribution for a pickup:** **$15** (adjustable — see the appendix).
- **Two keys, two homes:**
  - The lookup key lives in the donation backend's plain settings file.
  - The **webhook signing secret** — the shared password that proves a "payment happened"
    message really came from Givebutter — lives in **Firebase's secret store.** Its value
    is in Givebutter under **Settings → Webhooks**.
  - **Rotating the webhook secret is a two-step move:** change it in Givebutter _and_
    update the Firebase secret **together**. If they don't match, the backend rejects every
    payment message (it fails safe), and pickups will silently stop being dispatched.

---

## Roadie — courier _(donation app only)_

Books and runs the courier who collects a pickup and brings it to the warehouse.

- **Sign in:** [connect.roadie.com](https://connect.roadie.com) (live) /
  [connect-sandbox.roadie.com](https://connect-sandbox.roadie.com) (test).
- **Owned by:** Beauty Forward. **The team has their own Roadie logins** and can view and
  rebook couriers directly.
- **Key:** the Roadie API key lives in **Firebase's secret store** (never in the plain
  settings file). A separate _test_ key is used only for local development.
- **Worth confirming once:** that production Roadie is actually live (not still pointing at
  the test environment) — see the handover checklist.

---

## Resend — email _(donation app only)_

Sends every automated donation email: the confirmations, the "finish your donation"
reminder, and the "we're on it" reassurance note.

- **Sign in:** [resend.com](https://resend.com).
- **Owned by:** Beauty Forward, under **`info@beauty-forward.org`**.
- **Keys:** the Resend API key and the "from" address live in the donation backend's plain
  settings file.
- **Good to know:** if the Resend key is missing, emails simply don't send (the app logs a
  warning) — **it never blocks a donation from being recorded.**
- **Sending address:** emails send from a `beauty-forward.org` address. For emails to reach
  _all_ donors (not just the account owner), the sending domain must be verified in Resend
  via DNS. Confirm the domain is verified in production.

---

## GitHub — the code

- **Org:** `Beauty-Forward`. **Three repos:**
  [donation-delivery-app](https://github.com/Beauty-Forward/donation-delivery-app),
  [inventory-management-system](https://github.com/Beauty-Forward/inventory-management-system),
  [data-dashboard](https://github.com/Beauty-Forward/data-dashboard).
- **Access:** Beauty Forward has **admin** on all three repos. Only needed for making code
  changes or deploying — not for day-to-day operations.

---

## Where every key physically lives

Sorted by sensitivity — this split exists on purpose:

| Home | What's in it | Who can see it |
| --- | --- | --- |
| **Firebase secret store** (Secret Manager) | The most sensitive keys: the Roadie key and the Givebutter webhook signing secret | Only people with access to the Firebase project |
| **Backend settings files** (`functions/.env` in each repo) | Less-sensitive settings: the Givebutter lookup key, Resend key + from-address, courier/warehouse details (donation app); the optional UPCitemdb key (IMS); the Postgres connection string (dashboard) | In the deployed backend; **not** in the public code repos |
| **Public website config** (`src/environments/`) | Each app's Firebase web config — **public by design, not a secret** | Anyone (it's in the shipped websites) |
| **Google Cloud project itself** | Vertex AI (Gemini) and Cloud SQL (Postgres) authenticate as the project — no key to store | People with access to the Google project |

> **Never** put a Firebase-secret-store value into a plain settings file or the code repo.

---

## Handover checklist

The open items to close out ownership:

- ⬜ **Transfer the Firebase project and Google Cloud billing** from the dev's personal
  Google account to a Beauty Forward-owned account. _(Tied to project close-out / final
  payment.)_ This one move hands over **all three apps' backend at once**, since they share
  the project.
- ⬜ **Record the Firebase/Google Cloud spend to date** for the handover conversation.
- ⬜ **Confirm the Beauty Forward Givebutter login sees the same campaigns** the donation
  app uses (they were created from the dev's account).
- ⬜ **Confirm production Roadie is live** and the production key — not the test key — is
  set as the Firebase secret.
- ⬜ **Confirm the Resend sending domain is verified** so emails reach all donors.
- ⬜ **Confirm Vertex AI is enabled** on the project (IMS photo scan + barcode AI fallback).
- ⬜ **Confirm Cloud SQL (`beauty-forward-fdc`) is provisioned** and the dashboard's
  read-only role + migration have been run (`node db/migrate.mjs` once) for production.

---

## Appendix — for the technical successor

**Shared Firebase project:** `beauty-forward`. Three App Hosting backends
(`donation-delivery-app`, `inventory-management-system`, `data-dashboard`); Functions
codebases `donor`, `ims`, and the dashboard's; all region `us-central1`. Deploys use the
Firebase CLI.

**Donation app** — Firebase secrets (`firebase functions:secrets:set <NAME>`):
`ROADIE_API_KEY`, `GIVEBUTTER_WEBHOOK_SIGNATURE`. `functions/.env` (deployed, no true
secrets): `ROADIE_API_BASE_URL`, `WAREHOUSE_CONTACT_NAME`, `WAREHOUSE_CONTACT_PHONE`,
`PICKUP_DONATION_MIN_USD` (defaults to `15`), `GIVEBUTTER_API_KEY`,
`GIVEBUTTER_CAMPAIGN_URL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`. Warehouse details are
hardcoded in `functions/src/warehouse.ts`.

**IMS** — `functions/.env`: `UPCITEMDB_API_KEY` (optional; unset = UPCitemdb free trial).
Gemini runs via Vertex AI (`vertexai: true`, project `beauty-forward`, `gemini-2.5-flash`)
with no key. Data Connect: service `beauty-forward-service`, connector `bf-ims`, Cloud SQL
`beauty-forward-fdc` / db `fdcdb`. Functions codebase `ims`.

**Dashboard** — functions env: `ANALYTICS_DB_URL` (Cloud SQL connection to
`beauty-forward-fdc` / `fdcdb`; read-only role `dashboard_reader` created by
`node db/migrate.mjs`). `dataconnect/` is a symlink into the IMS repo. Firestore holds only
per-user saved views. Demo logins (local seed, password `beautyforward`):
`admin@beautyforward.demo` (admin), `partners@glossaire.demo` (brand).
