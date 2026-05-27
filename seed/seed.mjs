// Populates the Data Connect emulator with demo data for local dev.
// Run with: `npm run seed` (requires `npm run emulators` running in another terminal).
//
// Idempotent? No — assumes a fresh emulator. If you re-run, the unique
// constraint on Donor.email will reject the second pass. Restart the emulator
// for a clean slate, or run with --import/--export-on-exit to persist.

import { initializeApp } from 'firebase/app';
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import {
  connectorConfig,
  createDonor,
  createDonation,
  createProduct,
  createShelter,
  createBatch,
  finalizeBatch,
  allocateProductToBatch,
  upsertCatalogEntry,
} from '../src/app/core/dataconnect/esm/index.esm.js';

const FAKE_UID = 'seed-warehouse-manager';

const app = initializeApp({
  projectId: 'beauty-forward',
  apiKey: 'fake-api-key-for-emulator',
  appId: '1:0:web:0',
});
const dc = getDataConnect(app, connectorConfig);
connectDataConnectEmulator(dc, '127.0.0.1', 9399);

function ref(yyyymmdd, suffix) {
  return `BFW-${yyyymmdd}-${suffix}`;
}

async function run() {
  console.log('Seeding Data Connect emulator at 127.0.0.1:9399…\n');

  // --- Shelters ---
  console.log('Creating shelters…');
  const shelter1 = (await createShelter(dc, {
    name: 'Sunrise Family Shelter',
    addressLine1: '120 Hope Street',
    city: 'Brooklyn',
    state: 'NY',
    postalCode: '11201',
    contactName: 'Aisha Bello',
    contactEmail: 'aisha@sunriseshelter.org',
    contactPhone: '347-555-0142',
    acceptedTypes: ['shampoo', 'conditioner', 'soap', 'body_wash', 'deodorant', 'toothpaste'],
    rejectedTypes: ['nail_polish_remover', 'perfume'],
    preferredBrands: ['Dove', 'Olay'],
    notes: 'Prefers fragrance-free for kids program.',
    capacityPerBatch: 80,
  })).data.shelter_insert.id;

  const shelter2 = (await createShelter(dc, {
    name: 'Anchor House',
    addressLine1: '88 Pearl Avenue',
    city: 'Jersey City',
    state: 'NJ',
    postalCode: '07302',
    contactName: 'Marcus Reyes',
    contactEmail: 'marcus@anchorhouse.org',
    contactPhone: '201-555-0188',
    acceptedTypes: ['lipstick', 'foundation', 'mascara', 'moisturizer', 'serum', 'sunscreen'],
    preferredBrands: ['Maybelline', 'CeraVe'],
    capacityPerBatch: 50,
  })).data.shelter_insert.id;

  const shelter3 = (await createShelter(dc, {
    name: 'Northside Women\'s Center',
    addressLine1: '450 Linden Blvd',
    addressLine2: 'Suite 2B',
    city: 'Queens',
    state: 'NY',
    postalCode: '11432',
    contactName: 'Priya Chandra',
    contactEmail: 'priya@northsidewc.org',
    acceptedTypes: ['feminine_products', 'lotion', 'hair_oil', 'cleanser', 'toner'],
    capacityPerBatch: 60,
  })).data.shelter_insert.id;

  console.log(`  → ${shelter1.slice(0, 8)}… ${shelter2.slice(0, 8)}… ${shelter3.slice(0, 8)}…\n`);

  // --- Donors ---
  console.log('Creating donors…');
  const donor1 = (await createDonor(dc, {
    fullName: 'Naomi Park',
    email: 'naomi.park@example.com',
    phone: '917-555-0101',
    city: 'New York',
    state: 'NY',
    smsOptIn: true,
    instagramHandle: '@naomi.beauty',
  })).data.donor_insert.id;

  const donor2 = (await createDonor(dc, {
    fullName: 'Jordan Mills',
    email: 'jordan.mills@example.com',
    phone: '646-555-0202',
    city: 'Brooklyn',
    state: 'NY',
  })).data.donor_insert.id;

  const donor3 = (await createDonor(dc, {
    fullName: 'Lila Okafor',
    email: 'lila.okafor@example.com',
    phone: '718-555-0303',
    city: 'Queens',
    state: 'NY',
    smsOptIn: true,
  })).data.donor_insert.id;

  const donor4 = (await createDonor(dc, {
    fullName: 'Tasha Greene',
    email: 'tasha.greene@example.com',
    phone: '201-555-0404',
    city: 'Hoboken',
    state: 'NJ',
  })).data.donor_insert.id;

  console.log(`  → 4 donors\n`);

  // --- Donations + Products ---
  console.log('Creating donations and products…');

  async function donate({ donorId, dateOffsetDays, method, ref: warehouseRef, products }) {
    const date = new Date(Date.now() - dateOffsetDays * 86400 * 1000)
      .toISOString()
      .slice(0, 10);
    const donationId = (await createDonation(dc, {
      donorId,
      warehouseReference: warehouseRef,
      date,
      method,
      processedBy: FAKE_UID,
      // Seed acts as if these donations have been received at the warehouse.
      // Walk-ins use 'walk_in'; scheduled donations get 'completed' (arrived).
      logisticsStatus: method === 'walk-in' ? 'walk_in' : 'completed',
    })).data.donation_insert.id;

    const productIds = [];
    for (const p of products) {
      const id = (await createProduct(dc, { donationId, ...p })).data.product_insert.id;
      productIds.push(id);
    }
    return { donationId, productIds };
  }

  const d1 = await donate({
    donorId: donor1,
    dateOffsetDays: 18,
    method: 'pickup',
    ref: ref('20260509', 'NMPK0001'),
    products: [
      { name: 'Daily Moisturizing Lotion', brand: 'CeraVe', type: 'lotion', quantity: 2, price: '14.99', details: { size: '12oz' } },
      { name: 'Hydrating Cleanser', brand: 'CeraVe', type: 'cleanser', quantity: 1, price: '13.99' },
      { name: 'SuperStay Matte Ink', brand: 'Maybelline', type: 'lipstick', quantity: 3, color: 'Pioneer', colorCategory: 'warm red' },
    ],
  });

  const d2 = await donate({
    donorId: donor2,
    dateOffsetDays: 11,
    method: 'dropoff',
    ref: ref('20260516', 'JRDM0001'),
    products: [
      { name: 'Argan Oil Treatment', brand: 'OGX', type: 'hair_oil', quantity: 2, price: '8.99' },
      { name: 'Renewing Argan Shampoo', brand: 'OGX', type: 'shampoo', quantity: 1 },
      { name: 'Renewing Argan Conditioner', brand: 'OGX', type: 'conditioner', quantity: 1 },
    ],
  });

  const d3 = await donate({
    donorId: donor3,
    dateOffsetDays: 6,
    method: 'walk-in',
    ref: ref('20260521', 'LLOK0001'),
    products: [
      { name: 'Pure Castile Soap', brand: 'Dr. Bronner\'s', type: 'soap', quantity: 4 },
      { name: 'Dry Spray Antiperspirant', brand: 'Dove', type: 'deodorant', quantity: 2, expirationDate: '2027-03-01' },
      { name: 'Cavity Protection Toothpaste', brand: 'Crest', type: 'toothpaste', quantity: 6 },
      { name: 'Always Pads, Heavy Flow', brand: 'Always', type: 'feminine_products', quantity: 3 },
    ],
  });

  const d4 = await donate({
    donorId: donor4,
    dateOffsetDays: 2,
    method: 'shipping',
    ref: ref('20260525', 'TGRN0001'),
    products: [
      { name: 'Fit Me Foundation', brand: 'Maybelline', type: 'foundation', quantity: 2, color: '220 Natural Beige', colorCategory: 'warm beige' },
      { name: 'Great Lash Mascara', brand: 'Maybelline', type: 'mascara', quantity: 4, color: 'Very Black' },
      { name: 'Mineral Sunscreen SPF 50', brand: 'Neutrogena', type: 'sunscreen', quantity: 2, expirationDate: '2026-09-15' },
    ],
  });

  console.log(`  → 4 donations, ${[d1, d2, d3, d4].reduce((n, d) => n + d.productIds.length, 0)} products\n`);

  // --- Batches ---
  console.log('Creating batches…');

  // Batch 1: DRAFT for Sunrise — allocate Naomi's CeraVe + Jordan's OGX
  const batch1 = (await createBatch(dc, {
    shelterId: shelter1,
    createdBy: FAKE_UID,
    notes: 'Family shelter pickup, week of June 1.',
  })).data.batch_insert.id;

  for (const pid of [...d1.productIds.slice(0, 2), ...d2.productIds]) {
    await allocateProductToBatch(dc, { productId: pid, batchId: batch1 });
  }

  // Batch 2: FINALIZED for Anchor House — Tasha's makeup donations
  const batch2 = (await createBatch(dc, {
    shelterId: shelter2,
    createdBy: FAKE_UID,
    notes: 'Color cosmetics drop. Shipped via courier.',
  })).data.batch_insert.id;

  for (const pid of d4.productIds) {
    await allocateProductToBatch(dc, { productId: pid, batchId: batch2 });
  }
  await finalizeBatch(dc, { id: batch2 });

  console.log(`  → batch1 DRAFT (${batch1.slice(0, 8)}…), batch2 FINALIZED (${batch2.slice(0, 8)}…)\n`);

  // --- Product Catalog (barcode cache) ---
  console.log('Seeding product catalog…');
  const catalog = [
    { barcode: '0301871239014', name: 'Daily Moisturizing Lotion', brand: 'CeraVe', type: 'lotion', price: '14.99', source: 'seed' },
    { barcode: '0301871417023', name: 'Hydrating Cleanser', brand: 'CeraVe', type: 'cleanser', price: '13.99', source: 'seed' },
    { barcode: '0022796974938', name: 'Argan Oil Treatment', brand: 'OGX', type: 'hair_oil', price: '8.99', source: 'seed' },
    { barcode: '0041100008060', name: 'Pure Castile Soap', brand: 'Dr. Bronner\'s', type: 'soap', source: 'seed' },
  ];
  for (const c of catalog) {
    await upsertCatalogEntry(dc, c);
  }
  console.log(`  → ${catalog.length} catalog entries\n`);

  console.log('Done.');
}

run().catch((err) => {
  console.error('\nSeed failed:', err?.message || err);
  if (String(err?.message || '').includes('unique')) {
    console.error('Looks like data already exists. Restart the emulator for a clean slate.');
  }
  process.exit(1);
});
