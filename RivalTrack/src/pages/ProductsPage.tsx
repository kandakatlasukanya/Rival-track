import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../types';
import { Smartphone, Check, ExternalLink, Cpu, HardDrive, Camera, Battery } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { referenceCompany, competitors, products } = useApp();
  const [selectedSegment, setSelectedSegment] = useState<string>('All');

  const filteredProducts = selectedSegment === 'All'
    ? products
    : products.filter(p => p.segment === selectedSegment);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-teal" style={{ marginBottom: '8px' }}>
            HARDWARE SPECIFICATION MATRIX
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
            Product & Spec Comparison
          </h1>
          <p style={{ fontSize: '14px', color: '#68768A' }}>
            Benchmarking {referenceCompany.name} hardware against rival flagship specifications and price tiers.
          </p>
        </div>

        {/* Filter Segment */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Ultra Premium', 'Flagship', 'Foldable'].map(seg => (
            <button
              key={seg}
              onClick={() => setSelectedSegment(seg)}
              className="btn"
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                backgroundColor: selectedSegment === seg ? '#173B67' : '#FFFFFF',
                color: selectedSegment === seg ? '#FFFFFF' : '#243247',
                border: '1px solid #E4EAF0'
              }}
            >
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="data-table" style={{ width: '100%', minWidth: '880px' }}>
          <thead>
            <tr>
              <th style={{ width: '22%' }}>Device & Brand</th>
              <th style={{ width: '16%' }}>Price (Observed)</th>
              <th style={{ width: '18%' }}>SoC Processor</th>
              <th style={{ width: '16%' }}>RAM & Storage</th>
              <th style={{ width: '18%' }}>Camera Setup</th>
              <th style={{ width: '10%' }}>Battery & Charging</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(prod => {
              const isRef = prod.companyId === referenceCompany.id;
              const company = isRef ? referenceCompany : competitors.find(c => c.id === prod.companyId);

              return (
                <tr
                  key={prod.id}
                  style={{
                    backgroundColor: isRef ? '#F6F9FD' : '#FFFFFF'
                  }}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Smartphone size={16} color={isRef ? '#173B67' : '#20A69A'} />
                      <span style={{ fontWeight: 700, color: '#173B67' }}>{prod.name}</span>
                      <a
                        href={prod.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`View official ${prod.name} page`}
                        style={{ color: '#68768A', display: 'inline-flex', alignItems: 'center' }}
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#68768A' }}>{company?.name}</span>
                      {isRef && (
                        <span className="badge badge-teal" style={{ fontSize: '10px', padding: '1px 6px' }}>
                          Your Reference
                        </span>
                      )}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#173B67' }}>
                      {formatINR(prod.currentPrice)}
                    </div>
                    {prod.currentPrice < prod.msrp ? (
                      <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                        -{formatINR(prod.msrp - prod.currentPrice)} promo
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#8F9CAE' }}>MSRP {formatINR(prod.msrp)}</span>
                    )}
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#243247' }}>
                      <Cpu size={14} color="#68768A" />
                      <span>{prod.soc}</span>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#243247' }}>
                      <HardDrive size={14} color="#68768A" />
                      <span>{prod.ramStorage}</span>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: '#243247' }}>
                      <Camera size={14} color="#68768A" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{prod.camera}</span>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#243247' }}>
                      <Battery size={14} color="#68768A" />
                      <span>{prod.battery}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
