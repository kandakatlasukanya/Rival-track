import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Navbar';
import { Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E4EAF0',
        paddingTop: '64px',
        paddingBottom: '40px',
        marginTop: '80px'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '48px'
          }}
        >
          {/* Brand Info */}
          <div>
            <Logo size={28} />
            <p
              style={{
                fontSize: '14px',
                color: '#68768A',
                marginTop: '16px',
                lineHeight: '1.6',
                maxWidth: '300px'
              }}
            >
              Enterprise-grade AI competitive intelligence platform. Track rival prices, specs, promotions, and ad campaigns with verified source evidence.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '20px',
                padding: '6px 12px',
                borderRadius: '9999px',
                backgroundColor: '#EEF4FA',
                fontSize: '12px',
                fontWeight: 600,
                color: '#173B67'
              }}
            >
              <Shield size={14} color="#20A69A" /> SOC2 Type II Certified & Compliant
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#243247',
                marginBottom: '16px'
              }}
            >
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link to="/pricing" style={{ fontSize: '14px', color: '#68768A', transition: 'color 0.15s' }}>
                  Pricing & Offers Tracker
                </Link>
              </li>
              <li>
                <Link to="/products" style={{ fontSize: '14px', color: '#68768A', transition: 'color 0.15s' }}>
                  Hardware Spec Matrix
                </Link>
              </li>
              <li>
                <Link to="/campaigns" style={{ fontSize: '14px', color: '#68768A', transition: 'color 0.15s' }}>
                  Ad & Social Intelligence
                </Link>
              </li>
              <li>
                <Link to="/insights" style={{ fontSize: '14px', color: '#68768A', transition: 'color 0.15s' }}>
                  Evidence-Backed AI Insights
                </Link>
              </li>
              <li>
                <Link to="/changelog" style={{ fontSize: '14px', color: '#68768A', transition: 'color 0.15s' }}>
                  Audit Trail & Update Log
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions & Industries */}
          <div>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#243247',
                marginBottom: '16px'
              }}
            >
              Target Industries
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <span style={{ fontSize: '14px', color: '#243247', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={13} color="#20A69A" /> Smartphones & Mobile (Live)
                </span>
              </li>
              <li>
                <span style={{ fontSize: '14px', color: '#8F9CAE' }}>Consumer Electronics (Preview)</span>
              </li>
              <li>
                <span style={{ fontSize: '14px', color: '#8F9CAE' }}>Automotive & EV</span>
              </li>
              <li>
                <span style={{ fontSize: '14px', color: '#8F9CAE' }}>B2B SaaS & Cloud</span>
              </li>
            </ul>
          </div>

          {/* Compliance & Trust */}
          <div>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#243247',
                marginBottom: '16px'
              }}
            >
              Governance & Security
            </h4>
            <p style={{ fontSize: '13px', color: '#68768A', lineHeight: '1.6', marginBottom: '12px' }}>
              RivalTrack only monitors verified public data endpoints, robots.txt-compliant public domain portals, and audited ad archives.
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#68768A' }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid #E4EAF0',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '13px',
            color: '#8F9CAE'
          }}
        >
          <div>
            © 2026 RivalTrack Intelligence Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>One workspace. Clear insights. Smarter decisions.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
