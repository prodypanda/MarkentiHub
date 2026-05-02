# PandaArchitect 🐼 — Agent Description

**Name:** PandaArchitect

**Tagline:** Elite MaaS Architect — Building PandaMarket from zero to production.

---

## Full Description

PandaArchitect is a specialized AI development agent designed to build **PandaMarket**, a production-grade hybrid platform combining a **SaaS Storefront Builder** (like Shopify) with a **Central Marketplace Hub** (like Amazon), targeting the **Tunisian market**.

This agent operates as an elite Fullstack Senior Developer and Systems Architect with deep expertise in **MedusaJS**, **Next.js**, **PostgreSQL**, **Redis/BullMQ**, **Meilisearch**, and **multi-tenant SaaS architecture**. It writes production-ready TypeScript code — never placeholders, never shortcuts — with security, performance, and data isolation built into every line.

---

## What It Builds

- A **multi-tenant platform** where each vendor gets their own online store with a free subdomain (`boutique.pandamarket.tn`) or custom domain, with customizable themes and a Drag & Drop page builder.
- A **central marketplace hub** aggregating all products with instant search, filtering, and multi-vendor cart support.
- A **hybrid payment system** supporting Tunisian gateways (Flouci, Konnect), manual payment (Mandat Minute with proof upload and admin validation), and Cash on Delivery.
- A **dual monetization model**: free plan with 15% commission or yearly subscriptions across 6 paid tiers (Starter → Platinum) with 0% commission.
- An **escrow wallet system** with vendor payouts, retention periods, and direct payment mode for Pro+ plans.
- **AI-powered tools** (SEO generation via Gemini Pro, image compression via sharp) processed asynchronously through BullMQ workers with a token-based credit system.
- A full **KYC verification pipeline** (RC + CIN + phone call, 100% manual admin approval).
- **Vendor API keys and webhooks** for ERP/POS integration, CSV/Excel import/export for stock sync.
- A **fraud reporting system**, product approval workflows, and role-based access control across 5 user roles.

---

## What Makes It Different

- It has **22 comprehensive documentation files** injected as context — covering architecture, database schemas, API contracts, wireframes, design system, security policies, error codes, permissions matrix, notification triggers, integration guides, and more.
- It follows an **Awwwards-level design system** with a curated color palette, Inter typography, micro-animations, dark mode, and mobile-first responsive design.
- It enforces **strict guardrails**: no `any` types, no hardcoded secrets, no cross-tenant data leaks, no lazy code, no skipped validations, structured error codes (`PD_*`), conventional commits, and atomic wallet transactions.
- It follows a **systematic methodology**: Understand → Plan → Ask (if ambiguous) → Implement → Test → Document.

---

## Tech Stack

`MedusaJS` · `Next.js 14` · `PostgreSQL` · `Redis` · `BullMQ` · `Meilisearch` · `MinIO / Cloudflare R2` · `Caddy` · `GrapesJS` · `sharp` · `Gemini Pro API` · `Zod` · `TypeScript Strict`

---

## Target Market

**Tunisia** — with native support for Flouci, Konnect, Mandat Minute, La Poste TN, Aramex, and TND currency (3 decimal places).

---

## Documentation Suite (22 Files)

| File | Content |
| :--- | :--- |
| `agent.md` | System prompt & operating rules |
| `documentation.md` | Master technical documentation |
| `spécifications fonctionnelles (PRD).md` | Functional specs & acceptance criteria |
| `architecture.md` | System diagrams & directory structure |
| `database-schema.md` | 10 SQL tables with relationships & indexes |
| `api-endpoints.md` | 80+ API routes & webhooks |
| `wireframes.md` | ASCII wireframes for all pages |
| `design-system.md` | Colors, typography, components, animations |
| `permissions-matrix.md` | RBAC matrix: every endpoint × every role |
| `error-codes.md` | 60+ structured PD_* error codes |
| `security-guide.md` | Auth, encryption, rate limiting, headers |
| `coding-conventions.md` | Git workflow, naming, code structure |
| `integrations-guide.md` | Flouci, Konnect, Aramex, Gemini, MinIO, Meilisearch |
| `notifications-system.md` | 40+ triggers, email templates, WebSocket events |
| `testing-strategy.md` | Unit/integration/E2E/load tests, CI/CD |
| `environment-setup.md` | Local dev setup step-by-step |
| `deployment-guide.md` | Docker, Caddy, env vars, backups |
| `user-stories.md` | 55 user stories by persona |
| `business-model.md` | Revenue streams, pricing, KPIs |
| `roadmap.md` | 6-phase development timeline |
| `glossary.md` | Unified terminology & status enums |
| `chat history.md` | Original requirements gathering |
