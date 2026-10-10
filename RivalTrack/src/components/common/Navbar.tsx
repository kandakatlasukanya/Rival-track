import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, User as UserIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Logo: React.FC<{ size?: number }> = ({ size = 32 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: '#173B67',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(23, 59, 103, 0.15)'
        }}
      >
        {/* Trend symbol in teal */}
        <svg
          width={size * 0.65}
          height={size * 0.65}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#20A69A"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      </div>
      <span
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#173B67',
          letterSpacing: '-0.02em',
          fontFamily: 'var(--font-display)'
        }}
      >
        RivalTrack
      </span>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useApp();
  const navigate = useNavigate();

  const handleNavClick = (anchorId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E4EAF0',
        height: '72px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo />
        </Link>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '32px'
          }}
          className="desktop-nav"
        >
          <button
            onClick={() => handleNavClick('product')}
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: '#68768A',
              transition: 'color 0.15s ease',
              padding: '4px 0'
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#173B67')}
            onMouseLeave={e => (e.currentTarget.style.color = '#68768A')}
          >
            Product
          </button>
          <button
            onClick={() => handleNavClick('features')}
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: '#68768A',
              transition: 'color 0.15s ease',
              padding: '4px 0'
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#173B67')}
            onMouseLeave={e => (e.currentTarget.style.color = '#68768A')}
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: '#68768A',
              transition: 'color 0.15s ease',
              padding: '4px 0'
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#173B67')}
            onMouseLeave={e => (e.currentTarget.style.color = '#68768A')}
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('about')}
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: '#68768A',
              transition: 'color 0.15s ease',
              padding: '4px 0'
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#173B67')}
            onMouseLeave={e => (e.currentTarget.style.color = '#68768A')}
          >
            About
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                Go to Workspace <ArrowRight size={15} />
              </button>
              <button
                onClick={logout}
                className="btn btn-ghost"
                style={{ fontSize: '13px' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#243247',
                  padding: '8px 12px',
                  transition: 'color 0.15s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#173B67')}
                onMouseLeave={e => (e.currentTarget.style.color = '#243247')}
              >
                Sign In
              </Link>
              <Link
                to="/select-company"
                className="btn btn-primary"
                style={{
                  backgroundColor: '#173B67',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(23, 59, 103, 0.15)'
                }}
              >
                Explore Platform
              </Link>
            </>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              display: 'none',
              padding: '6px',
              color: '#173B67',
              borderRadius: '6px',
              border: '1px solid #E4EAF0'
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '72px',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E4EAF0',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 8px 24px rgba(23, 59, 103, 0.08)'
          }}
        >
          <button
            onClick={() => handleNavClick('product')}
            style={{ textAlign: 'left', fontSize: '15px', fontWeight: 500, color: '#243247' }}
          >
            Product
          </button>
          <button
            onClick={() => handleNavClick('features')}
            style={{ textAlign: 'left', fontSize: '15px', fontWeight: 500, color: '#243247' }}
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            style={{ textAlign: 'left', fontSize: '15px', fontWeight: 500, color: '#243247' }}
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('about')}
            style={{ textAlign: 'left', fontSize: '15px', fontWeight: 500, color: '#243247' }}
          >
            About
          </button>
          <div style={{ height: '1px', backgroundColor: '#E4EAF0', margin: '4px 0' }} />
          <Link
            to="/login"
            style={{
              padding: '10px 0',
              fontWeight: 600,
              color: '#243247',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <UserIcon size={16} /> Sign In
          </Link>
          <Link
            to="/select-company"
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Explore Platform
          </Link>
        </div>
      )}

      {/* Embedded CSS for responsive desktop-nav vs mobile-toggle */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};
