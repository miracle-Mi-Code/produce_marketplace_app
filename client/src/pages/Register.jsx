import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Sprout, UserPlus, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [meta, setMeta] = useState({ states: [], statesAndLgas: {} });
  const [lgas, setLgas] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'buyer',
    state: '',
    lga: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await api.get('/meta/meta');
        setMeta({ states: res.data.states, statesAndLgas: res.data.statesAndLgas });
        if (res.data.states.length > 0) {
          const firstState = res.data.states[0];
          setFormData(prev => ({
            ...prev,
            state: firstState,
            lga: res.data.statesAndLgas[firstState]?.[0] || ''
          }));
        }
      } catch (err) {
        console.warn('Failed to load location meta:', err);
      }
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    if (formData.state && meta.statesAndLgas[formData.state]) {
      const stateLgas = meta.statesAndLgas[formData.state];
      setLgas(stateLgas);
      if (!stateLgas.includes(formData.lga)) {
        setFormData(prev => ({ ...prev, lga: stateLgas[0] || '' }));
      }
    }
  }, [formData.state, meta.statesAndLgas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const newUser = await register(formData);
      if (newUser.role === 'farmer' || newUser.role === 'both') {
        navigate('/farmer-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.details?.[0]?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container animate-fade-in" style={{ padding: '2.5rem 1rem', maxWidth: '34rem' }}>
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
            <UserPlus size={28} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-900)' }}>
            Join FarmDirect NG
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Create an account as a Farmer, Buyer, or both
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Selector Card */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">I want to use FarmDirect as a:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'buyer' }))}
                className={formData.role === 'buyer' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                style={{ padding: '0.625rem 0.375rem', fontSize: '0.8125rem' }}
              >
                🛒 Buyer
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'farmer' }))}
                className={formData.role === 'farmer' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                style={{ padding: '0.625rem 0.375rem', fontSize: '0.8125rem' }}
              >
                🌾 Farmer
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'both' }))}
                className={formData.role === 'both' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                style={{ padding: '0.625rem 0.375rem', fontSize: '0.8125rem' }}
              >
                🌾🛒 Both
              </button>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'center' }}>
              {formData.role === 'farmer' && 'Post listings & receive buyer purchase orders.'}
              {formData.role === 'buyer' && 'Browse, search & place orders with verified farmers.'}
              {formData.role === 'both' && 'Sell your produce & buy from other farmers.'}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Amina Bello"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="amina@agrideal.ng"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="08031234567"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">State</label>
              <select name="state" className="form-select" value={formData.state} onChange={handleChange} required>
                {meta.states.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">LGA</label>
              <select name="lga" className="form-select" value={formData.lga} onChange={handleChange} required>
                {lgas.map(lg => (
                  <option key={lg} value={lg}>{lg}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.75rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-700)', fontWeight: 700 }}>
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
