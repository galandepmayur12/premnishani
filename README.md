# Premnishani — Premium Gifting E-Commerce Platform

Production-ready e-commerce for customizable gifts: couple gifts, photo frames, hampers, engraved & personalized items.

## Stack

- **Frontend:** Next.js 14, TypeScript, TailwindCSS, Zustand, Framer Motion
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL
- **Payments:** Razorpay, Stripe
- **Auth:** JWT
- **Deploy:** Frontend → Vercel, Backend → Docker + AWS ECS

## Project structure

```
premnishani/
├── frontend/       # Next.js storefront
├── backend/        # FastAPI API
├── admin-dashboard/ # Admin UI (Next.js)
├── docker-compose.yml
└── README.md
```

## Quick start

### 1. Database

```bash
docker run -d --name premnishani-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=premnishani -p 5432:5432 postgres:15-alpine
```

Or use Docker Compose:

```bash
docker-compose up -d db
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env      # edit .env with your keys
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

**Seed products** (images in `frontend/public/images/`):

```bash
cd backend
python seed_products.py
```

### 3. Frontend

```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev
```

Storefront: http://localhost:3000

### 4. Admin dashboard

```bash
cd admin-dashboard
npm install
npm run dev
```

Admin: http://localhost:3001

## Environment

### Backend (`.env`)

- `DATABASE_URL` / `DATABASE_URL_SYNC` — PostgreSQL URLs
- `SECRET_KEY` — JWT secret
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- `AWS_*` for S3 uploads (optional)
- `CORS_ORIGINS` — allowed frontend origins

### Frontend (`.env.local`)

- `NEXT_PUBLIC_API_URL` — backend base URL (e.g. `http://localhost:8000`)

## Features

- **Landing:** Hero, featured, best sellers, categories, newsletter
- **Catalog:** Filters (category, price, sort), product detail with customization
- **Auth:** Signup, login, JWT, optional Google & password reset
- **Cart:** Add/update/remove, coupon (API ready)
- **Checkout:** 3 steps — shipping, payment (Razorpay/Stripe), review
- **Orders:** Create order, payment session, webhooks, order history
- **Admin:** Products CRUD, orders list/status, analytics (revenue, top products)
- **Wishlist, gift message, referral** (API scaffolding in place)

## Deployment

- **Frontend:** Connect repo to Vercel, set `NEXT_PUBLIC_API_URL` to your API URL.
- **Backend:** Build Docker image from `backend/Dockerfile`, run on ECS (or any host) with PostgreSQL and env vars set.

## License

Proprietary.
