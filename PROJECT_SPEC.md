# Premnishani — Production E-Commerce Platform Specification

**Role:** You are a senior full-stack architect.

**Goal:** Build a production-ready e-commerce platform called **Premnishani**.

---

## Product Overview

**Premnishani** is a premium gifting brand selling customizable gifts such as:
- Couple gifts
- Photo frames
- Hampers
- Engraved gifts
- Personalized items

---

## Platform Requirements

The platform must support:

- Browsing products
- Customization
- User accounts
- Cart
- Checkout
- Payments
- Order tracking
- Admin dashboard

Use **modern scalable architecture**.

---

## Tech Stack

### Frontend
- **Next.js 14**
- **TypeScript**
- **TailwindCSS**
- **Zustand** (state management)

### Backend
- **FastAPI** (Python)

### Database
- **PostgreSQL**
- **Vector storage** (future AI features) — **ChromaDB**

### Payments
- **Razorpay**
- **Stripe**

### Auth
- **JWT**

### Image Storage
- **AWS S3**

### Deployment
- **Frontend** → Vercel
- **Backend** → Docker + AWS ECS

---

## Project Structure

Create this structure:

```
premnishani/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── utils/
│   └── styles/
├── backend/
│   ├── api/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── repositories/
│   ├── routers/
│   ├── middleware/
│   └── main.py
└── admin-dashboard/
    ├── pages/
    ├── components/
    ├── api/
    └── charts/
```

---

## Landing Page

Create a **premium landing page** with these sections.

### Hero Section
- **Headline:** Luxury Gifts That Tell Your Story
- **Subheadline:** Personalized Premium Gifting
- **CTA:** [Shop Now]

### Sections
1. **Featured Collections**
2. **Instagram Gallery**
3. **Best Sellers**
4. **Customizable Gifts**
5. **Customer Reviews**
6. **Gift Categories**
7. **Newsletter**

---

## Product Catalog

Create a **product browsing system**.

### Filters
- Category
- Price
- Popularity
- Personalization

### Example Categories
- Romantic Gifts
- Anniversary Gifts
- Wedding Gifts
- Birthday Gifts
- Luxury Hampers
- Corporate Gifts

---

## Product Page

The product page must support **customization options**.

### Example: Custom Photo Frame

**Customization fields:**
- Upload Photo
- Add Name
- Add Message
- Select Frame Color
- Select Font Style
- Gift Wrap Option

- **Dynamic price update**
- **Add preview component**

---

## Signup / Login System

Create authentication pages.

### Signup Fields
- Name
- Email
- Phone
- Password
- Confirm Password

### Login Fields
- Email
- Password

### Also Support
- **Google login**
- **Password reset**
- **JWT authentication**

---

## Cart System

### Features
- Add product to cart

### Cart Structure
- `product_id`
- `quantity`
- `customization_data`
- `price`

### Cart Page Must Allow
- Update quantity
- Remove item
- Apply coupon

---

## Checkout Flow

Create a **3-step checkout flow**.

### Step 1 — Shipping
**Fields:**
- Full Name
- Phone
- Email
- Address
- City
- State
- Zip
- Country

### Step 2 — Payment
**Payment options:**
- Razorpay
- Stripe
- UPI
- Credit Card
- Debit Card
- Net Banking

### Step 3 — Review
**Show:**
- Products
- Customizations
- Shipping
- Tax
- Total

**Button:** Place Order

---

## Payment Integration

### Integrate Razorpay
**Flow:**
1. Create order from backend
2. Return payment session
3. User completes payment
4. Webhook confirms payment
5. Create order record

**Also implement Stripe payment.**

---

## Order System — Database Tables

### Users
- `id`
- `name`
- `email`
- `password`
- `phone`
- `created_at`

### Products
- `id`
- `name`
- `description`
- `price`
- `category`
- `images`
- `stock`
- `customizable`

### Orders
- `id`
- `user_id`
- `status`
- `total_price`
- `payment_status`
- `created_at`

### Order Items
- `order_id`
- `product_id`
- `quantity`
- `customization_data`

---

## Admin Dashboard

Admin must manage:

### Products
- Add product
- Edit product
- Delete product
- Upload images
- Add customization options

### Orders
- View orders
- Update status
- Mark shipped
- Mark delivered

### Customers
- View users
- Order history

### Analytics
- Sales chart
- Top products
- Revenue

---

## Instagram Section

Add **Instagram integration**.

- Display grid of posts
- **Hashtag:** #PremnishaniMoments
- Use **Instagram Graph API**

---

## UI Design Style

**Luxury theme.**

### Colors
- **Primary:** `#C89B3C` (Gold)
- **Secondary:** `#000000` (Black)
- **Accent:** `#F5F3EE` (Cream)

### Fonts
- **Playfair Display**
- **Inter**

### Animations
- Use **Framer Motion**

---

## Additional Features

Implement:

- **Wishlist** — save gifts
- **Gift Message** — add card message
- **Coupon System** — apply coupon
- **Referral system**

---

## Security

Implement:

- **JWT auth**
- **HTTPS**
- **Rate limiting**
- **CSRF protection**

---

## Optional AI Features

Add **AI gift recommender**.

**User inputs:**
- Occasion
- Budget
- Relationship

**Return:** Recommended products.

---

## Output Requirements

Generate:

1. Complete backend API
2. Complete Next.js frontend
3. Admin dashboard
4. Database models
5. Payment integration
6. Cart and checkout logic
7. Docker files
8. README setup guide

**All code must be production-ready.**

---

## Bonus: UI Generation (Super Powerful)

If you want AI to generate the UI too, add:

> Also generate complete UI components with responsive design and beautiful luxury product cards similar to Apple store or premium gift websites.

---

## Future Vision: AI Personalized Gift Platform

Since you are also building AI SaaS products, Premnishani can become an **AI Personalized Gift Platform**.

### Features to Add
- **AI gift finder**
- **AI message generator**
- **AI gift card writing**
- **AI gift packaging preview**
