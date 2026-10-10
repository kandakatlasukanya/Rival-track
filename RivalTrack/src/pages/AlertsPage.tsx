import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AlertsPage: React.FC = () => {
  const { alerts, markAlertAsRead, markAllAlertsAsRead } = useApp();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-teal" style={{ marginBottom: '8px' }}>
            NOTIFICATION FEED & THREAT SIGNALS
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
            Alerts & Notifications
          </h1>
          <p style={{ fontSize: '14px', color: '#68768A' }}>
            Automated alerts triggered by rival price cuts, promotional launches, and marketing spikes.
          </p>
        </div>

        <button
          onClick={markAllAlertsAsRead}
          className="btn btn-secondary"
          style={{ fontSize: '13px', padding: '8px 16px' }}
        >
          <CheckCheck size={16} /> Mark All as Read
        </button>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {alerts.map(alert => {
            const isUrgent = alert.severity === 'urgent';
            const isWarning = alert.severity === 'warning';

            return (
              <div
                key={alert.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: alert.read ? '#FAFAF7' : '#FFFFFF',
                  border: alert.read ? '1px solid #E4EAF0' : '1px solid #B2E5E0',
                  borderRadius: '10px',
                  boxShadow: alert.read ? 'none' : 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: isUrgent ? '#FEF2F2' : isWarning ? '#FFFBEB' : '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {isUrgent ? (
                      <AlertTriangle size={18} color="#EF4444" />
                    ) : (
                      <Info size={18} color={isWarning ? '#F59E0B' : '#3B82F6'} />
                    )}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: '#173B67', fontSize: '14px' }}>
                        {alert.title}
                      </span>
                      <span className="badge badge-navy" style={{ fontSize: '10px' }}>
                        {alert.targetCompany}
                      </span>
                      {!alert.read && (
                        <span className="badge badge-teal" style={{ fontSize: '10px' }}>
                          NEW
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '13px', color: '#68768A' }}>
                      {alert.message}
                    </p>
                    <span style={{ fontSize: '11px', color: '#8F9CAE', marginTop: '4px', display: 'block' }}>
                      {alert.timestamp}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Link
                    to={alert.link}
                    className="btn btn-primary"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    View <ArrowRight size={12} />
                  </Link>
                  {!alert.read && (
                    <button
                      onClick={() => markAlertAsRead(alert.id)}
                      className="btn btn-ghost"
                      style={{ fontSize: '12px' }}
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
