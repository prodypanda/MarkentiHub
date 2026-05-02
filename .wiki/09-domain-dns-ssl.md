# 09 — Domain, DNS & SSL Setup

This guide explains how to configure your domain name, DNS records, and automatic HTTPS using Caddy.

---

## Step 1: Buy a Domain

If you don't already have a domain:

| Option | Registrar | Notes |
|--------|-----------|-------|
| `.tn` domain | [ATI](https://www.ati.tn) | Tunisian domain, requires Tunisian ID |
| `.com` / `.shop` | [Namecheap](https://namecheap.com) or [OVH](https://ovh.com) | International domain |

---

## Step 2: Configure DNS Records

Go to your domain registrar's DNS settings panel and add these records:

### Required DNS Records

| Type | Name/Host | Value | TTL |
|------|-----------|-------|-----|
| **A** | `@` (or `pandamarket.tn`) | `YOUR_SERVER_IP` | 3600 |
| **A** | `www` | `YOUR_SERVER_IP` | 3600 |
| **A** | `api` | `YOUR_SERVER_IP` | 3600 |
| **A** | `admin` | `YOUR_SERVER_IP` | 3600 |
| **A** | `*` (wildcard) | `YOUR_SERVER_IP` | 3600 |

> 💡 The **wildcard (`*`) record** is essential! It allows vendor subdomains like `monshop.pandamarket.tn` to resolve to your server.

### How to find your server IP

```bash
# On the server
curl -4 ifconfig.me
```

### Verify DNS propagation

After adding the records, wait 5–30 minutes, then check:

```powershell
# From Windows
nslookup pandamarket.tn
nslookup api.pandamarket.tn
nslookup test-store.pandamarket.tn
```

All should return your server IP.

You can also use: https://www.whatsmydns.net to check global propagation.

---

## Step 3: Configure Caddy

Caddy automatically handles HTTPS certificates (Let's Encrypt) — no manual SSL setup needed!

### 3.1 — Edit the Caddyfile

```bash
sudo nano /etc/caddy/Caddyfile
```

Replace the entire content with:

```caddyfile
# =============================================================================
# PandaMarket — Caddy Configuration
# =============================================================================

# Hub (main marketplace)
pandamarket.tn, www.pandamarket.tn {
    reverse_proxy localhost:3000
    encode gzip zstd
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        X-XSS-Protection "1; mode=block"
        Referrer-Policy strict-origin-when-cross-origin
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
    }
}

# API
api.pandamarket.tn {
    reverse_proxy localhost:9000
    encode gzip zstd
    header {
        X-Content-Type-Options nosniff
        Strict-Transport-Security "max-age=31536000"
    }
}

# Admin Panel
admin.pandamarket.tn {
    reverse_proxy localhost:3000
    encode gzip zstd
}

# Search (Meilisearch — restrict in production)
search.pandamarket.tn {
    reverse_proxy localhost:7700
    encode gzip zstd
    # Only allow search API, block admin endpoints
    @admin_routes {
        path /keys* /indexes/*/settings* /dumps* /tasks*
    }
    respond @admin_routes "Forbidden" 403
}

# Vendor Storefronts (wildcard subdomains)
*.pandamarket.tn {
    reverse_proxy localhost:3000
    encode gzip zstd
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options SAMEORIGIN
        X-XSS-Protection "1; mode=block"
    }
}
```

> ⚠️ **Replace `pandamarket.tn`** with your actual domain name everywhere in this file!

### 3.2 — Validate the configuration

```bash
caddy validate --config /etc/caddy/Caddyfile
```

Should say: `Valid configuration`

### 3.3 — Restart Caddy

```bash
sudo systemctl restart caddy
sudo systemctl status caddy
```

Should show `active (running)`.

### 3.4 — Check SSL certificates

Caddy will automatically request SSL certificates from Let's Encrypt. This may take 1–2 minutes for the first request.

```bash
# Check if certificates were issued
sudo caddy list-certificates
```

---

## Step 4: Test HTTPS

Open your browser and go to:

| URL | Expected |
|-----|----------|
| `https://pandamarket.tn` | Homepage (with padlock 🔒) |
| `https://api.pandamarket.tn/health` | Backend health check |
| `https://test-store.pandamarket.tn` | Vendor storefront (may show 404 if no store exists) |

### Verify SSL with curl

```bash
curl -I https://pandamarket.tn
```

You should see `HTTP/2 200` and no SSL errors.

---

## Step 5: Custom Domains for Vendors (Advanced)

When a vendor connects a custom domain (e.g., `www.mybrand.tn`), they need to:

1. Add a **CNAME record** pointing to `pandamarket.tn`
2. Or add an **A record** pointing to your server IP

The Caddy `on_demand` TLS configuration (already in the Caddyfile) will automatically issue SSL certificates for custom domains.

### Enable on-demand TLS

Add this block at the end of your Caddyfile:

```caddyfile
# Custom Domains — On-demand TLS
:443 {
    tls {
        on_demand
    }
    reverse_proxy localhost:3000
    encode gzip zstd
}
```

> ⚠️ **Security**: In production, configure `on_demand` with an `ask` endpoint to prevent abuse. This endpoint should verify that the domain belongs to a registered vendor.

---

## Troubleshooting DNS

### "This site can't be reached"
- DNS hasn't propagated yet (wait 5–30 minutes)
- Check that your A records are correct
- Check firewall: `sudo ufw status` (ports 80 and 443 must be open)

### "Certificate error" or "Not secure"
- Caddy couldn't get an SSL certificate
- Check Caddy logs: `sudo journalctl -u caddy -f`
- Make sure port 80 is open (Caddy needs it for the ACME challenge)
- Make sure DNS points to the correct IP

### "502 Bad Gateway"
- The backend or frontend isn't running
- Check: `pm2 status`
- Check: `curl http://localhost:3000` and `curl http://localhost:9000`

---

> **Next:** [10 — Payment Providers Setup](./10-payment-providers.md)
