# 🌾 FarmDirect NG — Produce Marketplace App MVP

A two-sided agricultural marketplace connecting Nigerian farmers directly with commercial produce buyers, wholesale traders, and food processors across all 36 states and the FCT.

---

## 🌟 Features

- **Multi-Role Authentication**: Secure registration and login supporting `farmer`, `buyer`, or `both` roles using JWT access & refresh tokens with bcrypt password hashing.
- **Farmer Produce Portal**: Full CRUD operations for produce listings (produce name, category, quantity, unit, price, harvest date, state/LGA location, photo URL, description). Toggle listings as *Sold Out* when stock exhausts.
- **Buyer Search & Discovery Feed**:
  - Browse paginated listings.
  - Full-text keyword search across produce names, descriptions, and locations.
  - Filter by category, Nigerian state location, and price ranges.
  - Sort by Price (Low to High, High to Low) or Recency (Newest, Oldest).
- **Stock-Validated Order Engine**:
  - Real-time stock validation preventing over-ordering.
  - Order status lifecycle: `pending` → `confirmed` → `completed` / `cancelled`.
  - Transactional stock deduction and automatic stock restoration upon order cancellation.
  - Farmer incoming order manager & buyer order tracking portal.
- **Nigerian Location System**: Integrated database of all 36 Nigerian States and their Local Government Areas (LGAs).
- **Mobile-First Responsive Design**: Optimized for mid-range Android smartphones used by farmers in rural farming hubs (Kano, Benue, Oyo, Plateau, Kaduna, etc.).

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, CSS Design System (Custom Variables, Glassmorphism), Lucide Icons, React Router v6, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (with fallback in-memory store for quick local evaluation) |
| **Authentication** | JWT (Access & Refresh Tokens), Bcryptjs Password Hashing |
| **Security & Utilities** | Express Rate Limiting (`express-rate-limit`), Express Validator (`express-validator`), CORS |

---

## 📁 Repository Structure

```
produce_marketplace_app/
├── client/                     # React + Vite Frontend App
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ListingCard, ListingModal, OrderCard, Pagination
│   │   ├── context/            # AuthContext (state, login, register, role checks)
│   │   ├── pages/              # Home, Login, Register, FarmerDashboard, BuyerOrders
│   │   ├── services/           # Axios instance with auto JWT refresh interceptor
│   │   ├── index.css           # Design Tokens & Styles
│   │   └── App.jsx             # React Router Setup & Protected Routes
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend API
│   ├── src/
│   │   ├── config/             # PostgreSQL Pool & DB Configuration (db.js)
│   │   ├── controllers/        # authController, listingController, orderController, locationController
│   │   ├── db/                 # schema.sql, seed.sql
│   │   ├── middleware/         # auth.js, validate.js, rateLimiter.js, errorHandler.js
│   │   ├── models/             # UserModel, ListingModel, OrderModel
│   │   ├── routes/             # authRoutes, listingRoutes, orderRoutes, locationRoutes
│   │   └── utils/              # jwt.js, nigerianStates.js
│   ├── server.js               # Express Server Entry Point
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root package scripts
└── README.md
```

---

## 🗄️ Database Schema (PostgreSQL)

### 1. `users` Table
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR)
- `email` (VARCHAR UNIQUE)
- `password_hash` (VARCHAR)
- `phone` (VARCHAR)
- `role` (VARCHAR: `farmer`, `buyer`, `both`)
- `state` (VARCHAR)
- `lga` (VARCHAR)
- `created_at` (TIMESTAMP)

### 2. `listings` Table
- `id` (SERIAL PRIMARY KEY)
- `farmer_id` (INTEGER REFERENCES `users(id)`)
- `produce_name` (VARCHAR)
- `category` (VARCHAR)
- `quantity` (NUMERIC)
- `unit` (VARCHAR)
- `price_per_unit` (NUMERIC)
- `location` (VARCHAR)
- `state` (VARCHAR)
- `lga` (VARCHAR)
- `harvest_date` (DATE)
- `photo_url` (TEXT)
- `description` (TEXT)
- `status` (VARCHAR: `available`, `sold_out`, `archived`)
- `created_at` (TIMESTAMP)

### 3. `orders` Table
- `id` (SERIAL PRIMARY KEY)
- `buyer_id` (INTEGER REFERENCES `users(id)`)
- `listing_id` (INTEGER REFERENCES `listings(id)`)
- `farmer_id` (INTEGER REFERENCES `users(id)`)
- `quantity` (NUMERIC)
- `unit_price_snapshot` (NUMERIC)
- `total_price` (NUMERIC)
- `status` (VARCHAR: `pending`, `confirmed`, `completed`, `cancelled`)
- `notes` (TEXT)
- `created_at` (TIMESTAMP)

---

## 🚀 Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgres://postgres:postgres@localhost:5432/produce_marketplace
JWT_SECRET=super_secret_jwt_access_key_produce_marketplace_2026
JWT_REFRESH_SECRET=super_secret_jwt_refresh_key_produce_marketplace_2026
CLIENT_URL=http://localhost:5173
```

---

## ⚙️ Running Locally

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Optional; if PostgreSQL is not installed locally, the server automatically operates seamlessly on an enriched in-memory store so you can test immediately!)

### Step 1: Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 2: Set Up Database (PostgreSQL)
If using local PostgreSQL:
```bash
# Create database
createdb produce_marketplace

# Run schema and seed scripts
psql -d produce_marketplace -f src/db/schema.sql
psql -d produce_marketplace -f src/db/seed.sql
```

### Step 3: Start Application
Run the backend server and React Vite frontend:

**Terminal 1 (Backend API)**:
```bash
cd server
npm run dev
# Server will start on http://localhost:5000
```

**Terminal 2 (Frontend Client)**:
```bash
cd client
npm run dev
# Vite server will start on http://localhost:5173
```

---

## 🔑 Pre-seeded Demo Accounts

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Farmer** | `musa@farmer.ng` | `password123` | Kano Rice & Sorghum Farmer (Kura LGA) |
| **Farmer** | `tunde@farmer.ng` | `password123` | Oyo Tomato & Grain Producer |
| **Buyer** | `nkechi@buyer.ng` | `password123` | Lagos Produce Wholesale Buyer |
| **Farmer & Buyer** | `amina@agrideal.ng` | `password123` | Benue Yam & Palm Oil Producer |

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`farmer`, `buyer`, or `both`)
- `POST /api/auth/login` — Authenticate and receive access & refresh tokens
- `POST /api/auth/refresh` — Issue a new access token via refresh token
- `GET /api/auth/me` — Get current logged-in user profile (Auth required)

### Listings (`/api/listings`)
- `GET /api/listings` — Get paginated listings (Query params: `search`, `category`, `state`, `minPrice`, `maxPrice`, `sortBy`, `page`, `limit`)
- `GET /api/listings/:id` — Get single produce listing detail
- `POST /api/listings` — Create a new produce listing (Farmer role required)
- `PUT /api/listings/:id` — Update listing details (Farmer owner required)
- `PATCH /api/listings/:id/sold-out` — Mark listing as Sold Out (Farmer owner required)
- `DELETE /api/listings/:id` — Delete produce listing (Farmer owner required)

### Orders (`/api/orders`)
- `POST /api/orders` — Place order against listing (Buyer role required, validates stock & snapshots price)
- `GET /api/orders/mine` — Get buyer order history (Buyer role required)
- `GET /api/orders/received` — Get farmer incoming orders (Farmer role required)
- `PATCH /api/orders/:id/status` — Update order status (`pending` → `confirmed` → `completed` / `cancelled`)

### Location & Metadata (`/api/meta`)
- `GET /api/meta/meta` — Get list of 36 Nigerian states, LGAs, produce categories, and units

---

## 🌐 Render Deployment Guide

### Option 1: Render Blueprints (Automatic 1-Click Deployment)
1. Push your repository to GitHub or GitLab.
2. Log into [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Blueprint**.
4. Connect your repository. Render will automatically detect `render.yaml` and configure:
   - **PostgreSQL Database** (`produce-marketplace-db`)
   - **Unified Web Service** (`farmdirect-produce-marketplace`)
5. Click **Apply**. Render will provision the database, build the React frontend, and launch the Express server!

### Option 2: Manual Web Service Setup on Render
If configuring manually on Render:
1. **Create PostgreSQL Instance**:
   - Go to Render Dashboard -> **New +** -> **PostgreSQL**.
   - Copy the **Internal Database URL** or **External Database URL**.
   - Run `schema.sql` and `seed.sql` against the database via `psql` or database GUI.

2. **Create Web Service**:
   - Go to Render Dashboard -> **New +** -> **Web Service**.
   - Connect your GitHub repo.
   - **Environment**: `Node`
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `DATABASE_URL`: *(Paste your Render Postgres connection string)*
     - `JWT_SECRET`: *(Set a strong secret key)*
     - `JWT_REFRESH_SECRET`: *(Set a strong refresh key)*

3. Once deployed, Render will provide a public URL (e.g., `https://farmdirect-produce-marketplace.onrender.com`). Both the frontend React app and backend Express API run seamlessly on this single URL!

---

## 📄 License
MIT License. Built for Nigerian Agriculture.
