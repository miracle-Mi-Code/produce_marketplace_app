import React, { useState } from 'react';
import { Package, User, Phone, MapPin, Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function OrderCard({ order, viewType, onStatusChange }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formattedTotal = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(order.total_price);
  const formattedUnitPrice = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(order.unit_price_snapshot);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge badge-confirmed">Confirmed</span>;
      case 'completed':
        return <span className="badge badge-completed">Completed</span>;
      case 'cancelled':
        return <span className="badge badge-cancelled">Cancelled</span>;
      default:
        return <span className="badge badge-pending">Pending</span>;
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setLoading(true);
    setError('');
    try {
      await api.patch(`/orders/${order.id}/status`, { status: newStatus });
      if (onStatusChange) onStatusChange(order.id, newStatus);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '0.75rem' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-muted)' }}>
              ORDER #{order.id}
            </span>
            {getStatusBadge(order.status)}
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {order.produce_name}
          </h3>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'var(--font-heading)' }}>
            {formattedTotal}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {order.quantity} {order.unit} @ {formattedUnitPrice}/{order.unit}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.875rem',
        backgroundColor: 'var(--bg-app)',
        padding: '0.875rem',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1rem',
        fontSize: '0.84375rem'
      }}>
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            {viewType === 'farmer' ? 'BUYER DETAILS' : 'FARMER SELLER'}
          </div>
          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <User size={14} /> {viewType === 'farmer' ? order.buyer_name : order.farmer_name}
          </div>
          {(viewType === 'farmer' ? order.buyer_phone : order.farmer_phone) && (
            <a href={`tel:${viewType === 'farmer' ? order.buyer_phone : order.farmer_phone}`} style={{ color: 'var(--primary-700)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '2px' }}>
              <Phone size={12} /> {viewType === 'farmer' ? order.buyer_phone : order.farmer_phone}
            </a>
          )}
        </div>

        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem' }}>LOCATION</div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={14} color="var(--primary-600)" />
            {viewType === 'farmer'
              ? (order.buyer_state ? `${order.buyer_state}, ${order.buyer_lga}` : order.listing_location)
              : order.listing_location}
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem' }}>ORDER DATE</div>
          <div style={{ color: 'var(--text-main)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={14} /> {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Delivery Notes */}
      {order.notes && (
        <div style={{ fontSize: '0.8125rem', backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', color: '#92400e' }}>
          <strong>Buyer Delivery Note:</strong> {order.notes}
        </div>
      )}

      {/* Action Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        {viewType === 'farmer' && (
          <>
            {order.status === 'pending' && (
              <button onClick={() => handleUpdateStatus('confirmed')} className="btn btn-primary btn-sm" disabled={loading}>
                <CheckCircle2 size={14} /> Confirm Order
              </button>
            )}
            {order.status === 'confirmed' && (
              <button onClick={() => handleUpdateStatus('completed')} className="btn btn-accent btn-sm" disabled={loading}>
                <CheckCircle2 size={14} /> Mark Completed
              </button>
            )}
            {(order.status === 'pending' || order.status === 'confirmed') && (
              <button onClick={() => handleUpdateStatus('cancelled')} className="btn btn-ghost btn-sm" style={{ color: '#dc2626' }} disabled={loading}>
                <XCircle size={14} /> Cancel Order
              </button>
            )}
          </>
        )}

        {viewType === 'buyer' && order.status === 'pending' && (
          <button onClick={() => handleUpdateStatus('cancelled')} className="btn btn-ghost btn-sm" style={{ color: '#dc2626' }} disabled={loading}>
            <XCircle size={14} /> Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}
