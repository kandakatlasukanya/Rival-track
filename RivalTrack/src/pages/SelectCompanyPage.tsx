import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/common/Navbar';
import { useApp } from '../context/AppContext';
import { Check, ArrowRight, Shield, Layers, HelpCircle } from 'lucide-react';

export const SelectCompanyPage: React.FC = () => {
  const { companies, referenceCompany, setReferenceCompanyById } = useApp();
  const [selectedId, setSelectedId] = useState<string>(referenceCompany.id);
  const navigate = useNavigate();

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleConfirm = () => {
    setReferenceCompanyById(selectedId);
    navigate('/dashboard');
  };

  const currentSelection = companies.find(c => c.id === selectedId) || companies[0];
  const rivals = companies.filter(c => c.id !== selectedId);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FAFAF7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 20px'
      }}
    >
      <div style={{ marginBottom: '32px' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo size={36} />
        </Link>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4EAF0',
          borderRadius: '16px',
          boxShadow: '0 8px 30px -4px rgba(23, 59, 103, 0.08)',
          padding: '40px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div
            className="badge badge-teal"
            style={{ marginBottom: '12px', fontSize: '11px', letterSpacing: '0.08em' }}
          >
            STEP 1 • ENTERPRISE SETUP
          </div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#173B67',
              fontFamily: 'var(--font-display)',
              marginBottom: '8px'
            }}
          >
            Which company do you represent?
          </h1>
          <p style={{ fontSize: '15px', color: '#68768A', maxWidth: '580px', margin: '0 auto' }}>
            Choose your organization. Your selected brand anchors the benchmark intelligence, while the other {companies.length - 1} brands will be continuously tracked as your active rivals.
          </p>
        </div>

        {/* Company Card Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '36px'
          }}
        >
          {companies.map(c => {
            const isSelected = c.id === selectedId;
            return (
              <div
                key={c.id}
                onClick={() => handleSelect(c.id)}
                style={{
                  border: isSelected ? '2px solid #173B67' : '1px solid #E4EAF0',
                  borderRadius: '12px',
                  padding: '20px',
                  backgroundColor: isSelected ? '#F4F8FC' : '#FFFFFF',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 14px rgba(23, 59, 103, 0.1)' : 'none'
                }}
              >
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#173B67',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Check size={14} />
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: '#EEF4FA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#173B67'
                    }}
                  >
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#173B67' }}>
                      {c.name}
                    </h3>
                    <span style={{ fontSize: '12px', color: '#68768A' }}>
                      {c.headquarters}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid #E4EAF0',
                    fontSize: '12px',
                    color: '#68768A'
                  }}
                >
                  <span>Global Share: <strong style={{ color: '#243247' }}>{c.marketShare}%</strong></span>
                  <span>SKUs: <strong style={{ color: '#243247' }}>{c.productCount}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Summary Preview */}
        <div
          style={{
            backgroundColor: '#FAFAF7',
            border: '1px solid #E4EAF0',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '32px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Layers size={18} color="#20A69A" />
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#173B67' }}>
              Configured Intelligence Matrix
            </h4>
          </div>
          <div style={{ fontSize: '13px', color: '#68768A', lineHeight: '1.6' }}>
            Reference Entity: <strong style={{ color: '#173B67' }}>{currentSelection.name}</strong>
            <br />
            Tracked Competitors: {rivals.map(r => r.name).join(', ')} ({rivals.length} continuous crawlers active)
          </div>
        </div>

        {/* Confirm action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <Link to="/" style={{ fontSize: '14px', color: '#68768A', textDecoration: 'none' }}>
            ← Cancel and Return Home
          </Link>
          <button
            onClick={handleConfirm}
            className="btn btn-primary"
            style={{
              padding: '12px 28px',
              fontSize: '15px',
              borderRadius: '8px'
            }}
          >
            Launch {currentSelection.name} Workspace <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
