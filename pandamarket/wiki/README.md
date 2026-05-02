# 🐼 PandaMarket — Wiki & Documentation

Welcome to the PandaMarket project documentation. This wiki will guide you through **every step** needed to run PandaMarket on your local machine (Windows) or deploy it to a live production server (Linux VPS).

---

## 📖 Table of Contents

| # | Document | Description |
|---|----------|-------------|
| 1 | [Project Overview](./01-project-overview.md) | What PandaMarket is, its architecture, and technology stack |
| 2 | [Prerequisites — Local (Windows)](./02-prerequisites-windows.md) | Software you need to install before starting on Windows |
| 3 | [Local Setup — Step by Step](./03-local-setup.md) | Clone, configure, and run the full project on your Windows machine |
| 4 | [Database & Migrations](./04-database-migrations.md) | How to set up the database, run migrations, and seed data |
| 5 | [Environment Variables Reference](./05-environment-variables.md) | Detailed explanation of every `.env` variable |
| 6 | [Running & Testing Locally](./06-running-locally.md) | How to start dev servers, test endpoints, and debug |
| 7 | [Prerequisites — Production (Linux VPS)](./07-prerequisites-production.md) | Server requirements and software setup for deployment |
| 8 | [Production Deployment — Step by Step](./08-production-deployment.md) | Full guide to deploy on a VPS (OVH, Hetzner, DigitalOcean) |
| 9 | [Domain, DNS & SSL Setup](./09-domain-dns-ssl.md) | Configure domain names, wildcard DNS, and Caddy HTTPS |
| 10 | [Payment Providers Setup](./10-payment-providers.md) | How to configure Flouci, Konnect, Mandat Minute, and COD |
| 11 | [S3 Storage Setup](./11-s3-storage-setup.md) | Configure MinIO (local) or S3-compatible storage (production) |
| 12 | [Troubleshooting & FAQ](./12-troubleshooting.md) | Common errors and how to fix them |

---

## 🗂 Project Structure

```
pandamarket/
├── .env.example          # Template for environment variables
├── docker-compose.yml    # Infrastructure services (Postgres, Redis, Meilisearch, MinIO)
├── Caddyfile             # Reverse proxy configuration (production)
├── backend/              # Medusa v2 backend (API, modules, subscribers)
│   ├── src/
│   │   ├── api/          # REST API routes (/pd/*)
│   │   ├── modules/      # Custom Medusa modules (store, wallet, etc.)
│   │   ├── subscribers/  # Event-driven logic (order.placed, etc.)
│   │   ├── utils/        # Shared utilities (crypto, s3, errors)
│   │   └── scripts/      # Seed scripts
│   ├── package.json
│   └── tsconfig.json
├── frontend/             # Next.js 14 storefront & vendor dashboard
│   ├── src/
│   │   ├── app/          # Pages (hub, dashboard, auth)
│   │   ├── components/   # Reusable UI components
│   │   └── lib/          # API client, utilities
│   ├── package.json
│   └── tsconfig.json
└── wiki/                 # ← You are here
```

---

> **Need help?** Start with [02-prerequisites-windows.md](./02-prerequisites-windows.md) for local development, or [07-prerequisites-production.md](./07-prerequisites-production.md) for production deployment.
