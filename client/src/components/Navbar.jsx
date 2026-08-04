import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  ShoppingBag,
  PlusCircle,
  ClipboardList,
  User,
  LogOut,
  Menu,
  X,
  Search
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isFarmer, isBuyer } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4.25rem'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary-700), var(--primary-500))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 10px rgba(5, 150, 105, 0.25)'
          }}>
            <Sprout size={24} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--primary-900)',
              letterSpacing: '-0.02em',
              display: 'block',
              lineHeight: 1.1
            }}>
              FarmDirect <span style={{ color: 'var(--accent-600)' }}>NG</span>
            </span>
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Farmer-to-Buyer Portal
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <Link to="/" style={{
            fontWeight: 600,
            fontSize: '0.9375rem',
            color: location.pathname === '/' ? 'var(--primary-700)' : 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem'
          }}>
            <Search size={18} />
            Marketplace
          </Link>

          {user && isBuyer && (
            <Link to="/my-orders" style={{
              fontWeight: 600,
              fontSize: '0.9375rem',
              color: location.pathname === '/my-orders' ? 'var(--primary-700)' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}>
              <ShoppingBag size={18} />
              My Orders
            </Link>
          )}

          {user && isFarmer && (
            <Link to="/farmer-dashboard" style={{
              fontWeight: 600,
              fontSize: '0.9375rem',
              color: location.pathname === '/farmer-dashboard' ? 'var(--primary-700)' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}>
              <ClipboardList size={18} />
              Farmer Portal
            </Link>
          )}
        </nav>

        {/* User Auth Buttons */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-auth">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                  {user.name}
                </div>
                <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end', marginTop: '2px' }}>
                  <span className="badge badge-available" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>
                    {user.role}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    📍 {user.state}
                  </span>
                </div>
              </div>

              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log out">
                <LogOut size={16} />
                Exit
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="btn btn-ghost btn-sm mobile-toggle"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: 'white',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.875rem',
          animation: 'fadeIn 200ms ease-out'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <Search size={18} /> Marketplace Feed
          </Link>

          {user && isBuyer && (
            <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <ShoppingBag size={18} /> My Orders
            </Link>
          )}

          {user && isFarmer && (
            <Link to="/farmer-dashboard" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <ClipboardList size={18} /> Farmer Dashboard
            </Link>
          )}

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{user.name} ({user.role})</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{user.email} • {user.state}, {user.lga}</div>
                </div>
                <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>
                  Log In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                  Register Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav, .desktop-auth { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
