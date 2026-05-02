# 02 — Prerequisites for Windows (Local Development)

This guide will help you install **every tool** you need to run PandaMarket on your Windows computer.

---

## ✅ Checklist

Before starting, make sure you install all of these:

| # | Software | Version | Required? |
|---|----------|---------|-----------|
| 1 | Node.js | ≥ 20.x | ✅ Yes |
| 2 | npm | ≥ 9.x (comes with Node) | ✅ Yes |
| 3 | Git | Latest | ✅ Yes |
| 4 | Docker Desktop | Latest | ✅ Yes |
| 5 | Visual Studio Code | Latest | 🟡 Recommended |
| 6 | Windows Terminal | Latest | 🟡 Recommended |

---

## Step 1: Install Node.js

Node.js is the JavaScript runtime that runs both the backend and frontend.

1. Go to **https://nodejs.org**
2. Download the **LTS version** (must be version **20 or higher**)
3. Run the installer — click **Next** on everything (default settings are fine)
4. **Check the box** that says "Automatically install the necessary tools" if asked

### Verify the installation

Open a **new** terminal (PowerShell or Command Prompt) and type:

```powershell
node --version
```

You should see something like `v20.16.0` or higher.

```powershell
npm --version
```

You should see `9.x` or `10.x`.

> ⚠️ **IMPORTANT:** If you see an error like `'node' is not recognized`, close ALL terminal windows and open a new one. Windows needs to reload the PATH.

---

## Step 2: Install Git

Git is used to download (clone) the project code and track changes.

1. Go to **https://git-scm.com/download/win**
2. Download the installer and run it
3. Click **Next** on everything (all default options are fine)

### Verify the installation

```powershell
git --version
```

You should see something like `git version 2.45.0.windows.1`.

---

## Step 3: Install Docker Desktop

Docker runs the infrastructure services (PostgreSQL, Redis, Meilisearch, MinIO) in isolated containers so you don't have to install them individually.

### 3a. Enable WSL 2 (required for Docker)

1. Open **PowerShell as Administrator** (right-click → "Run as administrator")
2. Run this command:

```powershell
wsl --install
```

3. **Restart your computer** when prompted

### 3b. Install Docker Desktop

1. Go to **https://www.docker.com/products/docker-desktop/**
2. Click **Download for Windows**
3. Run the installer
4. Make sure **"Use WSL 2 instead of Hyper-V"** is checked during installation
5. Click **OK** and let it install
6. **Restart your computer** when prompted

### 3c. Start Docker Desktop

1. Open **Docker Desktop** from the Start menu
2. Wait for it to say **"Docker Desktop is running"** in the bottom-left corner
3. You may need to accept the license agreement on first run

### Verify the installation

```powershell
docker --version
```

You should see something like `Docker version 27.x.x`.

```powershell
docker compose version
```

You should see something like `Docker Compose version v2.x.x`.

> ⚠️ **Common Issue:** If Docker won't start, make sure:
> - Virtualization is enabled in your BIOS (search "enable virtualization [your motherboard brand]")
> - WSL 2 is installed properly (`wsl --status` should show "Default Version: 2")

---

## Step 4: Install Visual Studio Code (Recommended)

VS Code is the best code editor for this project.

1. Go to **https://code.visualstudio.com**
2. Download and install

### Recommended VS Code Extensions

After installing VS Code, install these extensions (click Extensions icon on the left sidebar → search → install):

| Extension | Why |
|-----------|-----|
| **ESLint** | Shows code quality warnings |
| **Prettier** | Auto-formats code on save |
| **TypeScript Importer** | Auto-imports TypeScript modules |
| **Docker** | Manage Docker containers from VS Code |
| **Thunder Client** | Test API endpoints (like Postman) |

---

## Step 5: Install Windows Terminal (Recommended)

Windows Terminal is a better terminal than the default Command Prompt.

1. Open **Microsoft Store** (search in Start menu)
2. Search for **"Windows Terminal"**
3. Click **Get** / **Install**

---

## 🎯 You're Done!

You now have everything installed. Go to the next step:

> **Next:** [03 — Local Setup — Step by Step](./03-local-setup.md)
