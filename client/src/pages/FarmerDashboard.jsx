import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ListingFormModal from '../components/ListingFormModal';
import OrderCard from '../components/OrderCard';
import {
  Sprout,
  PlusCircle,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Edit,
  Trash2,
  EyeOff,
  ShoppingBag,
  MapPin,
  Calendar
} from 'lucide-react';

export default function FarmerDashboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'orders'
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metaData, setMetaData] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);

  useEffect(() => {
    fetchFarmerData();
    fetchMeta();
  }, []);

  const fetchMeta = async () => {
    try {
      const res = await api.get('/meta/meta');
      setMetaData(res.data);
    } catch (err) {
      console.warn('Failed to load location metadata:', err);
    }
  };

  const fetchFarmerData = async () => {
    setLoading(true);
    try {
      const [listingsRes, ordersRes] = await Promise.all([
        api.get(`/listings?farmerId=${user.id}&limit=50`),
        api.get('/orders/received')
      ]);
      setListings(listingsRes.data.listings);
      setOrders(ordersRes.data.orders);
    } catch (err) {
      console.error('Error loading farmer portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSoldOut = async (listingId) => {
    try {
      await api.patch(`/listings/${listingId}/sold-out`);
      fetchFarmerData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this produce listing?')) return;
    try {
      await api.delete(`/listings/${listingId}`);
      fetchFarmerData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete listing');
    }
  };

  // Calculations for KPI Cards
  const totalListings = listings.length;
  const availableCount = listings.filter(l => l.status === 'available').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const completedOrdersCount = orders.filter(o => o.status === 'completed').length;

  return (
    <main className="container animate-fade-in" style={{ padding: '2rem 1rem 4rem' }}>
      {/* Header & Quick Action */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <span className="badge badge-available" style={{ marginBottom: '0.375rem' }}>
            🌾 Farmer Producer Portal
          </span>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--primary-900)' }}>
            Welcome, {user.name}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Farm Location: 📍 {user.state}, {user.lga} LGA • Tel: {user.phone}
          </p>
        </div>

        <button
          onClick={() => { setEditingListing(null); setIsModalOpen(true); }}
          className="btn btn-primary btn-lg"
        >
          <PlusCircle size={20} /> Post New Farm Produce
        </button>
      </div>

      {/* Stats Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            TOTAL LISTINGS
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-900)', marginTop: '4px' }}>
            {totalListings} <span style={{ fontSize: '0.875rem', color: 'var(--primary-600)' }}>({availableCount} active)</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            PENDING ORDERS
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
            {pendingOrdersCount}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            COMPLETED DELIVERIES
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-700)', marginTop: '4px' }}>
            {completedOrdersCount}
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        borderBottom: '2px solid var(--border-light)',
        marginBottom: '1.5rem'
      }}>
        <button
          onClick={() => setActiveTab('listings')}
          style={{
            padding: '0.75rem 1.25rem',
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            fontWeight: 700,
            color: activeTab === 'listings' ? 'var(--primary-700)' : 'var(--text-muted)',
            borderBottom: activeTab === 'listings' ? '3px solid var(--primary-700)' : '3px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            marginBottom: '-2px'
          }}
        >
          My Produce Listings ({listings.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '0.75rem 1.25rem',
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            fontWeight: 700,
            color: activeTab === 'orders' ? 'var(--primary-700)' : 'var(--text-muted)',
            borderBottom: activeTab === 'orders' ? '3px solid var(--primary-700)' : '3px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            marginBottom: '-2px',
            position: 'relative'
          }}
        >
          Incoming Orders ({orders.length})
          {pendingOrdersCount > 0 && (
            <span className="badge badge-pending" style={{ marginLeft: '0.5rem', fontSize: '0.6875rem' }}>
              {pendingOrdersCount} New
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Listings Table / Cards */}
      {activeTab === 'listings' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading your produce listings...</div>
          ) : listings.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Sprout size={40} color="var(--primary-600)" style={{ margin: '0 auto 1rem' }} />
              <h3>You have not created any produce listings yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Post your harvested rice, yams, sorghum, beans, or tomatoes to start receiving buyer purchase orders.
              </p>
              <button onClick={() => { setEditingListing(null); setIsModalOpen(true); }} className="btn btn-primary">
                <PlusCircle size={18} /> Add First Listing
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {listings.map(item => (
                <div key={item.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span className={item.status === 'available' ? 'badge badge-available' : 'badge badge-sold-out'}>
                        {item.status}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</span>
                    </div>

                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.375rem' }}>{item.produce_name}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      📍 {item.location}
                    </p>

                    <div style={{ backgroundColor: 'var(--bg-app)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stock</div>
                        <div style={{ fontWeight: 700 }}>{item.quantity} {item.unit}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Price</div>
                        <div style={{ fontWeight: 800, color: 'var(--primary-700)' }}>
                          ₦{Number(item.price_per_unit).toLocaleString()}/{item.unit}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    {item.status === 'available' && (
                      <button onClick={() => handleToggleSoldOut(item.id)} className="btn btn-secondary btn-sm" title="Mark as Sold Out">
                        <EyeOff size={14} /> Mark Sold Out
                      </button>
                    )}
                    <button onClick={() => { setEditingListing(item); setIsModalOpen(true); }} className="btn btn-secondary btn-sm" title="Edit Listing">
                      <Edit size={14} /> Edit
                    </button>
                    <button onClick={() => handleDeleteListing(item.id)} className="btn btn-ghost btn-sm" style={{ color: '#dc2626' }} title="Delete Listing">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Incoming Orders */}
      {activeTab === 'orders' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading incoming buyer orders...</div>
          ) : orders.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <ShoppingBag size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3>No Incoming Orders Received Yet</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                When buyers order produce from your listings, purchase orders will appear here for your confirmation.
              </p>
            </div>
          ) : (
            <div>
              {orders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  viewType="farmer"
                  onStatusChange={() => fetchFarmerData()}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Listing Modal */}
      {isModalOpen && (
        <ListingFormModal
          initialData={editingListing}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => fetchFarmerData()}
          metaData={metaData}
        />
      )}
    </main>
  );
}
