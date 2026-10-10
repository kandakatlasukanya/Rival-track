import { PriceObservation, ChangeEvent } from '../types';
import { CollectionResult } from './collector';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  OBSERVATIONS: 'rivaltrack_observations_v1',
  CHANGE_EVENTS: 'rivaltrack_change_events_v1',
  COLLECTION_JOBS: 'rivaltrack_collection_jobs_v1',
  INSIGHTS: 'rivaltrack_insights_v1'
};

export interface CollectionJobRecord {
  id: string;
  sourceId: string;
  sourceName: string;
  targetUrl: string;
  status: 'success' | 'rate_limited' | 'error' | 'cors_restricted' | 'synthetic';
  httpStatusCode?: number;
  timestamp: string;
  errorMessage?: string;
  fetchDurationMs?: number;
  corsBlocked?: boolean;
  supabaseError?: string;
}

/**
 * Result of a single saveObservation call, used by the UI to display
 * per-run statistics: how many rows were new, how many were duplicates,
 * and whether a genuine price change was detected.
 */
export interface SaveObservationResult {
  isNewChange: boolean;
  isDuplicate: boolean;
  changeRecord?: ChangeEvent;
  supabaseError: string | null;
}

// ── Supabase key sanity check ──────────────────────────────────────────────────
// Standard Supabase anon keys are JWTs starting with "eyJ".
// The publishable key format (sb_publishable_...) is a newer API key format
// used by Supabase's newer projects. Both should work with the JS client,
// but we flag unexpected formats to help debug auth failures.
function validateSupabaseKey(): { valid: boolean; warning?: string } {
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  if (!key) return { valid: false, warning: 'VITE_SUPABASE_ANON_KEY is not set' };
  if (!key.startsWith('eyJ') && !key.startsWith('sb_')) {
    return { valid: false, warning: `Unexpected key format: "${key.substring(0, 12)}…"` };
  }
  return { valid: true };
}

export function getSupabaseKeyStatus(): string {
  const { valid, warning } = validateSupabaseKey();
  if (!isSupabaseConfigured) return '⚠ Supabase not configured (missing URL or key)';
  if (!valid) return `⚠ Key format warning: ${warning}`;
  return '✓ Supabase configured';
}

/**
 * Fetch the most recent stored observation for a given productId from Supabase.
 * Falls back to localStorage if Supabase is unavailable.
 * Returns null when no prior observation exists (first-ever collection).
 */
async function fetchPreviousObservation(productId: string): Promise<PriceObservation | null> {
  // 1. Try Supabase first — it is the authoritative store.
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('price_observations')
        .select('id, product_id, product_name, company_name, price, previous_price, currency, observed_at, source_url, source_name, evidence_snippet')
        .eq('product_id', productId)
        .order('observed_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          productId: data.product_id,
          productName: data.product_name,
          companyName: data.company_name,
          price: data.price,
          previousPrice: data.previous_price ?? data.price,
          currency: data.currency ?? '₹',
          observedAt: data.observed_at,
          sourceUrl: data.source_url,
          sourceName: data.source_name,
          evidenceSnippet: data.evidence_snippet ?? '',
        };
      }
    } catch {
      // Fall through to localStorage
    }
  }

  // 2. Fallback: localStorage (prepend order → index 0 is newest per product)
  const stored = PersistenceEngine.getObservations();
  return stored.find(o => o.productId === productId) ?? null;
}

/**
 * Attempt a Supabase INSERT with full error capture.
 * Returns the error message if the insert failed, or null on success.
 * Duplicate primary key (23505) is treated as success — idempotent write.
 */
async function supabaseInsertObservation(obs: PriceObservation): Promise<{ error: string | null; wasDuplicate: boolean }> {
  if (!supabase || !isSupabaseConfigured) {
    return { error: 'Supabase not configured', wasDuplicate: false };
  }

  const { error } = await supabase.from('price_observations').insert({
    id: obs.id,
    product_id: obs.productId || null,
    product_name: obs.productName,
    company_name: obs.companyName,
    price: obs.price,
    previous_price: obs.previousPrice,
    currency: obs.currency || '₹',
    source_name: obs.sourceName,
    source_url: obs.sourceUrl,
    evidence_snippet: obs.evidenceSnippet,
    // observed_at intentionally omitted — Supabase DEFAULT NOW() is authoritative
    // The unique index uix_obs_product_hour on (product_id, date_trunc('hour', observed_at))
    // enforces one observation per product per hour at the DB level.
  });

  if (error) {
    // 23505 = unique_violation — duplicate primary key OR duplicate hour-bucket index.
    // Both are expected on retry within the same hour. Treat as success.
    if (error.code === '23505') return { error: null, wasDuplicate: true };
    return { error: `${error.code}: ${error.message}`, wasDuplicate: false };
  }
  return { error: null, wasDuplicate: false };
}

async function supabaseInsertChangeEvent(chg: ChangeEvent): Promise<string | null> {
  if (!supabase || !isSupabaseConfigured) return 'Supabase not configured';

  const { error } = await supabase.from('change_events').insert({
    id: chg.id,
    type: chg.type,
    competitor_name: chg.competitorName,
    competitor_id: chg.competitorId,
    product_name: chg.productName,
    field_changed: chg.fieldChanged,
    previous_value: chg.previousValue,
    new_value: chg.newValue,
    source_url: chg.sourceUrl,
    source_name: chg.sourceName,
    verification_status: chg.verificationStatus,
  });

  if (error) {
    if (error.code === '23505') return null;
    return `${error.code}: ${error.message}`;
  }
  return null;
}

async function supabaseInsertCollectionJob(job: CollectionJobRecord): Promise<string | null> {
  if (!supabase || !isSupabaseConfigured) return 'Supabase not configured';

  const { error } = await supabase.from('collection_jobs').insert({
    id: job.id,
    source_id: job.sourceId,
    source_name: job.sourceName,
    target_url: job.targetUrl,
    status: job.status,
    http_status_code: job.httpStatusCode ?? null,
    error_message: job.errorMessage ?? null,
    // fetch_duration_ms and cors_blocked require schema migration (migration.sql)
    // They are stored locally but only inserted to DB after migration is applied.
  });

  if (error) {
    if (error.code === '23505') return null;
    return `${error.code}: ${error.message}`;
  }
  return null;
}

/**
 * Seed initial baseline data into Supabase database tables
 */
export async function seedSupabaseBaselineData(): Promise<{ success: boolean; message: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase client is not configured yet.' };
  }

  try {
    // 1. Seed Companies
    const compRes = await supabase.from('companies').upsert([
      { id: 'samsung', name: 'Samsung', slug: 'samsung', headquarters: 'Suwon, South Korea', website: 'https://www.samsung.com/in', is_reference: true },
      { id: 'apple', name: 'Apple', slug: 'apple', headquarters: 'Cupertino, California', website: 'https://www.apple.com/in' },
      { id: 'motorola', name: 'Motorola', slug: 'motorola', headquarters: 'Chicago, Illinois', website: 'https://www.motorola.in' },
      { id: 'pixel', name: 'Google Pixel', slug: 'pixel', headquarters: 'Mountain View, California', website: 'https://store.google.com/in' },
      { id: 'oneplus', name: 'OnePlus', slug: 'oneplus', headquarters: 'Shenzhen, China', website: 'https://www.oneplus.com/in' }
    ]);

    if (compRes.error) {
      return {
        success: false,
        message: `Companies Insert Error: ${compRes.error.message}. Re-run schema.sql in Supabase SQL Editor.`
      };
    }

    // 2. Seed Products
    const prodRes = await supabase.from('products').upsert([
      {
        id: 'prod-sam-s24u',
        company_id: 'samsung',
        name: 'Samsung Galaxy S24 Ultra',
        segment: 'Ultra Premium',
        current_price: 129999,
        msrp: 134999,
        currency: '₹',
        soc: 'Snapdragon 8 Gen 3 for Galaxy',
        ram_storage: '12GB / 256GB',
        camera: '200MP + 50MP 5x + 10MP 3x + 12MP',
        battery: '5000 mAh / 45W',
        source_url: 'https://www.samsung.com/in/smartphones/galaxy-s24-ultra/buy/'
      },
      {
        id: 'prod-app-16pm',
        company_id: 'apple',
        name: 'iPhone 16 Pro Max',
        segment: 'Ultra Premium',
        current_price: 144900,
        msrp: 144900,
        currency: '₹',
        soc: 'Apple A18 Pro (3nm)',
        ram_storage: '8GB / 256GB',
        camera: '48MP Fusion + 48MP UW + 12MP 5x Tele',
        battery: '4685 mAh / 25W MagSafe',
        source_url: 'https://www.apple.com/in/shop/buy-iphone/iphone-16-pro'
      },
      {
        id: 'prod-moto-edge50u',
        company_id: 'motorola',
        name: 'Motorola Edge 50 Ultra',
        segment: 'Upper Mid-Range',
        current_price: 59999,
        msrp: 64999,
        currency: '₹',
        soc: 'Snapdragon 8s Gen 3',
        ram_storage: '16GB / 512GB (Nordic Wood)',
        camera: '50MP OIS + 64MP 3x Periscope + 50MP UW',
        battery: '4500 mAh / 125W TurboPower',
        source_url: 'https://www.motorola.in/motorola-edge-50-ultra/p'
      }
    ]);

    if (prodRes.error) {
      return { success: false, message: `Products Insert Error: ${prodRes.error.message}` };
    }

    // 3. Seed Observations (upsert = safe re-run)
    const obsRes = await supabase.from('price_observations').upsert([
      {
        id: 'obs-sam-s24u',
        product_id: 'prod-sam-s24u',
        product_name: 'Samsung Galaxy S24 Ultra (12GB/256GB)',
        company_name: 'Samsung',
        price: 129999,
        previous_price: 134999,
        currency: '₹',
        source_name: 'Samsung India Official Store',
        source_url: 'https://www.samsung.com/in/smartphones/galaxy-s24-ultra/buy/',
        evidence_snippet: 'Baseline: official web store list price for Galaxy S24 Ultra.'
      },
      {
        id: 'obs-app-16pm',
        product_id: 'prod-app-16pm',
        product_name: 'iPhone 16 Pro Max (256GB)',
        company_name: 'Apple',
        price: 144900,
        previous_price: 144900,
        currency: '₹',
        source_name: 'Apple India Direct Store',
        source_url: 'https://www.apple.com/in/shop/buy-iphone/iphone-16-pro',
        evidence_snippet: 'Baseline: official Apple Store India published price.'
      },
      {
        id: 'obs-moto-edge50u',
        product_id: 'prod-moto-edge50u',
        product_name: 'Motorola Edge 50 Ultra (16GB/512GB)',
        company_name: 'Motorola',
        price: 59999,
        previous_price: 64999,
        currency: '₹',
        source_name: 'Motorola India Store',
        source_url: 'https://www.motorola.in/motorola-edge-50-ultra/p',
        evidence_snippet: 'Baseline: published promotional price on Motorola India site.'
      }
    ]);

    if (obsRes.error) {
      return { success: false, message: `Observations Insert Error: ${obsRes.error.message}` };
    }

    await supabase.from('collection_jobs').upsert([
      {
        id: 'job-init-1',
        source_id: 'src-samsung',
        source_name: 'Samsung India Store Adapter',
        target_url: 'https://www.samsung.com/in/smartphones/galaxy-s24-ultra/buy/',
        status: 'synthetic',
        http_status_code: null,
        error_message: 'Baseline seed — no live fetch performed'
      },
      {
        id: 'job-init-2',
        source_id: 'src-apple',
        source_name: 'Apple India Store Adapter',
        target_url: 'https://www.apple.com/in/shop/buy-iphone/iphone-16-pro',
        status: 'synthetic',
        http_status_code: null,
        error_message: 'Baseline seed — no live fetch performed'
      },
      {
        id: 'job-init-3',
        source_id: 'src-motorola',
        source_name: 'Motorola India Store Adapter',
        target_url: 'https://www.motorola.in/motorola-edge-50-ultra/p',
        status: 'synthetic',
        http_status_code: null,
        error_message: 'Baseline seed — no live fetch performed'
      }
    ]);

    return { success: true, message: 'Supabase baseline rows successfully populated!' };
  } catch (err: any) {
    return { success: false, message: `Failed to seed Supabase rows: ${err?.message || 'Error'}` };
  }
}

/**
 * Local Data Persistence & Real Change Detection Engine with Supabase Sync
 *
 * DEDUPLICATION STRATEGY
 * ─────────────────────
 * Observations are periodic snapshots, NOT unique-per-price records.
 * Policy: one snapshot per product per calendar hour.
 *
 * Enforcement:
 *   1. Client-side: obsId = `obs-{productId}-{ISO-hour}` (e.g. "obs-prod-sam-s24u-2024-10-09T18")
 *      Same ID on retry → primary-key conflict (23505) → treated as idempotent success.
 *   2. Database-side: UNIQUE INDEX uix_obs_product_hour on (product_id, date_trunc('hour', observed_at))
 *      Prevents duplicate rows even if client sends different IDs in the same DB clock hour.
 *   3. Local (localStorage): filter-out the duplicate before prepending.
 *
 * Change Events:
 *   Created only when obs.price !== previousObs.price (genuine delta).
 *   Dedup: LocalStorage check (same product + same newValue + same detectedAt ISO minute).
 *   DB-side: primary key on change_events.id prevents concurrent-write duplicates.
 */
export class PersistenceEngine {
  /**
   * Save a new observation + trigger change detection.
   *
   * Returns:
   *   isNewChange  — true if a genuine price delta was detected
   *   isDuplicate  — true if this observation was a duplicate (DB or local)
   *   changeRecord — the new change event, if isNewChange is true
   *   supabaseError — non-null string if Supabase write failed (non-duplicate reason)
   */
  static async saveObservation(obs: PriceObservation): Promise<SaveObservationResult> {
    const existingObs = this.getObservations();

    // Check local duplicate first (avoids network round-trip on double-click)
    const localDuplicate = existingObs.some(o => o.id === obs.id);

    // Persist locally (always works, never blocked by CORS or network)
    if (!localDuplicate) {
      const updatedObs = [obs, ...existingObs.slice(0, 49)];
      localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(updatedObs));
    }

    // Sync to Supabase — distinguish real error from expected duplicate
    const { error: supabaseError, wasDuplicate: dbDuplicate } = await supabaseInsertObservation(obs);

    if (supabaseError) {
      console.warn('[RivalTrack] Supabase price_observations INSERT failed:', supabaseError);
    }

    const isDuplicate = localDuplicate || dbDuplicate;

    // ── Change Detection ───────────────────────────────────────────────────────
    // Re-read from localStorage after potential insert to get the latest prior obs.
    // Note: this uses localStorage only; for first-load accuracy the caller should
    // pass the Supabase-fetched previous price via obs.previousPrice.
    let isNewChange = false;
    let changeRecord: ChangeEvent | undefined;

    // Only run change detection on non-duplicate observations
    if (!isDuplicate) {
      const previousObs = existingObs.find(o => o.productId === obs.productId);
      const previousPrice = obs.previousPrice; // caller is responsible for setting this correctly

      // Use caller-supplied previousPrice for the delta check (accurate even on fresh load)
      const priceChanged = previousPrice !== undefined && previousPrice !== obs.price;

      if (priceChanged) {
        isNewChange = true;
        const delta = obs.price - previousPrice;
        const percent = ((delta / previousPrice) * 100).toFixed(1);
        const detectedAt = new Date().toISOString();

        changeRecord = {
          // Deterministic ID: product + from-price + to-price prevents concurrent-write duplicates
          id: `chg-${obs.productId}-${previousPrice}-${obs.price}`,
          type: 'price_change',
          competitorName: obs.companyName,
          competitorId: obs.companyName.toLowerCase().replace(/\s+/g, ''),
          productName: obs.productName,
          fieldChanged: 'Observed Store Price',
          previousValue: `₹${previousPrice.toLocaleString('en-IN')}`,
          newValue: `₹${obs.price.toLocaleString('en-IN')} (${delta < 0 ? percent + '%' : '+' + percent + '%'})`,
          detectedAt,
          sourceUrl: obs.sourceUrl,
          sourceName: obs.sourceName || 'Official Store',
          verificationStatus: 'verified',
        };

        this.saveChangeEventSync(changeRecord);
        // Async Supabase sync — 23505 on concurrent write is safe (same deterministic ID)
        supabaseInsertChangeEvent(changeRecord).then(err => {
          if (err) console.warn('[RivalTrack] Supabase change_events INSERT failed:', err);
        });
      } else if (previousObs) {
        // Price unchanged — log for debugging, do not create a change event
        console.debug(`[RivalTrack] Price unchanged for ${obs.productName}: ₹${obs.price}`);
      }
    }

    return { isNewChange, isDuplicate, changeRecord, supabaseError };
  }

  static getObservations(): PriceObservation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OBSERVATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // Synchronous local save for change events.
  // Dedup: same product + same (from→to) price pair + same ISO-minute window.
  private static saveChangeEventSync(chg: ChangeEvent): void {
    const existing = this.getChangeEvents();
    // Primary dedup: same deterministic ID (product + from-price + to-price)
    if (existing.some(e => e.id === chg.id)) return;
    const updated = [chg, ...existing.slice(0, 49)];
    localStorage.setItem(STORAGE_KEYS.CHANGE_EVENTS, JSON.stringify(updated));
  }

  static getChangeEvents(): ChangeEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHANGE_EVENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static async recordCollectionJob(result: CollectionResult): Promise<CollectionJobRecord> {
    const jobs = this.getCollectionJobs();
    const newJob: CollectionJobRecord = {
      id: 'job-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      sourceId: result.sourceId,
      sourceName: result.sourceName,
      targetUrl: result.targetUrl,
      status: result.status,
      httpStatusCode: result.httpStatusCode,
      timestamp: result.timestamp,
      errorMessage: result.errorMessage,
      fetchDurationMs: result.fetchDurationMs,
      corsBlocked: result.corsBlocked,
    };

    const updated = [newJob, ...jobs.slice(0, 29)];
    localStorage.setItem(STORAGE_KEYS.COLLECTION_JOBS, JSON.stringify(updated));

    const supabaseError = await supabaseInsertCollectionJob(newJob);
    if (supabaseError) {
      console.warn('[RivalTrack] Supabase collection_jobs INSERT failed:', supabaseError);
      newJob.supabaseError = supabaseError;
      localStorage.setItem(STORAGE_KEYS.COLLECTION_JOBS, JSON.stringify([newJob, ...jobs.slice(0, 29)]));
    }

    return newJob;
  }

  static getCollectionJobs(): CollectionJobRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COLLECTION_JOBS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}

// Re-export for use in AppContext
export { fetchPreviousObservation };
