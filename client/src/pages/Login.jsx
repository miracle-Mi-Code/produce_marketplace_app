import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const expired = searchParams.get('expired');
  const redirect = searchParams.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (redirect === 'listing') {
        const id = searchParams.get('id');
        navigate(`/?listingId=${id}`);
      } else if (loggedUser.role === 'farmer') {
        navigate('/farmer-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <main className="container animate-fade-in" style={{ padding: '3rem 1rem', maxWidth: '30rem' }}>
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '3.25rem',
            height: '3.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary-700), var(--primary-500))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            margin: '0 auto 0.75rem',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
          }}>
            <Sprout size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-900)' }}>
            Welcome Back to FarmDirect
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Log in to manage produce listings, track orders & connect
          </p>
        </div>

        {expired && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>Your session expired. Please log in again to continue.</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. musa@farmer.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.75rem' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'} <LogIn size={18} />
          </button>
        </form>

        {/* Demo Accounts Quick Login Panel */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--border-light)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.625rem', textAlign: 'center' }}>
            TEST DEMO ACCOUNTS (Password: password123)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <button
              onClick={() => fillDemoAccount('musa@farmer.ng')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', fontSize: '0.8125rem' }}
            >
              <span>🌾 Musa Ibrahim (Kano Farmer)</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-700)', fontWeight: 600 }}>Fill</span>
            </button>
            <button
              onClick={() => fillDemoAccount('nkechi@buyer.ng')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', fontSize: '0.8125rem' }}
            >
              <span>🛒 Nkechi Okonkwo (Lagos Buyer)</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-700)', fontWeight: 600 }}>Fill</span>
            </button>
            <button
              onClick={() => fillDemoAccount('amina@agrideal.ng')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', fontSize: '0.8125rem' }}
            >
              <span>🌾🛒 Amina Bello (Farmer & Buyer)</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-700)', fontWeight: 600 }}>Fill</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--primary-700)', fontWeight: 700 }}>
            Register Free
          </Link>
        </div>
      </div>
    </main>
  );
}
