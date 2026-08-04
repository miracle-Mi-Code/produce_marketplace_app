import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X, Sprout, Image, AlertCircle, CheckCircle } from 'lucide-react';

export default function ListingFormModal({ initialData, onClose, onSuccess, metaData }) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    produce_name: '',
    category: metaData?.categories?.[0] || 'Grains & Cereals',
    quantity: '',
    unit: metaData?.units?.[0] || '50kg Bag',
    price_per_unit: '',
    state: metaData?.states?.[0] || 'Kano',
    lga: '',
    harvest_date: new Date().toISOString().split('T')[0],
    photo_url: '',
    description: ''
  });

  const [lgas, setLgas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        produce_name: initialData.produce_name || '',
        category: initialData.category || metaData?.categories?.[0] || 'Grains & Cereals',
        quantity: initialData.quantity || '',
        unit: initialData.unit || metaData?.units?.[0] || '50kg Bag',
        price_per_unit: initialData.price_per_unit || '',
        state: initialData.state || metaData?.states?.[0] || 'Kano',
        lga: initialData.lga || '',
        harvest_date: initialData.harvest_date ? initialData.harvest_date.split('T')[0] : new Date().toISOString().split('T')[0],
        photo_url: initialData.photo_url || '',
        description: initialData.description || ''
      });
    }
  }, [initialData, metaData]);

  // Update LGA list when State changes
  useEffect(() => {
    if (formData.state && metaData?.statesAndLgas?.[formData.state]) {
      const stateLgas = metaData.statesAndLgas[formData.state];
      setLgas(stateLgas);
      if (!stateLgas.includes(formData.lga)) {
        setFormData(prev => ({ ...prev, lga: stateLgas[0] || '' }));
      }
    }
  }, [formData.state, metaData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Number(formData.quantity) <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    if (Number(formData.price_per_unit) <= 0) {
      setError('Price per unit must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/listings/${initialData.id}`, formData);
      } else {
        await api.post('/listings', formData);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save produce listing');
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
        maxWidth: '38rem',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative',
        padding: '1.5rem'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.875rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sprout size={24} color="var(--primary-600)" />
            {isEditing ? 'Edit Produce Listing' : 'Post New Farm Produce Listing'}
          </h2>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Produce Name</label>
            <input
              type="text"
              name="produce_name"
              className="form-input"
              placeholder="e.g. Foreign Parboiled Rice Paddy, Benue Yellow Yams, Plum Tomatoes"
              value={formData.produce_name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
                {metaData?.categories?.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Unit of Measure</label>
              <select name="unit" className="form-select" value={formData.unit} onChange={handleChange} required>
                {metaData?.units?.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Available Quantity</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                name="quantity"
                className="form-input"
                placeholder="e.g. 150"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price Per Unit (₦)</label>
              <input
                type="number"
                step="1"
                min="1"
                name="price_per_unit"
                className="form-input"
                placeholder="e.g. 42000"
                value={formData.price_per_unit}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">State Location</label>
              <select name="state" className="form-select" value={formData.state} onChange={handleChange} required>
                {metaData?.states?.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">LGA Location</label>
              <select name="lga" className="form-select" value={formData.lga} onChange={handleChange} required>
                {lgas.map(lg => (
                  <option key={lg} value={lg}>{lg}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Harvest Date</label>
              <input
                type="date"
                name="harvest_date"
                className="form-input"
                value={formData.harvest_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Photo URL (Optional)</label>
              <input
                type="url"
                name="photo_url"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={formData.photo_url}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Image Preview */}
          {formData.photo_url && (
            <div style={{ marginBottom: '1rem', height: '6rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
              <img src={formData.photo_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Produce Description & Specifications</label>
            <textarea
              name="description"
              className="form-textarea"
              rows="3"
              placeholder="Describe quality, moisture content, stone-free condition, packaging, or bulk delivery terms..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update Listing' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
