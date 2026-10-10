import React from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../types';
import { History, TrendingDown, Tag, Megaphone, ExternalLink, Zap, Sparkles } from 'lucide-react';

export const ChangelogPage: React.FC = () => {
  const { referenceCompany, observations, offers, campaigns, changeEvents, triggerInstantLiveUpdate } = useApp();

  // Combine dynamic live observations, campaign detections, and change events
  const combinedAuditEvents = [
    ...changeEvents.map(evt => ({
      id: evt.id,
      type: evt.type === 'price_change' ? 'price' : evt.type === 'offer_added' ? 'offer' : 'campaign',
      title: `${evt.competitorName}: ${evt.productName ? `${evt.productName} ` : ''}${evt.fieldChanged}`,
      company: evt.competitorName,
      timestamp: evt.detectedAt,
      diff: `${evt.previousValue} → ${evt.newValue}`,
      evidence: `Verified at ${evt.sourceName}`,
      url: evt.sourceUrl
    })),
    ...observations.map(obs => ({
      id: obs.id,
      type: 'price',
      title: `${obs.companyName}: ${obs.productName} adjusted to ${formatINR(obs.price)}`,
      company: obs.companyName,
      timestamp: obs.observedAt,
      diff: `-${formatINR(Math.abs(obs.previousPrice - obs.price))} (${formatINR(obs.previousPrice)} → ${formatINR(obs.price)})`,
      evidence: obs.evidenceSnippet,
      url: obs.sourceUrl
    })),
    ...offers.map(off => ({
      id: off.id,
      type: 'offer',
      title: `${off.companyName}: ${off.title}`,
      company: off.companyName,
      timestamp: off.validUntil.includes('Hours') || off.validUntil.includes('days') ? 'Recently captured' : 'Active promotion',
      diff: off.discountValue,
      evidence: off.description,
      url: off.sourceUrl
    })),
    ...campaigns.map(camp => ({
      id: camp.id,
      type: 'campaign',
      title: `${camp.companyName} on ${camp.platform}: "${camp.headline}"`,
      company: camp.companyName,
      timestamp: camp.detectedAt,
      diff: `${camp.platform} Campaign (${camp.estimatedSpendTier})`,
      evidence: camp.keyHook,
      url: camp.landingPageUrl
    }))
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-teal" style={{ marginBottom: '8px' }}>
            HISTORICAL AUDIT LOG & LIVE CHANGE DETECTOR
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
            Update Log & Audit Trail
          </h1>
          <p style={{ fontSize: '14px', color: '#68768A' }}>
            Real-time time-stamped audit trail of public competitor actions, observed price deltas, and crawler snapshots.
          </p>
        </div>

        <button
          onClick={triggerInstantLiveUpdate}
          className="btn btn-primary"
          style={{ fontSize: '13px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Zap size={14} color="#20A69A" /> Probe Live Delta
        </button>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {combinedAuditEvents.map(evt => (
            <div
              key={evt.id}
              style={{
                display: 'flex',
                gap: '16px',
                paddingBottom: '20px',
                borderBottom: '1px solid #E4EAF0'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: evt.type === 'price' ? '#ECFDF5' : evt.type === 'offer' ? '#EFF6FF' : '#FFFBEB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {evt.type === 'price' && <TrendingDown size={18} color="#10B981" />}
                {evt.type === 'offer' && <Tag size={18} color="#2563EB" />}
                {evt.type === 'campaign' && <Megaphone size={18} color="#D97706" />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#173B67', fontSize: '15px' }}>
                      {evt.title}
                    </span>
                    <span className="badge badge-navy" style={{ fontSize: '11px' }}>
                      {evt.company}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#8F9CAE' }}>
                    {evt.timestamp}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: '#20A69A', fontWeight: 600, marginBottom: '6px' }}>
                  Observed Delta: {evt.diff}
                </div>

                <p style={{ fontSize: '13px', color: '#68768A', marginBottom: '8px' }}>
                  {evt.evidence}
                </p>

                <a
                  href={evt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '12px',
                    color: '#173B67',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Inspect Captured Snapshot <ExternalLink size={11} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
