# 🥜 Tasty Namkeens — Business Owner & Site Administrator Manual
### The Complete Non-Technical Guide to Running Your Wholesale B2B Snacks Platform

Welcome to the official **Tasty Namkeens Administration Manual**. This guide is written in plain, friendly English for business owners, inventory managers, and customer support staff. You **do not need any coding, technical, or computer science knowledge** to operate your online wholesale platform.

---

## 📑 Table of Contents
1. [Executive Overview & Security Rules](#1-executive-overview--security-rules)
2. [How New Supermarkets Join (WhatsApp Onboarding Flow)](#2-how-new-supermarkets-join-whatsapp-onboarding-flow)
3. [Admin Portal Login Guide](#3-admin-portal-login-guide)
4. [Product Catalog Management Guide (No-Code GUI)](#4-product-catalog-management-guide-no-code-gui)
5. [Store Finder & Retail Network Management](#5-store-finder--retail-network-management)
6. [B2B Wholesale Order Processing Lifecycle](#6-b2b-wholesale-order-processing-lifecycle)
7. [Owner Quick-Reference Cheatsheet](#7-owner-quick-reference-cheatsheet)

---

## 1. Executive Overview & Security Rules

### 🛡️ Why Public Registration is Disabled
Unlike regular retail shopping websites (like Amazon or Flipkart), **Tasty Namkeens is a protected B2B (Business-to-Business) manufacturer platform**. 

> **Important Business Policy:**  
> Direct consumers and retail shoppers **cannot** buy snacks directly from this website, and random visitors **cannot** register accounts online.

#### Why is the website designed this way?
1. **Protects Wholesale Margins**: Your confidential discounted bulk prices (`Wholesale Rates`) are completely hidden from the public, competitors, and retail shoppers.
2. **Prevents Fake Orders**: Only genuine, verified supermarket owners with real physical stores can place orders.
3. **Drives Foot Traffic to Local Stores**: When ordinary shoppers visit the website to check out snacks, the website guides them to visit your authorized partner supermarkets in person using the **"Find Nearby Store"** button.

---

## 2. How New Supermarkets Join (WhatsApp Onboarding Flow)

Every supermarket that orders from you follows a simple, 5-step VIP onboarding process:

```
[ Supermarket Owner ]  ──►  Clicks "Request Account via WhatsApp" button on website
          │
          ▼
[ WhatsApp Chat ]      ──►  Pre-filled message arrives directly on your phone (+91 XXXXXXXXXX)
          │
          ▼
[ Owner Verifies ]     ──►  You check their store name, location, and GST/FSSAI details in chat
          │
          ▼
[ Admin Dashboard ]    ──►  You click "Issue Supermarket Credentials" & type their email + password
          │
          ▼
[ Account Active ]     ──►  You message them their login details & they can start ordering bulk!
```

### Detailed Step-by-Step Breakdown:

1. **Supermarket Visits Your Website**:  
   The supermarket owner opens `tastynamkeens.com` on their phone or computer.
2. **Clicks WhatsApp Button**:  
   They click the green button labeled **"Request Account via WhatsApp"** or **"Supermarket Registration"**.
3. **Pre-filled Message Reaches You**:  
   Their phone automatically opens WhatsApp with a ready-made message sent to your WhatsApp number:
   > *"Hello Admin, I am a supermarket owner and I want to register my store on Tasty Namkeens to place wholesale snack orders."*
4. **Quick Verification Chat**:  
   Ask them for their supermarket name, city address, and phone number.
5. **You Issue Their Login**:  
   Open your Admin Portal &rarr; go to the **"Issue Supermarket Credentials"** tab &rarr; enter their store name, email, and temporary password (e.g. `Store@2026`).
6. **Send Password Back on WhatsApp**:  
   Reply to them with:  
   > *"Welcome to Tasty Namkeens! Your wholesale portal account is ready. Log in at `tastynamkeens.com/login` with Email: `their-email@gmail.com` and Password: `Store@2026`."*

---

## 3. Admin Portal Login Guide

As the master business owner, you have full control over the website through the secure **Admin Dashboard**.

### How to Log In:
1. Open your website in any browser (Chrome, Safari, Edge):  
   `https://tastynamkeens.com` (or `http://localhost:3000` during local testing).
2. Click the **"Portal Login"** button located at the top right of the navigation header (or go directly to `tastynamkeens.com/login`).
3. Enter your Master Admin credentials:
   - **Email**: `admin@tastynam-keens.com`
   - **Password**: `Admin@TastyNamkeens2024` *(or your custom password)*
4. Click **"Sign In to Portal"**.
5. The system recognizes your administrator role and automatically directs you to the **Master Admin Console**.

> **Pro Tip for Testing**:  
> On the login page, you will notice a section called **"Quick-Fill Test Credentials"**. Clicking the **"🔐 Admin"** button instantly fills in the login details so you don't have to retype them every time.

### Logging Out:
When you are finished managing orders, click the **"Sign Out"** button at the top right corner of the dashboard to lock the console.

---

## 4. Product Catalog Management Guide (No-Code GUI)

Your website can display **50+ varieties** of namkeens, bhujias, chivdas, mathris, and roasted snacks. You can manage all products directly without touching a single line of code.

### A. Adding a New Snack Item
When your kitchen or manufacturing unit launches a new snack:
1. Log in to the Admin Portal.
2. Navigate to the **"Catalog Management"** section and click the red **"+ Add New Product"** button.
3. Complete the simple form fields:
   - **Product Name**: e.g., *Methi Mathri*, *Kashmiri Mixture*, *Ratlami Sev*.
   - **Category**: Select from the dropdown (*Bhujia, Chivda, Lentil Snacks, Mathri, Peanuts, Mixture, Chips, Namkeens*).
   - **Net Weight**: e.g., *200g*, *250g*, *500g*, *1kg*.
   - **Wholesale Bulk Price (₹)**: Your discounted bulk price per packet charged to supermarkets (e.g., *₹55*).  
     *(Remember: Retail shoppers browsing the website CANNOT see this price).*
   - **Minimum Order Quantity (MOQ)**: The minimum number of packets a supermarket must order in a single batch (e.g., *20 packets*).
   - **Description**: A short, appetizing 1–2 sentence summary explaining the flavor and crunch.
   - **Ingredients**: e.g., *Chickpea flour, edible oil, red chilli, ajwain, rock salt*.
   - **Photo / Image URL**: Paste the link or upload the product packaging photo.
4. Click **"Save & Publish Snack"**. The new snack immediately appears on the live public website!

### B. Modifying Existing Snacks (Price Changes & Discounts)
If ingredient costs change or you want to offer a festival promotion:
1. Locate the snack card in the product list.
2. Click **"Edit Snack"** (pencil icon).
3. Update the **Wholesale Bulk Price (₹)** or the **Minimum Order Quantity**.
4. Click **"Save Changes"**.
> **Important Note on Past Orders**:  
> Changing a snack's price today will **never change past invoices or past orders**. The system always preserves the original price agreed upon at the exact moment the supermarket placed the order.

### C. Temporarily Hiding vs. Permanently Deleting Snacks
- **Temporarily Out of Stock (Soft Deactivate)**:  
  If raw materials run out or a batch is temporarily unavailable, simply toggle the snack's status from **"Active"** to **"Inactive"**. The snack immediately vanishes from public view, but your historical sales records remain completely intact.
- **Permanent Deletion**:  
  Only use the delete button if a product was entered by mistake and has never been ordered before.

---

## 5. Store Finder & Retail Network Management

This is one of the most powerful features of your platform. It turns casual online visitors into paying customers for your partner supermarkets!

```
[ Online Visitor Browsing Website ]
                  │
                  ▼
   Views "Aloo Bhujia (200g)"
                  │
                  ▼
   Clicks "Find Nearby Store"
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│  Interactive Modal Pops Up:                            │
│  • Sri Lakshmi Supermarket — Ameerpet, Hyderabad       │
│  • Phone: 9876543210 (Click to Call)                   │
│  • [ WhatsApp Store ]  [ Get Directions on Maps ]      │
└────────────────────────────────────────────────────────┘
```

### Adding a New Physical Supermarket Location:
When a new supermarket becomes your official retail stockist:
1. In the Admin Dashboard, click the **"Retail Stores"** tab.
2. Click **"+ Register Retail Store"**.
3. Fill in the store's public details:
   - **Store Name**: e.g., *Sri Balaji Supermarket*.
   - **Owner / Manager Name**: e.g., *Suresh Reddy*.
   - **Street Address & Landmark**: e.g., *Shop #14, Main Road, Near Metro Pillar 1042*.
   - **City & Pincode**: e.g., *Hyderabad, 500016*.
   - **Phone Number**: The store's counter contact number for customer inquiries.
   - **WhatsApp Number**: For customers to ask the store about stock availability.
   - **Store Hours**: e.g., *Mon–Sun: 8:00 AM – 10:00 PM*.
4. Click **"Save Store"**.

### Mapping Which Snacks the Store Stocks:
1. Click **"Map Products"** next to the store name.
2. Tick the checkboxes for the snack items that the supermarket currently has on its physical shelves.
3. Click **"Save Stock Mapping"**.
4. Now, whenever an online customer clicks **"Find Nearby Store"** on any of those snacks, this supermarket will show up at the top of the list!

---

## 6. B2B Wholesale Order Processing Lifecycle

When an authorized supermarket logs in, they select their desired snack quantities and submit a wholesale order. Here is how you manage those orders from placement to final delivery:

```
[ 1. PENDING ]     ──► Supermarket submits order on portal. You review quantities.
       │
       ▼
[ 2. APPROVED ]    ──► You verify payment / credit terms and send order to factory.
       │
       ▼
[ 3. DISPATCHED ]  ──► Cartons are loaded onto delivery truck / courier. Add vehicle note.
       │
       ▼
[ 4. DELIVERED ]   ──► Goods received at supermarket. Order successfully completed!
```

### Step-by-Step Order Fulfillment Instructions:

1. **Viewing Incoming Orders**:
   - In the Admin Dashboard, click the **"📦 Incoming Orders"** tab.
   - You will see a list of all wholesale orders arranged from newest to oldest.
2. **Reviewing Order Details**:
   - Each order card displays:
     - **Supermarket Name & Contact Phone**
     - **Date & Time of order**
     - **List of Snack Items, Packet Quantities, and Rate per packet**
     - **Total Order Value (₹)** *(automatically calculated)*
     - **Current Status Tag** (*Pending, Approved, Dispatched, Delivered*)
3. **Updating Order Status**:
   - To update progress, simply click the status dropdown menu on the right of the order card:
     - Select **"Approved"** once you have confirmed stock availability and payment arrangements.
     - Select **"Dispatched"** when the cartons leave your warehouse. You can enter an optional note (e.g., *"Dispatched via Express Cargo, Tempo #TS-09-UB-1234"*).
     - Select **"Delivered"** once the supermarket confirms receipt of the snacks.
4. **Supermarket Transparency**:
   - The supermarket owner can log into their own portal anytime, click **"Order History"**, and see the live status update and your dispatch notes in real time!

---

## 7. Owner Quick-Reference Cheatsheet

Keep this cheat sheet handy for day-to-day operations:

| What do you want to do? | Where to click in Admin Dashboard? | What action to take? |
|:---|:---|:---|
| **Check today's new wholesale orders** | **"Incoming Orders"** tab | Look for orders marked with yellow `● Pending` status. |
| **Mark an order as dispatched / shipped** | **"Incoming Orders"** tab | Change dropdown from `Approved` &rarr; `Dispatched` and enter tracking info. |
| **Give a new supermarket an account** | **"Issue Supermarket Credentials"** tab | Fill in Store Name, Email, Password & click `Create & Authorize Supermarket`. |
| **Temporarily block a supermarket** | **"Registered Supermarkets"** tab | Click the `Deactivate` button next to their name. |
| **Add a new snack to the website** | **"Catalog Management"** tab | Click `+ Add New Product`, fill in details, set wholesale price & MOQ. |
| **Change the price of a snack** | **"Catalog Management"** tab | Click `Edit` on the snack card, update Wholesale Price (₹), and save. |
| **Add a new supermarket location to Store Finder** | **"Retail Stores"** tab | Click `+ Register Retail Store`, enter address, and map stocked snacks. |
| **View overall business metrics** | **"Top Dashboard Bar"** | Check Total Products, Retail Stores, Pending Orders, and Active Retailers. |
| **Log out for the day** | Top right corner | Click the `Sign Out` button. |

---

## 📞 Support & Emergency Contact

- **Master Admin Technical Documentation**: [`DEPLOYMENT.md`](DEPLOYMENT.md) & [`README.md`](README.md)
- **Primary Business WhatsApp**: Configured inside `server/.env` under `ADMIN_WHATSAPP`.
- **System Health Check URL**: `https://tastynamkeens.com/api/health`

*Tasty Namkeens Platform — Engineered for Reliability, Privacy, and Wholesale Growth.*
