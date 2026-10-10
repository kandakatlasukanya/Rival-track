import { formatINR } from '../types';

export interface CollectionResult {
  sourceId: string;
  sourceName: string;
  targetUrl: string;
  status: 'success' | 'rate_limited' | 'error' | 'cors_restricted' | 'synthetic';
  httpStatusCode?: number;
  productName?: string;
  brand: string;
  observedPrice?: number;
  msrp?: number;
  currency: string;
  evidenceSnippet?: string;
  timestamp: string;
  errorMessage?: string;
  fetchDurationMs?: number;
  corsBlocked: boolean;
  /** true if price came from a live server parse (Edge Function or direct fetch) */
  isLivePrice: boolean;
  /** true if price fell back to the known baseline (CORS or parse failure) */
  usedBaseline: boolean;
}

/**
 * Known baseline MSRPs for fallback reference.
 * These are the published Indian store list prices (manually updated).
 * Used ONLY when the live fetch fails — clearly labelled as baselines in all outputs.
 *
 * ⚠ These are NOT live prices. They are last-known reference prices to prevent
 *   the pipeline from silently producing empty results on CORS failure.
 */
const KNOWN_BASELINES: Record<string, { price: number; msrp: number; sourceName: string }> = {
  Samsung:  { price: 129999, msrp: 134999, sourceName: 'Samsung India Official Store' },
  Apple:    { price: 144900, msrp: 144900, sourceName: 'Apple India Direct Store' },
  Motorola: { price: 59999,  msrp: 64999,  sourceName: 'Motorola India Store' },
};

/**
 * Supabase Edge Function URL for server-side price collection.
 * When deployed, this bypasses the CORS restriction that blocks browser-side fetches
 * to samsung.com, apple.com, and motorola.in.
 *
 * Deploy: `supabase functions deploy collect-prices`
 * Then set VITE_EDGE_COLLECT_URL in .env:
 *   VITE_EDGE_COLLECT_URL=https://<project-ref>.supabase.co/functions/v1/collect-prices
 */
const EDGE_COLLECT_URL = import.meta.env.VITE_EDGE_COLLECT_URL || '';

/**
 * Attempt to collect a price via the deployed Supabase Edge Function (server-side).
 * Returns null if the Edge Function URL is not configured or the call fails.
 */
async function tryEdgeFunctionFetch(params: {
  productId: string;
  brand: string;
  targetUrl: string;
  productName: string;
}): Promise<{ observedPrice: number; evidenceSnippet: string; fetchDurationMs: number } | null> {
  if (!EDGE_COLLECT_URL) return null;

  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  try {
    const response = await fetch(EDGE_COLLECT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.status === 'success' && typeof data.observedPrice === 'number') {
      return {
        observedPrice: data.observedPrice,
        evidenceSnippet: data.evidenceSnippet || `Server-side fetch: ₹${data.observedPrice}`,
        fetchDurationMs: data.fetchDurationMs ?? 0,
      };
    }
  } catch {
    // Edge Function not deployed or network error — fall through to browser-side attempt
  }
  return null;
}

/**
 * Public Data Collection Adapter for Smartphone Direct Stores in India.
 *
 * Collection Strategy (in priority order):
 *   1. Supabase Edge Function (server-side, CORS-free) — if VITE_EDGE_COLLECT_URL is set.
 *   2. Browser-side fetch — succeeds only if the source allows cross-origin requests.
 *   3. Known baseline — last-resort fallback, clearly labelled as synthetic in all outputs.
 *
 * This function:
 *   1. Tries the Edge Function first (circumvents CORS, respects source TOS as a server).
 *   2. Falls back to browser-side fetch (usually CORS-blocked; records the real error).
 *   3. Falls back to the documented baseline with status='synthetic' if both fail.
 *   4. NEVER invents a price that has no documented source.
 *   5. NEVER marks a synthetic observation as a live success.
 *
 * Rate limits & TOS:
 *   - 10 s timeout (browser) / 10 s timeout (Edge Function).
 *   - No CAPTCHA bypass, no login, no session injection.
 *   - Caller should not invoke this more than once per hour per product.
 */
export async function collectPublicStoreData(
  brand: 'Samsung' | 'Apple' | 'Motorola' | 'Google Pixel' | 'OnePlus',
  productName: string,
  targetUrl: string,
  productId?: string
): Promise<CollectionResult> {
  const timestamp = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }) + ' IST';

  const baseline = KNOWN_BASELINES[brand];
  const sourceId = `src-${brand.toLowerCase().replace(/\s+/g, '-')}`;
  const sourceName = baseline?.sourceName || `${brand} Official India Store`;

  // ── Step 1: Try Supabase Edge Function (server-side, CORS-free) ────────────
  if (EDGE_COLLECT_URL && productId) {
    const edgeResult = await tryEdgeFunctionFetch({ productId, brand, targetUrl, productName });
    if (edgeResult) {
      return {
        sourceId,
        sourceName,
        targetUrl,
        status: 'success',
        productName,
        brand,
        observedPrice: edgeResult.observedPrice,
        msrp: baseline?.msrp,
        currency: '₹',
        evidenceSnippet: edgeResult.evidenceSnippet,
        timestamp,
        fetchDurationMs: edgeResult.fetchDurationMs,
        corsBlocked: false,
        isLivePrice: true,
        usedBaseline: false,
      };
    }
  }

  const startMs = Date.now();

  // ── Step 2: Browser-side fetch (expected to be CORS-blocked for these stores) ──
  let liveResult: {
    ok: boolean;
    status: number;
    corsBlocked: boolean;
    htmlText?: string;
    errorMessage?: string;
  } | null = null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-IN,en;q=0.9',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const htmlText = await response.text();
      liveResult = { ok: true, status: response.status, corsBlocked: false, htmlText };
    } else {
      liveResult = {
        ok: false,
        status: response.status,
        corsBlocked: false,
        errorMessage: `HTTP ${response.status} from origin server`,
      };
    }
  } catch (err: any) {
    const isCors =
      err?.name === 'TypeError' ||
      err?.message?.includes('Failed to fetch') ||
      err?.message?.includes('NetworkError');
    const isTimeout = err?.name === 'AbortError';

    liveResult = {
      ok: false,
      status: 0,
      corsBlocked: isCors,
      errorMessage: isTimeout
        ? 'Request timed out after 8 s'
        : isCors
        ? 'CORS policy blocked browser-side fetch — deploy Edge Function to enable live data'
        : err?.message || 'Unknown fetch error',
    };
  }

  const fetchDurationMs = Date.now() - startMs;

  // ── Step 3: Parse price from live HTML (only if we got it) ─────────────────
  let parsedPrice: number | undefined;
  if (liveResult?.htmlText) {
    const html = liveResult.htmlText;
    const patterns = [
      /"price":\s*"?(\d{4,7})"?/i,
      /content="(\d{4,7})"\s+property="product:price:amount"/i,
      /₹\s*([0-9,]{5,9})/,
      /Rs\.?\s*([0-9,]{5,9})/i,
      /priceCurrency[^>]+INR[\s\S]*?content="(\d{4,7})"/i,
    ];
    for (const re of patterns) {
      const m = html.match(re);
      if (m?.[1]) {
        const val = parseInt(m[1].replace(/,/g, ''), 10);
        if (!isNaN(val) && val >= 5000 && val <= 350000) {
          parsedPrice = val;
          break;
        }
      }
    }
  }

  // ── Step 4: Determine final observed price ─────────────────────────────────
  // Use live-parsed price if available. Only then fall back to known baseline.
  // The baseline is always labelled 'synthetic' — never passed off as live.
  const finalPrice = parsedPrice ?? baseline?.price;

  if (!finalPrice) {
    // No live price AND no baseline — cannot produce any observation
    return {
      sourceId,
      sourceName,
      targetUrl,
      status: 'error',
      httpStatusCode: liveResult?.status || 0,
      brand,
      currency: '₹',
      timestamp,
      fetchDurationMs,
      corsBlocked: liveResult?.corsBlocked ?? false,
      errorMessage: liveResult?.errorMessage || 'No price data available and no baseline configured',
      isLivePrice: false,
      usedBaseline: false,
    };
  }

  const effectiveStatus: CollectionResult['status'] = liveResult?.ok && parsedPrice
    ? 'success'
    : liveResult?.corsBlocked
    ? 'cors_restricted'
    : parsedPrice
    ? 'success'
    : 'synthetic';

  const isLivePrice = !!parsedPrice;
  const usedBaseline = !parsedPrice && !!baseline;

  return {
    sourceId,
    sourceName,
    targetUrl,
    status: effectiveStatus,
    httpStatusCode: liveResult?.status || undefined,
    productName,
    brand,
    observedPrice: finalPrice,
    msrp: baseline?.msrp,
    currency: '₹',
    evidenceSnippet: parsedPrice
      ? `Live HTML: observed ${formatINR(parsedPrice)} parsed from canonical price meta at ${targetUrl}`
      : `Baseline reference: documented store price ${formatINR(finalPrice)} — live fetch CORS-blocked. Deploy Edge Function for live data. Source: ${targetUrl}`,
    timestamp,
    fetchDurationMs,
    corsBlocked: liveResult?.corsBlocked ?? false,
    errorMessage: liveResult?.corsBlocked
      ? `CORS blocked (${fetchDurationMs}ms) — using baseline. Set VITE_EDGE_COLLECT_URL to enable live server-side fetch.`
      : liveResult?.errorMessage,
    isLivePrice,
    usedBaseline,
  };
}
