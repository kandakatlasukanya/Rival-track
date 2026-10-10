import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Globe, Clock, ShieldCheck, Check, Save, Wifi, AlertTriangle } from 'lucide-react';
import { testSupabaseConnection, isSupabaseConfigured } from '../lib/supabase';

export const SettingsPage: React.FC = () => {
  const { referenceCompany, companies, setReferenceCompanyById, supabaseKeyStatus } = useApp();
  const [cadence, setCadence] = useState('hourly');
  const [industry, setIndustry] = useState('smartphones');
  const [savedNotice, setSavedNotice] = useState(false);
  const [connTestResult, setConnTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testingConn, setTestingConn] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleTestConnection = async () => {
    setTestingConn(true);
    setConnTestResult(null);
    const result = await testSupabaseConnection();
    setConnTestResult(result);
    setTestingConn(false);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div className="badge badge-teal" style={{ marginBottom: '8px' }}>
          WORKSPACE PREFERENCES
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
          Platform Settings
        </h1>
        <p style={{ fontSize: '14px', color: '#68768A' }}>
          Configure enterprise monitoring parameters, crawler scheduling, and intelligence endpoints.
        </p>
      </div>

      {savedNotice && (
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '8px',
            color: '#065F46',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}
        >
          <Check size={16} /> Preferences successfully updated.
        </div>
      )}

      <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Reference Entity */}
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '14px' }}>
            Reference Organization
          </label>
          <p style={{ fontSize: '12px', color: '#68768A', marginBottom: '8px' }}>
            This enterprise serves as the baseline company against which all rivals are measured.
          </p>
          <select
            value={referenceCompany.id}
            onChange={e => setReferenceCompanyById(e.target.value)}
            className="form-input"
            style={{ fontWeight: 600, color: '#173B67' }}
          >
            {companies.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.headquarters})
              </option>
            ))}
          </select>
        </div>

        {/* Industry Domain */}
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '14px' }}>
            Benchmark Industry Domain
          </label>
          <p style={{ fontSize: '12px', color: '#68768A', marginBottom: '8px' }}>
            Sets the target taxonomy, specification templates, and catalog scrapers.
          </p>
          <select
            value={industry}
            onChange={e => setIndustry(e.target.value)}
            className="form-input"
          >
            <option value="smartphones">Smartphones & Mobile Devices (Live Benchmark)</option>
            <option value="electronics" disabled>Consumer Electronics & Laptops (Coming soon)</option>
            <option value="automotive" disabled>Automotive & Connected EV (Coming soon)</option>
            <option value="b2b" disabled>B2B SaaS & Cloud Computing (Coming soon)</option>
          </select>
        </div>

        {/* Crawling Schedule */}
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '14px' }}>
            Crawler Frequency & Polling Interval
          </label>
          <select
            value={cadence}
            onChange={e => setCadence(e.target.value)}
            className="form-input"
          >
            <option value="realtime">Continuous Stream (Webhooks + 15 min poll)</option>
            <option value="hourly">Hourly Deep Scan (Default recommended)</option>
            <option value="daily">Daily Executive Snapshot</option>
          </select>
        </div>

        {/* Security & Data governance */}
        <div
          style={{
            padding: '16px',
            backgroundColor: '#FAFAF7',
            borderRadius: '10px',
            border: '1px solid #E4EAF0',
            fontSize: '13px',
            color: '#68768A'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#173B67', fontWeight: 700, marginBottom: '6px' }}>
            <ShieldCheck size={16} color="#20A69A" />
            Compliance & Evidence Verification
          </div>
          Every scraped price point, promotional banner, and ad snippet is cryptographically hashed with timestamp and archive URL for audit trail verification.
        </div>

        {/* Supabase Integration & Seeding Controls */}
        <div
          style={{
            padding: '18px',
            backgroundColor: '#EEF4FA',
            border: '1px solid #D9E4EF',
            borderRadius: '10px'
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#173B67', marginBottom: '4px' }}>
            Supabase Project Database Sync
          </div>
          <p style={{ fontSize: '12px', color: '#68768A', marginBottom: '4px' }}>
            Project URL: <code>https://swngacujdrtdlfwjaepx.supabase.co</code>
          </p>
          <p style={{ fontSize: '12px', marginBottom: '12px' }}>
            <span style={{ color: supabaseKeyStatus.startsWith('✓') ? '#10B981' : '#F59E0B', fontWeight: 600 }}>
              {supabaseKeyStatus}
            </span>
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleTestConnection}
              disabled={testingConn}
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Wifi size={13} />
              {testingConn ? 'Testing...' : 'Test Connection'}
            </button>

            <button
              onClick={async () => {
                const { seedSupabaseBaselineData } = await import('../services/db');
                const result = await seedSupabaseBaselineData();
                alert(result.message);
              }}
              className="btn btn-primary"
              style={{ fontSize: '12px', padding: '8px 14px' }}
            >
              ⚡ Populate Supabase Database Rows
            </button>
          </div>

          {connTestResult && (
            <div
              style={{
                marginTop: '12px',
                padding: '10px 14px',
                backgroundColor: connTestResult.success ? '#ECFDF5' : '#FEF2F2',
                border: `1px solid ${connTestResult.success ? '#A7F3D0' : '#FECACA'}`,
                borderRadius: '8px',
                fontSize: '12.5px',
                color: connTestResult.success ? '#065F46' : '#991B1B',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}
            >
              {connTestResult.success ? <Check size={14} style={{ flexShrink: 0, marginTop: '2px' }} /> : <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />}
              <span>{connTestResult.message}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          className="btn btn-primary"
          style={{ padding: '10px 20px', alignSelf: 'flex-start' }}
        >
          <Save size={15} /> Save Settings
        </button>
      </div>
    </div>
  );
};
