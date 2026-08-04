-- Seed data for Produce Marketplace App

-- 1. Insert Users (Password is 'password123' hashed with bcrypt)
-- Hash for 'password123': $2a$10$7R0Z.uF./tQd3eWp2l6s3OaT/O5f23D4L7U6Y5W5t2A1S0D2F3G4H
INSERT INTO users (name, email, password_hash, phone, role, state, lga) VALUES
('Musa Ibrahim', 'musa@farmer.ng', '$2a$10$7R0Z.uF./tQd3eWp2l6s3OaT/O5f23D4L7U6Y5W5t2A1S0D2F3G4H', '08031234567', 'farmer', 'Kano', 'Kura'),
('Tunde Bakare', 'tunde@farmer.ng', '$2a$10$7R0Z.uF./tQd3eWp2l6s3OaT/O5f23D4L7U6Y5W5t2A1S0D2F3G4H', '08059876543', 'farmer', 'Oyo', 'Ibadan North'),
('Nkechi Okonkwo', 'nkechi@buyer.ng', '$2a$10$7R0Z.uF./tQd3eWp2l6s3OaT/O5f23D4L7U6Y5W5t2A1S0D2F3G4H', '08021112233', 'buyer', 'Lagos', 'Ikeja'),
('Amina Bello', 'amina@agrideal.ng', '$2a$10$7R0Z.uF./tQd3eWp2l6s3OaT/O5f23D4L7U6Y5W5t2A1S0D2F3G4H', '08145556677', 'both', 'Benue', 'Gboko');

-- 2. Insert Listings
INSERT INTO listings (farmer_id, produce_name, category, quantity, unit, price_per_unit, location, state, lga, harvest_date, photo_url, description, status) VALUES
(1, 'Fresh Foreign Parboiled Rice Paddy', 'Grains & Cereals', 150.00, '50kg Bag', 42000.00, 'Kano, Kura', 'Kano', 'Kura', '2026-07-20', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', 'High quality dried rice paddy directly harvested from Kura irrigation farm scheme. Clean and free from stones.', 'available'),

(1, 'Red Sorghum Grains', 'Grains & Cereals', 80.00, '100kg Bag', 65000.00, 'Kano, Kura', 'Kano', 'Kura', '2026-07-15', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80', 'Premium red sorghum suitable for commercial flour mills and brewing processing.', 'available'),

(2, 'Fresh Benue Yellow Yams', 'Tubers & Roots', 500.00, 'Tuber / Bunch / Piece', 2500.00, 'Benue, Gboko', 'Benue', 'Gboko', '2026-07-28', 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=600&auto=format&fit=crop&q=80', 'Large sized Gboko yams. Well preserved, sweet taste, zero rot guarantee.', 'available'),

(2, 'Plum Red Tomatoes (Jos Variety)', 'Vegetables', 120.00, 'Crate', 35000.00, 'Oyo, Ibadan North', 'Oyo', 'Ibadan North', '2026-08-01', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80', 'Firm red tomatoes fresh from harvest. Excellent shelf life for wholesale traders and market vendors.', 'available'),

(4, 'Pure Red Palm Oil (Unadulterated)', 'Spices & Oils', 60.00, 'Gallon (25L)', 28000.00, 'Benue, Gboko', 'Benue', 'Gboko', '2026-07-25', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80', '100% natural, thick red palm oil processed traditionally with no chemical additives or water mixing.', 'available'),

(4, 'White Honey Beans (Oloyin)', 'Legumes & Pulses', 45.00, '100kg Bag', 115000.00, 'Benue, Gboko', 'Benue', 'Gboko', '2026-07-10', 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=600&auto=format&fit=crop&q=80', 'Sweet Oloyin honey beans. Hand sorted, insect-free and thoroughly dried.', 'available');

-- 3. Insert Sample Orders
INSERT INTO orders (buyer_id, listing_id, farmer_id, quantity, unit_price_snapshot, total_price, status, notes) VALUES
(3, 4, 2, 5.00, 35000.00, 175000.00, 'confirmed', 'Please ship via GIG Logistics to Mile 12 Market Lagos.'),
(3, 1, 1, 10.00, 42000.00, 420000.00, 'pending', 'Arranging transport pickup from Kano station.');
