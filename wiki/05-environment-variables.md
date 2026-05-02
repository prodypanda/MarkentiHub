# 05 — Environment Variables Reference

This document explains **every environment variable** used by PandaMarket. All variables are defined in the `.env` file at the project root.

---

## How to Use

1. Copy the template: `copy .env.example .env`
2. Edit `.env` with your values
3. **Never** commit `.env` to Git (it's in `.gitignore`)

---

## 🟢 Application

| Variable | Default | Description |
|----------|---------|-------------|
| `PD_NODE_ENV` | `development` | Environment mode. Use `development` locally, `production` on server |
| `PD_PORT` | `9000` | Port the backend API runs on |
| `PD_ADMIN_CORS` | `http://localhost:3000` | Allowed origins for admin API requests |
| `PD_STORE_CORS` | `http://localhost:3000` | Allowed origins for storefront requests |
| `PD_HUB_DOMAIN` | `pandamarket.local` | The main domain (used for subdomain routing) |

### 💡 How CORS works
- **Local**: Set both to `http://localhost:3000`
- **Production**: Set both to `https://pandamarket.tn` (your real domain)

---

## 🗄 Database (PostgreSQL)

| Variable | Default | Description |
|----------|---------|-------------|
| `PD_DATABASE_URL` | `postgresql://pd_user:pd_dev_password_2026@localhost:5432/pandamarket` | Full database connection string |
| `PD_DATABASE_POOL_SIZE` | `20` | Maximum database connections |

### Connection string format
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
```

### 💡 Tips
- **Local**: Use the Docker defaults as-is
- **Production**: Use a strong password and restrict network access
- If your password contains special characters (`@`, `#`, etc.), URL-encode them

---

## 🔴 Redis

| Variable | Default | Description |
|----------|---------|-------------|
| `PD_REDIS_URL` | `redis://localhost:6379` | Redis connection URL |

### 💡 Tips
- **Local**: Use the Docker default
- **Production**: Add a password: `redis://:your_password@localhost:6379`

---

## 📦 Storage (S3-Compatible)

| Variable | Default | Description |
|----------|---------|-------------|
| `PD_S3_ENDPOINT` | `http://localhost:9000` | S3 API endpoint (MinIO locally) |
| `PD_S3_BUCKET_PUBLIC` | `pd-product-images` | Bucket for product images (public read) |
| `PD_S3_BUCKET_PRIVATE` | `pd-private-files` | Bucket for KYC docs, digital products (private) |
| `PD_S3_BUCKET_THEMES` | `pd-themes` | Bucket for theme assets (public read) |
| `PD_S3_ACCESS_KEY` | `pd_minio_admin` | S3 access key |
| `PD_S3_SECRET_KEY` | `pd_minio_secret_2026` | S3 secret key |
| `PD_S3_REGION` | `us-east-1` | S3 region (required by AWS SDK) |

### 💡 Tips
- **Local**: MinIO runs on the same port as the backend (9000). If there's a conflict, change MinIO's port in `docker-compose.yml`
- **Production**: Use a real S3 provider (AWS S3, Scaleway, OVH Object Storage) and update the endpoint

---

## 💳 Payments — Flouci

| Variable | Default | Description |
|----------|---------|-------------|
| `PD_FLOUCI_APP_TOKEN` | `sandbox_flouci_token` | Your Flouci app token |
| `PD_FLOUCI_APP_SECRET` | `sandbox_flouci_secret` | Your Flouci app secret |
| `PD_FLOUCI_BASE_URL` | `https://developers.flouci.com/api` | Flouci API base URL |

### How to get real keys
1. Go to https://developers.flouci.com
2. Create an account and an app
3. Copy the App Token and Secret
4. For sandbox testing, use the test keys provided

---

## 💳 Payments — Konnect

| Variable | Default | Description |
|----------|---------|-------------|
| `PD_KONNECT_API_KEY` | `sandbox_konnect_key` | Your Konnect API key |
| `PD_KONNECT_RECEIVER_WALLET` | `sandbox_konnect_wallet` | Konnect wallet ID to receive payments |
| `PD_KONNECT_BASE_URL` | `https://api.konnect.network/api/v2` | Konnect API base URL |

### How to get real keys
1. Go to https://konnect.network
2. Create a merchant account
3. Navigate to API settings
4. Copy your API Key and Wallet ID

---

## 🤖 AI — Google Gemini

| Variable | Default | Description |
|----------|---------|-------------|
| `PD_GEMINI_API_KEY` | `your_gemini_api_key` | Google Gemini API key |
| `PD_GEMINI_MODEL` | `gemini-2.0-pro` | AI model to use |
| `PD_GEMINI_MAX_TOKENS` | `500` | Maximum tokens per AI request |

### How to get a key
1. Go to https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy the key

> 💡 The AI SEO feature is **optional**. If you don't set this key, everything else still works — the AI feature will just return an error when used.

---

## 🔍 Search — Meilisearch

| Variable | Default | Description |
|----------|---------|-------------|
| `PD_MEILI_HOST` | `http://localhost:7700` | Meilisearch URL |
| `PD_MEILI_MASTER_KEY` | `pd_meili_master_dev_key_2026` | Master key (admin access) |

> ⚠️ The master key in `.env` must match the one in `docker-compose.yml` under the `meilisearch` service.

---

## 🔐 Authentication — JWT

| Variable | Default | Description |
|----------|---------|-------------|
| `PD_JWT_SECRET` | `pd_dev_jwt_secret_...` | Secret for signing access tokens |
| `PD_JWT_EXPIRY` | `15m` | Access token lifetime (15 minutes) |
| `PD_REFRESH_TOKEN_SECRET` | `pd_dev_refresh_secret_...` | Secret for signing refresh tokens |
| `PD_REFRESH_TOKEN_EXPIRY` | `7d` | Refresh token lifetime (7 days) |
| `PD_COOKIE_SECRET` | `pd_dev_cookie_secret_...` | Secret for signing cookies |

### 💡 For production
Generate strong random secrets:

```powershell
# Generate a random 64-character secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this command **3 times** to generate unique secrets for JWT, refresh token, and cookie.

---

## 🔒 Encryption

| Variable | Default | Description |
|----------|---------|-------------|
| `PD_ENCRYPTION_KEY` | `pd_dev_encryption_key_32chars!!` | AES-256 key for encrypting vendor payment credentials |

> ⚠️ Must be exactly **32 characters** long!

---

## 🪝 Webhooks

| Variable | Default | Description |
|----------|---------|-------------|
| `PD_WEBHOOK_SECRET` | `pd_dev_webhook_secret_2026` | HMAC secret for signing outgoing webhooks |

---

## 🌐 Frontend (Next.js)

These variables are used by the **frontend** application. They must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_MEDUSA_URL` | `http://localhost:9000` | Backend API URL |
| `NEXT_PUBLIC_HUB_DOMAIN` | `pandamarket.local` | Hub domain for routing |
| `NEXT_PUBLIC_MEILI_HOST` | `http://localhost:7700` | Meilisearch URL (public search) |
| `NEXT_PUBLIC_MEILI_SEARCH_KEY` | `pd_meili_search_dev_key` | Meilisearch public search-only key |

---

## Example: Minimal .env for Local Development

```env
PD_NODE_ENV=development
PD_PORT=9000
PD_ADMIN_CORS=http://localhost:3000
PD_STORE_CORS=http://localhost:3000
PD_DATABASE_URL=postgresql://pd_user:pd_dev_password_2026@localhost:5432/pandamarket
PD_REDIS_URL=redis://localhost:6379
PD_S3_ENDPOINT=http://localhost:9000
PD_S3_ACCESS_KEY=pd_minio_admin
PD_S3_SECRET_KEY=pd_minio_secret_2026
PD_MEILI_HOST=http://localhost:7700
PD_MEILI_MASTER_KEY=pd_meili_master_dev_key_2026
PD_JWT_SECRET=pd_dev_jwt_secret_change_in_production_2026
PD_COOKIE_SECRET=pd_dev_cookie_secret_change_in_production_2026
PD_ENCRYPTION_KEY=pd_dev_encryption_key_32chars!!
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000
```

---

> **Next:** [06 — Running & Testing Locally](./06-running-locally.md)
