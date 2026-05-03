<div align="center">
  <picture>
    <img alt="PandaMarket Logo" src="https://github.com/prodypanda/MarkentiHub/assets/placeholder-logo.png" width="150" />
  </picture>
  <h1>PandaMarket 🐼</h1>
  <p><strong>The Production-Grade Hybrid MaaS/SaaS Platform for the Tunisian Market</strong></p>

  <p>
    <img src="https://img.shields.io/badge/MedusaJS-2.14.2-7B61FF?style=flat-square&logo=medusa" alt="MedusaJS" />
    <img src="https://img.shields.io/badge/Next.js-14.2-000000?style=flat-square&logo=nextdotjs" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Redis-7.2-DC382D?style=flat-square&logo=redis" alt="Redis" />
  </p>
</div>

---

## 📖 What is PandaMarket?

PandaMarket is a powerful, production-ready **hybrid MaaS/SaaS e-commerce platform**. It combines the best of two worlds:
- **The Shopify Model**: Every registered vendor gets their own dedicated, branded storefront (e.g., `monshop.pandamarket.tn`).
- **The Amazon Model**: All products from all vendors are aggregated into a single, highly searchable central marketplace hub.

Designed exclusively for the Tunisian market, it features built-in support for local payment gateways, offline payments, and multi-tenant isolation.

---

## ✨ Key Features

- **🏪 Multi-Tenant Architecture**: Complete tenant isolation, custom vendor subdomains, and automated store provisioning.
- **💳 Tunisian Payment Integrations**: Native support for Flouci, Konnect, Mandat Minute, and Cash on Delivery (COD).
- **🤖 AI-Powered SEO**: Built-in Google Gemini integration for automated product descriptions and metadata generation.
- **🔍 Blazing Fast Search**: Typo-tolerant, full-text instant search powered by Meilisearch.
- **📦 Digital & Physical Products**: Secure S3 presigned URLs for digital downloads.
- **🔐 Enterprise Security**: Custom rate limiting, strict Content Security Policies (CSP), HSTS headers, and tenant-isolated API middleware.
- **⚡ Real-Time WebSockets**: Live vendor dashboard notifications powered by Socket.io and Redis.
- **📊 Tiered Subscriptions**: 7 integrated SaaS subscription plans (Free to Platinum) with commission logic and capability limits.

---

## 🏗️ Architecture

PandaMarket relies on a decoupled, microservices-oriented architecture:

```text
┌─────────────────────────────────────────────────────────┐
│                      INTERNET                           │
│                         │                               │
│              ┌──────────▼──────────┐                    │
│              │  Caddy (HTTPS/SSL)  │                    │
│              │  Reverse Proxy      │                    │
│              └──────────┬──────────┘                    │
│           ┌─────────────┼─────────────┐                 │
│           ▼             ▼             ▼                 │
│   ┌──────────┐  ┌──────────────┐  ┌────────────┐        │
│   │ Frontend │  │   Backend    │  │ Meilisearch│        │
│   │ Next.js  │  │  Medusa v2   │  │  Search    │        │
│   │ :3000    │  │  :9000       │  │  :7700     │        │
│   └──────────┘  └──────┬───────┘  └────────────┘        │
│                        │                                │
│           ┌────────────┼────────────┐                   │
│           ▼            ▼            ▼                   │
│   ┌────────────┐ ┌──────────┐ ┌─────────┐               │
│   │ PostgreSQL │ │  Redis   │ │  MinIO  │               │
│   │  :5432     │ │  :6379   │ │  :9000  │               │
│   └────────────┘ └──────────┘ └─────────┘               │
└─────────────────────────────────────────────────────────┘
```

---

## 📚 Documentation & Setup

We have prepared a comprehensive `.wiki/` directory that contains everything you need to know about setting up, deploying, and maintaining PandaMarket.

Please refer to the following guides in order:

1. [**Project Overview**](./.wiki/01-project-overview.md) - Deep dive into features and architecture.
2. [**Local Windows Prerequisites**](./.wiki/02-prerequisites-windows.md) - Software needed to develop locally.
3. [**Infrastructure Setup**](./.wiki/03-infrastructure.md) - Setting up Postgres, Redis, Meilisearch, and MinIO via Docker.
4. [**Backend Setup (Medusa)**](./.wiki/04-backend-setup.md) - Bootstrapping the API and database.
5. [**Frontend Setup (Next.js)**](./.wiki/05-frontend-setup.md) - Bootstrapping the user interface.
6. [**Admin Panel Guide**](./.wiki/06-admin-usage.md) - How to manage vendors and platform settings.
7. [**Platform Architecture Rules**](./.wiki/07-architecture-rules.md) - Coding standards and tenant isolation rules.
8. [**Production Deployment**](./.wiki/08-production-deployment.md) - Step-by-step VPS deployment guide (Ubuntu/Caddy/PM2).
9. [**Payment Gateway Setup**](./.wiki/09-payment-setup.md) - Configuring Flouci and Konnect.
10. [**Email Setup (SendGrid)**](./.wiki/10-email-setup.md) - Configuring transactional emails.
11. [**AI & Gemini Integration**](./.wiki/11-ai-setup.md) - Setting up the AI SEO engine.
12. [**Troubleshooting**](./.wiki/12-troubleshooting.md) - Solutions to common errors (Testing, WebSockets, Rate Limits).

---

## 🚀 Quick Start (Development)

Ensure Docker Desktop is running, then start the infrastructure:

```bash
docker-compose up -d
```

**Start the Backend:**
```bash
cd backend
npm install
npm run dev
```

**Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🛡️ Security
PandaMarket has undergone thorough security audits (CodeQL & Dependabot). Core security features include:
- **PBKDF2 API Key Hashing** (with server-side peppers)
- **Zod Schema Validation** for all API inputs
- **Tenant-isolated middleware** to prevent Cross-Tenant Data Leakage
- **Redis-backed rate limiting** (429 Too Many Requests)

---

<div align="center">
  <i>Built for the future of e-commerce in Tunisia. 🇹🇳</i>
</div>
