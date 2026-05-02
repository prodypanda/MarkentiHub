# 03 — Local Setup — Step by Step (Windows)

This guide walks you through getting PandaMarket running on your Windows computer **from zero to fully working**.

---

## Step 1: Get the Project Code

### Option A: Clone from Git (if the project is in a Git repository)

Open **Windows Terminal** (or PowerShell) and run:

```powershell
# Navigate to where you want the project (for example, Documents)
cd C:\Users\YourName\Documents

# Clone the repository
git clone https://github.com/your-org/pandamarket.git

# Enter the project folder
cd pandamarket
```

### Option B: Copy the folder manually

If you already have the project folder (like `pulire audit\pandamarket`), simply open a terminal in that folder:

1. Open **File Explorer**
2. Navigate to the `pandamarket` folder
3. Click the address bar, type `powershell`, and press Enter

This opens a terminal already in the project folder.

---

## Step 2: Create the Environment File

The `.env` file contains all your passwords, API keys, and configuration. **This file is never shared or committed to Git.**

```powershell
# Copy the example file to create your own .env
copy .env.example .env
```

> 📝 For local development, the default values in `.env.example` work out of the box. You only need to change things if you want real payment processing or AI features.

---

## Step 3: Start Infrastructure Services (Docker)

Make sure **Docker Desktop is running** (check the system tray — you should see the Docker whale icon).

```powershell
# Start all infrastructure services
docker compose up -d
```

This starts **4 services** in the background:

| Service | Port | What it does |
|---------|------|-------------|
| PostgreSQL | 5432 | Main database |
| Redis | 6379 | Cache & event queue |
| Meilisearch | 7700 | Product search engine |
| MinIO | 9000 / 9001 | File storage (S3-compatible) |

### Verify everything is running

```powershell
docker compose ps
```

You should see all 4 services with state `running`:

```
NAME              STATUS
pd_postgres       running
pd_redis          running
pd_meilisearch    running
pd_minio          running
```

### If something fails

```powershell
# Check logs for a specific service
docker compose logs postgres
docker compose logs redis
docker compose logs meilisearch
docker compose logs minio
```

> ⚠️ **Port conflict?** If port 5432 is already in use, you might have a local PostgreSQL installation. Either stop it (`net stop postgresql-x64-16`) or change the port in `docker-compose.yml`.

---

## Step 4: Install Backend Dependencies

```powershell
# Navigate to the backend folder
cd backend

# Install all Node.js packages
npm install
```

This will take **1-3 minutes** depending on your internet speed. You'll see a progress bar.

> 💡 If you get warnings about "deprecated packages" or "vulnerabilities", that's normal. These are from upstream dependencies and don't affect functionality.

---

## Step 5: Run Database Migrations

Migrations create all the database tables that PandaMarket needs.

```powershell
# Still in the backend/ folder
npx medusa migrations run
```

You should see output like:

```
info: Running migrations...
info: Migrations completed successfully
```

---

## Step 6: Seed the Database

Seeding fills the database with initial data (subscription plans, default themes).

```powershell
npx medusa exec ./src/scripts/seed.ts
```

You should see:

```
  ✅ Plan "free" seeded
  ✅ Plan "starter" seeded
  ✅ Plan "regular" seeded
  ...
  ✅ Theme "Minimal" seeded
  ✅ Theme "Classic" seeded
  ✅ Theme "Modern" seeded

🐼 PandaMarket seed complete!
```

---

## Step 7: Install Frontend Dependencies

Open a **new terminal tab/window** (keep the backend terminal open):

```powershell
# Navigate to the frontend folder (from the project root)
cd frontend

# Install all Node.js packages
npm install
```

---

## Step 8: Start the Backend (Development Mode)

Go back to the backend terminal:

```powershell
# In the backend/ folder
npm run dev
```

You should see:

```
info: Server is ready on port 9000
```

The backend API is now running at **http://localhost:9000**.

### Quick test

Open your browser and go to:
```
http://localhost:9000/health
```

You should see a response (or a Medusa welcome page).

---

## Step 9: Start the Frontend (Development Mode)

Go to the frontend terminal:

```powershell
# In the frontend/ folder
npm run dev
```

You should see:

```
  ▲ Next.js 14.2.x
  - Local:        http://localhost:3000
  - Ready in 2.4s
```

---

## Step 10: Open PandaMarket!

Open your browser and go to:

| URL | What you'll see |
|-----|----------------|
| **http://localhost:3000** | 🏠 PandaMarket Hub (marketplace homepage) |
| **http://localhost:3000/auth/login** | 🔑 Login page |
| **http://localhost:3000/auth/register** | 📝 Registration page |
| **http://localhost:3000/dashboard** | 📊 Vendor dashboard |
| **http://localhost:9000** | ⚙️ Backend API |
| **http://localhost:9001** | 📁 MinIO Console (files) |
| **http://localhost:7700** | 🔍 Meilisearch dashboard |

---

## 🎉 Congratulations!

PandaMarket is now running on your computer! Here's a summary:

```
Backend  → http://localhost:9000  (Medusa v2 API)
Frontend → http://localhost:3000  (Next.js)
Database → localhost:5432         (PostgreSQL via Docker)
Cache    → localhost:6379         (Redis via Docker)
Search   → http://localhost:7700  (Meilisearch via Docker)
Storage  → http://localhost:9001  (MinIO Console via Docker)
```

---

## ⏹ Stopping Everything

### Stop the frontend
Press `Ctrl + C` in the frontend terminal.

### Stop the backend
Press `Ctrl + C` in the backend terminal.

### Stop Docker services
```powershell
# From the project root (pandamarket/)
docker compose down
```

> 💡 Your data is **preserved** in Docker volumes. When you run `docker compose up -d` again, all your data will still be there.

### To completely wipe data and start fresh
```powershell
docker compose down -v
```

> ⚠️ The `-v` flag deletes all volumes (database data, search index, files). Use this only if you want a clean slate.

---

> **Next:** [04 — Database & Migrations](./04-database-migrations.md)
