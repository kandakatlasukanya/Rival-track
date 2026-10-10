/**
 * RivalTrack — Supabase Edge Function: collect-prices
 *
 * PURPOSE
 * ───────
 * Browser-side fetch to samsung.com, apple.com, and motorola.in is blocked by
 * CORS policy (no Access-Control-Allow-Origin header for cross-origin requests).
 * This Edge Function runs server-side in Deno, bypassing that restriction.
 *
 * INVOCATION
 * ──────────
 * POST https://<project>.supabase.co/functions/v1/collect-prices
 * Headers: Authorization: Bearer <SUPABASE_ANON_KEY>
 * Body: { "productId": "prod-sam-s24u", "brand": "Samsung", "targetUrl": "...", "productName": "..." }
 *
 * RESPONSE
 * ────────
 * { status, observedPrice, currency, evidenceSnippet, fetchDurationMs, httpStatusCode, errorMessage }
 *
 * RATE LIMITING & RESPECT FOR SOURCE TERMS
 * ─────────────────────────────────────────
 * - 10-second timeout per request (prevents runaway fetches).
 * - No authentication bypass — only public, unauthenticated store pages are fetched.
 * - No CAPTCHA solving, no login simulation, no session cookie injection.
 * - If a source returns 429 (Too Many Requests), the status is surfaced to the caller.
 * - Use scheduled invocation with at least 1-hour intervals to avoid overloading sources.
 *
 * DEDUPLICATION NOTE
 * ──────────────────
 * This function only collects and returns price data. It does NOT write to the database.
 * The client (AppContext.triggerInstantLiveUpdate) is responsible for all DB writes,
 * including deduplication via the obsId hour-bucket and the uix_obs_product_hour index.
 */

// Price extraction patterns for Indian smartphone store pages
const PRICE_PATTERNS: RegExp[] = [
  // JSON-LD / meta structured data
  /"price":\s*"?(\d{4,7})"?/i,
  // Open Graph / meta[property="product:price:amount"]
  /content="(\d{4,7})"\s+property="product:price:amount"/i,
  /property="product:price:amount"\s+content="(\d{4,7})"/i,
  // Rupee symbol followed by digits (e.g. ₹1,29,999 or ₹129999)
  /₹\s*([0-9,]{5,9})/,
  // Rs. prefix
  /Rs\.?\s*([0-9,]{5,9})/i,
  // priceCurrency INR near content value
  /priceCurrency[^>]+INR[\s\S]*?content="(\d{4,7})"/i,
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function parsePrice(html: string): number | undefined {
  for (const pattern of PRICE_PATTERNS) {
    const match = html.match(pattern);
    if (match?.[1]) {
      const cleaned = match[1].replace(/,/g, '');
      const val = parseInt(cleaned, 10);
      // Sanity check: must be a plausible Indian smartphone price (₹5,000–₹3,50,000)
      if (!isNaN(val) && val >= 5000 && val <= 350000) {
        return val;
      }
    }
  }
  return undefined;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed — use POST' }),
      { status: 405, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  let body: { productId?: string; brand?: string; targetUrl?: string; productName?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  const { productId, brand, targetUrl, productName } = body;

  if (!targetUrl || !brand) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: targetUrl, brand' }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  // Allowlist: only fetch from known, pre-approved public store domains
  const ALLOWED_DOMAINS = [
    'samsung.com',
    'apple.com',
    'motorola.in',
    'oneplus.com',
    'store.google.com',
    'flipkart.com',
  ];

  const urlHost = (() => {
    try { return new URL(targetUrl).hostname.toLowerCase(); }
    catch { return ''; }
  })();

  const isAllowed = ALLOWED_DOMAINS.some(domain => urlHost === domain || urlHost.endsWith('.' + domain));
  if (!isAllowed) {
    return new Response(
      JSON.stringify({ error: `Domain not in allowlist: ${urlHost}` }),
      { status: 403, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  const startMs = Date.now();
  let httpStatusCode = 0;
  let observedPrice: number | undefined;
  let evidenceSnippet: string | undefined;
  let errorMessage: string | undefined;
  let status: 'success' | 'error' | 'rate_limited' | 'cors_restricted' = 'error';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-IN,en;q=0.9',
        'User-Agent': 'Mozilla/5.0 (compatible; RivalTrack-Collector/1.0)',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    httpStatusCode = response.status;

    if (response.status === 429) {
      status = 'rate_limited';
      errorMessage = `Rate limited by ${urlHost} (HTTP 429). Retry after delay.`;
    } else if (!response.ok) {
      errorMessage = `HTTP ${response.status} from ${urlHost}`;
    } else {
      const html = await response.text();
      observedPrice = parsePrice(html);

      if (observedPrice !== undefined) {
        status = 'success';
        evidenceSnippet = `Live server-side fetch: observed ₹${observedPrice.toLocaleString('en-IN')} from ${targetUrl}`;
      } else {
        errorMessage = `Price not found in page HTML — page structure may have changed at ${urlHost}`;
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const isTimeout = message.includes('aborted') || message.includes('timeout');
    errorMessage = isTimeout
      ? `Request timed out after 10 s fetching ${urlHost}`
      : `Fetch error: ${message}`;
  }

  const fetchDurationMs = Date.now() - startMs;

  const payload = {
    productId,
    productName,
    brand,
    targetUrl,
    status,
    httpStatusCode,
    observedPrice,
    currency: '₹',
    evidenceSnippet,
    fetchDurationMs,
    errorMessage,
    // Server does NOT write to DB — caller handles deduplication and insert
  };

  return new Response(
    JSON.stringify(payload),
    {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    }
  );
});
