import React from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../types';
import { Building2, Globe, ShieldCheck, CheckCircle2, RefreshCw, ExternalLink, Plus } from 'lucide-react';

export const CompetitorsPage: React.FC = () => {
  const { referenceCompany, competitors, products, offers, triggerInstantLiveUpdate } = useApp();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-teal" style={{ marginBottom: '8px' }}>
            RIVAL ECOSYSTEM MANAGEMENT
          </div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#173B67',
              fontFamily: 'var(--font-display)',
              marginBottom: '4px'
            }}
          >
            Tracked Competitors
          </h1>
          <p style={{ fontSize: '14px', color: '#68768A' }}>
            Continuous crawler status, endpoints, and market positioning relative to {referenceCompany.name}.
          </p>
        </div>

        <button
          onClick={() => alert('New competitor crawler endpoint configuration modal.')}
          className="btn btn-primary"
          style={{ fontSize: '13px', padding: '9px 16px' }}
        >
          <Plus size={16} /> Add Custom Competitor Source
        </button>
      </div>

      {/* Competitor Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}
      >
        {competitors.map(comp => {
          const compProducts = products.filter(p => p.companyId === comp.id);
          const compOffers = offers.filter(o => o.companyId === comp.id);

          return (
            <div
              key={comp.id}
              className="card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        backgroundColor: '#EEF4FA',
                        color: '#173B67',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '18px'
                      }}
                    >
                      {comp.name.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#173B67' }}>
                        {comp.name}
                      </h3>
                      <span style={{ fontSize: '12px', color: '#68768A' }}>
                        {comp.headquarters}
                      </span>
                    </div>
                  </div>

                  <span className="badge badge-success" style={{ fontSize: '11px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    Active Bot
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: '#FAFAF7',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontSize: '13px'
                  }}
                >
                  <div>
                    <span style={{ color: '#8F9CAE', fontSize: '11px', display: 'block' }}>Global Share</span>
                    <strong style={{ color: '#173B67', fontSize: '16px' }}>{comp.marketShare}%</strong>
                  </div>
                  <div>
                    <span style={{ color: '#8F9CAE', fontSize: '11px', display: 'block' }}>Monitored SKUs</span>
                    <strong style={{ color: '#173B67', fontSize: '16px' }}>{comp.productCount}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#8F9CAE', fontSize: '11px', display: 'block' }}>Active Offers</span>
                    <strong style={{ color: '#20A69A', fontSize: '16px' }}>{compOffers.length} Live</strong>
                  </div>
                  <div>
                    <span style={{ color: '#8F9CAE', fontSize: '11px', display: 'block' }}>Last Crawled</span>
                    <strong style={{ color: '#243247', fontSize: '13px' }}>{comp.lastMonitored}</strong>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#68768A', marginBottom: '6px' }}>
                    Flagship Monitored:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {compProducts.map(p => (
                      <span
                        key={p.id}
                        style={{
                          fontSize: '12px',
                          padding: '4px 10px',
                          backgroundColor: '#EEF4FA',
                          borderRadius: '6px',
                          color: '#173B67',
                          fontWeight: 500
                        }}
                      >
                        {p.name} ({formatINR(p.currentPrice)})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid #E4EAF0',
                  paddingTop: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <a
                  href={comp.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '12px',
                    color: '#20A69A',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Globe size={13} /> Official Website <ExternalLink size={11} />
                </a>

                <button
                  onClick={() => triggerInstantLiveUpdate()}
                  style={{
                    fontSize: '12px',
                    color: '#173B67',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: '#EEF4FA'
                  }}
                >
                  <RefreshCw size={12} /> Crawl Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
