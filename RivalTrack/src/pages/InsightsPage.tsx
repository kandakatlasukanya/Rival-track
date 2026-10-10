import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, RefreshCw, AlertCircle, CheckCircle, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';

export const InsightsPage: React.FC = () => {
  const { referenceCompany, insights, runIntelligenceScan, isScanning } = useApp();
  const [filterUrgency, setFilterUrgency] = useState<string>('all');

  const filteredInsights = filterUrgency === 'all'
    ? insights
    : insights.filter(i => i.urgency === filterUrgency);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-teal" style={{ marginBottom: '8px' }}>
            EVIDENCE-BACKED STRATEGIC DECISION SUITE
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
            AI Insights & Countermeasures
          </h1>
          <p style={{ fontSize: '14px', color: '#68768A' }}>
            Autonomous competitive evaluations and recommended business responses for {referenceCompany.name}.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={runIntelligenceScan}
            disabled={isScanning}
            className="btn btn-teal"
            style={{ fontSize: '13px', padding: '9px 16px' }}
          >
            <Sparkles size={15} />
            <span>{isScanning ? 'Running Synthesis Models...' : 'Run New AI Intelligence Scan'}</span>
            <RefreshCw size={13} className={isScanning ? 'spin-animation' : ''} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { id: 'all', label: `All Insights (${insights.length})` },
          { id: 'high', label: 'High Urgency' },
          { id: 'medium', label: 'Medium Urgency' },
          { id: 'low', label: 'Low Urgency' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterUrgency(tab.id)}
            className="btn"
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              backgroundColor: filterUrgency === tab.id ? '#173B67' : '#FFFFFF',
              color: filterUrgency === tab.id ? '#FFFFFF' : '#243247',
              border: '1px solid #E4EAF0'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Insights List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredInsights.map(insight => {
          const isHigh = insight.urgency === 'high';
          const isMedium = insight.urgency === 'medium';

          return (
            <div
              key={insight.id}
              className="card"
              style={{
                padding: '28px',
                border: isHigh ? '1px solid #B2E5E0' : '1px solid #E4EAF0',
                backgroundColor: isHigh ? '#FCFDFD' : '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: isHigh ? '#FEF2F2' : isMedium ? '#FEF3C7' : '#EFF6FF',
                      color: isHigh ? '#DC2626' : isMedium ? '#D97706' : '#2563EB',
                      border: isHigh ? '1px solid #FECACA' : isMedium ? '1px solid #FDE68A' : '1px solid #BFDBFE'
                    }}
                  >
                    {insight.urgency.toUpperCase()} URGENCY
                  </span>
                  <span className="badge badge-teal">
                    {insight.category}
                  </span>
                  <span style={{ fontSize: '13px', color: '#68768A', fontWeight: 600 }}>
                    Affecting Rival: {insight.competitorAffected}
                  </span>
                </div>

                <span style={{ fontSize: '12px', color: '#8F9CAE' }}>
                  Generated {insight.generatedAt}
                </span>
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#173B67', marginBottom: '10px' }}>
                {insight.title}
              </h2>

              <p style={{ fontSize: '15px', color: '#243247', lineHeight: '1.6', marginBottom: '16px' }}>
                {insight.summary}
              </p>

              {/* Strategic Analysis & Countermeasure Box */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '16px',
                  backgroundColor: '#FAFAF7',
                  border: '1px solid #E4EAF0',
                  borderRadius: '12px',
                  padding: '18px',
                  marginBottom: '16px'
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#173B67', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Market Impact Forecast
                  </div>
                  <p style={{ fontSize: '13px', color: '#68768A', lineHeight: '1.5' }}>
                    {insight.strategicImpact}
                  </p>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#20A69A', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Recommended Countermeasure
                  </div>
                  <p style={{ fontSize: '13px', color: '#243247', fontWeight: 500, lineHeight: '1.5' }}>
                    {insight.suggestedAction}
                  </p>
                </div>
              </div>

              {/* Verified Source Evidence */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  paddingTop: '14px',
                  borderTop: '1px solid #E4EAF0',
                  fontSize: '13px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color="#20A69A" />
                  <span style={{ color: '#68768A' }}>
                    Evidence Source: <strong style={{ color: '#173B67' }}>{insight.sourceEvidence.sourceName}</strong> ({insight.sourceEvidence.observedValue})
                  </span>
                </div>

                <a
                  href={insight.sourceEvidence.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px', color: '#173B67' }}
                >
                  Inspect Source URL <ExternalLink size={12} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
