# 🇧🇫 BURKINA NEWS · CHRONOLOGIE & JOURNAL DE BORD DU FRONTEND
**Projet : `burkina-news` | Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4**  
*Guide opérationnel pas-à-pas — Synchronisation en temps réel avec le Backend Go*

---

## 📌 Mode d'emploi de ce document
- `[ ]` : Non démarré
- `[/]` : En cours d'intégration
- `[x]` : Validé & Terminé

---

## 📊 Résumé Global de la Synchronisation Frontend / Backend

| Phase | Périmètre Backend associé | Statut Intégration Frontend |
| :--- | :--- | :---: |
| **Phase F1** | **Semaine 1 :** Socle API, Client HTTP centralisé, Healthcheck & Diagnostic | `[x] Validé & Terminé` |
| **Phase F2** | **Semaine 2 :** Authentification JWT (`login`, `refresh`, `logout`, `me`), AuthGuard & CRUD Utilisateurs Desk | `[x] Validé & Terminé` |
| **Phase F3** | **Semaine 3 :** Médiathèque & Upload de fichiers (Cloudflare R2 / Local) | `[x] Validé & Terminé` |
| **🚀 DevOps** | Vercel (frontend) + Railway (backend + PostgreSQL) + Cloudflare R2 en production | `[x] Validé & Terminé` |
| **Phase F4** | **Semaine 4 :** API Articles & Enquêtes (Jalon F4.0 Rubriques validé, F4.1 en cours) | `[/] En cours (F4.0 achevé)` |
| **Phase F5** | **Semaine 5 :** API Le Fil (Dépêches 60s, Éditions hebdo, Streaming SSE en direct) | `[ ] En attente` |
| **Phase F6** | **Semaine 6 :** API Tracker des Chantiers (6 Statuts, cartographie, PV) & Baromètre RELANCE | `[ ] En attente` |
| **Phase F7** | **Semaine 7 :** Numéros PDF, Registre public des Corrections & Moteur de Recherche Globale | `[ ] En attente` |
| **Phase F8** | **Semaine 8 :** Curation Une, Rubriques, Formulaires Publics (Signalements/Contact) & IA Micum | `[ ] En attente` |
| **Phase F9** | **Semaine 9 :** Durcissement, Tests E2E, Gestion du mode dégradé hors-ligne | `[ ] En attente` |
| **Phase F10** | **Semaine 10 :** Recette Finale, Optimisations CWV (LCP/INP) & Déploiement Production | `[ ] En attente` |

---

## 📅 PHASE F1 : Socle Client HTTP, Typage DTO & Diagnostic Système (Semaine 1 Backend)

> **🎯 Objectif :** Établir la couche de communication unique avec l'API Go, définir les types TypeScript stricts et valider la connectivité réseau via les endpoints Healthcheck et Ping.

| ID | Statut | Tâche Technique | Fichiers / Composants | Endpoints Backend | Détails & Vérification |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **F1.1** | `[x]` | Définir les interfaces DTO et types TypeScript conformes aux payloads JSON du Backend Go. | `lib/api/types.ts` | Tous | Types `ApiResponse<T>`, `ApiErrorResponse`, `PaginationMeta`, `AdminUserDTO`, etc. |
| **F1.2** | `[x]` | Créer le client HTTP Singleton avec injection automatique du Bearer token et gestion des erreurs bilingues. | `lib/api/client.ts` | `http://localhost:8080/api/v1` | Interception 401, auto-refresh JWT, typage générique des requêtes GET, POST, PUT, PATCH, DELETE. |
| **F1.3** | `[x]` | Configurer les variables d'environnement frontend pour cibler l'API backend. | `.env.local`, `.env.example` | `NEXT_PUBLIC_API_URL` | Définit `http://localhost:8080/api/v1` pour dev local. |
| **F1.4** | `[x]` | Créer le service de santé (`health.ts`) pour tester la connectivité et la latence de PostgreSQL. | `lib/api/health.ts` | `GET /health`<br>`GET /api/v1/ping` | Utilisable pour afficher l'indicateur de statut système en direct. |

---

## 📅 PHASE F2 : Authentification JWT, Garde de Session & Desk Utilisateurs (Semaine 2 Backend)

> **🎯 Objectif :** Connecter la mire de connexion `/admin/login`, le contexte d'authentification `AuthGuard`, le profil connecté `/api/v1/auth/me` et la gestion complète de l'équipe rédactionnelle `/admin/utilisateurs` avec les vraies données PostgreSQL, les états Skeletons et les gardes-fous déontologiques.

| ID | Statut | Tâche Technique | Fichiers / Composants | Endpoints Backend | Détails & Vérification |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **F2.1** | `[x]` | Développer le service d'authentification API (`login`, `refresh`, `logout`, `getMe`). | `lib/api/auth.ts` | `POST /api/v1/auth/*`<br>`GET /api/v1/auth/me` | Gestion sécurisée des cookies `bn_access_token` et `bn_refresh_token`. |
| **F2.2** | `[x]` | Connecter la page de connexion administrative avec le Superadmin Go (`samba@leguideai.com`). | `app/admin/login/page.tsx` | `POST /api/v1/auth/login` | Remplacement du faux login mock, affichage des erreurs bilingues réelles et état `isSubmitting`. |
| **F2.3** | `[x]` | Refondre le composant `AuthGuard` et le hook `useAdminAuth` pour valider la session via `GET /auth/me`. | `components/admin/AuthGuard.tsx` | `GET /api/v1/auth/me` | Rendu de `SkeletonForm` pendant la vérification, redirection fluide sans clignotement. |
| **F2.4** | `[x]` | Développer le service de gestion des utilisateurs du Desk (`usersApi`). | `lib/api/users.ts` | `CRUD /api/v1/admin/users` | Méthodes `listUsers`, `getUser`, `createUser`, `updateUser`, `updateStatus`, `deleteUser`. |
| **F2.5** | `[x]` | Connecter l'écran `/admin/utilisateurs` à l'API réelle avec `SkeletonTable` au chargement. | `app/admin/utilisateurs/page.tsx` | `GET /api/v1/admin/users` | Fin du recours à `app/api/admin/data`, affichage des membres réels en base de données. |
| **F2.6** | `[x]` | Intégrer les opérations de création, modification, suspension et suppression avec gestion d'erreurs déontologiques. | `app/admin/utilisateurs/page.tsx` | `POST/PUT/PATCH/DELETE /admin/users` | Affichage du blocage explicite lors d'une tentative sur le dernier Superadmin. |
| **F2.7** | `[x]` | Auto-génération de mots de passe mémorables (8 car.) et expédition automatique des accès par email Resend. | `app/admin/utilisateurs/page.tsx` | `POST/PUT /admin/users` | Mention explicite Resend, générateur phonétique prononçable, toggle visuel et bouton copier. |
| **F2.8** | `[x]` | Auto-assignation déontologique du titre rédactionnel selon le rôle choisi avec surcharge manuelle possible. | `app/admin/utilisateurs/page.tsx`, `lib/api/types.ts` | Formulaire utilisateur | Correspondance stricte aux 6 rôles de la Charte déontologique. |
| **F2.9** | `[x]` | CRUD complet et dynamique des Rubriques & Sous-rubriques avec valorisation de la Section Histoire. | `app/admin/rubriques/page.tsx`, `components/admin/AdminSidebar.tsx` | `/admin/rubriques` | Création/édition bilingue FR/EN, suppression avec contrôle des dépendances, sauvegarde dynamique. |

---

## 📅 PHASE F2.10 / F8.1 : Assistant IA Micum & Connexion Réelle Google Gemini 3.5 Flash
> **🎯 Objectif :** Éradiquer tous les mocks et simulations de réponses dans l'ensemble du back-office, et brancher toutes les actions en direct sur l'API Google Gemini 3.5 Flash.

| ID | Statut | Tâche Technique | Fichiers / Composants | Endpoints associés | Détails & Vérification |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **F8.1** | `[x]` | Éradication des données mockées de l'IA Micum & Raccordement 100% réel à Gemini 3.5 Flash. | `app/api/admin/ai/route.ts`, `lib/ai/providers.ts`, `components/admin/Micum*`, `app/admin/une/page.tsx` | `POST /api/admin/ai` | 8 actions connectées en direct (traduction, dépêches, briefing, newsletter, citations, etc.), spinner `Loader2` et skeleton. |

---

## 📅 PHASE F3 : Intégration Médias, Upload Cloudflare R2 / Local & Photos de Profil

> **🎯 Objectif :** Connecter l'upload d'images et de fichiers vers le backend Go avec sélection automatique Cloudflare R2 / Local et gestion complète de la photo de profil (Avatar).

| ID | Statut | Tâche Technique | Fichiers / Composants | Endpoints associés | Détails & Vérification |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **F3.1** | `[x]` | Développer le client API médias (`mediaApi`) avec méthodes `upload`, `uploadAvatar`, `list` et `delete`. | `lib/api/media.ts`, `lib/api/types.ts` | `POST /api/v1/media/upload`<br>`GET /api/v1/media`<br>`DELETE /api/v1/media/:id` | Support complet multipart avec conservation du jeton Bearer JWT. |
| **F3.2** | `[x]` | Connecter le composant universel `ImageUploader` à l'API Go réelle avec support du dossier cible. | `components/admin/ImageUploader.tsx` | `POST /api/v1/media/upload` | Fin des simulations base64/mocks, upload vers Cloudflare R2 ou repli local avec notification toast. |
| **F3.3** | `[x]` | Raccorder l'upload de photo de profil dans la modale "Mon Profil Rédactionnel" et la page utilisateurs. | `components/admin/AdminHeader.tsx`, `app/admin/utilisateurs/page.tsx` | `POST /api/v1/media/upload?folder=avatars`<br>`PUT /api/v1/auth/me` | Téléversement direct, prévisualisation et mise à jour dynamique de l'avatar sans déconnexion. |

---

## 📅 PHASE F4 : Module Articles & Grandes Enquêtes d'Investigation (Semaine 4 Backend)

> **🎯 Objectif :** Connecter la rédaction d'enquêtes, le catalogage des articles et l'architecture éditoriale aux endpoints réels de l'API Go.

| ID | Statut | Tâche Technique | Fichiers / Composants | Endpoints associés | Détails & Vérification |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **F4.0** | `[x]` | Raccordement du service `categoriesApi` et de l'écran `/admin/rubriques` au CRUD Go/PostgreSQL réel. | `lib/api/categories.ts`, `app/admin/rubriques/page.tsx` | `GET /api/v1/categories`<br>`CRUD /api/v1/admin/categories` | Gestion dynamique complète des rubriques et sous-rubriques, alimentation directe pour la rédaction d'articles. |
| **F4.1** | `[ ]` | Développer le client API `articlesApi` pour la consultation et gestion des articles d'investigation. | `lib/api/articles.ts` | `GET /api/v1/articles`<br>`CRUD /api/v1/admin/articles` | Support des filtres, pagination, formats et bilinguisme. |

---

## 📅 PHASES F5 À F10 (SYNCHRONISATION FUTURE AVEC LES SEMAINES BACKEND 5 À 10)

- **Phase F5 (Semaine 5) :** Intégration Le Fil & Flux SSE temps réel (`/fr/fil`, `/admin/fil`).
- **Phase F6 (Semaine 6) :** Intégration Tracker Chantiers (6 Statuts) & Baromètre RELANCE (`/fr/tracker`, `/admin/projets`).

- **Phase F7 (Semaine 7) :** Intégration Numéros PDF & Registre des Corrections (`/fr/numeros`, `/admin/corrections`).
- **Phase F8 (Semaine 8) :** Intégration Curation Une, Formulaires Signalements & Assistant Micum.
- **Phase F9 (Semaine 9) :** Durcissement, gestion du mode hors-ligne, audit de résilience.
- **Phase F10 (Semaine 10) :** Recette finale de performance CWV & Mise en production.
