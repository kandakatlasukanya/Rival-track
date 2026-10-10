import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/common/Navbar';
import { useApp } from '../context/AppContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, setReferenceCompanyById } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your work email.');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      login(email);
      setIsLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  const handleQuickLogin = (userEmail: string, companyId: string, roleName: string) => {
    setIsLoading(true);
    setReferenceCompanyById(companyId);
    setTimeout(() => {
      login(userEmail, roleName);
      setIsLoading(false);
      navigate('/dashboard');
    }, 300);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FAFAF7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px'
      }}
    >
      {/* Brand Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
          <Logo size={36} />
        </Link>
      </div>

      {/* Main Login Card */}
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px 36px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4EAF0',
          borderRadius: '16px',
          boxShadow: '0 8px 30px -4px rgba(23, 59, 103, 0.08)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#173B67',
              fontFamily: 'var(--font-display)',
              marginBottom: '8px'
            }}
          >
            Sign in to RivalTrack
          </h1>
          <p style={{ fontSize: '14px', color: '#68768A', lineHeight: '1.5' }}>
            Enterprise competitive intelligence & automated market change tracking.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              color: '#B91C1C',
              fontSize: '13px',
              marginBottom: '20px'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Work Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '38px' }}
                autoComplete="email"
              />
              <Mail
                size={16}
                color="#8F9CAE"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <a
                href="#forgot"
                onClick={e => {
                  e.preventDefault();
                  alert('Use one-click authenticated profile access below.');
                }}
                style={{ fontSize: '12px', color: '#20A69A', fontWeight: 600 }}
              >
                Forgot password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '38px' }}
                autoComplete="current-password"
              />
              <Lock
                size={16}
                color="#8F9CAE"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#243247' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                style={{ accentColor: '#173B67' }}
              />
              Remember this device
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              padding: '12px',
              fontSize: '15px',
              fontWeight: 600,
              width: '100%',
              borderRadius: '8px',
              marginTop: '4px'
            }}
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Workspace'}
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Quick Enterprise Role Access */}
        <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid #E4EAF0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#68768A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Quick-Access Enterprise Profiles
            </span>
            <span className="badge badge-teal" style={{ fontSize: '10px' }}>
              <Sparkles size={10} /> Live
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('alex.strat@samsung.corp', 'samsung', 'Alex Rivera (Samsung Strategy Lead)')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: '#EEF4FA',
                border: '1px solid #DCE6F1',
                fontSize: '12px',
                fontWeight: 600,
                color: '#173B67',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={14} color="#173B67" />
                <span>Samsung Lead • Tracking Motorola, Apple & rivals</span>
              </div>
              <ArrowRight size={13} />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('marcus.intel@motorola.corp', 'motorola', 'Marcus Vance (Motorola Strategy Director)')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: '#FAFAF7',
                border: '1px solid #E4EAF0',
                fontSize: '12px',
                fontWeight: 600,
                color: '#243247',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={14} color="#20A69A" />
                <span>Motorola Lead • Tracking Samsung & rivals</span>
              </div>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Company onboarding prompt */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '13px', color: '#68768A' }}>
            New organization?{' '}
            <Link to="/select-company" style={{ color: '#20A69A', fontWeight: 600 }}>
              Setup your company tracker
            </Link>
          </span>
        </div>
      </div>

      {/* Trust & Back link */}
      <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px', color: '#68768A' }}>
        <Link to="/" style={{ color: '#173B67', fontWeight: 500 }}>
          ← Back to Homepage
        </Link>
        <span>•</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={14} color="#20A69A" /> 256-bit Encrypted Session
        </span>
      </div>
    </div>
  );
};
