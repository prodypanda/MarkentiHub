# 07 — Prerequisites for Production (Linux VPS)

This guide lists everything you need to deploy PandaMarket on a **live production server**.

---

## Server Requirements

### Minimum Specifications

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| **CPU** | 2 vCPUs | 4 vCPUs |
| **RAM** | 4 GB | 8 GB |
| **Storage** | 40 GB SSD | 80 GB SSD |
| **OS** | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| **Network** | 100 Mbps | 1 Gbps |

### Recommended VPS Providers (Tunisia-friendly)

| Provider | Starting Price | Data Center |
|----------|---------------|-------------|
| **OVH** | ~15€/month (VPS Starter) | France (low latency to Tunisia) |
| **Hetzner** | ~5€/month (CX22) | Germany/Finland |
| **DigitalOcean** | $12/month (Basic 2GB) | Frankfurt |
| **Contabo** | ~6€/month (VPS S) | Germany |

> 💡 **Recommendation**: Start with **OVH VPS Starter** or **Hetzner CX22** for the best price/performance ratio with low latency to Tunisia.

---

## Domain Name

You need a domain name for PandaMarket. We'll use `pandamarket.tn` as an example.

### Where to buy a domain

| TLD | Registrar |
|-----|-----------|
| `.tn` | https://www.ati.tn (Agence Tunisienne d'Internet) |
| `.com` | https://www.namecheap.com or https://www.ovh.com |
| `.shop` | Any registrar |

### DNS records needed

You'll configure these in [Step 09](./09-domain-dns-ssl.md), but here's what you'll need:

| Type | Name | Value |
|------|------|-------|
| A | `pandamarket.tn` | `YOUR_SERVER_IP` |
| A | `*.pandamarket.tn` | `YOUR_SERVER_IP` |
| A | `api.pandamarket.tn` | `YOUR_SERVER_IP` |

---

## Software to Install on the Server

All installation commands are covered in [Step 08](./08-production-deployment.md), but here's the list:

| Software | Version | Purpose |
|----------|---------|---------|
| **Node.js** | ≥ 20.x | Runtime for backend and frontend |
| **npm** | ≥ 9.x | Package manager |
| **Docker** | ≥ 24.x | Container runtime |
| **Docker Compose** | ≥ 2.x | Multi-container orchestration |
| **Caddy** | ≥ 2.8 | Web server with automatic HTTPS |
| **Git** | Latest | Code deployment |
| **UFW** | Included with Ubuntu | Firewall |

---

## Accounts You'll Need

Before deploying, create accounts on these services:

| Service | Why | Free Tier? |
|---------|-----|-----------|
| **GitHub** (or GitLab) | Host your code repository | ✅ Yes |
| **Flouci Developer** | Process online payments | ✅ Sandbox mode |
| **Konnect** | Process card payments | ✅ Sandbox mode |
| **Google AI Studio** | AI-powered SEO (Gemini API) | ✅ Free tier |
| *(Optional)* **AWS S3** or **Scaleway** | Production file storage | 🟡 Free tier limited |

---

## SSH Access

You'll need SSH access to your server. Here's how to set it up:

### Generate SSH Key (on your Windows machine)

```powershell
# Generate a new SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Press Enter for default file location
# Enter a passphrase (optional but recommended)
```

Your key is saved at:
- **Private key**: `C:\Users\YourName\.ssh\id_ed25519` (NEVER share this)
- **Public key**: `C:\Users\YourName\.ssh\id_ed25519.pub` (this is what you upload to the server)

### Connect to your server

```powershell
ssh root@YOUR_SERVER_IP
```

First time: type `yes` to accept the fingerprint.

---

## Security Checklist (Before Going Live)

- [ ] Change all default passwords in `.env`
- [ ] Generate strong random JWT/cookie secrets
- [ ] Set up firewall (UFW)
- [ ] Disable root SSH login
- [ ] Create a non-root user for the application
- [ ] Enable automatic security updates
- [ ] Set up a backup schedule
- [ ] Configure payment providers with **production** (not sandbox) keys

---

> **Next:** [08 — Production Deployment — Step by Step](./08-production-deployment.md)
