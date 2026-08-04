import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { X, MapPin, Calendar, User, Phone, ShoppingBag, CheckCircle, AlertCircle } from 'lucide-react';

export default function ListingModal({ listing, onClose, onOrderSuccess }) {
  const { user, isBuyer } = useAuth();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!listing) return null;

  const maxAvailable = parseFloat(listing.quantity);
  const pricePerUnit = parseFloat(listing.price_per_unit);
  const totalPrice = quantity * pricePerUnit;

  const formattedUnitPrice = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(pricePerUnit);
  const formattedTotalPrice = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(totalPrice);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      navigate('/login?redirect=listing&id=' + listing.id);
      return;
    }

    if (!isBuyer) {
      setError('You need a Buyer account to place orders. You can register or update your account role to "Buyer" or "Both".');
      return;
    }

    if (quantity <= 0 || quantity > maxAvailable) {
      setError(`Quantity must be between 1 and ${maxAvailable} ${listing.unit}`);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/orders', {
        listing_id: listing.id,
        quantity: parseFloat(quantity),
        notes
      });
      setSuccess(`Order #${res.data.order.id} placed successfully! The farmer has been notified.`);
      if (onOrderSuccess) onOrderSuccess(res.data.order);
      setTimeout(() => {
        onClose();
        navigate('/my-orders');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div className="animate-fade-in" style={{
        backgroundColor: 'white',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '42rem',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative'
      }}>
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 10,
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Top Header Image */}
        <div style={{ height: '14rem', width: '100%', backgroundColor: '#f1f5f9', position: 'relative' }}>
          <img
            src={listing.photo_url || 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&auto=format&fit=crop&q=80'}
            alt={listing.produce_name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            inset: 'auto 0 0 0',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            padding: '1.25rem',
            color: 'white'
          }}>
            <span className="badge badge-available" style={{ marginBottom: '0.375rem' }}>
              {listing.category}
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{listing.produce_name}</h2>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem' }}>
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <div>{error}</div>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <CheckCircle size={18} />
              <div>{success}</div>
            </div>
          )}

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: 'var(--bg-app)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PRICE PER UNIT</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                {formattedUnitPrice} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {listing.unit}</span>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-app)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>STOCK AVAILABLE</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {listing.quantity} {listing.unit}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-app)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>HARVEST DATE</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '4px' }}>
                <Calendar size={16} /> {new Date(listing.harvest_date).toLocaleDateString('en-GB')}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-app)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>FARM LOCATION</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '4px' }}>
                <MapPin size={16} color="var(--primary-600)" /> {listing.location}
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.375rem' }}>Produce Details & Quality Note</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {listing.description || 'Fresh agricultural produce harvested directly from local farms.'}
            </p>
          </div>

          {/* Farmer Contact Card */}
          <div style={{
            backgroundColor: 'var(--primary-50)',
            border: '1px solid var(--primary-100)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-900)', textTransform: 'uppercase' }}>
                VERIFIED FARMER SELLER
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <User size={16} /> {listing.farmer_name}
              </div>
            </div>
            {listing.farmer_phone && (
              <a href={`tel:${listing.farmer_phone}`} className="btn btn-secondary btn-sm" style={{ backgroundColor: 'white' }}>
                <Phone size={14} color="var(--primary-700)" /> {listing.farmer_phone}
              </a>
            )}
          </div>

          {/* Order Placement Form */}
          {listing.status === 'available' ? (
            <form onSubmit={handleOrderSubmit} style={{ borderTop: '2px dashed var(--border-light)', paddingTop: '1.25rem' }}>
              <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={20} color="var(--primary-600)" /> Place Order Request
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Quantity ({listing.unit})</label>
                  <input
                    type="number"
                    min="1"
                    max={maxAvailable}
                    step="1"
                    className="form-input"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(maxAvailable, Number(e.target.value))))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Calculated Total</label>
                  <div style={{
                    padding: '0.625rem 0.875rem',
                    fontSize: '1.125rem',
                    fontWeight: 800,
                    color: 'var(--primary-700)',
                    backgroundColor: 'var(--primary-50)',
                    border: '1px solid var(--primary-100)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    {formattedTotalPrice}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Note / Transport Preferences (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  placeholder="e.g. Please deliver to Mile 12 Market Lagos via inter-state haulage bus..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '0.5rem' }}
                disabled={loading || success}
              >
                {loading ? 'Processing Order...' : user ? `Confirm & Place Order (${formattedTotalPrice})` : 'Log in to Place Order'}
              </button>
            </form>
          ) : (
            <div className="alert alert-error">
              This produce item is currently marked as Sold Out.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
