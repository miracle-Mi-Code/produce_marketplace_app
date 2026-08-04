import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import OrderCard from '../components/OrderCard';
import { ShoppingBag, Search, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BuyerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/mine');
      setOrders(res.data.orders);
    } catch (err) {
      console.error('Error fetching buyer orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <main className="container animate-fade-in" style={{ padding: '2rem 1rem 4rem', maxWidth: '54rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span className="badge badge-available" style={{ marginBottom: '0.375rem' }}>
          🛒 Buyer Purchase Portal
        </span>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--primary-900)' }}>
          My Produce Orders History
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Track status of your orders, connect with farmers, and verify delivery arrangements.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading your order history...</div>
      ) : orders.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <ShoppingBag size={40} color="var(--primary-600)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            You haven't placed any produce orders yet
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Browse our direct farmer marketplace to order fresh rice, yams, vegetables, and oils.
          </p>
          <Link to="/" className="btn btn-primary">
            <Search size={18} /> Browse Marketplace
          </Link>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              viewType="buyer"
              onStatusChange={() => fetchOrders()}
            />
          ))}
        </div>
      )}
    </main>
  );
}
