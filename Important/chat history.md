give me the best free github repo for marketplace system that i can use it as starting point for my marketplace system, if yo want or if you need you can ask me questions before starting the search.

Salut Nasro ! Pour t'éviter de réinventer la roue, voici les meilleurs dépôts GitHub gratuits (Open Source) pour lancer un système de marketplace en 2026.

Le choix dépendra principalement de ton affinité avec Node.js ou PHP et du type de produits (physiques vs services).

1. MedusaJS + Mercur (Le combo moderne)
C'est actuellement le "gold standard" pour le commerce headless. Medusa est le noyau, et Mercur est le starter spécifique pour transformer ce noyau en marketplace multi-vendeurs.

Stack : Node.js, TypeScript, Medusa.

Points forts : Architecture API-first très flexible, gestion native des paiements complexes (order splitting) et interface admin très propre.  

GitHub : medusajs/medusa & mercurjs/mercur

2. Bagisto (La puissance Laravel)
Si tu préfères rester dans l'écosystème PHP, Bagisto est l'un des frameworks e-commerce les plus complets basés sur Laravel.  

Stack : PHP, Laravel, Vue.js.

Points forts : Très robuste pour les marketplaces de produits physiques. Il existe une version "Multi-Vendor" open-source très performante.

GitHub : bagisto/bagisto

3. Cocorico (Spécialisé Services & Locations)
Si ta marketplace ressemble plus à un Airbnb ou un Fiverr qu'à un Amazon, Cocorico est l'outil idéal.  

Stack : PHP, Symfony.

Points forts : Conçu spécifiquement pour la prise de rendez-vous, la location de matériel et les services complexes.  

GitHub : Cocorico-Project/Cocorico

4. Vendure (L'alternative GraphQL)
Un framework headless construit sur NestJS qui est extrêmement apprécié par les développeurs pour sa modularité.

Stack : Node.js, NestJS, TypeScript, GraphQL.

Points forts : Système de plugins très puissant pour ajouter des fonctionnalités multi-vendeurs sans toucher au cœur du système.

GitHub : vendure-ecommerce/vendure

Quel est ton verdict ?
Pour t'orienter vers le dépôt le plus pertinent : souhaites-tu bâtir une marketplace de produits physiques (stock, livraison) ou une plateforme de services/réservations ?

1

C'est un excellent choix, Nasro. MedusaJS est souvent surnommé l'alternative open source à Shopify, mais avec une flexibilité totale pour les développeurs. Pour une marketplace, c'est l'une des architectures les plus propres grâce à son approche headless.

Pourquoi Medusa + Mercur ?
Architecture Headless : Le backend (logic) est totalement séparé du frontend. Tu peux utiliser Next.js pour le store, React pour l'admin, ou même une application mobile.

Multi-vendeurs (Mercur) : Mercur ajoute la couche nécessaire pour gérer plusieurs boutiques sur une seule instance (tableaux de bord vendeurs, commissions, séparation des commandes).

Extensibilité : Contrairement à WordPress/WooCommerce, tu n'es pas limité par des plugins rigides. Tout se fait via des abonnés (subscribers) et des services en Node.js.

Comment démarrer rapidement
Installation du noyau Medusa :

Bash
npx create-medusa-app@latest
Configuration du multi-vendeur :
Tu devras intégrer le plugin Mercur ou suivre leur structure de "Marketplace Starter" disponible sur leur GitHub pour gérer les entités Store liées aux produits.

Points à surveiller
Hébergement : Comme c'est du Node.js, tu auras besoin d'un VPS ou d'une plateforme type Railway/Render (plus complexe qu'un simple hébergement mutualisé).

Base de données : Medusa utilise PostgreSQL et Redis pour la gestion des files d'attente et du cache.

Souhaites-tu que je te détaille les étapes spécifiques pour configurer le tableau de bord côté vendeur ?

i want to create my own version of this marketplace, so now you need to ask me multiples questions to get what i need about functionalities and features..



To build a solid blueprint for your version of the marketplace, I need to understand the "soul" of the project.

Since we are looking at a MedusaJS foundation, here are the key questions to define your requirements:

1. The Core Product
What are you selling? Is it physical goods (like machinery or tools), digital products (software, licenses), or services (bookings, rentals)?

Inventory: Will vendors sync their own stock, or will you manage a central warehouse?

2. The Money Flow
Monetization: Will you take a percentage commission per sale, charge a monthly subscription to vendors, or charge for "featured" listings?

Payments: Do you need to integrate local payment gateways (like Flouci, Konnect, or GPG) for the Tunisian market, or international ones like Stripe/PayPal?

3. Logistics & Operations
Shipping: Will vendors be responsible for their own shipping, or will the marketplace provide a unified shipping solution (e.g., integration with Aramex or Jumia Logistics)?

Order Splitting: If a customer buys from three different vendors in one cart, how should the system handle the shipping costs and notifications?

4. Specialized Features
Vendor Dashboard: What level of control do vendors need? (e.g., basic product upload vs. advanced analytics and discount management).

AI Enhancement: Do you want built-in tools to help vendors generate "ultra-realistic" product photos or SEO-optimized descriptions automatically?

Approval Workflow: Should vendor products go live instantly, or do they need a "Super Admin" (you) to approve them first?

Which of these is the highest priority for your first version (MVP)?

1- this is a marketplace, so vendors can sell everythings (physical goods, digital products,services).

the vendor can vendors sync their own stock.

2-there are two types of subscription, one time subscription (yearly subscription without commission), and the second is a free subscription with taking a percentage commission per sale, also there are a lots of payed options that vendors can buy like ai driven seo, products image coompress...

for the yearly subscription the vendors can chose one of multiples levels of yearly subscription like (starter, regular, agency, pro, golden, platinium) there are variations between them in terms of the limit on the number of products, limit of pictures per products and a lots of features ...etc.

for the Payments,  i need to integrate local payment gateways like Flouci, Konnect and payment on delivery.



3- the vendors can chose between to be responsible for their own shipping or use a provided unified shipping solution like (Aramex, la poste tn ..etc).

for the Order Splitting, it need to be configurable from the marketplace admin platform, so the marketplace admin can chose between them. but for the starting point, it need to be separate shipping costs and notifications.



4- as i told to you before, there is a multiple level of controll, features and functionalities, depend on the subscription or pourcentage or separate buyed options.

 for the AI Enhancement, also as i told to you before, its an option thaat included in specific subscriptions or pourcentage levels and also can buyed separately as opitons.

for the Approval Workflow, if the user is not verified, it need to whait until a supper admin approve new products, and if its a verified vendor her products go live instantly.

---

another ideas:

every vendor create new store get has his own website with free subdommain, and can buy or point her domain to her website. also he can chose a template from a free or paied list of template. also her products shold be visible in the marketplace hub like amazon..etc

-------

ask me more questions to get more clarifications and get a comprehensive overview of the project.

C'est un projet ambitieux, Nasro. Ce que tu décris dépasse la simple marketplace : c'est une plateforme SaaS multi-tenante (similaire à Shopify ou Wix) couplée à un Hub central (type Amazon).

Compte tenu de la complexité technique (sous-domaines, templates personnalisés, gestion des abonnements), voici les questions cruciales pour affiner l'architecture :

1. Architecture Multi-Tenante & Frontend
Gestion des Templates : Comme tu souhaites proposer des templates, comment imagines-tu le moteur de rendu ? Est-ce que ce seront des thèmes React/Next.js pré-construits que le vendeur peut juste personnaliser (couleurs, logos), ou un vrai constructeur de pages (Drag & Drop) ?

Routage des Domaines : Pour les sous-domaines (ex: boutique.tonsite.tn) et les domaines personnalisés, as-tu déjà une préférence pour la gestion du proxy inverse (Nginx, Caddy ou Vercel Platforms) pour gérer les certificats SSL dynamiquement ?

2. Gestion des Services & Produits Numériques
Services : Pour la vente de services, le vendeur a-t-il besoin d'un calendrier de réservation (booking) intégré, ou s'agit-il simplement d'une commande classique avec livraison d'un rapport/travail ?

Fichiers Numériques : Pour les produits digitaux, as-tu besoin d'un système de liens de téléchargement temporaires sécurisés (hébergés sur S3 par exemple) ou d'un système de clés de licence ?

3. Système de Payouts (Reverse Logistics financière)
Flux de l'argent : Lorsqu'un client paie via Flouci ou Konnect, l'argent arrive sur ton compte principal. Quel est le délai de reversement aux vendeurs ? Prévois-tu un portefeuille virtuel (Wallet) où le vendeur peut demander un retrait, ou des virements automatiques après X jours ?

4. IA & Optimisation (Add-ons)
Infrastructure IA : Pour le "AI driven SEO" et la compression d'image, souhaites-tu que ces tâches soient exécutées de manière asynchrone (via des Queues/Workers) pour ne pas ralentir le serveur principal lors des uploads massifs ?

Crédits : Les options payantes (IA) seront-elles basées sur un usage illimité par abonnement ou sur un système de jetons (tokens) à acheter ?

5. Vérification & Sécurité
Processus de Vérification : Pour devenir un "Verified Vendor", quels documents prévois-tu de demander (Registre de commerce, CIN, etc.) ? Le passage du statut "Non-vérifié" à "Vérifié" doit-il être automatique après un certain nombre de ventes réussies ou 100% manuel ?

Modération : En dehors de l'approbation des produits, as-tu besoin d'un système de signalement (Report) pour les clients en cas de fraude d'un vendeur ?

6. Synchronisation des Stocks
External Sync : Quand tu dis que les vendeurs peuvent synchroniser leur stock, parles-tu d'un import CSV/Excel manuel, ou d'une API/Webhooks pour se connecter à leurs propres logiciels de gestion (ERP/POS local) ?

Une fois que nous aurons ces détails, je pourrai t'aider à tracer le schéma technique complet pour MedusaJS.

1- les deux, le vendeur peus choisir between chose between React/Next.js pré-construits thèmes, ou utiliser un vrai constructeur de pages (Drag & Drop).

pour les Routage des Domaines, jais pas des autres preferences pour maintenant.

2- pour les Services: il s'agit simplement d'une commande classique avec livraison d'un rapport/travail.

pour les Fichiers Numériques, il ya les deux (système de liens de téléchargement temporaires sécurisés, un système de clés de licence).

3- le vendeur peus utilise notre systeme preconfigurée du paiement (Flouci ou Konnect ou mondat minute.. etc) est les argent arrive sur notre compte principal et aprée certin periode (depend au type du compte du vendeur et type de mode de paiement) puis le vendeur peux choisir la modalité de versement automatique ou aprée demander un retrait.

le vendeur peus aussi fait un contrat direct avec les systeme de paiement comme Flouci ou Konnect.. etc et peut utiliser ces modalité de paiement aprée un configuration fait par lui eu, a ce stade, les paiements aura fait directemen au compte du vendeur.

4-pour l'Infrastructure IA Pour le "AI driven SEO" et la compression d'image, ces tâches soient exécutées de manière asynchrone.

pour Les options payantes (IA) seront basées sur un usage illimité par abonnement et sur un système de jetons (tokens) à acheter (le vendeur peus choisir).

5-pour le Processus de Vérification: Pour devenir un "Verified Vendor" les documents demander sont (Registre de commerce, CIN)+ verification par appele telephonique, Le passage du statut "Non-vérifié" à "Vérifié" doit-il être 100% manuel.

pour la Modération, En dehors de l'approbation des produits jais besoin d'un système de signalement (Report) pour les clients en cas de fraude d'un vendeur.

6-pour le External Sync, les vendeurs peuvent synchroniser leur stock (import/export CSV/Excel manuel et une API/Webhooks pour se connecter à leurs propres logiciels de gestion).

C'est un projet monumental, Nasro. On ne parle plus d'une simple marketplace, mais d'une véritable plateforme MaaS (Marketplace as a Service). C'est un hybride entre Shopify (pour les boutiques individuelles) et Amazon (pour le hub central).

Pour un développeur senior comme toi, voici l'analyse technique de cette architecture complexe et comment structurer tout cela.

1. Architecture Multi-Tenante & Frontend
C'est le plus gros défi technique. Pour gérer des milliers de boutiques avec des domaines différents :

Routage Dynamique : Je te suggère d'utiliser Vercel Platforms ou un proxy inverse comme Caddy (plus simple que Nginx pour le SSL automatique). Caddy peut générer des certificats SSL "on-the-fly" pour les domaines de tes vendeurs (boutique-vendeur.tn).

Thèmes vs Builder :

Thèmes : Utilise des composants dynamiques en Next.js. Chaque vendeur choisit un ID de thème dans sa config, et ton frontend charge le layout correspondant.

Drag & Drop : Pour ne pas réinventer la roue, regarde GrapesJS ou Craft.js. Ce sont des frameworks open-source qui te permettent de bâtir un éditeur visuel puissant que tu peux intégrer dans ton dashboard vendeur.

2. Orchestration des Paiements (Hybride)
Tu as deux flux financiers radicalement différents :

Modèle Escrow (Le tien) : Tu collectes l'argent -> Tu prends ta commission -> Tu verses le reste. Il te faudra un "Wallet" en base de données pour chaque vendeur pour suivre les soldes avant retrait.

Modèle Direct : Le vendeur entre ses propres clés API (Flouci/Konnect). Dans ce cas, MedusaJS doit instancier le PaymentProvider avec les credentials du vendeur et non les tiens. C'est une modification spécifique à prévoir dans le plugin de paiement.

3. Infrastructure IA & Tâches Asynchrones
Pour éviter que l'upload d'une image de 10Mo ou la génération SEO ne bloque le serveur :

Queue System : Utilise BullMQ (basé sur Redis).

Workflow :

Le vendeur upload.

Le job est mis en file d'attente.

Un worker (Node.js) traite l'image/le texte.

Une notification (Webhook/WebSocket) informe le vendeur que c'est prêt.

Tokens : Une simple table vendor_credits en base de données, décrémentée à chaque appel d'API réussi.

4. Gestion des Produits & Vérification
Statut de vérification : Tu auras besoin d'une extension du modèle Store ou User dans Medusa avec un champ is_verified: boolean.

Workflow d'approbation :

Si vendor.is_verified === false, le produit créé prend le statut draft par défaut et une notification est envoyée à ton admin.

Si true, le statut passe directement à published.

5. Synchronisation Externe (API & Webhooks)
Pour que tes vendeurs pro puissent connecter leur ERP :

API Key Management : Tu dois permettre aux vendeurs de générer des clés API spécifiques à leur boutique dans leur dashboard.

Webhooks sortants : Ton système doit être capable d'envoyer un signal à l'ERP du vendeur (ex: order.placed) pour qu'il puisse décrémenter son stock local automatiquement.

Mes dernières questions pour verrouiller le plan :
L'aspect "Mandat Minute" : Comme c'est un processus manuel (hors système bancaire numérique), as-tu besoin d'une interface spécifique pour que le vendeur puisse uploader une preuve de reçu (photo du mandat) afin que tu valides manuellement le paiement ?

Hébergement des fichiers : Avec des milliers de boutiques et de l'IA (images compressées + originales), le stockage va exploser. Comptes-tu utiliser un service de type S3 (AWS) ou une solution locale en Tunisie pour la rapidité ?

Scalabilité du Hub : Le hub central (ton "Amazon") doit-il supporter des millions de produits ? Cela impactera le choix du moteur de recherche (Algolia ou un Meilisearch auto-hébergé).

Qu'en penses-tu, Nasro ? Est-ce qu'on commence à regarder la structure des tables de la base de données ou tu veux approfondir un point spécifique ?

1- pour le Mandat Minute jai besoin d'une interface spécifique pour que le vendeur puisse uploader une preuve de reçu (photo du mandat) afin que je valides manuellement le paiement (aussi ces un modalité de paiement disponible pour les acheteurs fineaux).

2-les deux (configurable).

3-chose the best one.

C'est clair, Nasro. On s'attaque à une architecture de type "SaaS" tunisien pur jus. Le support du Mandat Minute est une touche locale indispensable mais qui demande une gestion de flux asynchrone humaine.

Voici l'analyse technique pour ces trois points :

1. Workflow Mandat Minute (Preuve d'achat)
Puisque ce n'est pas un flux API direct, on traite cela comme une Machine à États (State Machine) :

Côté Client/Vendeur : Lors du checkout, l'utilisateur choisit "Mandat Minute". La commande est créée avec le statut payment_required. Une interface dédiée lui permet d'uploader une photo (via une presigned URL pour la sécurité).

Côté Admin : Tu as besoin d'une file d'attente "Validation Manuelle". L'admin voit la photo, le montant attendu, et clique sur "Approuver" ou "Rejeter".

Action Technique : À l'approbation, le système déclenche l'événement payment.captured qui débloque la commande ou l'abonnement.

2. Stockage Hybride (S3 vs Local)
Pour rester flexible et performant en Tunisie :

Recommandation : Utilise l'API S3-compatible.

Pourquoi ? Tu peux utiliser MinIO (auto-hébergé sur un serveur local en Tunisie pour la rapidité) au début. Si ton projet explose, tu n'as qu'à changer les variables d'environnement pour passer sur AWS S3 ou Cloudflare R2 sans toucher une seule ligne de code.

3. Le meilleur moteur de recherche pour le Hub
Oublie Elasticsearch (trop lourd) ou Algolia (trop cher pour une marketplace avec des millions de produits).

Le gagnant : Meilisearch.

Pourquoi ?

Ultra-rapide : "Search-as-you-type" (parfait pour ton hub).

Typo-tolerance : Crucial pour les clients qui font des fautes de frappe.

Open-source : Tu peux l'héberger toi-même pour garder le contrôle total sur tes données.

Facile : S'intègre parfaitement avec MedusaJS.

Aperçu de l'Architecture Globale
Synthèse de la Stack Technique proposée
Composant	Technologie
Backend Core	MedusaJS (Node.js)
Frontend Hub	Next.js (SEO friendly)
Frontend Vendeurs	Next.js (Multi-tenant via Vercel/Caddy)
Base de données	PostgreSQL (Données) + Redis (Queues IA/Jobs)
Recherche	Meilisearch
Tâches Asynchrones	BullMQ
