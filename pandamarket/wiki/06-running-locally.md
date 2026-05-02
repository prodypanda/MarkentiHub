# 06 — Running & Testing Locally

This guide covers how to start the development servers, test API endpoints, and debug common issues.

---

## Starting the Full Stack

You need **3 terminal windows/tabs** running simultaneously:

### Terminal 1: Infrastructure (Docker)

```powershell
cd C:\Users\YourName\Documents\pandamarket
docker compose up -d
```

Wait 10 seconds, then verify:

```powershell
docker compose ps
```

All 4 services should show `running`.

### Terminal 2: Backend

```powershell
cd C:\Users\YourName\Documents\pandamarket\backend
npm run dev
```

Wait for: `Server is ready on port 9000`

### Terminal 3: Frontend

```powershell
cd C:\Users\YourName\Documents\pandamarket\frontend
npm run dev
```

Wait for: `Ready in X.Xs`

---

## Testing API Endpoints

### Using the Browser

Simply open these URLs in your browser:

| URL | Expected Result |
|-----|----------------|
| `http://localhost:3000` | PandaMarket homepage |
| `http://localhost:9000/health` | Backend health check |
| `http://localhost:7700` | Meilisearch dashboard |
| `http://localhost:9001` | MinIO console (login: `pd_minio_admin` / `pd_minio_secret_2026`) |

### Using cURL (PowerShell)

```powershell
# Test backend health
Invoke-RestMethod http://localhost:9000/health

# List subscription plans
Invoke-RestMethod http://localhost:9000/api/pd/subscriptions/plans

# Get Swagger/OpenAPI spec
Invoke-RestMethod http://localhost:9000/api/pd/swagger
```

### Using Thunder Client (VS Code Extension)

1. Install the **Thunder Client** extension in VS Code
2. Click the lightning bolt icon in the left sidebar
3. Create requests:

**GET** `http://localhost:9000/api/pd/subscriptions/plans`
- No headers needed
- Click **Send**
- You should see the 7 subscription plans

**GET** `http://localhost:9000/api/pd/swagger`
- Returns the full API documentation in OpenAPI format

---

## API Endpoints Reference

### Public Endpoints (no authentication needed)

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/pd/subscriptions/plans` | List all subscription plans |
| GET | `/api/pd/swagger` | OpenAPI documentation |
| GET | `/api/pd/stores/:id` | Get store details |

### Authenticated Endpoints (need JWT token)

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/pd/products?store_id=xxx` | List store products |
| POST | `/api/pd/products` | Create a product |
| PUT | `/api/pd/products/:id` | Update a product |
| DELETE | `/api/pd/products/:id` | Delete a product |
| GET | `/api/pd/wallet` | Get wallet balance |
| POST | `/api/pd/wallet/withdraw` | Request withdrawal |
| GET | `/api/pd/credits` | Get AI token balance |
| POST | `/api/pd/ai/seo` | Generate AI SEO content |
| GET | `/api/pd/verification/status` | Check KYC status |
| POST | `/api/pd/verification/documents` | Submit KYC docs |
| GET | `/api/pd/notifications` | List notifications |
| GET | `/api/pd/api-keys` | List API keys |
| POST | `/api/pd/api-keys` | Generate a new API key |

### Admin Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/pd/admin/verifications` | List pending KYC submissions |
| PUT | `/api/pd/admin/verifications/:id` | Approve/reject KYC |
| GET | `/api/pd/admin/mandats` | List pending mandat proofs |
| PUT | `/api/pd/admin/mandats/:id` | Approve/reject mandat |

---

## Debugging

### Backend won't start

```powershell
# Check if the port is already in use
netstat -ano | findstr :9000

# Kill the process using port 9000 (replace PID with the number from above)
taskkill /PID <PID> /F
```

### Database connection error

```powershell
# Check if PostgreSQL is running
docker compose ps postgres

# Check PostgreSQL logs
docker compose logs postgres

# Test the connection manually
docker exec -it pd_postgres psql -U pd_user -d pandamarket -c "SELECT 1;"
```

### Redis connection error

```powershell
# Check if Redis is running
docker compose ps redis

# Test Redis
docker exec -it pd_redis redis-cli ping
# Should respond: PONG
```

### Frontend "Cannot connect to backend"

1. Make sure the backend is running (`http://localhost:9000`)
2. Check `NEXT_PUBLIC_MEDUSA_URL` in your `.env` is set to `http://localhost:9000`
3. Restart the frontend after changing `.env` values

### TypeScript errors

```powershell
# Check for compilation errors in backend
cd backend
npx tsc --noEmit

# Check for compilation errors in frontend
cd frontend
npx tsc --noEmit
```

Both should exit with code 0 (no errors).

---

## Hot Reloading

Both the backend and frontend support **hot reloading** in development mode:

- **Backend (`npm run dev`)**: When you save a `.ts` file, the server automatically restarts
- **Frontend (`npm run dev`)**: When you save a `.tsx` or `.css` file, the page automatically refreshes

> 💡 If hot reload seems broken, press `Ctrl + C` to stop the server and run `npm run dev` again.

---

## Useful Docker Commands

```powershell
# Start all services
docker compose up -d

# Stop all services (data preserved)
docker compose down

# Stop all services AND delete data
docker compose down -v

# Restart a specific service
docker compose restart postgres

# View logs (live)
docker compose logs -f meilisearch

# Check disk space used by Docker
docker system df
```

---

> **Next:** [07 — Prerequisites for Production](./07-prerequisites-production.md)
