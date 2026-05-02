# 10 — Payment Providers Setup

This guide explains how to configure each payment method supported by PandaMarket.

---

## Overview

PandaMarket supports **4 payment methods**, each designed for the Tunisian market:

| Method | Type | How it Works |
|--------|------|-------------|
| 🟢 **Flouci** | Online | Redirect to Flouci payment page → callback |
| 🔵 **Konnect** | Online | Redirect to Konnect payment page → callback |
| 🟡 **Mandat Minute** | Offline | Buyer sends money at post office → uploads proof → admin verifies |
| ⚪ **Cash on Delivery (COD)** | Offline | Payment collected at delivery |

---

## 1. Flouci Setup

Flouci is a Tunisian e-wallet and online payment platform.

### Create a Developer Account

1. Go to **https://developers.flouci.com**
2. Click **Sign Up**
3. Fill in your business information
4. Verify your email

### Get API Credentials

1. Log in to the developer dashboard
2. Click **Create New App**
3. Fill in:
   - App Name: `PandaMarket`
   - Callback URL: `https://api.pandamarket.tn/api/pd/payments/flouci/callback`
   - (For local testing: `http://localhost:9000/api/pd/payments/flouci/callback`)
4. Copy the **App Token** and **App Secret**

### Configure .env

```env
# Sandbox (testing)
PD_FLOUCI_APP_TOKEN=your_sandbox_token
PD_FLOUCI_APP_SECRET=your_sandbox_secret
PD_FLOUCI_BASE_URL=https://developers.flouci.com/api

# Production (real money)
PD_FLOUCI_APP_TOKEN=your_production_token
PD_FLOUCI_APP_SECRET=your_production_secret
PD_FLOUCI_BASE_URL=https://developers.flouci.com/api
```

### How the Payment Flow Works

```
1. Customer clicks "Pay with Flouci"
2. Backend creates a payment session → gets a redirect URL
3. Customer is redirected to Flouci's payment page
4. Customer completes payment on Flouci
5. Flouci redirects customer back to PandaMarket
6. Flouci sends a webhook callback to confirm payment
7. Backend captures the payment and triggers order processing
```

### Test Cards (Sandbox)

Use Flouci's sandbox test credentials (provided in their developer docs) to simulate payments without real money.

---

## 2. Konnect Setup

Konnect is a Tunisian fintech platform for card payments.

### Create a Merchant Account

1. Go to **https://konnect.network**
2. Click **Sign Up as Merchant**
3. Complete the registration and KYC verification
4. Navigate to **API Settings** in your dashboard

### Get API Credentials

1. In the Konnect dashboard → **Developers** → **API Keys**
2. Copy your **API Key**
3. Copy your **Receiver Wallet ID** (this is where payments are received)

### Configure .env

```env
# Sandbox (testing)
PD_KONNECT_API_KEY=your_sandbox_api_key
PD_KONNECT_RECEIVER_WALLET=your_sandbox_wallet_id
PD_KONNECT_BASE_URL=https://api.preprod.konnect.network/api/v2

# Production (real money)
PD_KONNECT_API_KEY=your_production_api_key
PD_KONNECT_RECEIVER_WALLET=your_production_wallet_id
PD_KONNECT_BASE_URL=https://api.konnect.network/api/v2
```

> ⚠️ Note the different base URLs for sandbox vs production!

### How the Payment Flow Works

```
1. Customer clicks "Pay with Card"
2. Backend creates a Konnect payment → gets a payment URL
3. Customer is redirected to Konnect's secure payment page
4. Customer enters card details
5. Konnect processes the payment
6. Customer is redirected back to PandaMarket
7. Konnect sends a webhook to confirm the payment
```

---

## 3. Mandat Minute Setup

Mandat Minute is a Tunisian postal money transfer service. **No API integration needed** — it's a manual verification process.

### How it Works

```
1. Customer selects "Mandat Minute" at checkout
2. PandaMarket displays instructions:
   - Go to your nearest La Poste office
   - Send the exact amount via Mandat Minute
   - Take a photo of the receipt
3. Customer uploads the receipt photo in their order page
4. PandaMarket admin reviews the receipt:
   - Checks the amount matches
   - Checks the reference number
   - Approves or rejects the payment
5. If approved, the order is processed
```

### Admin Workflow

1. Go to **Admin Dashboard** → **Mandats**
2. You'll see a list of pending mandat proofs
3. Click on a proof to see the uploaded receipt image
4. Click **Approve** (payment is captured) or **Reject** (order is cancelled)

### Escrow Period

Mandat Minute payments have a **14-day escrow period** before funds are available in the vendor's wallet. This protects buyers in case of disputes.

---

## 4. Cash on Delivery (COD) Setup

COD requires no external service — it's handled entirely within PandaMarket.

### How it Works

```
1. Customer selects "Cash on Delivery" at checkout
2. Order is created with status "payment_required"
3. Order is immediately authorized (no payment needed upfront)
4. Vendor prepares and ships the order
5. Delivery person collects payment from the customer
6. Vendor marks the order as "delivered" in the dashboard
7. Payment is marked as "captured"
```

### Configuration

No `.env` variables needed. COD is enabled by default.

### Considerations

- COD has **no escrow period** — funds are available immediately after delivery confirmation
- COD orders have a higher risk of "return to sender" (customer not home, refuses, etc.)
- Consider limiting COD to verified vendors only

---

## Webhook URLs Summary

When configuring webhooks in payment provider dashboards, use these URLs:

| Provider | Webhook URL |
|----------|------------|
| **Flouci** | `https://api.pandamarket.tn/api/pd/payments/flouci/webhook` |
| **Konnect** | `https://api.pandamarket.tn/api/pd/payments/konnect/webhook` |

> 💡 For local development, use [ngrok](https://ngrok.com) to expose your local server:
> ```bash
> ngrok http 9000
> ```
> Then use the ngrok URL as your webhook endpoint.

---

## Testing Payments Locally

Since payment providers need to send webhooks back to your server, local testing requires a public URL.

### Option 1: Use Sandbox Mode

Both Flouci and Konnect provide sandbox environments where you can simulate payments without public URLs.

### Option 2: Use ngrok

```bash
# Install ngrok
npm install -g ngrok

# Expose your backend
ngrok http 9000

# Use the generated URL (e.g., https://abc123.ngrok.io) as your webhook URL
```

### Option 3: Skip Online Payments

For local development, you can test with just **COD** and **Mandat Minute** (which don't need external callbacks).

---

> **Next:** [11 — S3 Storage Setup](./11-s3-storage-setup.md)
