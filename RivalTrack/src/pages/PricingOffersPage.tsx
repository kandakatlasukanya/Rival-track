import React from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../types';
import { DollarSign, Tag, TrendingDown, ExternalLink, Calendar, ShieldCheck, Gift, Zap } from 'lucide-react';

export const PricingOffersPage: React.FC = () => {
  const { referenceCompany, competitors, offers, observations, triggerInstantLiveUpdate } = useApp();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-teal" style={{ marginBottom: '8px' }}>
            PRICING INTELLIGENCE & TRADE-IN AUDIT
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
            Pricing & Offers Tracker
          </h1>
          <p style={{ fontSize: '14px', color: '#68768A' }}>
            Real-time observed price alterations, promotional campaigns, and trade-in incentives across competitor direct stores.
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

      {/* Two Column Layout: Active Offers & Historical Price Observations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Active Offers */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Tag size={20} color="#20A69A" />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#173B67' }}>
              Active Rival Promotional Campaigns ({offers.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {offers.map(offer => (
              <div
                key={offer.id}
                style={{
                  padding: '16px',
                  backgroundColor: '#FAFAF7',
                  border: '1px solid #E4EAF0',
                  borderRadius: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#173B67', fontSize: '14px' }}>
                      {offer.companyName}
                    </span>
                    <span className="badge badge-teal" style={{ fontSize: '10px' }}>
                      {offer.type}
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#10B981' }}>
                    {offer.discountValue}
                  </span>
                </div>

                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#243247', marginBottom: '6px' }}>
                  {offer.title}
                </h4>
                <p style={{ fontSize: '13px', color: '#68768A', marginBottom: '10px', lineHeight: '1.5' }}>
                  {offer.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#8F9CAE' }}>
                  <span>Valid until: {offer.validUntil}</span>
                  <a
                    href={offer.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#20A69A', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    Source: {offer.sourceName || 'Live Store Page'} <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observed Price Cuts Audit */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <DollarSign size={20} color="#173B67" />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#173B67' }}>
              Confirmed Price Movements
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {observations.map(obs => {
              const delta = obs.price - obs.previousPrice;
              return (
                <div
                  key={obs.id}
                  style={{
                    padding: '16px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E4EAF0',
                    borderRadius: '10px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#173B67', fontSize: '14px' }}>
                      {obs.productName}
                    </span>
                    <span className="badge badge-success" style={{ fontSize: '11px' }}>
                      <TrendingDown size={12} /> -{formatINR(Math.abs(delta))} ({Math.round((delta / obs.previousPrice) * 100)}%)
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 800, color: '#173B67' }}>
                      {formatINR(obs.price)}
                    </span>
                    <span style={{ fontSize: '13px', color: '#8F9CAE', textDecoration: 'line-through' }}>
                      {formatINR(obs.previousPrice)}
                    </span>
                    <span style={{ fontSize: '11px', color: '#68768A' }}>
                      • {obs.discountType}
                    </span>
                  </div>

                  <div
                    style={{
                      padding: '10px 12px',
                      backgroundColor: '#EEF4FA',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#243247',
                      fontStyle: 'italic',
                      marginBottom: '10px'
                    }}
                  >
                    {obs.evidenceSnippet}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#8F9CAE' }}>
                    <span>Recorded: {obs.observedAt}</span>
                    <a
                      href={obs.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#20A69A', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      Audit Proof ({obs.sourceName || 'Live Retailer'}) <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
