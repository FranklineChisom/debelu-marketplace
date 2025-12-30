# Debelu Marketplace - User Guide 📘

Welcome to the Debelu Marketplace ecosystem! this guide covers the three main roles in the application: **Buyer**, **Vendor**, and **Admin**.

---

## 🛍️ Buyer Guide
*Experience the marketplace as a student looking for products.*

### 1. Getting Started
- **Browse**: Visit the homepage to see featured products and categories.
- **Search**: Use the search bar to find specific items (e.g., "Laptop", "Pastries").
- **Account**: You are automatically logged in as a mock user (`user-1`), so you can access your profile immediately.

### 2. Making a Purchase
1.  **Add to Cart**: Click the "Add to Cart" button on any product card.
2.  **Checkout**: Click the cart icon in the top right and select "Checkout".
3.  **Shipping**: Select a saved address (e.g., "Moremi Hall") or add a new one.
4.  **Payment**: Choose a payment method (e.g., "Bank Transfer" or saved Card).
5.  **Place Order**: Confirm your order. You will receive an **Order Number** (e.g., `ORD-X7Y9Z`).

### 3. Order Tracking
- Navigate to **Profile > Orders** to view your order history.
- Click on an order to see its current status (Pending, Processing, Delivered).

---

## 🏪 Vendor Guide
*Manage your store, products, and sales.*

### 1. Access Vendor Dashboard
- Click the **"Start Selling"** or **"Vendor Dashboard"** link in the user menu.
- Alternatively, go to `/vendor/dashboard`.

### 2. Dashboard Overview
- **Stats**: Real-time view of Total Revenue, Order Count, and Sold Products.
- **Activity**: See the latest orders coming in.
- **Top Products**: View your best-selling items by revenue.

### 3. Managing Products
- Go to **Products** in the sidebar.
- Click **"Add Product"** to create a new listing.
- Fill in details like Name, Price, Category, and Inventory count.

### 4. Fulfilling Orders
- Go to **Orders** in the sidebar.
- Click on a "Pending" order to view details.
- Use the **"Process Order"** action to update status to *Processing* and then *Delivered*.

---

## 🛡️ Admin Guide
*Oversee the entire platform operation.*

### 1. Access Admin Panel
- Navigate to `/admin` (Mock access: unrestricted for demo purposes).

### 2. Platform Overview
- View global metrics: Total Platform Revenue, Total Active Users, Pending Vendor Approvals.
- **Revenue Chart**: Visual graph of weekly sales performance.

### 3. Vendor Management
- **Verification**: Go to **Vendors > Pending** to review new store applications.
- **Actions**: Approve credible vendors or reject incomplete applications.
- **Suspension**: Temporarily disable vendors violating policies.

### 4. Global Order View
- See every order placed across the entire marketplace.
- Useful for dispute resolution and platform auditing.

---

## 🛠️ Technical Notes (for Developers)
- **State Management**: The app uses `zustand` with `localStorage` persistence. Data resets if you clear your browser cache.
- **Resetting Data**: You can manually clear local storage to reset the demo state to defaults.
