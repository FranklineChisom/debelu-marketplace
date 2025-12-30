# Debelu Marketplace - Demo Script 🎬

**Goal**: Demonstrate the end-to-end flow of the marketplace, highlighting the synchronization between Buyer, Vendor, and Admin experiences.

---

## Scene 1: The Shopper (Buyer Experience)
**Narrator**: "Let's start by looking at the experience for a UNILAG student."

1.  **Homepage**:
    - Show the landing page. Scroll through "Featured Products".
    - Highlight the clean UI and "Campus Essentials" categories.
2.  **Add to Cart**:
    - Click on **"Dell Inspiron 15"** (or any product).
    - Show the Product Details (Price, Vendor Name, Description).
    - Click **"Add to Cart"**.
3.  **Checkout Flow**:
    - Go to **Cart** -> **Checkout**.
    - **Modal 1**: Change Address (Select "Moremi Hall").
    - **Modal 2**: Select "Bank Transfer".
    - Click **"Confirm Order"**.
    - *Action*: Wait for "Order placed successfully" toast. Note the **Order Number**.

---

## Scene 2: The Business Owner (Vendor Experience)
**Narrator**: "Now, let's switch hats. How does the vendor see this sale?"

1.  **Switch to Vendor**:
    - Go to `/vendor/dashboard`.
2.  **Dashboard Sync**:
    - Point out the **Recent Orders** list. The new order should be at the top!
    - Show the **Revenue** card. It has increased by the order amount.
3.  **Order Processing**:
    - Click on the new order.
    - Change status from **Pending** -> **Processing**.
    - Explain: "This notifies the student that their item is on the way."

---

## Scene 3: The Administrator (Platform Oversight)
**Narrator**: "Finally, how do we manage the platform?"

1.  **Switch to Admin**:
    -  Go to `/admin`.
2.  **Global Stats**:
    - Show the **Total Revenue** chart and **Active Orders** count.
3.  **Vendor Management**:
    - Go to **Vendors** page.
    - Show the "Pending Verification" tab (if any) or existing vendors list.
    - Demonstrate ability to "View Details" of a vendor.

---

## Closing
**Narrator**: "And that is Debelu Marketplace. A seamless, synchronized ecosystem connecting Students, Vendors, and Administrators locally."
