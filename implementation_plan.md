# PandaMarket — Plan d'Audit et de Finalisation

Ce document présente l'état d'avancement du projet PandaMarket, les fonctionnalités implémentées, la validation de la sécurité et les tâches restantes pour la mise en production.

> [!IMPORTANT]
> PandaMarket est une plateforme hybride MaaS (Marketplace as a Service) et SaaS (Storefront Builder) ciblant le marché tunisien.

## 0. Résultat de l'audit (03/05/2026)

- [ ] Application **non finalisée**: plusieurs fonctionnalités P0/P1 sont partiellement implémentées ou en mode placeholder.
- [x] Application **sécurisée** au niveau authentification/autorisation (Phase 0 complétée — voir §3).
- [x] Base technique globale en place (modules principaux backend/frontend présents).

## 1. État de l'Audit (Checklist des Fonctionnalités)

### Core Backend (MedusaJS v2)
- [x] Initialisation MedusaJS avec PostgreSQL + Redis
- [x] Extension du modèle `Store` (`pd_store`) : Statut, Plan, Domaines, Thème, Config Paiement
- [x] Système de limites par abonnement (`pd_subscription`)
- [x] Gestion du Wallet vendeur (`pd_wallet`) : Solde, transactions, rétention
- [x] Système de crédits IA (`pd_credits`)
- [x] Processus KYC (`pd_verification`) : Upload documents (RC, CIN)
- [x] Système de signalement (`pd_reports`)
- [x] Gestion des clés API vendeurs (`pd_api_keys`)

### Multi-Tenant Frontend (Next.js)
- [x] Middleware de détection hostname (Hub vs Admin vs Boutique)
- [x] Routage dynamique basé sur le `store_id`
- [x] Système de thèmes basé sur des variables CSS (`theme-minimal`, `theme-classic`, etc.)
- [x] Intégration GrapesJS pour le Page Builder (SaaS mode)
- [x] Dashboard Vendeur complet (Produits, Commandes, Paramètres, Wallet, KYC, IA)
- [ ] Authentification frontend connectée au backend (`/login`, `/register` encore en TODO)
- [ ] Support complet des domaines personnalisés (Caddy est configuré mais nécessite test de bout en bout)

### Paiements & Logistique
- [x] Intégration **Flouci** (Escrow & Direct)
- [x] Intégration **Konnect** (Escrow & Direct)
- [x] Système **Mandat Minute** (Upload preuve + validation admin)
- [x] Paiement à la livraison (COD)
- [x] Logique de commission automatique (15% pour le plan Free)
- [x] Intégration **Aramex** (Fulfillment Provider)
- [x] Intégration **La Poste Tunisienne** (Fulfillment Provider)

### Intelligence Artificielle & Recherche
- [x] Recherche instantanée avec **Meilisearch**
- [x] Synchronisation automatique des produits vers Meilisearch (Subscribers)
- [x] Workers BullMQ pour les tâches asynchrones
- [x] Compression d'image IA via `sharp`
- [x] Génération SEO IA via **Gemini Pro API**

---

## 2. Audit de Sécurité

### Authentification & Autorisation
- [x] Utilisation de JWT pour toutes les API (cohérent via `authenticateVendor` + `authenticateAdmin`)
- [x] Isolation stricte des données vendeurs (`store_id` enforcement via contexte authentifié)
- [x] Rôles RBAC (Customer, Vendor, Admin, Super Admin)
- [x] Hashage des mots de passe avec bcrypt (12 rounds)
- [x] Hachage des clés API (PBKDF2 + Pepper)

### Protection des Données
- [x] Chiffrement symétrique des clés API vendeurs (Flouci/Konnect) via AES-256-GCM
- [x] Stockage sécurisé des documents KYC (Presigned URLs S3)
- [x] Headers de sécurité configurés (Helmet, CSP, XSS protection)
- [ ] Rate limiting actif via Redis sur tous les endpoints critiques (à compléter/valider endpoint par endpoint)

### Infrastructure
- [x] Caddy configuré pour SSL automatique
- [x] Base de données et Redis non exposés sur le web (Bind local/Docker)
- [ ] Signature HMAC des webhooks (en cours de vérification pour tous les providers)

---

## 3. Plan d'Action Final (Tâches Restantes)

### Phase 0 : Correctifs Critiques Sécurité (immédiat)
- [x] Supprimer les fallbacks d'authentification non sécurisés déjà identifiés (`store_123`, secret JWT par défaut, mocks permissifs)
- [x] Forcer le `store_id` depuis le contexte authentifié sur toutes les routes vendor (ai/seo, products/[id] PUT/DELETE, upload/presigned-url)
- [x] Créer le middleware `authenticateAdmin` (rôle admin/super_admin requis) et l'appliquer à `/api/pd/admin/*`
- [x] Ajouter les matchers manquants dans `middlewares.ts` (wallet, credits, products, api-keys, notifications, verification, ai, digital)
- [x] Corriger les tests backend — tous 40 passent désormais (fixes authenticateVendor tests + order-splitter mock)

### Phase A : Validation & Tests (Semaine 1)
- [ ] Réaliser des tests de bout en bout sur le flux de paiement direct (Pro+)
- [ ] Valider le rendu du Page Builder GrapesJS avec les variables CSS des thèmes
- [ ] Tester la synchronisation Meilisearch avec un grand volume de produits (> 1000)
- [ ] Vérifier la gestion des erreurs sur les Workers BullMQ (Retry policy)

### Phase B : Polish UI/UX (Semaine 2)
- [ ] Améliorer les micro-animations du Hub Central
- [ ] Finaliser les emails transactionnels (Confirmations de commande, Alertes KYC)
- [ ] Optimiser le chargement des images via Next.js `Image` component sur les storefronts

### Phase C : Préparation Production (Semaine 3)
- [ ] Configurer les backups automatiques de la base PostgreSQL
- [ ] Setup du monitoring (Sentry / Prometheus)
- [ ] Documentation finale pour les vendeurs (Help Center)

---

## 4. Plan de Vérification

### Tests Automatisés
- [x] `npm test` dans le backend — **40 tests passent** (4 suites)
- [ ] `npm run lint` et `npm run build` dans le frontend — en échec (config lint + conflits routes Next.js + babel/meilisearch)

### Tests Manuels
1. **Flux Vendeur** : Inscription → KYC → Création Produit (draft) → Approbation Admin → Publication.
2. **Flux Achat** : Choix produit → Panier multi-vendeur → Paiement Flouci → Capture → Mise à jour Wallet.
3. **Flux IA** : Upload image lourde → Compression auto → Génération SEO → Vérification métadonnées.

---

## 5. Questions Ouvertes & Points d'Attention
- **Caddy & Custom Domains** : Est-ce que le serveur a les permissions nécessaires pour modifier la configuration Caddy dynamiquement ou via API ?
- **Passerelles de Paiement** : Les comptes sandbox Flouci/Konnect sont-ils fournis pour les tests finaux ?
- **Frais de Stockage** : Prévoir une limite d'upload par vendeur selon le plan pour éviter l'explosion des coûts S3/R2.
