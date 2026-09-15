# 🇧🇫 BURKINA NEWS · JOURNAL DES TRAVAUX DU FRONTEND
**Fichier de mémoire et de passage de relais technique pour les développeurs et agents IA**  
*Chaque jalon et intégration achevée doit être documentée ici avec précision.*

---

## 📌 Règle de tenue de ce journal
À chaque étape complétée :
1. Noter l'ID de la tâche (ex: `F1.1`, `F2.1`).
2. Indiquer la date et le périmètre traité.
3. Détailler les fichiers créés/modifiés et les choix techniques structurants.
4. Expliquer les vérifications effectuées (compilation, lint, tests manuels).
5. Indiquer la tâche suivante prête à être traitée.

---

## 🏗️ État Actuel du Projet Frontend
- **Phases en cours :** Phase F1 (Socle API, Client HTTP & Types) et Phase F2 (Auth JWT & Desk Utilisateurs).
- **Semaines Backend prêtes et connectées :** Semaine 1 (Socle Go & Health) et Semaine 2 (Auth JWT, RBAC & Utilisateurs).
- **Stratégie d'isolation :** Les routes administratives de gestion des sessions et des utilisateurs sont connectées à l'API Go réelle (`http://localhost:8080`). Les modules éditoriaux (Articles, Chantiers, Dépêches) conservent temporairement leurs mocks locaux pour garantir zéro rupture de service pendant la montée en charge du backend.

---

## 📜 Historique des Travaux Réalisés

### 📝 Jalon 0 Frontend : Cadrage, Charte Technique & Synchronisation
- **Date :** 15 Septembre 2026
- **Objectif :** Poser les règles d'or de développement du frontend Next.js, établir la synchronisation étape par étape avec le backend Go et créer les documents de suivi technique.
- **Livrables créés :**
  - [`REGLES_DEVELOPPEMENT_FRONTEND.md`](file:///Users/mac/Music/burkina-news-project/burkina-news/REGLES_DEVELOPPEMENT_FRONTEND.md) : Charte stricte (client HTTP singleton, Skeletons obligatoires, typage strict DTO, gestion des erreurs bilingues, auto-refresh des tokens, protection déontologique).
  - [`CHRONOLOGIE_ET_SUIVI_FRONTEND.md`](file:///Users/mac/Music/burkina-news-project/burkina-news/CHRONOLOGIE_ET_SUIVI_FRONTEND.md) : Suivi chronologique de toutes les phases frontend (F1 à F10).
### ⚙️ Phase F1 : Socle Client HTTP, Typage DTO & Connectivité API Go
- **Date :** 15 Septembre 2026
- **Objectif :** Établir l'infrastructure de communication unifiée entre le frontend Next.js 16 et l'API Go (`http://localhost:8080/api/v1`) en respectant la Règle 2 (zéro duplication).
- **Fichiers créés :**
  - `lib/api/types.ts` : Modèles DTO stricts (`ApiResponse<T>`, `ApiErrorResponse`, `PaginationMeta`, `AdminUserDTO`, `OFFICIAL_ROLES`, etc.).
  - `lib/api/client.ts` : Client HTTP singleton (`apiClient`) avec gestion des tokens (`tokenStorage`), en-tête `Authorization: Bearer <token>`, interception du code HTTP 401 pour auto-refresh transparent et formatage des erreurs via `ApiClientError`.
  - `lib/api/health.ts` : Service de diagnostic système interrogeant `GET /health` et `GET /api/v1/ping`.
  - `lib/api/index.ts` : Barrel export propre.
  - `.env.example` & `.env.local` : Ajout de `NEXT_PUBLIC_API_URL` et `NEXT_PUBLIC_API_ROOT`.
- **État :** Validé et coché [x] dans CHRONOLOGIE_ET_SUIVI_FRONTEND.md.

---

### 🛡️ Phase F2 : Authentification JWT, Garde de Session & Desk Utilisateurs
- **Date :** 15 Septembre 2026
- **Objectif :** Raccorder les écrans d'authentification et d'administration des utilisateurs aux endpoints réels du backend Go (Semaine 2).
- **Fichiers créés / modifiés :**
  - `lib/api/auth.ts` : Service d'authentification (`login`, `refresh`, `logout`, `getMe`).
  - `lib/api/users.ts` : Service CRUD complet de l'équipe rédactionnelle (`listUsers`, `getUser`, `createUser`, `updateUser`, `updateStatus`, `deleteUser`).
  - `components/admin/AuthGuard.tsx` : Migration sur `authApi.getMe()` avec vérification de la session en temps réel auprès de l'API Go et conservation du `SkeletonForm` au chargement.
  - `app/admin/login/page.tsx` : Remplacement du faux login mock par l'appel à `authApi.login()`, pré-remplissage avec le compte Superadmin fondateur (`samba@leguideai.com` / `BurkinaAdmin2026!`), affichage des messages d'erreur bilingues et état `isSubmitting`.
  - `app/admin/utilisateurs/page.tsx` : Remplacement complet de `/api/admin/data` par `usersApi`, affichage de `SkeletonTable` au chargement, pagination dynamique, filtres combinés et intégration des blocages déontologiques (protection du dernier Superadmin).
- **État :** Validé et coché [x] dans CHRONOLOGIE_ET_SUIVI_FRONTEND.md.

---

*(Les entrées suivantes seront ajoutées lors de l'intégration des phases F3 à F10 synchronisées avec les semaines backend)*
