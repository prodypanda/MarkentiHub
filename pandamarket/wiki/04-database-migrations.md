# 04 — Database & Migrations

This guide explains how the PandaMarket database works, how to manage migrations, and how to seed initial data.

---

## Overview

PandaMarket uses **PostgreSQL 16** as its primary database. The database schema is managed through **Medusa v2 migrations**, which automatically create and update tables based on the module definitions.

### Database Structure

PandaMarket has **two types of tables**:

1. **Medusa Core Tables** — Created by the Medusa framework (products, orders, customers, payments, etc.)
2. **PandaMarket Custom Tables** — Created by our custom modules (prefixed with `pd_`):

| Table | Module | Purpose |
|-------|--------|---------|
| `pd_store` | pd-store | Vendor store profiles |
| `pd_wallet` | pd-wallet | Vendor wallet balances |
| `pd_wallet_transaction` | pd-wallet | Transaction history |
| `pd_vendor_credits` | pd-credits | AI token credits |
| `pd_subscription_limits` | pd-subscription | Plan feature limits |
| `pd_verification_document` | pd-verification | KYC documents |
| `pd_mandat_proof` | pd-mandat | Mandat Minute payment proofs |
| `pd_report` | pd-reports | Fraud/abuse reports |
| `pd_theme` | pd-themes | Store theme configurations |
| `pd_api_key` | pd-api-keys | Developer API keys |
| `pd_notification` | pd-notifications | In-app notifications |

---

## Connecting to the Database

### From the terminal (psql)

```powershell
# Connect via Docker
docker exec -it pd_postgres psql -U pd_user -d pandamarket
```

Once connected, useful commands:

```sql
-- List all tables
\dt

-- List only PandaMarket tables
\dt pd_*

-- Describe a table structure
\d pd_store

-- Count rows in a table
SELECT COUNT(*) FROM pd_store;

-- Exit psql
\q
```

### From a GUI tool (recommended for beginners)

Download **pgAdmin 4** (free): https://www.pgadmin.org/download/

Connection settings:
| Field | Value |
|-------|-------|
| Host | `localhost` |
| Port | `5432` |
| Database | `pandamarket` |
| Username | `pd_user` |
| Password | `pd_dev_password_2026` |

---

## Running Migrations

### First-time setup

```powershell
cd backend
npx medusa migrations run
```

### After modifying a module model

If you change a model file (e.g., add a new field to `pd-store`):

```powershell
# Generate a new migration
npx medusa migrations generate

# Apply the migration
npx medusa migrations run
```

### Check migration status

```powershell
# See which migrations have been applied
docker exec -it pd_postgres psql -U pd_user -d pandamarket -c "SELECT * FROM mikro_orm_migrations ORDER BY executed_at DESC LIMIT 10;"
```

---

## Seeding Data

The seed script populates the database with essential initial data.

### What gets seeded

| Data | Details |
|------|---------|
| **7 subscription plans** | Free, Starter, Regular, Agency, Pro, Golden, Platinum |
| **3 default themes** | Minimal, Classic, Modern |

### Run the seed

```powershell
cd backend
npx medusa exec ./src/scripts/seed.ts
```

### Re-seeding

The seed script is **idempotent** — running it again will skip items that already exist:

```
  ⏭️  Plan "free" already exists, skipping
  ⏭️  Plan "starter" already exists, skipping
  ...
```

---

## Resetting the Database (Nuclear Option)

If you want to completely start over:

```powershell
# 1. Stop everything
docker compose down -v

# 2. Start fresh containers
docker compose up -d

# 3. Wait 10 seconds for PostgreSQL to initialize
Start-Sleep -Seconds 10

# 4. Run migrations
cd backend
npx medusa migrations run

# 5. Seed the database
npx medusa exec ./src/scripts/seed.ts
```

---

## Backup & Restore

### Create a backup

```powershell
docker exec pd_postgres pg_dump -U pd_user pandamarket > backup_$(Get-Date -Format "yyyy-MM-dd").sql
```

### Restore from backup

```powershell
# First, drop and recreate the database
docker exec -it pd_postgres psql -U pd_user -c "DROP DATABASE IF EXISTS pandamarket;"
docker exec -it pd_postgres psql -U pd_user -c "CREATE DATABASE pandamarket;"

# Restore
Get-Content backup_2026-05-02.sql | docker exec -i pd_postgres psql -U pd_user -d pandamarket
```

---

> **Next:** [05 — Environment Variables Reference](./05-environment-variables.md)
