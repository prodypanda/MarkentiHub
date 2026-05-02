# 12 — Troubleshooting & FAQ

Common problems and their solutions, organized by category.

---

## 🖥 Local Development Issues

### Docker won't start

**Symptom**: Docker Desktop shows "Docker Desktop stopped" or won't launch.

**Solutions**:
1. Make sure **Virtualization** is enabled in your BIOS:
   - Restart your computer → Press F2/Del during boot → Find "Virtualization Technology" → Enable
2. Make sure **WSL 2** is installed:
   ```powershell
   wsl --install
   wsl --set-default-version 2
   ```
3. Restart your computer after any changes

---

### Port already in use

**Symptom**: `Error: listen EADDRINUSE :::9000` or similar.

**Solution**:
```powershell
# Find what's using port 9000
netstat -ano | findstr :9000

# Kill the process (replace 12345 with the PID from above)
taskkill /PID 12345 /F
```

**Common port conflicts**:
| Port | Could be used by |
|------|-----------------|
| 5432 | Local PostgreSQL installation |
| 6379 | Local Redis installation |
| 9000 | MinIO (conflicts with backend) |
| 3000 | Another Node.js app |

---

### `npm install` fails

**Symptom**: Errors during `npm install` with messages about `node-gyp`, `bcrypt`, or native modules.

**Solution**:
```powershell
# Install build tools (Windows)
npm install --global --production windows-build-tools

# Or install Visual Studio Build Tools manually:
# https://visualstudio.microsoft.com/visual-cpp-build-tools/
```

If the error is about **Python**:
```powershell
# Install Python (needed for node-gyp)
winget install Python.Python.3.12
```

---

### Database connection refused

**Symptom**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solutions**:
1. Check Docker is running: `docker compose ps`
2. Wait 10 seconds after starting Docker services
3. Check PostgreSQL logs: `docker compose logs postgres`
4. Make sure the database URL in `.env` matches `docker-compose.yml` credentials

---

### Migrations fail

**Symptom**: `Error: relation "xxx" already exists` or `Error: migration failed`

**Solutions**:
```powershell
# Option 1: Try running migrations again
npx medusa migrations run

# Option 2: Reset the database completely
docker compose down -v
docker compose up -d
# Wait 10 seconds
npx medusa migrations run
npx medusa exec ./src/scripts/seed.ts
```

---

### TypeScript compilation errors

**Symptom**: Red squiggly lines in VS Code, or `tsc --noEmit` shows errors.

**Solution**: The codebase uses `// @ts-nocheck` directives where Medusa v2's dynamic types are incompatible with strict TypeScript. Make sure you didn't accidentally remove them.

```powershell
# Check if there are errors
cd backend
npx tsc --noEmit

cd ..\frontend
npx tsc --noEmit
```

Both should exit with code 0.

---

### Frontend can't connect to backend

**Symptom**: Network errors, "Failed to fetch", or CORS errors in the browser console.

**Solutions**:
1. Make sure the backend is running: `curl http://localhost:9000/health`
2. Check `NEXT_PUBLIC_MEDUSA_URL` in `.env`: should be `http://localhost:9000`
3. Check `PD_STORE_CORS` in `.env`: should include `http://localhost:3000`
4. Restart the frontend after changing any `NEXT_PUBLIC_*` variable

---

## 🌐 Production Issues

### 502 Bad Gateway

**Symptom**: Caddy shows "502 Bad Gateway" in the browser.

**Cause**: The application behind Caddy isn't running.

**Solutions**:
```bash
# Check if processes are running
pm2 status

# Check specific logs
pm2 logs pd-backend
pm2 logs pd-frontend

# Restart everything
pm2 restart all
```

---

### SSL certificate not working

**Symptom**: Browser shows "Your connection is not private" or "ERR_SSL_PROTOCOL_ERROR".

**Solutions**:
1. Make sure DNS is pointing to your server:
   ```bash
   dig pandamarket.tn +short   # Should show your server IP
   ```
2. Make sure ports 80 and 443 are open:
   ```bash
   sudo ufw status
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```
3. Check Caddy logs:
   ```bash
   sudo journalctl -u caddy -f
   ```
4. Wait 2-5 minutes — Caddy needs time to request certificates from Let's Encrypt

---

### Out of memory

**Symptom**: Application crashes, `pm2` shows frequent restarts, or `OOM killer` in system logs.

**Solutions**:
```bash
# Check memory usage
free -h

# Check which process uses the most memory
htop
```

If memory is consistently above 80%:
1. Upgrade your VPS to more RAM
2. Or add swap space:
   ```bash
   sudo fallocate -l 4G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

---

### Disk full

**Symptom**: Application errors, Docker can't create containers.

**Solutions**:
```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -a --volumes

# Clean npm cache
npm cache clean --force

# Check largest files
du -sh /home/pandamarket/* | sort -rh | head -20
```

---

## ❓ Frequently Asked Questions

### How do I create an admin user?

```bash
cd backend
npx medusa user -e admin@pandamarket.tn -p YourPassword123!
```

---

### How do I reset a vendor's password?

Currently done through the database:

```bash
docker exec -it pd_postgres psql -U pd_user -d pandamarket
```

```sql
-- This depends on Medusa's auth system. Check the auth tables:
\dt *auth*
```

---

### How do I add a new subscription plan?

Edit `backend/src/utils/constants.ts`:
1. Add the plan to the `SubscriptionPlan` enum
2. Add the limits to the `PLAN_LIMITS` object
3. Update the seed script if needed
4. Run the seed: `npx medusa exec ./src/scripts/seed.ts`

---

### How do I back up the database?

```bash
# Create a backup
docker exec pd_postgres pg_dump -U pd_user pandamarket > backup_$(date +%Y%m%d).sql

# Restore from backup
cat backup_20260502.sql | docker exec -i pd_postgres psql -U pd_user -d pandamarket
```

Set up automatic daily backups with cron:

```bash
crontab -e
```

Add this line:

```
0 2 * * * docker exec pd_postgres pg_dump -U pd_user pandamarket > /home/pandamarket/backups/backup_$(date +\%Y\%m\%d).sql
```

This creates a backup every day at 2:00 AM.

---

### How do I update the application?

```bash
cd /home/pandamarket/pandamarket

# 1. Pull latest code
git pull origin main

# 2. Update backend
cd backend
npm install
npx medusa migrations run
pm2 restart pd-backend

# 3. Update frontend
cd ../frontend
npm install
npm run build
pm2 restart pd-frontend
```

---

### How do I monitor the server?

```bash
# Real-time process monitoring
pm2 monit

# View application logs
pm2 logs

# Server resource usage
htop

# Docker container status
docker compose ps

# Caddy (web server) status
sudo systemctl status caddy
```

---

### How do I enable/disable a payment method?

Payment methods are configured in `backend/src/modules/payment-providers/`. To disable a method, remove or comment out its registration in `medusa-config.ts`.

---

### Where are uploaded files stored?

| Environment | Location |
|-------------|----------|
| Local (MinIO) | Docker volume `minio_data` + accessible at `http://localhost:9001` |
| Production | Your S3 provider (OVH, Scaleway, AWS) |

---

### How do I check if Meilisearch is working?

```bash
# Health check
curl http://localhost:7700/health

# List indexes
curl http://localhost:7700/indexes \
  -H "Authorization: Bearer YOUR_MEILI_MASTER_KEY"
```

---

## 📞 Getting Help

If you encounter an issue not covered here:

1. **Check the logs** — 90% of issues are explained in the error message
2. **Search the Medusa docs** — https://docs.medusajs.com/v2
3. **Check the Medusa Discord** — https://discord.gg/medusajs
4. **Check Next.js docs** — https://nextjs.org/docs

---

> 🐼 **Happy building with PandaMarket!**
