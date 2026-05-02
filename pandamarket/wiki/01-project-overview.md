# 01 — Project Overview

## What is PandaMarket?

PandaMarket is a **hybrid MaaS/SaaS platform** built for the Tunisian market. Think of it as a combination of:

- **Shopify** → Each vendor gets their own storefront (subdomain like `monshop.pandamarket.tn`)
- **Amazon** → All products are also visible on a central marketplace hub

### Key Features

| Feature | Description |
|---------|-------------|
| 🏪 Multi-tenant stores | Each vendor gets their own branded storefront |
| 🛒 Central marketplace | Hub page aggregates all vendor products |
| 💳 Tunisian payments | Flouci, Konnect, Mandat Minute, Cash on Delivery |
| 🤖 AI-powered SEO | Google Gemini generates product descriptions |
| 👛 Escrow wallet | Hold vendor funds until delivery confirmation |
| 🔍 Full-text search | Meilisearch-powered instant product search |
| 📦 Digital products | Download links with presigned S3 URLs |
| 🔐 KYC verification | Vendors submit RC + CIN documents for verification |
| 📊 7 subscription tiers | Free → Starter → Regular → Agency → Pro → Golden → Platinum |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      INTERNET                            │
│                         │                                │
│              ┌──────────▼──────────┐                     │
│              │  Caddy (HTTPS/SSL)  │                     │
│              │  Reverse Proxy      │                     │
│              └──────────┬──────────┘                     │
│           ┌─────────────┼─────────────┐                  │
│           ▼             ▼             ▼                   │
│   ┌──────────┐  ┌──────────────┐  ┌────────────┐        │
│   │ Frontend │  │   Backend    │  │ Meilisearch│        │
│   │ Next.js  │  │  Medusa v2   │  │  Search    │        │
│   │ :3000    │  │  :9000       │  │  :7700     │        │
│   └──────────┘  └──────┬───────┘  └────────────┘        │
│                        │                                 │
│           ┌────────────┼────────────┐                    │
│           ▼            ▼            ▼                    │
│   ┌────────────┐ ┌──────────┐ ┌─────────┐               │
│   │ PostgreSQL │ │  Redis   │ │  MinIO  │               │
│   │  :5432     │ │  :6379   │ │  :9000  │               │
│   └────────────┘ └──────────┘ └─────────┘               │
└─────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | ≥ 20.x | Runtime |
| **MedusaJS v2** | 2.14.2 | E-commerce framework |
| **TypeScript** | 5.6+ | Type safety |
| **PostgreSQL** | 16 | Primary database |
| **Redis** | 7.2 | Caching, event bus, sessions |
| **Meilisearch** | 1.8 | Full-text product search |
| **MinIO** | Latest | S3-compatible object storage |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 14.2 | React framework (SSR) |
| **React** | 18.3 | UI library |
| **SWR** | 2.2 | Data fetching |
| **Lucide React** | 1.14 | Icons |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Docker & Docker Compose** | Run infrastructure services |
| **Caddy** | Reverse proxy with automatic HTTPS |

---

## Subscription Plans

| Plan | Products | Commission | AI SEO | Custom Domain | Price/Year |
|------|----------|------------|--------|---------------|------------|
| Free | 10 | 15% | ❌ | ❌ | 0 TND |
| Starter | 50 | 0% | ✅ | ✅ | 300 TND |
| Regular | 100 | 0% | ✅ | ✅ | 600 TND |
| Agency | 300 | 0% | ✅ | ✅ | 1,200 TND |
| Pro | Unlimited | 0% | ✅ | ✅ | 2,400 TND |
| Golden | Unlimited | 0% | ✅ | ✅ | 4,800 TND |
| Platinum | Unlimited | 0% | ✅ (White-label) | ✅ | 9,600 TND |

---

## Payment Methods

| Method | Type | How it works |
|--------|------|-------------|
| **Flouci** | Online (card/e-wallet) | Redirect to Flouci payment page |
| **Konnect** | Online (card) | Redirect to Konnect payment page |
| **Mandat Minute** | Offline (post office) | Buyer sends money via post, uploads proof, admin verifies |
| **Cash on Delivery** | Offline | Payment collected at delivery |

---

> **Next step:** [02 — Prerequisites for Windows](./02-prerequisites-windows.md)
