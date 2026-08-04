import React from 'react';
import { Sprout, ShieldCheck, MapPin, PhoneCall } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--primary-900)',
      color: '#e2e8f0',
      paddingTop: '3rem',
      paddingBottom: '2rem',
      marginTop: '4rem',
      borderTop: '4px solid var(--accent-500)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <div style={{
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-500)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sprout size={20} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>
                FarmDirect NG
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Direct peer-to-peer agricultural produce exchange for Nigerian farmers, wholesale grain merchants, food processors, and market vendors.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ color: 'white', fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Platform Benefits
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--primary-500)" /> Zero Middlemen Commission
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--primary-500)" /> Coverage Across All 36 States & FCT
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PhoneCall size={16} color="var(--primary-500)" /> Verified Farmer Contact Info
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ color: 'white', fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Agricultural Hubs Covered
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Connecting buyers directly to farm gates in Kano (Kura Paddy), Benue (Gboko Yam & Sesame), Oyo (Ibadan Produce Hub), Kaduna (Grain Silos), and Plateau (Jos Vegetables).
            </p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.8125rem',
          color: '#94a3b8'
        }}>
          <div>© 2026 FarmDirect NG. Built for Nigerian Agriculture.</div>
          <div>React + Express + PostgreSQL MVP</div>
        </div>
      </div>
    </footer>
  );
}
