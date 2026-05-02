# 08 — Production Deployment — Step by Step

This guide walks you through deploying PandaMarket to a **live Linux VPS** from scratch. Every command is provided — just copy and paste.

> 📌 We'll use **Ubuntu 22.04/24.04 LTS** as the OS. Commands may differ on other distributions.

---

## Phase 1: Server Initial Setup

### 1.1 — Connect to your server

From your Windows terminal:

```powershell
ssh root@YOUR_SERVER_IP
```

### 1.2 — Update the system

```bash
apt update && apt upgrade -y
```

### 1.3 — Create a non-root user

Never run the application as `root`. Create a dedicated user:

```bash
# Create user "pandamarket"
adduser pandamarket

# Give it sudo privileges
usermod -aG sudo pandamarket

# Switch to the new user
su - pandamarket
```

### 1.4 — Set up SSH for the new user

```bash
# Create SSH directory
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add your SSH public key
nano ~/.ssh/authorized_keys
# Paste your public key (from C:\Users\YourName\.ssh\id_ed25519.pub)
# Save: Ctrl+O, Enter, Ctrl+X

chmod 600 ~/.ssh/authorized_keys
```

Now you can connect directly as the `pandamarket` user:

```powershell
# From Windows
ssh pandamarket@YOUR_SERVER_IP
```

### 1.5 — Secure SSH (disable root login)

```bash
sudo nano /etc/ssh/sshd_config
```

Find and change these lines:

```
PermitRootLogin no
PasswordAuthentication no
```

Save and restart SSH:

```bash
sudo systemctl restart sshd
```

> ⚠️ **WARNING**: Make sure you can still SSH in as `pandamarket` before locking out `root`!

### 1.6 — Set up the firewall

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable the firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Phase 2: Install Required Software

### 2.1 — Install Node.js 20

```bash
# Install Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version    # Should show v20.x.x
npm --version     # Should show 9.x or 10.x
```

### 2.2 — Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com | sudo sh

# Add your user to the docker group (so you don't need sudo)
sudo usermod -aG docker pandamarket

# IMPORTANT: Log out and log back in for the group change to take effect
exit
ssh pandamarket@YOUR_SERVER_IP

# Verify
docker --version
docker compose version
```

### 2.3 — Install Caddy

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy -y

# Verify
caddy version
```

### 2.4 — Install Git

```bash
sudo apt install -y git
git --version
```

---

## Phase 3: Deploy the Code

### 3.1 — Clone the repository

```bash
cd /home/pandamarket
git clone https://github.com/your-org/pandamarket.git
cd pandamarket
```

> 💡 If using a private repo, set up a deploy key:
> ```bash
> ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -C "pandamarket-deploy"
> cat ~/.ssh/deploy_key.pub
> # Add this key to your GitHub repo → Settings → Deploy Keys
> ```

### 3.2 — Create the production .env file

```bash
cp .env.example .env
nano .env
```

**Change these values for production:**

```env
# Application
PD_NODE_ENV=production
PD_PORT=9000
PD_ADMIN_CORS=https://admin.pandamarket.tn
PD_STORE_CORS=https://pandamarket.tn
PD_HUB_DOMAIN=pandamarket.tn

# Database — USE A STRONG PASSWORD
PD_DATABASE_URL=postgresql://pd_user:YOUR_STRONG_DB_PASSWORD_HERE@localhost:5432/pandamarket

# Redis
PD_REDIS_URL=redis://localhost:6379

# Storage — USE STRONG KEYS
PD_S3_ENDPOINT=http://localhost:9100
PD_S3_BUCKET_PUBLIC=pd-product-images
PD_S3_BUCKET_PRIVATE=pd-private-files
PD_S3_BUCKET_THEMES=pd-themes
PD_S3_ACCESS_KEY=YOUR_STRONG_MINIO_KEY
PD_S3_SECRET_KEY=YOUR_STRONG_MINIO_SECRET
PD_S3_REGION=us-east-1

# Payments — PRODUCTION KEYS
PD_FLOUCI_APP_TOKEN=your_real_flouci_token
PD_FLOUCI_APP_SECRET=your_real_flouci_secret
PD_KONNECT_API_KEY=your_real_konnect_key
PD_KONNECT_RECEIVER_WALLET=your_real_konnect_wallet

# AI
PD_GEMINI_API_KEY=your_real_gemini_key

# Search
PD_MEILI_HOST=http://localhost:7700
PD_MEILI_MASTER_KEY=GENERATE_A_RANDOM_KEY_HERE

# Auth — GENERATE STRONG SECRETS (see below)
PD_JWT_SECRET=GENERATE_64_CHAR_SECRET_1
PD_REFRESH_TOKEN_SECRET=GENERATE_64_CHAR_SECRET_2
PD_COOKIE_SECRET=GENERATE_64_CHAR_SECRET_3
PD_ENCRYPTION_KEY=GENERATE_32_CHAR_SECRET_4

# Webhooks
PD_WEBHOOK_SECRET=GENERATE_RANDOM_SECRET

# Frontend
NEXT_PUBLIC_MEDUSA_URL=https://api.pandamarket.tn
NEXT_PUBLIC_HUB_DOMAIN=pandamarket.tn
NEXT_PUBLIC_MEILI_HOST=https://search.pandamarket.tn
NEXT_PUBLIC_MEILI_SEARCH_KEY=GENERATE_A_SEARCH_KEY
```

**Generate strong secrets:**

```bash
# Run this 4 times to generate 4 different secrets
openssl rand -hex 32
```

Save the file: `Ctrl+O`, `Enter`, `Ctrl+X`.

### 3.3 — Update docker-compose.yml for production

Edit the Docker Compose file to match your production `.env` passwords:

```bash
nano docker-compose.yml
```

Change:
- `POSTGRES_PASSWORD` to match `PD_DATABASE_URL`
- `MINIO_ROOT_PASSWORD` to match `PD_S3_SECRET_KEY`
- `MEILI_MASTER_KEY` to match `PD_MEILI_MASTER_KEY`
- Change MinIO port from `9000` to `9100` (to avoid conflict with the backend):

```yaml
    ports:
      - "9100:9000"   # API
      - "9101:9001"   # Console
```

---

## Phase 4: Start Infrastructure

```bash
# Start all services
docker compose up -d

# Wait 15 seconds for everything to initialize
sleep 15

# Verify all services are running
docker compose ps
```

All 4 services must show `running`.

---

## Phase 5: Build and Start the Application

### 5.1 — Backend

```bash
cd /home/pandamarket/pandamarket/backend

# Install dependencies
npm install --production=false

# Run database migrations
npx medusa migrations run

# Seed the database
npx medusa exec ./src/scripts/seed.ts

# Create admin user
npx medusa user -e admin@pandamarket.tn -p YOUR_ADMIN_PASSWORD
```

### 5.2 — Frontend

```bash
cd /home/pandamarket/pandamarket/frontend

# Install dependencies
npm install

# Build the production bundle
npm run build
```

---

## Phase 6: Set Up Process Manager (PM2)

PM2 keeps your application running and restarts it if it crashes.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the backend
cd /home/pandamarket/pandamarket/backend
pm2 start "npm run start" --name "pd-backend"

# Start the frontend
cd /home/pandamarket/pandamarket/frontend
pm2 start "npm run start" --name "pd-frontend"

# Save the PM2 process list (so it survives reboots)
pm2 save

# Set PM2 to start on boot
pm2 startup
# Copy and run the command it gives you (it will look like: sudo env PATH=... pm2 startup ...)
```

### Verify processes are running

```bash
pm2 status
```

You should see:

```
┌─────┬──────────────┬──────┬──────┬───────────┐
│ id  │ name         │ mode │ ↺    │ status    │
├─────┼──────────────┼──────┼──────┼───────────┤
│ 0   │ pd-backend   │ fork │ 0    │ online    │
│ 1   │ pd-frontend  │ fork │ 0    │ online    │
└─────┴──────────────┴──────┴──────┴───────────┘
```

### Useful PM2 commands

```bash
pm2 logs pd-backend       # View backend logs
pm2 logs pd-frontend      # View frontend logs
pm2 restart pd-backend     # Restart backend
pm2 restart all            # Restart everything
pm2 monit                  # Real-time monitoring dashboard
```

---

## Phase 7: Configure Caddy (HTTPS)

See [09 — Domain, DNS & SSL Setup](./09-domain-dns-ssl.md) for the full Caddy configuration.

Quick setup:

```bash
# Copy the Caddyfile
sudo cp /home/pandamarket/pandamarket/Caddyfile /etc/caddy/Caddyfile

# Edit it with your actual domain
sudo nano /etc/caddy/Caddyfile

# Restart Caddy
sudo systemctl restart caddy

# Check Caddy status
sudo systemctl status caddy
```

---

## Phase 8: Verify Everything

### Test from your browser

| URL | Expected |
|-----|----------|
| `https://pandamarket.tn` | Homepage |
| `https://api.pandamarket.tn/health` | Backend health |
| `https://pandamarket.tn/auth/login` | Login page |

### Test from the command line (on the server)

```bash
curl -s http://localhost:9000/health
curl -s http://localhost:3000
curl -s http://localhost:7700/health
```

---

## Updating the Application

When you push new code:

```bash
cd /home/pandamarket/pandamarket

# Pull latest code
git pull origin main

# Backend
cd backend
npm install
npx medusa migrations run
pm2 restart pd-backend

# Frontend
cd ../frontend
npm install
npm run build
pm2 restart pd-frontend
```

---

> **Next:** [09 — Domain, DNS & SSL Setup](./09-domain-dns-ssl.md)
