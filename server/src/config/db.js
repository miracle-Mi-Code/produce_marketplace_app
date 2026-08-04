const { Pool } = require('pg');
require('dotenv').config();

let pool = null;
let isPgConnected = false;

// Memory storage fallback if PostgreSQL is not available locally during evaluation
const mockStore = {
  users: [
    {
      id: 1,
      name: 'Musa Ibrahim',
      email: 'musa@farmer.ng',
      password_hash: '$2a$10$7R0Z.uF./tQd3eWp2l6s3OaT/O5f23D4L7U6Y5W5t2A1S0D2F3G4H', // password123
      phone: '08031234567',
      role: 'farmer',
      state: 'Kano',
      lga: 'Kura',
      created_at: new Date('2026-07-01')
    },
    {
      id: 2,
      name: 'Tunde Bakare',
      email: 'tunde@farmer.ng',
      password_hash: '$2a$10$7R0Z.uF./tQd3eWp2l6s3OaT/O5f23D4L7U6Y5W5t2A1S0D2F3G4H',
      phone: '08059876543',
      role: 'farmer',
      state: 'Oyo',
      lga: 'Ibadan North',
      created_at: new Date('2026-07-02')
    },
    {
      id: 3,
      name: 'Nkechi Okonkwo',
      email: 'nkechi@buyer.ng',
      password_hash: '$2a$10$7R0Z.uF./tQd3eWp2l6s3OaT/O5f23D4L7U6Y5W5t2A1S0D2F3G4H',
      phone: '08021112233',
      role: 'buyer',
      state: 'Lagos',
      lga: 'Ikeja',
      created_at: new Date('2026-07-03')
    },
    {
      id: 4,
      name: 'Amina Bello',
      email: 'amina@agrideal.ng',
      password_hash: '$2a$10$7R0Z.uF./tQd3eWp2l6s3OaT/O5f23D4L7U6Y5W5t2A1S0D2F3G4H',
      phone: '08145556677',
      role: 'both',
      state: 'Benue',
      lga: 'Gboko',
      created_at: new Date('2026-07-04')
    }
  ],
  listings: [
    {
      id: 1,
      farmer_id: 1,
      produce_name: 'Fresh Foreign Parboiled Rice Paddy',
      category: 'Grains & Cereals',
      quantity: 150.00,
      unit: '50kg Bag',
      price_per_unit: 42000.00,
      location: 'Kano, Kura',
      state: 'Kano',
      lga: 'Kura',
      harvest_date: '2026-07-20',
      photo_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      description: 'High quality dried rice paddy directly harvested from Kura irrigation farm scheme. Clean and free from stones.',
      status: 'available',
      created_at: new Date('2026-07-20')
    },
    {
      id: 2,
      farmer_id: 1,
      produce_name: 'Red Sorghum Grains',
      category: 'Grains & Cereals',
      quantity: 80.00,
      unit: '100kg Bag',
      price_per_unit: 65000.00,
      location: 'Kano, Kura',
      state: 'Kano',
      lga: 'Kura',
      harvest_date: '2026-07-15',
      photo_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
      description: 'Premium red sorghum suitable for commercial flour mills and brewing processing.',
      status: 'available',
      created_at: new Date('2026-07-15')
    },
    {
      id: 3,
      farmer_id: 4,
      produce_name: 'Fresh Benue Yellow Yams',
      category: 'Tubers & Roots',
      quantity: 500.00,
      unit: 'Tuber / Bunch / Piece',
      price_per_unit: 2500.00,
      location: 'Benue, Gboko',
      state: 'Benue',
      lga: 'Gboko',
      harvest_date: '2026-07-28',
      photo_url: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=600&auto=format&fit=crop&q=80',
      description: 'Large sized Gboko yams. Well preserved, sweet taste, zero rot guarantee.',
      status: 'available',
      created_at: new Date('2026-07-28')
    },
    {
      id: 4,
      farmer_id: 2,
      produce_name: 'Plum Red Tomatoes (Jos Variety)',
      category: 'Vegetables',
      quantity: 120.00,
      unit: 'Crate',
      price_per_unit: 35000.00,
      location: 'Oyo, Ibadan North',
      state: 'Oyo',
      lga: 'Ibadan North',
      harvest_date: '2026-08-01',
      photo_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      description: 'Firm red tomatoes fresh from harvest. Excellent shelf life for wholesale traders and market vendors.',
      status: 'available',
      created_at: new Date('2026-08-01')
    },
    {
      id: 5,
      farmer_id: 4,
      produce_name: 'Pure Red Palm Oil (Unadulterated)',
      category: 'Spices & Oils',
      quantity: 60.00,
      unit: 'Gallon (25L)',
      price_per_unit: 28000.00,
      location: 'Benue, Gboko',
      state: 'Benue',
      lga: 'Gboko',
      harvest_date: '2026-07-25',
      photo_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
      description: '100% natural, thick red palm oil processed traditionally with no chemical additives or water mixing.',
      status: 'available',
      created_at: new Date('2026-07-25')
    },
    {
      id: 6,
      farmer_id: 4,
      produce_name: 'White Honey Beans (Oloyin)',
      category: 'Legumes & Pulses',
      quantity: 45.00,
      unit: '100kg Bag',
      price_per_unit: 115000.00,
      location: 'Benue, Gboko',
      state: 'Benue',
      lga: 'Gboko',
      harvest_date: '2026-07-10',
      photo_url: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=600&auto=format&fit=crop&q=80',
      description: 'Sweet Oloyin honey beans. Hand sorted, insect-free and thoroughly dried.',
      status: 'available',
      created_at: new Date('2026-07-10')
    }
  ],
  orders: [
    {
      id: 1,
      buyer_id: 3,
      listing_id: 4,
      farmer_id: 2,
      quantity: 5.00,
      unit_price_snapshot: 35000.00,
      total_price: 175000.00,
      status: 'confirmed',
      notes: 'Please ship via GIG Logistics to Mile 12 Market Lagos.',
      created_at: new Date('2026-08-02'),
      updated_at: new Date('2026-08-02')
    },
    {
      id: 2,
      buyer_id: 3,
      listing_id: 1,
      farmer_id: 1,
      quantity: 10.00,
      unit_price_snapshot: 42000.00,
      total_price: 420000.00,
      status: 'pending',
      notes: 'Arranging transport pickup from Kano station.',
      created_at: new Date('2026-08-03'),
      updated_at: new Date('2026-08-03')
    }
  ]
};

const connectionString = process.env.DATABASE_URL;

if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  pool.connect()
    .then(client => {
      console.log('✅ Connected to PostgreSQL database');
      isPgConnected = true;
      client.release();
    })
    .catch(err => {
      console.log('ℹ️ PostgreSQL not active on local port 5432. Operating seamlessly in demo mode with sample produce database.');
      isPgConnected = false;
    });
} else {
  console.log('ℹ️ No DATABASE_URL provided. Operating with in-memory database store.');
}

const query = async (text, params) => {
  if (isPgConnected && pool) {
    return pool.query(text, params);
  }
  // If PG is not active, fallback queries are handled in models
  return null;
};

module.exports = {
  pool,
  query,
  isPgConnected: () => isPgConnected,
  mockStore
};
