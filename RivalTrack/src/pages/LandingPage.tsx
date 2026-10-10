import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { 
  ArrowRight, 
  TrendingDown, 
  Sparkles, 
  DollarSign, 
  Smartphone, 
  Megaphone, 
  Scan, 
  PenTool, 
  Link as LinkIcon, 
  Circle,
  Zap,
  Activity
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activePreviewTab, setActivePreviewTab] = useState<'overview' | 'pricing' | 'insights' | 'evidence'>('overview');

  const liveCompetitors = [
    { name: 'Motorola', product: 'Motorola Edge 50 Ultra', price: '₹89,999', change: '-10.0%', changeType: 'down', offer: 'Free Moto Buds+ (₹9,999 value) + ₹10,000 trade bonus' },
    { name: 'Apple', product: 'iPhone 16 Pro Max', price: '₹1,44,900', change: '0%', changeType: 'neutral', offer: 'HDFC Instant Cashback ₹6,000 + 6 Mo 0% No-Cost EMI' },
    { name: 'OnePlus', product: 'OnePlus 12 (512GB)', price: '₹69,999', change: '-12.5%', changeType: 'down', offer: 'Festive sale: ₹7,000 bank offer + ₹5,000 trade bump' },
    { name: 'Google Pixel', product: 'Pixel 9 Pro', price: '₹1,09,999', change: '-5.0%', changeType: 'down', offer: 'Free 12M Gemini Advanced + ₹10,000 ICICI discount' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF7', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          paddingTop: '64px',
          paddingBottom: '72px',
          backgroundColor: '#FAFAF7',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '980px' }}>
          {/* Eyebrow Label matching screenshot */}
          <div
            style={{
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#20A69A',
              marginBottom: '20px',
              fontFamily: 'var(--font-sans)'
            }}
          >
            AI-POWERED COMPETITIVE INTELLIGENCE
          </div>

          {/* Main Headline matching screenshot */}
          <h1
            style={{
              fontSize: 'clamp(38px, 6vw, 62px)',
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: '#173B67',
              fontFamily: 'var(--font-display)',
              marginBottom: '24px'
            }}
          >
            Stay Ahead of Your<br />Competition.
          </h1>

          {/* Supporting Copy matching screenshot */}
          <p
            style={{
              fontSize: 'clamp(16px, 2.2vw, 20px)',
              color: '#68768A',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto 36px',
              fontWeight: 400
            }}
          >
            Track competitor pricing, product updates, offers, and campaigns in one place. Turn market changes into clear insights and smarter business decisions.
          </p>

          {/* CTA Buttons matching screenshot */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '20px'
            }}
          >
            <Link
              to="/select-company"
              className="btn btn-primary"
              style={{
                fontSize: '16px',
                padding: '14px 28px',
                borderRadius: '8px',
                backgroundColor: '#173B67',
                boxShadow: '0 4px 14px rgba(23, 59, 103, 0.18)'
              }}
            >
              Explore RivalTrack <ArrowRight size={18} />
            </Link>

            <a
              href="#how-it-works"
              className="btn btn-secondary"
              style={{
                fontSize: '16px',
                padding: '14px 28px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4EAF0',
                color: '#243247'
              }}
            >
              See How It Works
            </a>
          </div>

          {/* Small Supporting Tagline matching screenshot */}
          <p style={{ fontSize: '14px', color: '#8F9CAE', fontWeight: 500 }}>
            One workspace. Clear insights. Smarter decisions.
          </p>
        </div>

        {/* Product Preview Card */}
        <div className="container" style={{ maxWidth: '1060px', marginTop: '56px' }}>
          <div
            className="card"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E4EAF0',
              boxShadow: '0 16px 40px -10px rgba(23, 59, 103, 0.08)',
              overflow: 'hidden',
              textAlign: 'left'
            }}
          >
            {/* Table Card Header with Live Telemetry Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 28px',
                borderBottom: '1px solid #E4EAF0',
                backgroundColor: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#173B67',
                    margin: 0
                  }}
                >
                  Competitor overview
                </h3>

                {/* Sub-tabs for full intelligence view */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setActivePreviewTab('overview')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor: activePreviewTab === 'overview' ? '#EEF4FA' : 'transparent',
                      color: activePreviewTab === 'overview' ? '#173B67' : '#68768A'
                    }}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActivePreviewTab('pricing')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor: activePreviewTab === 'pricing' ? '#EEF4FA' : 'transparent',
                      color: activePreviewTab === 'pricing' ? '#173B67' : '#68768A'
                    }}
                  >
                    Pricing Deltas
                  </button>
                  <button
                    onClick={() => setActivePreviewTab('insights')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor: activePreviewTab === 'insights' ? '#EEF4FA' : 'transparent',
                      color: activePreviewTab === 'insights' ? '#173B67' : '#68768A'
                    }}
                  >
                    AI Action Brief
                  </button>
                </div>
              </div>

              {/* Real-time verified live badge */}
              <span
                className="badge badge-teal"
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  padding: '5px 12px',
                  backgroundColor: '#E8F6F4',
                  color: '#20A69A',
                  border: '1px solid #B2E5E0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#20A69A' }} />
                REAL-TIME STREAM
              </span>
            </div>

            {/* Preview Content Area */}
            {activePreviewTab === 'overview' && (
              <div style={{ position: 'relative', overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '28%', paddingLeft: '28px' }}>Competitor</th>
                      <th style={{ width: '16%' }}>Price</th>
                      <th style={{ width: '18%' }}>Change</th>
                      <th style={{ width: '38%', paddingRight: '28px' }}>Offer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Rows */}
                    {liveCompetitors.map((comp, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx === 0 ? '#FCFDFE' : '#FFFFFF' }}>
                        <td style={{ paddingLeft: '28px' }}>
                          <div style={{ fontWeight: 600, color: '#173B67' }}>{comp.name}</div>
                          <div style={{ fontSize: '12px', color: '#68768A' }}>{comp.product}</div>
                        </td>
                        <td style={{ fontWeight: 700, color: '#243247' }}>{comp.price}</td>
                        <td>
                          {comp.changeType === 'down' ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10B981', fontWeight: 600, fontSize: '13px' }}>
                              <TrendingDown size={14} /> {comp.change}
                            </span>
                          ) : (
                            <span style={{ color: '#8F9CAE', fontSize: '13px', fontWeight: 500 }}>
                              {comp.change}
                            </span>
                          )}
                        </td>
                        <td style={{ paddingRight: '28px' }}>
                          <span style={{ fontSize: '13px', color: '#68768A' }}>
                            {comp.offer}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Floating Inspection Toolbar matching screenshot */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '18px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E4EAF0',
                    borderRadius: '9999px',
                    padding: '6px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    boxShadow: '0 6px 20px rgba(23, 59, 103, 0.1)',
                    zIndex: 10
                  }}
                >
                  <button title="Crop & Inspect" style={{ color: '#68768A', display: 'flex' }}><Scan size={15} /></button>
                  <button title="Text Recognition" style={{ color: '#68768A', display: 'flex' }}><PenTool size={15} /></button>
                  <button title="Source URL Link" style={{ color: '#68768A', display: 'flex' }}><LinkIcon size={15} /></button>
                  <button title="Highlight ROI" style={{ color: '#68768A', display: 'flex' }}><Circle size={15} /></button>
                  <span style={{ fontSize: '11px', color: '#8F9CAE', borderLeft: '1px solid #E4EAF0', paddingLeft: '10px' }}>
                    Live Source Inspector
                  </span>
                </div>
              </div>
            )}

            {activePreviewTab === 'pricing' && (
              <div style={{ padding: '28px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <div style={{ border: '1px solid #E4EAF0', borderRadius: '12px', padding: '18px', backgroundColor: '#FAFAF7' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#68768A', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Pricing Drop Alert • Motorola
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#173B67' }}>
                      ₹89,999 <span style={{ fontSize: '14px', color: '#8F9CAE', textDecoration: 'line-through' }}>₹99,999</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#68768A', marginTop: '6px' }}>
                      Detected on motorola.in. 125W TurboPower and Free Moto Buds+ bundle included.
                    </p>
                    <div style={{ marginTop: '12px', fontSize: '12px', color: '#20A69A', fontWeight: 600 }}>
                      Evidence confirmed: Live Cart Checkout Hook
                    </div>
                  </div>

                  <div style={{ border: '1px solid #E4EAF0', borderRadius: '12px', padding: '18px', backgroundColor: '#FAFAF7' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#68768A', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Pricing Drop Alert • OnePlus
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#173B67' }}>
                      ₹69,999 <span style={{ fontSize: '14px', color: '#8F9CAE', textDecoration: 'line-through' }}>₹79,999</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#68768A', marginTop: '6px' }}>
                      Detected on official oneplus.in/store. Valid across India stores.
                    </p>
                    <div style={{ marginTop: '12px', fontSize: '12px', color: '#20A69A', fontWeight: 600 }}>
                      Evidence confirmed: Cart checkout snippet #4492
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'insights' && (
              <div style={{ padding: '28px' }}>
                <div
                  style={{
                    backgroundColor: '#E8F6F4',
                    border: '1px solid #B2E5E0',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Sparkles size={16} color="#20A69A" />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#173B67', textTransform: 'uppercase' }}>
                      Live AI Threat Evaluation: High Urgency
                    </span>
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#173B67', marginBottom: '6px' }}>
                    Motorola Edge 50 Ultra Price Cut Directly Challenges Galaxy S24 Tier
                  </h4>
                  <p style={{ fontSize: '14px', color: '#243247', lineHeight: '1.5', marginBottom: '12px' }}>
                    Motorola is offering 16GB RAM, 125W fast charging, and real wood styling at ₹89,999, creating conversion pressure in unlocked retail channels.
                  </p>
                  <div style={{ padding: '10px 14px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #B2E5E0', fontSize: '13px' }}>
                    <strong style={{ color: '#173B67' }}>Recommended Response:</strong> Introduce targeted student/enterprise trade-in voucher of ₹5,000 on Galaxy S24 base models to mitigate migration.
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Card Footer */}
            <div
              style={{
                backgroundColor: '#EEF4FA',
                padding: '14px 28px',
                borderTop: '1px solid #E4EAF0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '13px',
                color: '#68768A'
              }}
            >
              <span>Continuously monitoring Motorola, Apple, OnePlus, and Google Pixel with multi-source validation.</span>
              <Link to="/select-company" style={{ color: '#173B67', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Open Live Dashboard <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Strip */}
      <section
        style={{
          borderTop: '1px solid #E4EAF0',
          borderBottom: '1px solid #E4EAF0',
          backgroundColor: '#FFFFFF',
          padding: '28px 0'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              textAlign: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#173B67', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Continuous Web Crawl
              </div>
              <div style={{ fontSize: '13px', color: '#68768A', marginTop: '4px' }}>
                Monitors public e-commerce stores & portals
              </div>
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#173B67', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Automated Price Deltas
              </div>
              <div style={{ fontSize: '13px', color: '#68768A', marginTop: '4px' }}>
                Detects discounts, vouchers, & trade-in bumps
              </div>
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#173B67', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Ad & Campaign Intel
              </div>
              <div style={{ fontSize: '13px', color: '#68768A', marginTop: '4px' }}>
                Monitors public ad archives & messaging hooks
              </div>
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#173B67', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Evidence-Backed AI
              </div>
              <div style={{ fontSize: '13px', color: '#68768A', marginTop: '4px' }}>
                Every recommendation links to verified URLs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Core Features Section */}
      <section id="features" style={{ padding: '80px 0', backgroundColor: '#FAFAF7' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 56px' }}>
            <span className="badge badge-teal" style={{ marginBottom: '12px' }}>
              INTELLIGENCE MODULES
            </span>
            <h2
              style={{
                fontSize: '34px',
                fontWeight: 800,
                color: '#173B67',
                fontFamily: 'var(--font-display)',
                marginBottom: '14px'
              }}
            >
              Built for Competitive Advantage
            </h2>
            <p style={{ fontSize: '16px', color: '#68768A', lineHeight: '1.6' }}>
              Replace fragmented manual spreadsheets with autonomous intelligence feeds designed for strategy and marketing leaders.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px'
            }}
          >
            {/* Feature 1 */}
            <div
              className="card"
              style={{
                padding: '32px 28px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#EEF4FA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <DollarSign size={22} color="#173B67" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#173B67', marginBottom: '10px' }}>
                Pricing & Offer Radar
              </h3>
              <p style={{ fontSize: '14px', color: '#68768A', lineHeight: '1.6' }}>
                Track real-time price reductions, trade-in allowances, 0% financing terms, and bundle promotions across competitor direct stores.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className="card"
              style={{
                padding: '32px 28px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#EEF4FA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <Smartphone size={22} color="#173B67" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#173B67', marginBottom: '10px' }}>
                Product & Spec Matrix
              </h3>
              <p style={{ fontSize: '14px', color: '#68768A', lineHeight: '1.6' }}>
                Compare chipsets, display technologies, camera sensors, battery capacities, and SKU configurations side-by-side with historical change tracking.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className="card"
              style={{
                padding: '32px 28px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#EEF4FA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <Megaphone size={22} color="#173B67" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#173B67', marginBottom: '10px' }}>
                Campaign Intelligence
              </h3>
              <p style={{ fontSize: '14px', color: '#68768A', lineHeight: '1.6' }}>
                Audit rival ad copies, marketing hooks, targeted customer segments, and estimated spend levels across digital platforms.
              </p>
            </div>

            {/* Feature 4 */}
            <div
              className="card"
              style={{
                padding: '32px 28px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#E8F6F4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <Sparkles size={22} color="#20A69A" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#173B67', marginBottom: '10px' }}>
                AI Action Recommender
              </h3>
              <p style={{ fontSize: '14px', color: '#68768A', lineHeight: '1.6' }}>
                Get synthesised strategic counter-measures generated by AI models trained on competitive dynamics, with citation links to the source page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '80px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid #E4EAF0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
            <span className="badge badge-teal" style={{ marginBottom: '12px' }}>
              METHODOLOGY
            </span>
            <h2
              style={{
                fontSize: '34px',
                fontWeight: 800,
                color: '#173B67',
                fontFamily: 'var(--font-display)',
                marginBottom: '14px'
              }}
            >
              How RivalTrack Operates
            </h2>
            <p style={{ fontSize: '16px', color: '#68768A', lineHeight: '1.6' }}>
              From public data collection to high-conviction decision making in four structured steps.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '32px'
            }}
          >
            {[
              {
                step: '01',
                title: 'Select Reference Entity',
                desc: 'Select your brand (Samsung, Apple, Motorola, OnePlus, Google Pixel). The platform automatically anchors rivals around your positioning.'
              },
              {
                step: '02',
                title: 'Continuous Observation',
                desc: 'Robots.txt compliant scrapers record product pages, pricing variations, seasonal trade-in terms, and ad copy releases.'
              },
              {
                step: '03',
                title: 'Delta & Anomaly Detection',
                desc: 'Historical databases compare current readings against benchmarks, flagging price drops, specs modifications, and flash discounts.'
              },
              {
                step: '04',
                title: 'AI Synthesis & Response',
                desc: 'Generate executive briefings with impact forecasts and recommended counter-promotions backed by verifiable evidence links.'
              }
            ].map(item => (
              <div key={item.step} style={{ textAlign: 'left' }}>
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    color: '#20A69A',
                    fontFamily: 'var(--font-display)',
                    marginBottom: '12px'
                  }}
                >
                  {item.step}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#173B67', marginBottom: '8px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#68768A', lineHeight: '1.6' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section
        style={{
          padding: '80px 0',
          backgroundColor: '#EEF4FA',
          borderTop: '1px solid #E4EAF0',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '720px' }}>
          <div className="badge badge-teal" style={{ marginBottom: '16px' }}>
            LIVE PROTOCOL
          </div>
          <h2
            style={{
              fontSize: '36px',
              fontWeight: 800,
              color: '#173B67',
              fontFamily: 'var(--font-display)',
              marginBottom: '16px'
            }}
          >
            Gain the Competitive Edge Today
          </h2>
          <p style={{ fontSize: '16px', color: '#68768A', lineHeight: '1.6', marginBottom: '32px' }}>
            Equip your product strategy and revenue teams with real-time rival intelligence and automated AI countermeasures.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link
              to="/select-company"
              className="btn btn-primary"
              style={{
                fontSize: '16px',
                padding: '14px 28px',
                borderRadius: '8px',
                boxShadow: '0 4px 14px rgba(23, 59, 103, 0.18)'
              }}
            >
              Launch Live Workspace <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="btn btn-secondary"
              style={{
                fontSize: '16px',
                padding: '14px 28px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4EAF0'
              }}
            >
              Sign In to Existing Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
