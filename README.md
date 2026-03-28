# PropertyLoop 🏠

**Nigeria's Next-Generation Real Estate & Home Services Platform**

> From first search to signed contract — and everything that happens after the keys are handed over.

---

## Table of Contents

- [Overview](#overview)
- [The Problem We're Solving](#the-problem-were-solving)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development Phases](#development-phases)
- [Architecture Overview](#architecture-overview)
- [Key Concepts](#key-concepts)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

PropertyLoop is a full-stack real estate and home services platform built specifically for the Nigerian market. Unlike existing platforms that stop at listing and lead generation, PropertyLoop closes the entire loop — from property discovery to signed tenancy agreement, and beyond into ongoing home management via the **Service Loop**.

**Three things no competitor has:**

| Feature                 | What It Does                                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 🔁 **The Service Loop** | Verified home service vendors (plumbers, electricians, builders) bookable and payable inside the platform              |
| 🔒 **Service Escrow**   | Paystack-powered escrow protects users on every vendor payment — funds only release when the job is confirmed complete |
| 📋 **Property Logbook** | A permanent, verifiable digital maintenance history attached to every property ID on the platform                      |

---

## The Problem We're Solving

| Problem              | Reality in Nigeria Today                                      | PropertyLoop's Answer                                             |
| -------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| Inflated Pricing     | No price history; agents re-list at higher prices freely      | Full price history on every listing                               |
| Weak Trust           | Verification is a paid add-on; scams are widespread           | KYC-verified agents by default — no individual landlord listings  |
| No Transactions      | Platform generates leads then steps aside                     | Offers, e-signing, escrow, shortlet booking — all in-platform     |
| No Local Data        | Zero neighbourhood-level insights on any Nigerian platform    | Hyperlocal scores: power, flood risk, roads, schools, safety      |
| Poor Agent Tools     | No CRM, no analytics, no lead tracking                        | Full agent CRM with pipeline and per-listing analytics            |
| No Post-Move Support | Users leave platform to find plumbers, builders, electricians | Verified Service Vendors onboarded — payments via escrow          |
| No Property History  | No way to verify a property's maintenance record              | Property Logbook: every repair/service stored against property ID |

---

## Core Features

### 🏘️ Listings

- Buy, Rent, Shortlet, and New Developments — all through KYC-verified agents
- Map-based search with interactive price pins
- Advanced filters: type, location, price range, beds, baths
- Price history timeline on every listing
- Virtual tour / 360° video embedding
- Verified C of O document uploads

### 👤 Agent-First Model

- All listings flow through Verified Real Estate Agents — no individual landlord posts
- Agent profile pages: photo, phone, business address, website, verified badge
- Agent KYC via Smile Identity or Dojah
- Agent CRM dashboard with deal pipeline stages
- Per-listing analytics and lead tracking

### 🔁 Service Loop

- Hire verified plumbers, electricians, builders, cleaners, designers, and more
- All vendors are KYC-verified before onboarding
- In-platform job booking and scheduling
- Service Escrow via Paystack — funds held until job is confirmed complete
- Every completed job auto-logged to the Property Logbook

### 📋 Property Logbook

- Unique Property ID assigned to every listing
- Permanent maintenance history: what was repaired, when, and by which verified vendor
- Accessible to prospective buyers and tenants for due diligence
- Builds compounding property value and platform data moat

### 📍 Neighbourhood Intelligence

- Power availability score
- Flood risk rating
- Road quality indicator
- Proximity to schools and hospitals
- Safety/crime index per LGA
- Service Reliability Score: how easy it is to find quality vendors in a specific area

### 💳 Transactions

- Shortlet instant booking with Paystack integration
- Rental deposit escrow
- E-signing of tenancy and sale agreements (via DocuSeal)
- Offer submission and negotiation management on-platform

### 📊 Data & Intelligence (Phase 4)

- AI natural language property search
- Commute-time filter with Lagos traffic data
- Predictive pricing: neighbourhood-level price forecasts
- Demand heatmap: most-searched areas visualised on map
- Quarterly market reports (downloadable)
- Market data licensing API for banks, developers, and investors

---

## Tech Stack

| Layer             | Technology                               | Reason                                                 |
| ----------------- | ---------------------------------------- | ------------------------------------------------------ |
| Frontend          | Next.js (React)                          | SSR critical for SEO; fast page loads on mobile        |
| Backend / API     | Node.js + Express or Django REST         | Fast, well-supported, large Nigerian dev community     |
| Database          | PostgreSQL + PostGIS                     | Geo queries for map search; reliable relational data   |
| Search            | Typesense or Elasticsearch               | Sub-100ms filtered search across 100k+ listings        |
| File Storage      | Cloudinary / AWS S3                      | Property images, virtual tour assets, document uploads |
| Authentication    | Clerk or custom JWT                      | Agent and buyer accounts with role-based access        |
| Payments / Escrow | Paystack                                 | Nigeria-native; supports escrow, recurring, and splits |
| Maps              | Mapbox or Google Maps API                | Interactive map search and neighbourhood overlays      |
| Notifications     | Termii (SMS) + Firebase (push)           | SMS matters in Nigeria; Termii is local and reliable   |
| Analytics         | PostHog or Mixpanel                      | Product analytics and user behaviour tracking          |
| E-Signing         | DocuSeal (open source) or YouSign        | Tenancy and sale agreement signing                     |
| KYC               | Smile Identity or Dojah                  | Nigerian-native identity verification API              |
| Hosting           | Vercel (frontend) + Railway/Render (API) | Fast deploys, scalable, cost-effective for early stage |

---

## Project Structure

```
propertyloop/
├── apps/
│   ├── web/                  # Next.js frontend
│   │   ├── app/              # App router pages
│   │   ├── components/       # Shared UI components
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utilities and helpers
│   └── api/                  # Backend API (Node.js or Django)
│       ├── routes/           # API route handlers
│       ├── controllers/      # Business logic
│       ├── models/           # Database models
│       ├── middleware/        # Auth, validation, rate limiting
│       └── services/         # External integrations (Paystack, Termii, etc.)
├── packages/
│   ├── database/             # PostgreSQL schema, migrations (Prisma or Drizzle)
│   ├── types/                # Shared TypeScript types
│   └── config/               # Shared config across apps
├── docs/                     # Additional documentation
├── scripts/                  # Database seeds, utility scripts
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 14 with PostGIS extension
- A Paystack account (test keys for development)
- A Mapbox or Google Maps API key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/propertyloop.git
cd propertyloop

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your keys (see Environment Variables below)

# Run database migrations
npm run db:migrate

# Seed with sample data (optional)
npm run db:seed

# Start development servers
npm run dev
```

The web app will be available at `http://localhost:3000`
The API will be available at `http://localhost:4000`

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/propertyloop

# Authentication
JWT_SECRET=your_jwt_secret_here
CLERK_SECRET_KEY=your_clerk_secret              # if using Clerk

# Payments
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxx

# Maps
MAPBOX_ACCESS_TOKEN=pk.eyJ1...                  # or use GOOGLE_MAPS_API_KEY
GOOGLE_MAPS_API_KEY=AIza...

# File Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Notifications
TERMII_API_KEY=your_termii_key                  # SMS
FIREBASE_SERVER_KEY=your_firebase_key           # Push notifications

# KYC
SMILE_IDENTITY_API_KEY=your_smile_key          # or DOJAH_API_KEY
DOJAH_APP_ID=your_dojah_app_id

# E-Signing
DOCUSEAL_API_KEY=your_docuseal_key

# Analytics
POSTHOG_API_KEY=your_posthog_key
```

---

## Development Phases

### Phase 1 — Foundation (Months 1–4)

Core listings platform: Buy, Rent, Shortlet, and New Developments through verified agents. Map search, user accounts, SEO-optimised URLs, mobile-responsive frontend.

### Phase 2 — Trust, Data & Vendor Onboarding (Months 5–7)

Price history tracking, C of O document verification, agent KYC, neighbourhood scorecards, saved searches with SMS/push alerts, mortgage calculator, review system, and beginning of verified vendor onboarding.

### Phase 3 — Transactions, Agent Tools & Service Escrow (Months 8–12)

Shortlet booking with Paystack, rental escrow, e-signing, offer management, agent CRM dashboard, Service Loop launch, Service Escrow launch, demand heatmap, rental yield calculator.

### Phase 4 — Growth, Intelligence & Property Logbook (Months 13–18)

Property Logbook launch, Service Reliability Score per LGA, AI natural language search, commute-time filter, predictive pricing, quarterly market reports, Abuja/Port Harcourt/Kano/Ibadan expansion, developer portal, and market data licensing API.

---

## Architecture Overview

```
User / Agent / Vendor
        │
        ▼
   Next.js Frontend (Vercel)
        │
        ▼
   API Layer (Express / Django)
   ├── Auth middleware (JWT / Clerk)
   ├── Role-based access (Buyer | Agent | Vendor | Admin)
   └── Rate limiting
        │
        ├──► PostgreSQL + PostGIS (Listings, Agents, Vendors, Logbook)
        ├──► Typesense (Full-text & filtered search)
        ├──► Cloudinary / S3 (Images, documents, virtual tours)
        ├──► Paystack (Payments, escrow, splits)
        ├──► Mapbox / Google Maps (Map search, neighbourhood overlays)
        ├──► Termii + Firebase (SMS + push notifications)
        ├──► Smile Identity / Dojah (Agent & vendor KYC)
        └──► DocuSeal (E-signing)
```

---

## Key Concepts

### Property ID

Every property listed on PropertyLoop is assigned a unique, permanent Property ID. This ID persists across listing changes, ownership transfers, and agent changes. It is the anchor for the Property Logbook.

### Escrow Flow

```
User initiates payment
        │
        ▼
Funds deposited to Paystack escrow
(vendor receives nothing yet)
        │
        ▼
Vendor completes job, submits completion request
        │
        ▼
User confirms completion (or raises dispute)
        │
        ▼
Paystack releases funds to vendor
minus PropertyLoop service fee
        │
        ▼
Service record auto-logged to Property Logbook
```

### Agent-First Model

PropertyLoop does not accept listings from individual landlords. All listings are posted and managed by KYC-verified real estate agents. This is a structural trust decision — it raises listing quality and makes agents core platform stakeholders rather than occasional users.

### Verified Vendor Onboarding

Service vendors (plumbers, electricians, builders, cleaners, etc.) go through a KYC process before appearing on the platform. Only verified vendors can accept jobs and receive escrow payments.

---

## API Reference

Full API documentation is available in `/docs/api.md` or via the Swagger UI at `http://localhost:4000/docs` when running in development mode.

Key endpoint groups:

- `POST /api/listings` — Create a new property listing (agents only)
- `GET /api/listings/search` — Search listings with filters and geo queries
- `GET /api/listings/:id/price-history` — Fetch full price history for a listing
- `GET /api/properties/:propertyId/logbook` — Fetch the Property Logbook
- `POST /api/escrow/initiate` — Initiate an escrow payment via Paystack
- `POST /api/escrow/:id/confirm` — Confirm job completion and release funds
- `GET /api/neighbourhoods/:lga/score` — Fetch neighbourhood scorecard for an LGA
- `GET /api/vendors?category=plumber&lga=Yaba` — Search verified vendors by category and location

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the existing code style and write tests for new features.

---

## License

Proprietary — PropertyLoop © 2026. All rights reserved.

---

_PropertyLoop Product Development Plan v2.0 | March 2026_
#   p r o p e r t y l o o p _ f r o n t e n d  
 