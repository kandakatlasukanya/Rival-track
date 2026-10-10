import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatINR } from '../types';
import { 
  TrendingDown, 
  Sparkles, 
  ArrowRight, 
  ExternalLink, 
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Server,
  Database,
  Copy,
  GitCommit
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    referenceCompany, 
    competitors, 
    products, 
    offers, 
    insights,
    changeEvents,
    alerts,
    collectionJobs,
    runIntelligenceScan, 
    isScanning,
    recentlyUpdatedProductId,
    triggerInstantLiveUpdate,
    lastRefreshTime,
    refreshStatusMessage,
    lastCollectionResults,
    lastRunStats,
    supabaseKeyStatus,
  } = useApp();

  const rivalProducts = products.filter(p => p.companyId !== referenceCompany.id);
  const urgentInsight = insights.find(i => i.urgency === 'high') || insights[0];
  const recentChanges = changeEvents.slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Page Title & Selected Company Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-teal" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
              BASELINE BRAND: {referenceCompany.name} ({referenceCompany.headquarters})
            </span>
          </div>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: '#173B67',
              fontFamily: 'var(--font-display)',
              marginBottom: '4px'
            }}
          >
            Competitive Overview
          </h1>
          <p style={{ fontSize: '14px', color: '#68768A' }}>
            Benchmarking {referenceCompany.name} against {competitors.map(c => c.name).join(', ')}.
          </p>
        </div>

        {/* Primary Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={triggerInstantLiveUpdate}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} color="#20A69A" />
            <span>Refresh Data</span>
          </button>

          <button
            onClick={runIntelligenceScan}
            disabled={isScanning}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={14} />
            <span>{isScanning ? 'Running Synthesis...' : 'Run AI Scan'}</span>
          </button>
        </div>
      </div>

      {/* Status Notice Banner if Refreshed */}
      {refreshStatusMessage && (
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '8px',
            color: '#065F46',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={16} /> {refreshStatusMessage}
        </div>
      )}

      {/* 2. Compact Data Freshness & Status Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4EAF0',
          borderRadius: '10px',
          fontSize: '12.5px',
          color: '#68768A',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={14} color="#20A69A" />
          <span>Data Status: <strong>Public Source Adapters Enabled</strong></span>
          <span>•</span>
          <span>Last Refreshed: {lastRefreshTime}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#20A69A', fontWeight: 600 }}>
          <ShieldCheck size={14} />
          {lastRunStats
            ? <span>{lastRunStats.sourcesSucceeded}/{lastRunStats.sourcesChecked} Adapters Succeeded</span>
            : <span>No collection run yet</span>
          }
        </div>
      </div>

      {/* 2b. Per-Run Collection Statistics (only after first Refresh) */}
      {lastRunStats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '10px',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0', borderRadius: '8px',
          }}>
            <Database size={14} color="#059669" />
            <div>
              <div style={{ fontSize: '11px', color: '#065F46', fontWeight: 600, textTransform: 'uppercase' }}>New Saved</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#059669' }}>{lastRunStats.newObservationsSaved}</div>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A', borderRadius: '8px',
          }}>
            <Copy size={14} color="#D97706" />
            <div>
              <div style={{ fontSize: '11px', color: '#92400E', fontWeight: 600, textTransform: 'uppercase' }}>Duplicates Skipped</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#D97706' }}>{lastRunStats.duplicatesSkipped}</div>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', backgroundColor: lastRunStats.changesDetected > 0 ? '#FEF2F2' : '#F8FAFC',
            border: `1px solid ${lastRunStats.changesDetected > 0 ? '#FECACA' : '#E4EAF0'}`, borderRadius: '8px',
          }}>
            <GitCommit size={14} color={lastRunStats.changesDetected > 0 ? '#DC2626' : '#8F9CAE'} />
            <div>
              <div style={{ fontSize: '11px', color: lastRunStats.changesDetected > 0 ? '#991B1B' : '#68768A', fontWeight: 600, textTransform: 'uppercase' }}>Genuine Changes</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: lastRunStats.changesDetected > 0 ? '#DC2626' : '#8F9CAE' }}>{lastRunStats.changesDetected}</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. KPI Cards Row (Calculated from stored records) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}
      >
        <div className="card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#68768A', textTransform: 'uppercase' }}>
            Monitored Competitors
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#173B67' }}>
              {competitors.length} Brands
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#8F9CAE', marginTop: '4px' }}>
            {competitors.map(c => c.name).join(', ')}
          </div>
        </div>

        <div className="card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#68768A', textTransform: 'uppercase' }}>
            Flagship SKUs Monitored
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#173B67' }}>
              {products.length} Products
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#8F9CAE', marginTop: '4px' }}>
            {products.length - rivalProducts.length} Baseline, {rivalProducts.length} Rivals
          </div>
        </div>

        <div className="card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#68768A', textTransform: 'uppercase' }}>
            Active Rival Promotions
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#173B67' }}>
              {offers.length} Active
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#8F9CAE', marginTop: '4px' }}>
            Cashbacks, Trade-ins & Bundles
          </div>
        </div>

        <div className="card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#68768A', textTransform: 'uppercase' }}>
            Strategic AI Insights
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#173B67' }}>
              {insights.length} Verified
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#8F9CAE', marginTop: '4px' }}>
            Backed by captured evidence
          </div>
        </div>
      </div>

      {/* 4. Competitor Price Comparison Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E4EAF0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#173B67' }}>
              Competitor Flagship Price Monitor
            </h3>
            <p style={{ fontSize: '12px', color: '#68768A' }}>
              Observed prices and promotions compared to {referenceCompany.name} flagships
            </p>
          </div>
          <Link to="/products" style={{ fontSize: '13px', color: '#20A69A', fontWeight: 600, textDecoration: 'none' }}>
            Full Specification Matrix →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product & Brand</th>
                <th>Observed Price</th>
                <th>MSRP / Previous</th>
                <th>Price Change</th>
                <th>Source URL</th>
                <th>Last Verified</th>
              </tr>
            </thead>
            <tbody>
              {rivalProducts.map(prod => {
                const comp = competitors.find(c => c.id === prod.companyId);
                const isRecentlyUpdated = prod.id === recentlyUpdatedProductId;

                return (
                  <tr
                    key={prod.id}
                    className={isRecentlyUpdated ? 'row-updated-flash' : ''}
                    style={{ transition: 'background-color 0.4s ease' }}
                  >
                    <td>
                      <div style={{ fontWeight: 600, color: '#173B67' }}>{prod.name}</div>
                      <div style={{ fontSize: '12px', color: '#68768A' }}>{comp?.name} • {prod.segment}</div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#173B67' }}>
                      {formatINR(prod.currentPrice)}
                    </td>
                    <td style={{ color: '#8F9CAE', fontSize: '13px' }}>
                      {prod.currentPrice < prod.msrp ? (
                        <span style={{ textDecoration: 'line-through' }}>{formatINR(prod.msrp)}</span>
                      ) : (
                        <span>{formatINR(prod.msrp)}</span>
                      )}
                    </td>
                    <td>
                      {prod.changePercent < 0 ? (
                        <span className="badge badge-success" style={{ fontSize: '11px' }}>
                          <TrendingDown size={11} /> {prod.changePercent}%
                        </span>
                      ) : (
                        <span style={{ color: '#8F9CAE', fontSize: '12px' }}>Unchanged</span>
                      )}
                    </td>
                    <td>
                      <a
                        href={prod.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#20A69A', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        Official Store <ExternalLink size={11} />
                      </a>
                    </td>
                    <td style={{ fontSize: '12px', color: '#68768A' }}>
                      {prod.lastUpdated}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Concise Recent Changes & 6. AI Strategic Recommendation Card Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {/* Concise Recent Changes Section */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#173B67' }}>
              Recent Market Changes
            </h3>
            <Link to="/changelog" style={{ fontSize: '12.5px', color: '#20A69A', fontWeight: 600, textDecoration: 'none' }}>
              View Change History →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentChanges.map(chg => (
              <div
                key={chg.id}
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#FAFAF7',
                  border: '1px solid #E4EAF0',
                  borderRadius: '8px',
                  fontSize: '13px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#173B67' }}>
                    {chg.competitorName} • {chg.fieldChanged}
                  </span>
                  <span style={{ fontSize: '11px', color: '#8F9CAE' }}>{chg.detectedAt}</span>
                </div>
                <div style={{ color: '#20A69A', fontWeight: 600, fontSize: '12.5px', marginBottom: '4px' }}>
                  {chg.previousValue} → {chg.newValue}
                </div>
                <a
                  href={chg.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#68768A', fontSize: '11.5px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                >
                  Source ({chg.sourceName}) <ExternalLink size={10} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Compact AI Strategic Recommendation Card */}
        {urgentInsight && (
          <div
            className="card"
            style={{
              padding: '20px',
              border: '1px solid #B2E5E0',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="badge badge-teal" style={{ fontSize: '10px' }}>
                  <Sparkles size={11} /> TOP AI STRATEGIC RECOMMENDATION
                </span>
                <span style={{ fontSize: '11.5px', color: '#8F9CAE' }}>
                  {urgentInsight.generatedAt}
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#173B67', marginBottom: '6px' }}>
                {urgentInsight.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#68768A', lineHeight: '1.5', marginBottom: '14px' }}>
                {urgentInsight.summary}
              </p>

              <div
                style={{
                  backgroundColor: '#FAFAF7',
                  border: '1px solid #E4EAF0',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '14px'
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#173B67', textTransform: 'uppercase', display: 'block' }}>
                  Suggested Action:
                </span>
                <p style={{ fontSize: '12.5px', color: '#243247', marginTop: '2px', fontWeight: 500 }}>
                  {urgentInsight.suggestedAction}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #E4EAF0' }}>
              <a
                href={urgentInsight.sourceEvidence.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '12px', color: '#20A69A', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
              >
                Evidence Source <ExternalLink size={11} />
              </a>
              <Link to="/insights" className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                Full AI Insights <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 7. Data Sources & Collection Status Panel */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={16} color="#173B67" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#173B67' }}>
              Data Source Adapters — Last Collection Run
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            <span style={{ fontSize: '12px', color: '#68768A' }}>Last Poll: {lastRefreshTime}</span>
            <span style={{
              fontSize: '11px',
              color: supabaseKeyStatus.startsWith('✓') ? '#10B981' : '#F59E0B',
              fontWeight: 600
            }}>
              {supabaseKeyStatus}
            </span>
          </div>
        </div>

        {lastCollectionResults.length === 0 ? (
          <div style={{
            padding: '20px',
            backgroundColor: '#FAFAF7',
            border: '1px solid #E4EAF0',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#68768A',
            textAlign: 'center'
          }}>
            No collection run yet. Click <strong>Refresh Data</strong> to probe official store pages.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lastCollectionResults.map((src, idx) => {
              const isLive = src.status === 'success';
              const isCors = src.corsBlocked || src.status === 'cors_restricted';
              const isSynthetic = src.status === 'synthetic';
              const hasSupabaseErr = !!src.supabaseError;

              return (
                <div
                  key={idx}
                  style={{
                    padding: '14px 16px',
                    backgroundColor: '#FAFAF7',
                    border: `1px solid ${hasSupabaseErr ? '#FECACA' : '#E4EAF0'}`,
                    borderRadius: '8px',
                    fontSize: '12.5px',
                  }}
                >
                  {/* Row 1: Name + status badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                    <strong style={{ color: '#173B67' }}>{src.sourceName}</strong>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {isLive && (
                        <span className="badge badge-success" style={{ fontSize: '10px' }}>✓ Live HTML</span>
                      )}
                      {isCors && (
                        <span style={{
                          padding: '2px 8px', fontSize: '10px', fontWeight: 700, borderRadius: '9999px',
                          backgroundColor: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A'
                        }}>CORS Blocked</span>
                      )}
                      {isSynthetic && (
                        <span style={{
                          padding: '2px 8px', fontSize: '10px', fontWeight: 700, borderRadius: '9999px',
                          backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE'
                        }}>Baseline Used</span>
                      )}
                      {hasSupabaseErr && (
                        <span className="badge badge-danger" style={{ fontSize: '10px' }}>Supabase Error</span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Stats */}
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', color: '#68768A', fontSize: '12px', marginBottom: src.errorMessage || src.supabaseError ? '6px' : 0 }}>
                    {src.observedPrice !== undefined && (
                      <span>Price: <strong style={{ color: '#173B67' }}>₹{src.observedPrice.toLocaleString('en-IN')}</strong></span>
                    )}
                    {src.fetchDurationMs !== undefined && (
                      <span>Duration: <strong>{src.fetchDurationMs}ms</strong></span>
                    )}
                    {src.httpStatusCode !== undefined && src.httpStatusCode > 0 && (
                      <span>HTTP: <strong>{src.httpStatusCode}</strong></span>
                    )}
                    <span>At: {src.timestamp}</span>
                    <a href={src.targetUrl} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#20A69A', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      Endpoint <ExternalLink size={10} />
                    </a>
                  </div>

                  {/* Row 3: Errors */}
                  {src.errorMessage && (
                    <div style={{ fontSize: '11.5px', color: '#D97706', marginTop: '4px' }}>
                      ⚠ Fetch: {src.errorMessage}
                    </div>
                  )}
                  {src.supabaseError && (
                    <div style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '4px' }}>
                      ✕ Supabase: {src.supabaseError}
                    </div>
                  )}
                </div>
              );
            })}

            {/* CORS explanation note */}
            {lastCollectionResults.some(s => s.corsBlocked) && (
              <div style={{
                padding: '10px 14px',
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#92400E'
              }}>
                <strong>CORS block explained:</strong> Browser security prevents direct client-side fetch from samsung.com, apple.com, and motorola.in.
                Baseline documented prices are used instead. To enable live scraping, deploy a Supabase Edge Function as a server-side proxy.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
