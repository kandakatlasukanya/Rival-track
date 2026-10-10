import React from 'react';
import { useApp } from '../context/AppContext';
import { Megaphone, ExternalLink, Target, DollarSign, Eye, Layers, Zap } from 'lucide-react';

export const CampaignsPage: React.FC = () => {
  const { referenceCompany, campaigns, triggerInstantLiveUpdate } = useApp();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-teal" style={{ marginBottom: '8px' }}>
            PUBLIC ADVERTISING & SOCIAL INTELLIGENCE
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
            Campaign & Creative Audit
          </h1>
          <p style={{ fontSize: '14px', color: '#68768A' }}>
            Monitors competitor marketing hooks, public ad archive listings, targeted demographics, and estimated expenditure.
          </p>
        </div>

        <button
          onClick={triggerInstantLiveUpdate}
          className="btn btn-primary"
          style={{ fontSize: '13px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Zap size={14} color="#20A69A" /> Probe Live Ads
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}
      >
        {campaigns.map(camp => (
          <div
            key={camp.id}
            className="card"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#173B67' }}>
                  {camp.companyName}
                </span>
                <span className="badge badge-teal" style={{ fontSize: '11px' }}>
                  {camp.platform}
                </span>
              </div>

              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#173B67',
                  marginBottom: '14px',
                  lineHeight: '1.4'
                }}
              >
                "{camp.headline}"
              </div>

              <div
                style={{
                  backgroundColor: '#FAFAF7',
                  border: '1px solid #E4EAF0',
                  borderRadius: '8px',
                  padding: '14px',
                  marginBottom: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '13px'
                }}
              >
                <div>
                  <span style={{ color: '#8F9CAE', fontSize: '11px', display: 'block', fontWeight: 600 }}>KEY VALUE HOOK</span>
                  <strong style={{ color: '#243247' }}>{camp.keyHook}</strong>
                </div>
                <div>
                  <span style={{ color: '#8F9CAE', fontSize: '11px', display: 'block', fontWeight: 600 }}>AUDIENCE TARGETING</span>
                  <span style={{ color: '#68768A' }}>{camp.audienceTarget}</span>
                </div>
                <div>
                  <span style={{ color: '#8F9CAE', fontSize: '11px', display: 'block', fontWeight: 600 }}>ESTIMATED SPEND TIER</span>
                  <span className="badge badge-navy" style={{ fontSize: '10px' }}>{camp.estimatedSpendTier}</span>
                </div>
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid #E4EAF0',
                paddingTop: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '12px',
                color: '#8F9CAE'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Detected: {camp.detectedAt}</span>
                <span className="badge badge-teal" style={{ fontSize: '10px' }}>
                  Live Verified
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {camp.adMediaUrl ? (
                  <a
                    href={camp.adMediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#173B67',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#EEF4FA',
                      padding: '4px 10px',
                      borderRadius: '6px'
                    }}
                  >
                    {camp.adMediaLabel || `Watch ${camp.platform} Ad`} <ExternalLink size={11} />
                  </a>
                ) : null}

                <a
                  href={camp.landingPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#20A69A', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  Inspect Ad Landing <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
