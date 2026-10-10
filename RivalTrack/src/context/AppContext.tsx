import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, Product, Offer, Campaign, AIInsight, Alert, PriceObservation, ChangeEvent } from '../types';
import { 
  INITIAL_COMPANIES, 
  INITIAL_PRODUCTS, 
  INITIAL_OFFERS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_INSIGHTS, 
  INITIAL_ALERTS,
  INITIAL_OBSERVATIONS,
  INITIAL_CHANGE_EVENTS
} from '../data/mockData';
import { collectPublicStoreData, CollectionResult } from '../services/collector';
import { PersistenceEngine, CollectionJobRecord, getSupabaseKeyStatus, fetchPreviousObservation } from '../services/db';
import { synthesizeEvidenceInsights } from '../services/aiService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyName: string;
}

export interface LiveTelemetryEvent {
  id: string;
  type: 'price' | 'offer' | 'campaign' | 'insight';
  title: string;
  companyName: string;
  timestamp: string;
  diffSummary: string;
}

export interface SourceCollectionStatus {
  brand: string;
  sourceName: string;
  targetUrl: string;
  status: CollectionResult['status'];
  corsBlocked: boolean;
  fetchDurationMs?: number;
  httpStatusCode?: number;
  errorMessage?: string;
  supabaseError: string | null;
  observedPrice?: number;
  previousPrice?: number;
  timestamp: string;
  /** ISO string of when this observation was actually collected */
  observedAtISO: string;
}

/**
 * Per-run collection statistics, shown on the dashboard after each Refresh Data.
 * All fields are set only from actual results — never guessed or fabricated.
 */
export interface CollectionRunStats {
  sourcesChecked: number;
  sourcesSucceeded: number;
  newObservationsSaved: number;
  duplicatesSkipped: number;
  changesDetected: number;
  runAtISO: string;
  /** Human-readable IST timestamp for display */
  runAtDisplay: string;
}

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  
  referenceCompany: Company;
  competitors: Company[];
  setReferenceCompanyById: (id: string) => void;
  
  companies: Company[];
  products: Product[];
  offers: Offer[];
  campaigns: Campaign[];
  insights: AIInsight[];
  alerts: Alert[];
  observations: PriceObservation[];
  changeEvents: ChangeEvent[];
  collectionJobs: CollectionJobRecord[];
  
  addCompetitor: (company: Omit<Company, 'id'>) => void;
  removeCompetitor: (id: string) => void;
  
  markAlertAsRead: (id: string) => void;
  markAllAlertsAsRead: () => void;
  runIntelligenceScan: () => Promise<void>;
  isScanning: boolean;

  // Real-time Live Telemetry System
  isLiveStreaming: boolean;
  setIsLiveStreaming: React.Dispatch<React.SetStateAction<boolean>>;
  toggleLiveStream: () => void;
  lastTelemetryEvent: LiveTelemetryEvent | null;
  recentlyUpdatedProductId: string | null;
  triggerInstantLiveUpdate: () => Promise<void>;
  liveEventCount: number;
  lastRefreshTime: string;
  refreshStatusMessage: string | null;
  lastCollectionResults: SourceCollectionStatus[];
  lastRunStats: CollectionRunStats | null;
  supabaseKeyStatus: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rivaltrack_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(() => {
    return localStorage.getItem('rivaltrack_ref_company') || 'samsung';
  });

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [insights, setInsights] = useState<AIInsight[]>(INITIAL_INSIGHTS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);

  // Initialize from persistent store or mock defaults
  const [observations, setObservations] = useState<PriceObservation[]>(() => {
    const stored = PersistenceEngine.getObservations();
    return stored.length ? stored : INITIAL_OBSERVATIONS;
  });

  const [changeEvents, setChangeEvents] = useState<ChangeEvent[]>(() => {
    const stored = PersistenceEngine.getChangeEvents();
    return stored.length ? stored : INITIAL_CHANGE_EVENTS;
  });

  const [collectionJobs, setCollectionJobs] = useState<CollectionJobRecord[]>(() => {
    return PersistenceEngine.getCollectionJobs();
  });

  const [isScanning, setIsScanning] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [lastTelemetryEvent, setLastTelemetryEvent] = useState<LiveTelemetryEvent | null>(null);
  const [recentlyUpdatedProductId, setRecentlyUpdatedProductId] = useState<string | null>(null);
  const [liveEventCount, setLiveEventCount] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState<string>('Not yet refreshed');
  const [refreshStatusMessage, setRefreshStatusMessage] = useState<string | null>(null);
  const [lastCollectionResults, setLastCollectionResults] = useState<SourceCollectionStatus[]>([]);
  const [lastRunStats, setLastRunStats] = useState<CollectionRunStats | null>(null);
  const supabaseKeyStatus = getSupabaseKeyStatus();

  useEffect(() => {
    if (user) {
      localStorage.setItem('rivaltrack_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rivaltrack_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('rivaltrack_ref_company', selectedCompanyId);
  }, [selectedCompanyId]);

  /**
   * Execute genuine public store collection adapters.
   *
   * Deduplication policy (per-run):
   *   - obsId is stable per product per calendar hour: `obs-{prodId}-{ISO-hour}`
   *   - On retry within the same hour, the same obsId is sent → DB PK conflict (23505) → counted as duplicate
   *   - Supabase UNIQUE INDEX uix_obs_product_hour provides a second line of defence
   *   - Change events are only emitted when the observed price differs from the previous stored price
   *   - Change event ID is deterministic: `chg-{prodId}-{fromPrice}-{toPrice}` → concurrent writes dedup at DB
   */
  const triggerInstantLiveUpdate = async () => {
    const runAtISO = new Date().toISOString();
    const runAtDisplay = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    }) + ' IST';

    setRefreshStatusMessage('Fetching from official store pages...');

    const targets: {
      brand: 'Samsung' | 'Apple' | 'Motorola';
      name: string;
      url: string;
      prodId: string;
    }[] = [
      { brand: 'Samsung',  name: 'Samsung Galaxy S24 Ultra',   url: 'https://www.samsung.com/in/smartphones/galaxy-s24-ultra/buy/', prodId: 'prod-sam-s24u'     },
      { brand: 'Apple',    name: 'iPhone 16 Pro Max',           url: 'https://www.apple.com/in/shop/buy-iphone/iphone-16-pro',        prodId: 'prod-app-16pm'     },
      { brand: 'Motorola', name: 'Motorola Edge 50 Ultra',      url: 'https://www.motorola.in/motorola-edge-50-ultra/p',              prodId: 'prod-moto-edge50u' },
    ];

    const collectionStatuses: SourceCollectionStatus[] = [];
    let sourcesSucceeded = 0;
    let newObservationsSaved = 0;
    let duplicatesSkipped = 0;
    let changesDetected = 0;

    for (const target of targets) {
      const result = await collectPublicStoreData(target.brand, target.name, target.url, target.prodId);
      const job = await PersistenceEngine.recordCollectionJob(result);

      // Capture the actual observation ISO time for this result
      const observedAtISO = new Date().toISOString();

      const sourceStatus: SourceCollectionStatus = {
        brand: target.brand,
        sourceName: result.sourceName,
        targetUrl: result.targetUrl,
        status: result.status,
        corsBlocked: result.corsBlocked,
        fetchDurationMs: result.fetchDurationMs,
        httpStatusCode: result.httpStatusCode,
        errorMessage: result.errorMessage,
        supabaseError: job.supabaseError || null,
        observedPrice: result.observedPrice,
        timestamp: runAtDisplay,
        observedAtISO,
      };

      // A result is usable if we have an observedPrice (live parse or documented baseline)
      if (result.observedPrice !== undefined) {
        sourcesSucceeded++;

        // ── Deduplication: one snapshot per product per calendar hour ──────────
        // The ISO hour bucket (e.g. "2024-10-09T18") forms the stable suffix.
        // Same bucket = same obsId = primary-key conflict at DB = safe idempotent retry.
        const hourBucket = runAtISO.substring(0, 13); // "YYYY-MM-DDTHH"
        const obsId = `obs-${target.prodId}-${hourBucket}`;

        // ── Fetch the true previous price from Supabase (or localStorage fallback) ──
        // This ensures previousPrice is accurate even after a page reload.
        const previousObsRecord = await fetchPreviousObservation(target.prodId);
        const previousPrice = previousObsRecord?.price ?? result.observedPrice;

        sourceStatus.previousPrice = previousPrice;

        const newObs: PriceObservation = {
          id: obsId,
          productId: target.prodId,
          productName: target.name,
          companyName: target.brand,
          price: result.observedPrice,
          previousPrice,                   // ← correct: actual last-known price, not current
          currency: '₹',
          observedAt: runAtDisplay,        // human-readable for UI display
          sourceName: result.sourceName,
          sourceUrl: result.targetUrl,
          evidenceSnippet: result.evidenceSnippet || `Observation at ${result.targetUrl}`,
        };

        const { isNewChange, isDuplicate, changeRecord, supabaseError } =
          await PersistenceEngine.saveObservation(newObs);

        if (supabaseError) sourceStatus.supabaseError = supabaseError;

        if (isDuplicate) {
          duplicatesSkipped++;
        } else {
          newObservationsSaved++;
          // Update local UI state
          setObservations(prev => {
            const withoutDup = prev.filter(o => o.id !== obsId);
            return [newObs, ...withoutDup.slice(0, 19)];
          });
        }

        if (isNewChange && changeRecord) {
          changesDetected++;
          setChangeEvents(prev => [changeRecord, ...prev.slice(0, 19)]);
          setRecentlyUpdatedProductId(target.prodId);
          setTimeout(() => setRecentlyUpdatedProductId(null), 3000);
        }
      }

      collectionStatuses.push(sourceStatus);
    }

    // Commit all UI state
    setLastCollectionResults(collectionStatuses);
    setCollectionJobs(PersistenceEngine.getCollectionJobs());
    setLastRefreshTime(runAtDisplay);
    setLiveEventCount(c => c + 1);

    const runStats: CollectionRunStats = {
      sourcesChecked: targets.length,
      sourcesSucceeded,
      newObservationsSaved,
      duplicatesSkipped,
      changesDetected,
      runAtISO,
      runAtDisplay,
    };
    setLastRunStats(runStats);

    // Build a concise, factual status banner
    const hasCors = collectionStatuses.some(s => s.corsBlocked);
    const hasSupabaseErr = collectionStatuses.some(s => s.supabaseError);
    const overallStatus =
      sourcesSucceeded === targets.length ? 'Success' :
      sourcesSucceeded > 0 ? 'Partial Success' : 'Failed';

    const statusParts: string[] = [
      `${overallStatus}: ${sourcesSucceeded}/${targets.length} sources`,
      `${newObservationsSaved} new observation(s)`,
      `${duplicatesSkipped} duplicate(s) skipped`,
      `${changesDetected} change(s) detected`,
    ];
    if (hasCors) statusParts.push('CORS blocked (baselines used)');
    if (hasSupabaseErr) statusParts.push('Supabase error(s) — see console');

    setRefreshStatusMessage(statusParts.join(' · ') + ` · ${runAtDisplay}`);
    setTimeout(() => setRefreshStatusMessage(null), 8000);
  };

  const toggleLiveStream = () => { setIsLiveStreaming(prev => !prev); };

  const login = (email: string, name?: string) => {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: name || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)),
      email,
      role: 'Head of Market Intelligence',
      companyName: companies.find(c => c.id === selectedCompanyId)?.name || 'Samsung'
    };
    setUser(newUser);
  };

  const logout = () => { setUser(null); };

  const setReferenceCompanyById = (id: string) => {
    setSelectedCompanyId(id);
    setCompanies(prev => prev.map(c => ({ ...c, isReference: c.id === id })));
    if (user) {
      const company = companies.find(c => c.id === id);
      if (company) setUser({ ...user, companyName: company.name });
    }
  };

  const addCompetitor = (companyData: Omit<Company, 'id'>) => {
    const newCompany: Company = { ...companyData, id: 'comp-' + Date.now() };
    setCompanies(prev => [...prev, newCompany]);
  };

  const removeCompetitor = (id: string) => {
    if (id === selectedCompanyId) return;
    setCompanies(prev => prev.filter(c => c.id !== id));
  };

  const referenceCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];
  const competitors = companies.filter(c => c.id !== selectedCompanyId);

  const markAlertAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllAlertsAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  // Run evidence-grounded AI synthesis
  const runIntelligenceScan = async () => {
    setIsScanning(true);
    const synthesis = await synthesizeEvidenceInsights(changeEvents, observations);
    setIsScanning(false);

    if (synthesis.insight) {
      setInsights(prev => [synthesis.insight!, ...prev.slice(0, 9)]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        referenceCompany,
        competitors,
        setReferenceCompanyById,
        companies,
        products,
        offers,
        campaigns,
        insights,
        alerts,
        observations,
        changeEvents,
        collectionJobs,
        addCompetitor,
        removeCompetitor,
        markAlertAsRead,
        markAllAlertsAsRead,
        runIntelligenceScan,
        isScanning,
        isLiveStreaming,
        setIsLiveStreaming,
        toggleLiveStream,
        lastTelemetryEvent,
        recentlyUpdatedProductId,
        triggerInstantLiveUpdate,
        liveEventCount,
        lastRefreshTime,
        refreshStatusMessage,
        lastCollectionResults,
        lastRunStats,
        supabaseKeyStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
