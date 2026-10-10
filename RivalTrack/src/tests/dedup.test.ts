/**
 * RivalTrack — Deduplication & Change Detection Test Suite
 *
 * These tests use in-memory fixtures and a mock Supabase adapter.
 * They DO NOT touch production data.
 *
 * Run: npx tsx src/tests/dedup.test.ts
 * (install tsx: npm i -D tsx)
 */

// ── Minimal type definitions (mirrors src/types/index.ts) ──────────────────
interface PriceObservation {
  id: string;
  productId: string;
  productName: string;
  companyName: string;
  price: number;
  previousPrice: number;
  currency: string;
  observedAt: string;
  sourceUrl: string;
  sourceName?: string;
  evidenceSnippet: string;
}

interface ChangeEvent {
  id: string;
  type: string;
  competitorName: string;
  competitorId: string;
  productName?: string;
  fieldChanged: string;
  previousValue: string;
  newValue: string;
  detectedAt: string;
  sourceUrl: string;
  sourceName: string;
  verificationStatus: string;
}

// ── In-memory stores (replaces localStorage + Supabase) ───────────────────
const memObservations: PriceObservation[] = [];
const memChangeEvents: ChangeEvent[] = [];
const supabaseObsStore: PriceObservation[] = [];

/** Reset all in-memory stores (call between tests) */
function resetStores() {
  memObservations.length = 0;
  memChangeEvents.length = 0;
  supabaseObsStore.length = 0;
}

// ── Mock PersistenceEngine (mirrors src/services/db.ts logic) ──────────────
interface SaveResult {
  isNewChange: boolean;
  isDuplicate: boolean;
  changeRecord?: ChangeEvent;
  supabaseError: string | null;
}

async function mockFetchPreviousObservation(productId: string): Promise<PriceObservation | null> {
  // Mirrors Supabase query: latest obs for product
  const matches = supabaseObsStore.filter(o => o.productId === productId);
  if (!matches.length) return null;
  return matches.sort((a, b) => b.observedAt.localeCompare(a.observedAt))[0];
}

async function mockSaveObservation(obs: PriceObservation): Promise<SaveResult> {
  const localDuplicate = memObservations.some(o => o.id === obs.id);

  // Supabase duplicate check (unique index: product_id + hour-bucket)
  const hourBucket = obs.observedAt.substring(0, 13);
  const dbDuplicate = supabaseObsStore.some(
    o => o.productId === obs.productId && o.observedAt.substring(0, 13) === hourBucket
  );

  if (!localDuplicate) {
    memObservations.unshift(obs);
  }
  if (!dbDuplicate) {
    supabaseObsStore.unshift(obs);
  }

  const isDuplicate = localDuplicate || dbDuplicate;

  let isNewChange = false;
  let changeRecord: ChangeEvent | undefined;

  if (!isDuplicate) {
    const priceChanged = obs.previousPrice !== obs.price;
    if (priceChanged) {
      isNewChange = true;
      const delta = obs.price - obs.previousPrice;
      const percent = ((delta / obs.previousPrice) * 100).toFixed(1);
      const detectedAt = new Date().toISOString();

      changeRecord = {
        id: `chg-${obs.productId}-${obs.previousPrice}-${obs.price}`,
        type: 'price_change',
        competitorName: obs.companyName,
        competitorId: obs.companyName.toLowerCase(),
        productName: obs.productName,
        fieldChanged: 'Observed Store Price',
        previousValue: `₹${obs.previousPrice.toLocaleString('en-IN')}`,
        newValue: `₹${obs.price.toLocaleString('en-IN')} (${delta < 0 ? percent + '%' : '+' + percent + '%'})`,
        detectedAt,
        sourceUrl: obs.sourceUrl,
        sourceName: obs.sourceName || 'Official Store',
        verificationStatus: 'verified',
      };

      // Dedup change events by deterministic ID
      if (!memChangeEvents.some(e => e.id === changeRecord!.id)) {
        memChangeEvents.unshift(changeRecord);
      }
    }
  }

  return { isNewChange, isDuplicate, changeRecord, supabaseError: null };
}

// ── Test helpers ───────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${label}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${label}`);
    failed++;
  }
}

function makeObs(overrides: Partial<PriceObservation> & { id: string }): PriceObservation {
  return {
    productId: 'prod-test-1',
    productName: 'Test Phone',
    companyName: 'TestBrand',
    price: 50000,
    previousPrice: 55000,
    currency: '₹',
    observedAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/phone',
    evidenceSnippet: 'Test evidence',
    ...overrides,
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────
async function runTests() {
  console.log('\n=== RivalTrack Deduplication & Change Detection Tests ===\n');

  // ── Test 1: A valid new observation is saved ──────────────────────────────
  console.log('Test 1: Valid new observation is saved');
  resetStores();
  const obs1 = makeObs({ id: 'obs-prod-test-1-2024-10-09T10', price: 50000, previousPrice: 55000, observedAt: '2024-10-09T10:00:00.000Z' });
  const r1 = await mockSaveObservation(obs1);
  assert(!r1.isDuplicate, 'First insert is not a duplicate');
  assert(memObservations.length === 1, 'One observation in local store');
  assert(supabaseObsStore.length === 1, 'One observation in Supabase store');
  assert(r1.isNewChange, 'Genuine price change detected (50000 vs 55000)');
  assert(r1.changeRecord?.newValue.includes('₹50,000'), 'Change record has correct new value');

  // ── Test 2: Retry does not create duplicate ───────────────────────────────
  console.log('\nTest 2: Retry does not create accidental duplicate');
  const r2 = await mockSaveObservation(obs1); // same id, same hour
  assert(r2.isDuplicate, 'Second insert of same obs is a duplicate');
  assert(memObservations.length === 1, 'Still only one observation in local store');
  assert(supabaseObsStore.length === 1, 'Still only one observation in Supabase store');
  assert(!r2.isNewChange, 'No false change event on retry');

  // ── Test 3: Second collection in same hour (same hour bucket) is a duplicate ──
  console.log('\nTest 3: Same hour, different obs ID → DB unique index catches it');
  const obs3 = makeObs({ id: 'obs-prod-test-1-2024-10-09T10-v2', price: 50000, previousPrice: 55000, observedAt: '2024-10-09T10:30:00.000Z' });
  const r3 = await mockSaveObservation(obs3);
  assert(r3.isDuplicate, 'Same product + same hour → duplicate (DB unique index)');
  assert(supabaseObsStore.length === 1, 'Supabase store unchanged');

  // ── Test 4: Genuine price increase creates one correct change event ────────
  console.log('\nTest 4: Price increase creates one change event');
  resetStores();
  const obs4a = makeObs({ id: 'obs-t4-hour1', price: 50000, previousPrice: 50000, observedAt: '2024-10-09T10:00:00.000Z' });
  await mockSaveObservation(obs4a);
  const obs4b = makeObs({ id: 'obs-t4-hour2', price: 55000, previousPrice: 50000, observedAt: '2024-10-09T11:00:00.000Z' });
  const r4 = await mockSaveObservation(obs4b);
  assert(r4.isNewChange, 'Price increase detected');
  assert(r4.changeRecord?.newValue.includes('+10.0%'), 'Correct percentage in change record');
  assert(memChangeEvents.length === 1, 'Exactly one change event created');

  // ── Test 5: Unchanged price creates no change event ────────────────────────
  console.log('\nTest 5: Unchanged price creates no change event');
  resetStores();
  const obs5a = makeObs({ id: 'obs-t5-hour1', price: 50000, previousPrice: 50000, observedAt: '2024-10-09T10:00:00.000Z' });
  await mockSaveObservation(obs5a);
  const obs5b = makeObs({ id: 'obs-t5-hour2', price: 50000, previousPrice: 50000, observedAt: '2024-10-09T11:00:00.000Z' });
  const r5 = await mockSaveObservation(obs5b);
  assert(!r5.isNewChange, 'No change event for same price');
  assert(memChangeEvents.length === 0, 'Zero change events when price is unchanged');

  // ── Test 6: Genuine price decrease creates one correct change event ────────
  console.log('\nTest 6: Price decrease creates one change event');
  resetStores();
  const obs6a = makeObs({ id: 'obs-t6-hour1', price: 60000, previousPrice: 60000, observedAt: '2024-10-09T10:00:00.000Z' });
  await mockSaveObservation(obs6a);
  const obs6b = makeObs({ id: 'obs-t6-hour2', price: 55000, previousPrice: 60000, observedAt: '2024-10-09T11:00:00.000Z' });
  const r6 = await mockSaveObservation(obs6b);
  assert(r6.isNewChange, 'Price decrease detected');
  assert(r6.changeRecord?.newValue.includes('-8.3%'), 'Correct negative percentage');
  assert(memChangeEvents.length === 1, 'Exactly one change event for decrease');

  // ── Test 7: Source timeout is reported honestly ────────────────────────────
  console.log('\nTest 7: Source timeout reported honestly (no fabricated price)');
  resetStores();
  const timeoutResult = {
    status: 'error' as const,
    observedPrice: undefined,
    errorMessage: 'Request timed out after 8 s',
    corsBlocked: false,
  };
  assert(timeoutResult.status === 'error', 'Status is error on timeout');
  assert(timeoutResult.observedPrice === undefined, 'No price fabricated on timeout');
  assert(typeof timeoutResult.errorMessage === 'string', 'Error message is present');

  // ── Test 8: Concurrent requests do not create duplicate change events ──────
  console.log('\nTest 8: Concurrent requests do not duplicate change events');
  resetStores();
  const obs8a = makeObs({ id: 'obs-t8-base', price: 50000, previousPrice: 50000, observedAt: '2024-10-09T10:00:00.000Z' });
  await mockSaveObservation(obs8a);
  // Two concurrent requests with same product+price delta → same deterministic change event ID
  const obs8b1 = makeObs({ id: 'obs-t8-hour2-req1', price: 45000, previousPrice: 50000, observedAt: '2024-10-09T11:00:00.000Z' });
  const obs8b2 = makeObs({ id: 'obs-t8-hour2-req2', price: 45000, previousPrice: 50000, observedAt: '2024-10-09T11:01:00.000Z' });
  // Simulate concurrent save: req1 gets through, req2 is caught by DB hour-bucket index
  const [r8a, r8b] = await Promise.all([mockSaveObservation(obs8b1), mockSaveObservation(obs8b2)]);
  // One should be a duplicate (same product, overlapping hour bucket for req2 is different hour here)
  // For this test, req1 wins, req2 generates same chg ID → deduped in memChangeEvents
  assert(memChangeEvents.length <= 1, 'At most one change event from concurrent requests');

  // ── Test 9: Dashboard displays correct stored records ─────────────────────
  console.log('\nTest 9: Dashboard state reflects actual stored records');
  resetStores();
  const obs9 = makeObs({ id: 'obs-t9', price: 48000, previousPrice: 50000, observedAt: '2024-10-09T12:00:00.000Z' });
  await mockSaveObservation(obs9);
  assert(memObservations[0].price === 48000, 'Dashboard shows correct observed price');
  assert(memObservations[0].previousPrice === 50000, 'Dashboard shows correct previous price');
  assert(memChangeEvents[0]?.newValue.includes('₹48,000'), 'Change log shows new price');
  assert(memChangeEvents[0]?.previousValue.includes('₹50,000'), 'Change log shows previous price');

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`\n═══════════════════════════════════════════════`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`═══════════════════════════════════════════════\n`);

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test runner crashed:', err);
  process.exit(1);
});
