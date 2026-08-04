import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ListingCard from '../components/ListingCard';
import ListingModal from '../components/ListingModal';
import Pagination from '../components/Pagination';
import { Search, Filter, SlidersHorizontal, MapPin, Tag, RefreshCw, Sprout } from 'lucide-react';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  // Metadata for dropdowns
  const [meta, setMeta] = useState({ categories: [], states: [] });

  // Fetch Meta Data once
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await api.get('/meta/meta');
        setMeta({ categories: res.data.categories, states: res.data.states });
      } catch (err) {
        console.warn('Failed to load location meta:', err);
      }
    };
    fetchMeta();
  }, []);

  // Fetch Listings with filters
  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/listings', {
        params: {
          search,
          category,
          state,
          minPrice,
          maxPrice,
          sortBy,
          page,
          limit: 9
        }
      });
      setListings(res.data.listings);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [page, category, state, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchListings();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setState('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setPage(1);
  };

  return (
    <main className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Hero Banner Header */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary-900), var(--primary-700))',
        color: 'white',
        padding: '3rem 1rem 3.5rem',
        borderRadius: '0 0 24px 24px',
        marginBottom: '2rem',
        boxShadow: '0 10px 25px -5px rgba(6, 78, 59, 0.3)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '48rem' }}>
          <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: 'white', marginBottom: '0.75rem' }}>
            <Sprout size={14} /> Direct Farmer-to-Buyer Exchange
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.875rem', lineHeight: 1.2 }}>
            Buy Fresh Nigerian Farm Produce Directly From The Harvest Gate
          </h1>
          <p style={{ fontSize: '1rem', color: '#d1fae5', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Connect with verified grain, tuber, vegetable, and livestock farmers in Kano, Benue, Oyo, Kaduna, Plateau & across all 36 states.
          </p>

          {/* Search Bar Input */}
          <form onSubmit={handleSearchSubmit} style={{
            display: 'flex',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '0.375rem',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '0.75rem', color: 'var(--text-muted)' }}>
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search produce (e.g., Rice Paddy, Benue Yam, Jos Tomatoes, Palm Oil)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                padding: '0.625rem 0.875rem',
                fontSize: '0.9375rem',
                color: 'var(--text-main)'
              }}
            />
            <button type="submit" className="btn btn-accent" style={{ borderRadius: 'var(--radius-md)' }}>
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container">
        {/* Category Pills Bar */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          marginBottom: '1.5rem',
          scrollbarWidth: 'none'
        }}>
          <button
            onClick={() => { setCategory(''); setPage(1); }}
            className={category === '' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
          >
            All Produce
          </button>
          {meta.categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={category === cat ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
              style={{ whiteSpace: 'nowrap' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--primary-900)' }}>
              <SlidersHorizontal size={18} /> Filters & Sorting
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%', maxWidth: '50rem' }}>
              {/* State Filter */}
              <div style={{ flex: '1 1 140px' }}>
                <select
                  value={state}
                  onChange={(e) => { setState(e.target.value); setPage(1); }}
                  className="form-select"
                  style={{ padding: '0.45rem 0.625rem', fontSize: '0.84375rem' }}
                >
                  <option value="">All Nigerian States</option>
                  {meta.states.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Price Min/Max */}
              <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center', flex: '1 1 180px' }}>
                <input
                  type="number"
                  placeholder="Min Price (₦)"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="form-input"
                  style={{ padding: '0.45rem 0.5rem', fontSize: '0.84375rem' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>-</span>
                <input
                  type="number"
                  placeholder="Max Price (₦)"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="form-input"
                  style={{ padding: '0.45rem 0.5rem', fontSize: '0.84375rem' }}
                />
              </div>

              {/* Sort Selector */}
              <div style={{ flex: '1 1 140px' }}>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="form-select"
                  style={{ padding: '0.45rem 0.625rem', fontSize: '0.84375rem' }}
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="oldest">Sort: Oldest First</option>
                </select>
              </div>

              <button onClick={() => { fetchListings(); setPage(1); }} className="btn btn-primary btn-sm">
                Apply
              </button>
              <button onClick={handleResetFilters} className="btn btn-ghost btn-sm" title="Reset Filters">
                <RefreshCw size={14} /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="glass-card" style={{ height: '22rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="skeleton" style={{ height: '11rem', width: '100%' }} />
                <div className="skeleton" style={{ height: '1.5rem', width: '70%' }} />
                <div className="skeleton" style={{ height: '1rem', width: '40%' }} />
                <div className="skeleton" style={{ height: '2rem', width: '100%', marginTop: 'auto' }} />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Sprout size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              No Produce Listings Found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
              Try adjusting your search keywords, clearing price range limits, or selecting all Nigerian states.
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {listings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onSelect={(item) => setSelectedListing(item)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              pagination={pagination}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </>
        )}

        {/* Detail Modal */}
        {selectedListing && (
          <ListingModal
            listing={selectedListing}
            onClose={() => setSelectedListing(null)}
            onOrderSuccess={() => {
              fetchListings();
            }}
          />
        )}
      </div>
    </main>
  );
}
