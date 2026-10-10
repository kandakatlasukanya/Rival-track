import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GitCompareArrows,
  DollarSign, 
  History, 
  Sparkles, 
  Bell, 
  Settings, 
  LogOut, 
  RefreshCw,
  ChevronDown,
  Building2,
  Zap,
  Play,
  Pause,
  Megaphone,
  X
} from 'lucide-react';
import { Logo } from './Navbar';
import { useApp } from '../../context/AppContext';

// Add Competitor Modal Component
const AddCompetitorModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addCompetitor } = useApp();
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [headquarters, setHq] = useState('');
  const [urlError, setUrlError] = useState('');
  const [saved, setSaved] = useState(false);

  const validateUrl = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    const finalUrl = website.startsWith('http') ? website : `https://${website}`;
    if (website && !validateUrl(website)) {
      setUrlError('Please enter a valid website URL.');
      return;
    }
    setUrlError('');

    addCompetitor({
      name: name.trim(),
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      logo: '',
      isReference: false,
      marketShare: 0,
      productCount: 0,
      activeOffersCount: 0,
      lastMonitored: 'Not yet monitored',
      status: 'active',
      headquarters: headquarters.trim() || 'Unknown',
      website: finalUrl || '#',
      primaryColor: '#173B67'
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  return (
    <div 
      style={{ 
        position: 'fixed', inset: 0, backgroundColor: 'rgba(23, 59, 103, 0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        style={{ 
          backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', 
          width: '480px', maxWidth: '95vw', boxShadow: '0 24px 64px rgba(23, 59, 103, 0.2)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#173B67' }}>Add Competitor</h2>
            <p style={{ fontSize: '13px', color: '#68768A', marginTop: '4px' }}>Track a new competitor brand in this workspace.</p>
          </div>
          <button onClick={onClose} style={{ color: '#68768A', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {saved ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#10B981', fontWeight: 600 }}>
            ✓ Competitor added successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Vivo, Realme, Nothing"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Official Website</label>
              <input
                className="form-input"
                value={website}
                onChange={e => { setWebsite(e.target.value); setUrlError(''); }}
                placeholder="e.g. https://www.vivo.com/in"
              />
              {urlError && <span style={{ fontSize: '12px', color: '#EF4444' }}>{urlError}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Headquarters</label>
              <input
                className="form-input"
                value={headquarters}
                onChange={e => setHq(e.target.value)}
                placeholder="e.g. Shenzhen, China"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Add Competitor</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export const AppLayout: React.FC = () => {
  const { 
    referenceCompany, 
    competitors,
    companies, 
    setReferenceCompanyById, 
    user, 
    logout, 
    alerts, 
    runIntelligenceScan, 
    isScanning,
    isLiveStreaming,
    toggleLiveStream,
    lastTelemetryEvent,
    triggerInstantLiveUpdate,
    liveEventCount,
    lastRefreshTime
  } = useApp();

  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadAlertsCount = alerts.filter(a => !a.read).length;

  // Required 7 primary navigation items
  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/competitors', label: 'Competitors', icon: Users, badge: `${competitors.length}` },
    { path: '/products', label: 'Comparisons', icon: GitCompareArrows },
    { path: '/pricing', label: 'Price & Offers', icon: DollarSign },
    { path: '/changelog', label: 'Change History', icon: History, badge: liveEventCount > 0 ? `${liveEventCount}` : undefined },
    { path: '/insights', label: 'AI Insights', icon: Sparkles, highlight: true },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCompanyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelectCompany = (id: string) => {
    setReferenceCompanyById(id);
    setCompanyDropdownOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FAFAF7' }}>
      {/* Top Application Header */}
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 40, height: '64px',
          backgroundColor: '#FFFFFF', borderBottom: '1px solid #E4EAF0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Logo size={28} />
          </Link>

          <div style={{ height: '24px', width: '1px', backgroundColor: '#E4EAF0' }} />

          {/* Reference Company Switcher */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px',
                backgroundColor: '#EEF4FA', border: '1px solid #D9E4EF', borderRadius: '8px',
                color: '#173B67', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
              }}
            >
              <Building2 size={15} color="#20A69A" />
              <span>Tracking: <strong>{referenceCompany.name}</strong></span>
              <ChevronDown size={14} style={{ transition: 'transform 0.15s', transform: companyDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>

            {companyDropdownOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, marginTop: '8px',
                backgroundColor: '#FFFFFF', border: '1px solid #E4EAF0', borderRadius: '10px',
                boxShadow: '0 10px 25px rgba(23, 59, 103, 0.12)', width: '260px', padding: '8px', zIndex: 50
              }}>
                <div style={{ padding: '6px 8px', fontSize: '11px', fontWeight: 700, color: '#68768A', textTransform: 'uppercase' }}>
                  Switch Baseline Brand
                </div>
                {companies.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCompany(c.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 10px', borderRadius: '6px',
                      backgroundColor: c.id === referenceCompany.id ? '#EEF4FA' : 'transparent',
                      color: c.id === referenceCompany.id ? '#173B67' : '#243247',
                      fontSize: '13px', fontWeight: c.id === referenceCompany.id ? 700 : 500,
                      textAlign: 'left', cursor: 'pointer'
                    }}
                  >
                    <span>{c.name}</span>
                    {c.id === referenceCompany.id && (
                      <span className="badge badge-teal" style={{ fontSize: '10px', padding: '2px 6px' }}>Baseline</span>
                    )}
                  </button>
                ))}
                <div style={{ borderTop: '1px solid #E4EAF0', marginTop: '6px', paddingTop: '6px' }}>
                  <button
                    onClick={() => { setCompanyDropdownOpen(false); setShowAddModal(true); }}
                    style={{ width: '100%', padding: '6px 10px', fontSize: '12px', color: '#20A69A', fontWeight: 600, textAlign: 'left' }}
                  >
                    + Add New Competitor →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right workspace actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Status Badge */}
          <span style={{
            fontSize: '12px', color: '#68768A', display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 10px', backgroundColor: '#FAFAF7', border: '1px solid #E4EAF0', borderRadius: '6px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#20A69A' }} />
            <span>Market Intelligence Feed • {lastRefreshTime}</span>
          </span>

          {/* Refresh Data */}
          <button
            onClick={triggerInstantLiveUpdate}
            className="btn btn-secondary"
            style={{
              padding: '7px 13px', fontSize: '12px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
            title="Update dashboard data"
          >
            <RefreshCw size={13} color="#20A69A" />
            <span>Refresh Data</span>
          </button>

          {/* AI Scan */}
          <button
            onClick={runIntelligenceScan}
            disabled={isScanning}
            className="btn btn-primary"
            style={{ padding: '7px 14px', fontSize: '13px', fontWeight: 600, gap: '6px' }}
          >
            <Sparkles size={14} color="#20A69A" />
            <span>{isScanning ? 'Analyzing...' : 'AI Scan'}</span>
            {isScanning && <RefreshCw size={13} className="spin-animation" />}
          </button>

          {/* Alerts Bell */}
          <Link
            to="/changelog"
            style={{
              position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '36px', height: '36px', borderRadius: '8px',
              backgroundColor: '#FFFFFF', border: '1px solid #E4EAF0', color: '#243247'
            }}
            title="View Change Log & Alerts"
          >
            <Bell size={17} />
            {unreadAlertsCount > 0 && (
              <span style={{
                position: 'absolute', top: '-3px', right: '-3px', backgroundColor: '#EF4444',
                color: '#FFFFFF', fontSize: '10px', fontWeight: 700, width: '16px', height: '16px',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {unreadAlertsCount}
              </span>
            )}
          </Link>

          <div style={{ height: '20px', width: '1px', backgroundColor: '#E4EAF0' }} />

          {/* User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#173B67',
              color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '13px'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#243247', lineHeight: '1.2' }}>
                {user?.name || 'Intelligence Lead'}
              </span>
              <span style={{ fontSize: '11px', color: '#68768A' }}>
                {referenceCompany.name}
              </span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              style={{ color: '#68768A', padding: '4px', borderRadius: '6px', border: 'none', background: 'none', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
              onMouseLeave={e => (e.currentTarget.style.color = '#68768A')}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <aside style={{
          width: '220px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E4EAF0',
          padding: '20px 14px', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', flexShrink: 0
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{
              padding: '4px 12px 10px', fontSize: '11px', fontWeight: 700,
              color: '#8F9CAE', letterSpacing: '0.06em', textTransform: 'uppercase'
            }}>
              Intelligence Suite
            </div>
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 12px', borderRadius: '8px', fontSize: '13.5px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#173B67' : '#68768A',
                    backgroundColor: isActive ? '#EEF4FA' : 'transparent',
                    textDecoration: 'none', transition: 'all 0.15s ease'
                  })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={16} color={item.highlight ? '#20A69A' : undefined} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{
                      padding: '2px 7px', fontSize: '11px', fontWeight: 700, borderRadius: '9999px',
                      backgroundColor: item.highlight ? '#E8F6F4' : '#E4EAF0',
                      color: item.highlight ? '#20A69A' : '#173B67'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Bottom Status */}
          <div style={{
            padding: '12px', backgroundColor: '#FAFAF7', borderRadius: '10px',
            border: '1px solid #E4EAF0', fontSize: '12px', color: '#68768A'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#173B67', fontWeight: 600, marginBottom: '4px' }}>
              <Building2 size={13} color="#20A69A" />
              <span>{referenceCompany.name} Workspace</span>
            </div>
            <div>Tracking {competitors.length} competitors ({competitors.map(c => c.name).join(', ')}).</div>
            <div style={{ marginTop: '8px', fontSize: '11px', color: '#20A69A', fontWeight: 600 }}>
              Official Store Adapters Active
            </div>
          </div>
        </aside>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto', minWidth: 0 }}>
          <Outlet />
        </main>
      </div>

      {/* Add Competitor Modal */}
      {showAddModal && <AddCompetitorModal onClose={() => setShowAddModal(false)} />}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes livePulse {
          0% { background-color: rgba(32, 166, 154, 0.15); }
          100% { background-color: transparent; }
        }
        .row-updated-flash { animation: livePulse 2.5s ease-out; }
        
        aside a:hover {
          background-color: #F4F7FA !important;
          color: #173B67 !important;
        }
      `}</style>
    </div>
  );
};
