# 🇧🇫 BURKINA NEWS · CHRONOLOGIE & PLAN D'EXÉCUTION DU BACKEND
**Horizon : 09 Septembre 2026 – 15 Novembre 2026 (10 Semaines)**  
*Document opérationnel de suivi de projet — Direction Technique*

---

## 1. Stack Technique Complète

| Couche | Technologie choisie | Rôle dans le projet | Avantage clé pour Burkina News |
| :--- | :--- | :--- | :--- |
| **Frontend & Back-Office** | **Next.js 16 (React 19) + Tailwind CSS v4 + TypeScript** | Interface publique du journal et back-office de gestion éditoriale | Rendu hybride SSR/SSG ultra-rapide, SEO Google Actualités, composants réactifs légers. |
| **Backend / API** | **Golang (Go 1.22+) avec Gin ou Fiber** | API RESTful haute performance, authentification JWT, logique métier, validation | Binaire compilé natif, consommation minime (~40 Mo de RAM), encaisse 20 000 req/sec sans broncher. |
| **Base de Données** | **PostgreSQL 16** | Stockage structuré des articles, métadonnées, dépêches, chantiers et utilisateurs | Full-Text Search français, intégrité transactionnelle stricte (ACID), extensions performantes. |
| **Stockage Fichiers (Images & PDF)** | **Cloudflare R2 (Compatible S3)** | Hébergement des photographies d'articles, PDF des numéros trimestriels et pièces officielles | **0 FCFA de frais de bande passante / téléchargement**, 10 Go gratuits, distribution via CDN mondial. |
| **Vidéos & Streaming** | **YouTube Embed (non répertorié) ou Cloudflare Stream** | Diffusion des reportages vidéos et interviews d'investigation | Débit adaptatif automatique (144p à 1080p) pour les connexions mobiles burkinabè (3G/4G). |

---

## 2. Comparatif Hébergement & Grille des Prix (Railway vs Render vs OVH)

### Tableau Comparatif

| Plateforme | Coût mensuel estimé | PostgreSQL & API Go | Verdict pour Burkina News |
| :--- | :--- | :--- | :--- |
| **🚂 Railway (Recommandé)** | **5 $ à 20 $ / mois**<br>*(~3 100 à 12 500 FCFA)* | API Go + Postgres dans le même projet. Réseau privé interne chiffré sans surcoût. | **✅ MEILLEUR CHOIX** : Facturation à l'usage réel de Go. Déploiement Git ultra-simple. |
| **⚪ Render** | **32 $ / mois minimum**<br>*(~20 000 FCFA)* | Go Web Service (7$ à 25$) + Postgres (7$ à 25$). Les instances gratuites s'endorment après 15 min. | ❌ Moins flexible, plus cher pour démarrer, tableau de bord plus rigide. |
| **🔵 OVH Managed Postgres** | **42 138 à 53 632 FCFA / mois**<br>*(~65 à 82 €)* | PostgreSQL uniquement. Il faut louer un serveur VPS séparé pour l'API Go. | ❌ Trop cher et surdimensionné pour la phase de lancement. |

### Détail des Abonnements Retenus

| Service & Fournisseur | Plan sélectionné | Détail de la facturation | Coût mensuel estimé |
| :--- | :--- | :--- | :---: |
| **Railway (API Go + Base PostgreSQL)** | Hobby ($5) ou Pro ($20) | Hobby : 5$ de crédits inclus. Pro : 20$ inclus, jusqu'à 1 TB de storage, haute disponibilité. | **3 100 à 12 500 FCFA / mois** *(5 $ à 20 $)* |
| **Cloudflare R2 (Stockage Médias)** | Pay-as-you-go | 10 Go stockés 100% GRATUITS / mois. 0$ de bande passante. Au-delà : 0,015 $/Go. | **0 FCFA / mois** *(Gratuit jusqu'à 10 Go)* |
| **Cloudflare CDN & Sécurité** | Free Plan | SSL Universel, protection anti-DDoS, mise en cache CDN. | **0 FCFA / mois** *(100% Gratuit)* |
| **Nom de Domaine** | Namecheap / OVH | Renouvellement annuel du nom de domaine (.bf ou .com). | **~700 à 1 200 FCFA / mois** *(~10 à 15 € / an)* |

> 💰 **BUDGET TOTAL MENSUEL PRÉVU :**  
> • Phase de développement : **~3 100 FCFA / mois (5 $ / mois)**  
> • Phase de production officielle : **~13 000 à 15 000 FCFA / mois (20 $ à 23 $ / mois)**

---

## 3. Règle Technique de Stockage des Fichiers

| Type de contenu | Emplacement de stockage | Rôle de la base PostgreSQL | Mode de diffusion utilisateur |
| :--- | :--- | :--- | :--- |
| **Images d'articles & Couvertures** | **Cloudflare R2** (Bucket S3) | Stocke uniquement l'URL publique CDN et la taille du fichier | Mise en cache CDN mondiale (chargement immédiat) |
| **Magazines & Rapports PDF** | **Cloudflare R2** (Bucket S3) | Stocke le titre, le nombre de pages et l'URL du PDF | Téléchargement direct sans frais de bande passante |
| **Reportages Vidéos & Interviews** | **YouTube** (Non répertorié) ou **Cloudflare Stream** | Stocke l'identifiant de la vidéo (embed ID) | Lecteur vidéo adaptatif (qualité auto 144p à 1080p) |

---

## 4. Chronologie Opérationnelle avec Cases à Cocher (10 Semaines)

### 📅 Semaine 1 (09 au 13 Septembre 2026) : Socle Technique, Golang & PostgreSQL
| ID | Tâche & Activités techniques | Composants / Endpoints | Statut / Fait |
| :---: | :--- | :--- | :---: |
| **T1.1** | Initialiser le dépôt backend Go (Go 1.22+, structure Clean Architecture : handlers, services, repositories). | `cmd/api/main.go`, `internal/` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T1.2** | Créer les scripts de migrations SQL PostgreSQL 16 (tables users, articles, briefs, projects, indicators, media). | `migrations/000001_init.up.sql` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T1.3** | Configurer l'environnement Docker & Docker-Compose local (API Go + PostgreSQL + pgAdmin). | `Dockerfile`, `docker-compose.yml` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T1.4** | Créer les endpoints de base de vérification de santé (Healthcheck & Ping). | `GET /health`<br>`GET /api/v1/ping` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |

---

### 📅 Semaine 2 (14 au 20 Septembre 2026) : Authentification, Sécurité & Rôles
| ID | Tâche & Activités techniques | Composants / Endpoints | Statut / Fait |
| :---: | :--- | :--- | :---: |
| **T2.1** | Implémenter le hachage sécurisé des mots de passe (Bcrypt / Argon2id). | `pkg/security/hash.go` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T2.2** | Créer le service d'authentification par jetons JWT (Access Token 15 min + Refresh Token 7 jours). | `POST /api/v1/auth/login`<br>`POST /api/v1/auth/refresh` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T2.3** | Développer le middleware de contrôle d'accès selon les rôles (Admin, Rédacteur en chef, Journaliste, Pigiste). | `internal/middleware/auth.go` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T2.4** | Endpoints de gestion du profil connecté et liste des utilisateurs pour l'administration. | `GET /api/v1/auth/me`<br>`GET /api/v1/admin/users` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |

---

### 📅 Semaine 3 (21 au 27 Septembre 2026) : Stockage Médias & Intégration Cloudflare R2
| ID | Tâche & Activités techniques | Composants / Endpoints | Statut / Fait |
| :---: | :--- | :--- | :---: |
| **T3.1** | Intégrer le SDK AWS Go v2 configuré avec les identifiants Cloudflare R2 (Endpoint, AccessKey, SecretKey). | `internal/services/storage.go` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T3.2** | Développer l'endpoint d'upload multipart d'images (JPG, PNG, WebP) avec validation de taille (< 10 Mo). | `POST /api/v1/media/upload-image` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T3.3** | Développer l'endpoint d'upload de documents PDF lourds (Magazines, rapports d'audit) avec validation (< 100 Mo). | `POST /api/v1/media/upload-pdf` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T3.4** | Table PostgreSQL `media_files` et endpoint de médiathèque pour lister et supprimer les fichiers depuis le Back-office. | `GET /api/v1/media`<br>`DELETE /api/v1/media/:id` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |

---

### 📅 Semaine 4 (28 Septembre au 04 Octobre 2026) : API Articles & Grandes Enquêtes
| ID | Tâche & Activités techniques | Composants / Endpoints | Statut / Fait |
| :---: | :--- | :--- | :---: |
| **T4.1** | Modèle et CRUD complet des articles et enquêtes (titre FR/EN, chapô, corps texte libre enrichi, photo). | `POST /api/v1/admin/articles`<br>`PUT /api/v1/admin/articles/:id` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T4.2** | Gérer le workflow des statuts éditoriaux : brouillon, en_relecture, valide, publie, archive. | `PATCH /api/v1/admin/articles/:id/status` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T4.3** | Endpoints publics de consultation des articles (pagination, filtre par rubrique, slug unique, calcul temps de lecture). | `GET /api/v1/articles`<br>`GET /api/v1/articles/:slug` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T4.4** | Enregistrement des niveaux de preuve déontologiques (A documentaire, B terrain optionnel, C déclaration) et sources. | Structure JSONB sources | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |

---

### 📅 Semaine 5 (05 au 11 Octobre 2026) : API Le Fil (Dépêches & Flux Temps Réel)
| ID | Tâche & Activités techniques | Composants / Endpoints | Statut / Fait |
| :---: | :--- | :--- | :---: |
| **T5.1** | Modèle et CRUD des dépêches brèves du Fil (heure précise, date, fait certifié, source primaire, niveau de preuve). | `POST /api/v1/admin/fil`<br>`DELETE /api/v1/admin/fil/:id` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T5.2** | Endpoint public paginé avec filtres par jour, mot-clé ou niveau de certification. | `GET /api/v1/fil?date=2026-09-09` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T5.3** | Flux d'événements temps réel (Server-Sent Events SSE) pour actualiser le fil instantanément chez les lecteurs. | `GET /api/v1/fil/stream` (SSE) | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T5.4** | Tests de débit et résilience du flux temps réel sur connexion mobile instable. | Suite de tests Go | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |

---

### 📅 Semaine 6 (12 au 18 Octobre 2026) : API Tracker des Chantiers & Baromètre RELANCE
| ID | Tâche & Activités techniques | Composants / Endpoints | Statut / Fait |
| :---: | :--- | :--- | :---: |
| **T6.1** | Modèle et CRUD du Tracker des Chantiers (projet, ministère, région du Burkina, budget FCFA, avancement %, jalons). | `POST /api/v1/admin/tracker`<br>`PUT /api/v1/admin/tracker/:id` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T6.2** | Endpoint public du Tracker avec agrégation financière régionale et tri par taux d'avancement. | `GET /api/v1/tracker/projects`<br>`GET /api/v1/tracker/stats` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T6.3** | Modèle et CRUD du Baromètre RELANCE (indicateurs macro, valeur actuelle, cible 2026, tendance hausse/baisse, source). | `POST /api/v1/admin/barometre`<br>`PUT /api/v1/admin/barometre/:id` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T6.4** | Endpoint public du Baromètre pour alimenter les compteurs et graphiques du site. | `GET /api/v1/barometre/indicators` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |

---

### 📅 Semaine 7 (19 au 25 Octobre 2026) : API Numéros (Magazines PDF) & Recherche Full-Text
| ID | Tâche & Activités techniques | Composants / Endpoints | Statut / Fait |
| :---: | :--- | :--- | :---: |
| **T7.1** | Modèle et endpoints des Numéros / Éditions Spéciales (titre, numéro trimestre, couverture, URL du PDF R2, nb pages). | `GET /api/v1/numeros`<br>`POST /api/v1/admin/numeros` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T7.2** | Configuration du moteur de recherche PostgreSQL (tsvector + tsquery en français et trigrammes pg_trgm). | Requêtes SQL optimisées | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T7.3** | Endpoint de recherche globale unifiée (cherche simultanément dans les articles, dépêches du fil et chantiers). | `GET /api/v1/search?q=tambao` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T7.4** | Génération de la documentation d'API interactive Swagger / OpenAPI. | Swagger UI (`/swagger/index.html`) | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |

---

### 📅 Semaine 8 (26 Octobre au 01 Novembre 2026) : Intégration Front-End (Next.js) & Sécurité
| ID | Tâche & Activités techniques | Composants / Endpoints | Statut / Fait |
| :---: | :--- | :--- | :---: |
| **T8.1** | Remplacement des données locales mockées dans Next.js par les appels réels vers l'API Golang. | `lib/api-client.ts` (Fetch/SWR) | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T8.2** | Connexion du Back-office aux endpoints d'upload R2 et formulaires d'édition (articles, fil, tracker, baromètre, numéros). | Écrans Back-Office | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T8.3** | Sécurisation avancée : CORS strict, Rate Limiting (anti-brute force), headers de sécurité (CSP, HSTS). | Middlewares Go | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T8.4** | Tests end-to-end (E2E) : cycle complet création d'article -> validation -> affichage public. | Test d'intégration global | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |

---

### 📅 Semaine 9 (02 au 08 Novembre 2026) : Déploiement Railway, Cloudflare R2 & CI/CD
| ID | Tâche & Activités techniques | Composants / Endpoints | Statut / Fait |
| :---: | :--- | :--- | :---: |
| **T9.1** | Création et configuration du projet Railway (Service Docker Go + Base PostgreSQL managée). | Projet Railway en ligne | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T9.2** | Liaison du réseau privé interne Railway (`DATABASE_URL`) et injection sécurisée des variables d'environnement. | Dashboard Railway Settings | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T9.3** | Création du Bucket Cloudflare R2 (`burkina-news-media`), configuration des clés S3 et liaison du sous-domaine (`media.burkinanews.bf`). | Console Cloudflare R2 | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T9.4** | Pipeline de déploiement automatique GitHub Actions (à chaque push sur `main`, Railway compile et déploie le binaire sans coupure). | `.github/workflows/deploy.yml` | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |

---

### 📅 Semaine 10 (09 au 15 Novembre 2026) : Recette Finale, Tests de Charge & Go-Live
| ID | Tâche & Activités techniques | Composants / Endpoints | Statut / Fait |
| :---: | :--- | :--- | :---: |
| **T10.1** | Tests de performance et de charge (simulation de 2 000 visiteurs simultanés avec k6 ou wrk). | Rapport de charge | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T10.2** | Vérification des sauvegardes automatiques de la base PostgreSQL et test de restauration à blanc. | Plan de reprise d'activité | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T10.3** | Séance de recette finale avec la Rédaction : saisie des premiers vrais articles, photos, dépêches et numéros PDF. | Validation équipe éditoriale | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |
| **T10.4** | 🚀 **BASCULE OFFICIELLE EN PRODUCTION (15 NOVEMBRE 2026)** : Ouverture complète du système. | Go-Live Officiel | [ ] Non démarré<br>[ ] En cours<br>[ ] Validé |

---

## 5. Checklist de Validation Finale (Go-Live du 15 Novembre 2026)

- [ ] **C1.** L'API Golang est déployée sur Railway et répond en moins de 30 ms en moyenne.
- [ ] **C2.** La base PostgreSQL 16 est chiffrée, protégée sur le réseau privé et sauvegardée automatiquement.
- [ ] **C3.** L'upload d'images et de PDF vers Cloudflare R2 fonctionne avec succès sans coût de bande passante.
- [ ] **C4.** Le Back-Office permet de rédiger en texte libre enrichi et d'assigner les preuves déontologiques.
- [ ] **C5.** Le Fil d'actualité diffuse les dépêches certifiées en temps réel (SSE) sans rechargement de page.
- [ ] **C6.** Le Tracker des Chantiers et le Baromètre RELANCE calculent et affichent les données exactes.
- [ ] **C7.** Le magazine PDF est téléchargeable rapidement depuis un mobile au Burkina Faso.
