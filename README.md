# 🥜 Tasty Namkeens — B2B E-Commerce Platform

> **Tasty Namkeens** is a full-stack B2B wholesale snack platform where supermarkets log in to place bulk orders. Public visitors browse the product catalog and use the **"Find Nearby Store"** feature to locate retail stockists.

---

## 📁 Project Structure

```
tasty-namkeens/
├── server/                         ← Node.js / Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               ← MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js   ← Login / JWT issuance
│   │   │   ├── productController.js← Catalog CRUD + wholesale
│   │   │   └── orderController.js  ← Order placement & management
│   │   ├── middleware/
│   │   │   ├── auth.js             ← protect() + authorize() RBAC
│   │   │   └── errorHandler.js     ← Global error handler
│   │   ├── models/
│   │   │   ├── User.js             ← Admin & Supermarket users
│   │   │   ├── Product.js          ← Snack catalog (50+ items)
│   │   │   ├── Store.js            ← Physical retail locations
│   │   │   └── Order.js            ← Wholesale orders
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── storeRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── index.js                ← Express app entry point
│   │   └── seed.js                 ← Database seeder
│   ├── .env                        ← Environment variables (secret!)
│   ├── .env.example                ← Template (safe to commit)
│   └── package.json
│
├── client/                         ← React Frontend (Phase 2)
│   ├── public/
│   └── src/
│
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ 
- **MongoDB** — local install or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment
```bash
# Copy the example file
copy .env.example .env

# Open .env and update these values:
#   MONGO_URI  → your MongoDB connection string
#   JWT_SECRET → a long random string
#   ADMIN_WHATSAPP → your WhatsApp number with country code (no +)
```

### 3. Seed the Database
```bash
npm run seed
```
This creates the admin account, 5 sample products, 2 stores, and 2 supermarket accounts.

**To wipe and re-seed (development only!):**
```bash
npm run seed -- --fresh
```

### 4. Start the Development Server
```bash
npm run dev
```
The API will be available at **http://localhost:5000**

---

## 🔗 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Login (all roles) |
| GET | `/api/auth/me` | JWT | Get current user |
| GET | `/api/products` | Public | Browse catalog (no prices) |
| GET | `/api/products/:id` | Public | Product detail + stores |
| GET | `/api/products/:id/stores` | Public | Find stores carrying product |
| GET | `/api/products/wholesale` | Supermarket/Admin | Full catalog with pricing |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Deactivate product |
| GET | `/api/stores` | Public | List all active stores |
| POST | `/api/orders` | Supermarket | Place wholesale order |
| GET | `/api/orders/my-orders` | Supermarket | View own order history |
| GET | `/api/orders` | Admin | View all orders |
| PUT | `/api/orders/:id/status` | Admin | Update order status |
| GET | `/api/admin/dashboard` | Admin | Stats overview |
| GET | `/api/admin/users` | Admin | List supermarket accounts |
| POST | `/api/admin/users` | Admin | Create supermarket account |

---

## 🔐 RBAC Summary

| Feature | Public | Supermarket | Admin |
|---------|--------|-------------|-------|
| Browse product catalog | ✅ | ✅ | ✅ |
| See wholesale prices | ❌ | ✅ | ✅ |
| Find nearby stores | ✅ | ✅ | ✅ |
| Place wholesale orders | ❌ | ✅ | ❌ |
| Manage product catalog | ❌ | ❌ | ✅ |
| Create supermarket accounts | ❌ | ❌ | ✅ |
| View all orders | ❌ | ❌ | ✅ |

---

## 🌱 Seed Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@tastynam-keens.com` | `Admin@TastyNamkeens2024` |
| Supermarket 1 | `srilakshmi@example.com` | `Supermarket@123` |
| Supermarket 2 | `balaji@example.com` | `Supermarket@456` |

> ⚠️ Change these passwords before deploying to production!

---

## 🏗️ Roadmap

- [ ] **Phase 1 (Current)** — Backend API architecture ✅
- [ ] **Phase 2** — React frontend: public catalog + store finder
- [ ] **Phase 3** — Supermarket dashboard: ordering interface
- [ ] **Phase 4** — Admin dashboard: CRUD, order management
- [ ] **Phase 5** — Deployment: Railway/Render (backend) + Vercel (frontend)
