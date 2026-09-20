# 🥜 Tasty Namkeens — Complete Cloud Deployment Guide
### Production Architecture: Vercel (Frontend) + Render (Backend) + MongoDB Atlas (Database)

This guide walks you through deploying the **Tasty Namkeens B2B Wholesale Platform** to live production URLs with free-tier cloud providers.

---

## 🏗️ Cloud Infrastructure Overview

```
[ Public Users / Supermarkets ]
               │
               ▼
   ┌───────────────────────┐
   │  Vercel Edge Network  │  (React Vite SPA)
   │  tastynamkeens.com    │  `https://tasty-namkeens.vercel.app`
   └───────────┬───────────┘
               │  REST API Calls (/api/*)
               ▼
   ┌───────────────────────┐
   │    Render Web Service │  (Node.js / Express API)
   │    Auto-Deploy via    │  `https://tasty-namkeens-api.onrender.com`
   │    render.yaml        │
   └───────────┬───────────┘
               │  Mongoose ODM (TLS / SSL)
               ▼
   ┌───────────────────────┐
   │   MongoDB Atlas M0    │  (Cloud Database Engine)
   │   Cluster (512MB Free)│  Replica Set / Primary
   └───────────────────────┘
```

---

## Step 1: Set Up MongoDB Atlas (Cloud Database)

1. **Create an Account**:
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas/database) and sign in or create a free account.
2. **Deploy a Free Cluster**:
   - Click **"Create Deployment"** &rarr; Select **M0 (Free)**.
   - Provider: **AWS** or **Google Cloud**.
   - Region: Choose closest to India (e.g., `ap-south-1` Mumbai or `ap-southeast-1` Singapore).
   - Cluster Name: `tasty-namkeens-db` &rarr; Click **Create**.
3. **Configure Database Access (Credentials)**:
   - Go to **Security &rarr; Database Access &rarr; Add New Database User**.
   - Authentication Method: **Password**.
   - Username: `tastyadmin` (or your choice).
   - Password: Click **Autogenerate Secure Password** or set a strong one (e.g. `TastyNamkeens2026!`).
   - Database User Privileges: **Read and write to any database**.
   - Click **Add User**.
4. **Configure Network Access (IP Whitelist)**:
   - Go to **Security &rarr; Network Access &rarr; Add IP Address**.
   - Click **"Allow Access from Anywhere"** (`0.0.0.0/0`).
   - *Why?* Render instances use dynamic IP pools. Cloud databases require `0.0.0.0/0` with user/password authentication.
   - Click **Confirm**.
5. **Get Connection String**:
   - Click **Databases &rarr; Connect &rarr; Drivers (Node.js)**.
   - Copy the URI string, which looks like:
     ```
     mongodb+srv://tastyadmin:<password>@tasty-namkeens-db.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=tasty-namkeens-db
     ```
   - Replace `<password>` with your actual password.
   - Add database name `/tasty-namkeens` before the query string:
     ```
     mongodb+srv://tastyadmin:TastyNamkeens2026!@tasty-namkeens-db.xxxx.mongodb.net/tasty-namkeens?retryWrites=true&w=majority
     ```

---

## Step 2: Push Project Code to GitHub

1. **Initialize Git & Commit**:
   ```powershell
   cd "C:\Users\Sai Charan Reddy\.gemini\antigravity\scratch\tasty-namkeens"
   git init
   git add .
   git commit -m "feat: complete Tasty Namkeens B2B architecture ready for deployment"
   ```
2. **Push to your GitHub Account**:
   - Go to [github.com/new](https://github.com/new) and create a repository named `tasty-namkeens`.
   ```powershell
   git remote add origin https://github.com/<your-username>/tasty-namkeens.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 3: Deploy Backend API to Render

1. **Sign in to Render**:
   - Go to [render.com](https://render.com) &rarr; Sign in with your GitHub account.
2. **Create New Web Service**:
   - Click **New + &rarr; Web Service**.
   - Connect your `tasty-namkeens` repository.
3. **Configure Settings**:
   - **Name**: `tasty-namkeens-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
   - **Instance Type**: `Free`
4. **Configure Environment Variables**:
   Click **Advanced &rarr; Add Environment Variable** and enter:

   | Key | Value | Notes |
   |-----|-------|-------|
   | `NODE_ENV` | `production` | Enables production optimisations |
   | `PORT` | `5000` | Internal port |
   | `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string from Step 1 |
   | `JWT_SECRET` | `your-super-long-random-secret-key-32-chars` | Random secure string |
   | `JWT_EXPIRES_IN` | `7d` | Token validity |
   | `ADMIN_WHATSAPP` | `919XXXXXXXXX` | Your WhatsApp number with country code (no `+`) |
   | `CLIENT_ORIGIN` | `https://your-app.vercel.app` | Leave blank or update after Vercel deployment |

5. **Deploy**:
   - Click **Create Web Service**.
   - Render will build and deploy your API in ~2 minutes.
   - Once complete, copy your Render live URL:
     ```
     https://tasty-namkeens-api.onrender.com
     ```
6. **Verify Backend Health**:
   Open in your browser:
   ```
   https://tasty-namkeens-api.onrender.com/api/health
   ```
   You should see:
   ```json
   { "success": true, "message": "🥜 Tasty Namkeens API is running!" }
   ```

---

## Step 4: Populate Cloud Database with 50+ Snack Varieties

Run the production cloud seeder from your local terminal pointing to MongoDB Atlas:

```powershell
cd "C:\Users\Sai Charan Reddy\.gemini\antigravity\scratch\tasty-namkeens\server"

# Run seed against your MongoDB Atlas cloud database:
node src/seedProd.js "mongodb+srv://tastyadmin:YourPassword@cluster.mongodb.net/tasty-namkeens?retryWrites=true&w=majority"
```

This immediately initializes:
- ✅ **1 Master Admin Account**: `admin@tastynam-keens.com` / `Admin@TastyNamkeens2024`
- ✅ **52 Signature Snack Varieties** (Bhujia, Chivda, Lentil Snacks, Mathri, Peanuts, Mixtures, Chips)
- ✅ **2 Physical Supermarket Store Profiles**
- ✅ **2 Supermarket Wholesale Accounts**:
  - `srilakshmi@example.com` / `Supermarket@123`
  - `balaji@example.com` / `Supermarket@456`

---

## Step 5: Deploy Frontend Client to Vercel

1. **Sign in to Vercel**:
   - Go to [vercel.com](https://vercel.com) &rarr; Sign in with GitHub.
2. **Import Repository**:
   - Click **Add New... &rarr; Project**.
   - Select the `tasty-namkeens` repository.
3. **Configure Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** &rarr; Select `client` folder.
   - **Build Command**: `npm run build` (or `vite build`)
   - **Output Directory**: `dist`
4. **Set Environment Variables**:
   Under **Environment Variables**, add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_BASE_URL` | `https://tasty-namkeens-api.onrender.com/api` |

   *(Use the live Render backend URL from Step 3).*

5. **Deploy**:
   - Click **Deploy**.
   - In ~45 seconds, Vercel will build and assign your production domain:
     ```
     https://tasty-namkeens.vercel.app
     ```
6. **Connect CORS in Render**:
   - Go back to Render Dashboard &rarr; `tasty-namkeens-api` &rarr; **Environment**.
   - Set `CLIENT_ORIGIN` to: `https://tasty-namkeens.vercel.app`.
   - *(Note: Our backend already dynamically accepts `*.vercel.app` domains automatically).*

---

## Step 6: End-to-End Live Verification Checklist

Test the live deployed application across the 5 core user journeys:

- [ ] **Public Catalog**: Visit `https://tasty-namkeens.vercel.app`. Confirm all 50+ snack varieties are displayed with search & category filters.
- [ ] **Wholesale Price Security**: Open Chrome DevTools &rarr; Network tab &rarr; Inspect `GET /api/products`. Confirm `wholesalePrice` and `minOrderQty` are **completely absent** from the public payload.
- [ ] **B2C Store Finder**: Click **"Find Nearby Store"** on any snack. Confirm the modal pops up showing store addresses, phone numbers, and Google Maps links.
- [ ] **Supermarket Onboarding**: Click **"Request Account via WhatsApp"**. Verify it opens WhatsApp to the Admin phone number with the pre-filled verification template.
- [ ] **Supermarket Login & Bulk Order**:
  - Go to `/login` &rarr; click **Store #1** (or enter `srilakshmi@example.com` / `Supermarket@123`).
  - Confirm wholesale prices become visible.
  - Test quantity selector (respects minimum packet order quantity).
  - Place a wholesale test order &rarr; verify order appears in **Order History**.
- [ ] **Master Admin Console**:
  - Log in as Admin (`admin@tastynam-keens.com` / `Admin@TastyNamkeens2024`).
  - View incoming bulk orders &rarr; update status (`Approved` &rarr; `Dispatched`).
  - Test manual supermarket account creation in **Issue Supermarket Credentials**.

---

## 🔒 Production Security Best Practices

1. **Rotate Passwords**: Change the default admin password (`Admin@TastyNamkeens2024`) upon first login.
2. **MongoDB Atlas IP Access**: If deploying on a dedicated server with static IP, restrict Atlas IP access from `0.0.0.0/0` to your specific server IP.
3. **Custom Domains**:
   - Add your custom domain (e.g. `tastynamkeens.com`) in Vercel &rarr; Settings &rarr; Domains.
   - Point your DNS A/CNAME records as guided by Vercel.
