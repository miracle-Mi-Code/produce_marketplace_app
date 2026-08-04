import React from 'react';
import { MapPin, Calendar, Tag, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export default function ListingCard({ listing, onSelect, isOwner }) {
  const isAvailable = listing.status === 'available';
  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(listing.price_per_unit);

  const defaultPhoto = 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&auto=format&fit=crop&q=80';

  return (
    <div
      onClick={() => onSelect(listing)}
      className="glass-card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      {/* Produce Image Container */}
      <div style={{ position: 'relative', height: '12.5rem', width: '100%', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
        <img
          src={listing.photo_url || defaultPhoto}
          alt={listing.produce_name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 400ms ease'
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultPhoto;
          }}
        />

        {/* Status Badge Over Image */}
        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
          {isAvailable ? (
            <span className="badge badge-available">
              <CheckCircle2 size={12} /> Available
            </span>
          ) : (
            <span className="badge badge-sold-out">
              <XCircle size={12} /> Sold Out
            </span>
          )}
        </div>

        {/* Category Tag */}
        <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem' }}>
          <span style={{
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '0.25rem 0.625rem',
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Tag size={12} /> {listing.category}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
        <div>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            marginBottom: '0.5rem',
            lineHeight: 1.3
          }}>
            {listing.produce_name}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.84375rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <MapPin size={15} color="var(--primary-600)" />
              <span style={{ fontWeight: 500 }}>{listing.location}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Calendar size={15} color="var(--text-light)" />
              <span>Harvested: {new Date(listing.harvest_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Stock & Price Footer */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Stock Available
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: isAvailable ? 'var(--primary-800)' : '#991b1b' }}>
              {listing.quantity} {listing.unit}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.1875rem', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'var(--font-heading)' }}>
              {formattedPrice}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              per {listing.unit}
            </div>
          </div>
        </div>

        {/* Action button */}
        <div style={{ marginTop: '1rem' }}>
          {isOwner ? (
            <button className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
              Manage Listing
            </button>
          ) : (
            <button className={isAvailable ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'} style={{ width: '100%' }} disabled={!isAvailable}>
              {isAvailable ? (
                <>Place Order <ArrowRight size={16} /></>
              ) : (
                'Out of Stock'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
