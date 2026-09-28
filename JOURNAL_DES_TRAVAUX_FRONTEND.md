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
- **Phases validées et terminées :**
  - **Phase F1 :** Socle API, Client HTTP centralisé & Typage DTO strict.
  - **Phase F2 & F2.1 :** Authentification JWT, Garde de Session `AuthGuard`, CRUD Utilisateurs Desk & Auto-édition du Profil.
  - **Phase F2.2 :** Gouvernance Déontologique Superadmin & Sécurité RBAC (protection stricte des privilèges).
  - **Phase F2.3 :** Notification par email automatique via Resend & Génération de mots de passe mémorables de 8 caractères.
  - **Phase F2.4 :** Auto-assignation déontologique du titre rédactionnel / fonction selon le rôle choisi.
  - **Phase F2.5 :** Refonte structurelle du CRUD Rubriques & Sous-rubriques, préservation et mise en valeur de la Section Histoire.
  - **Phase F2.6 :** Éradication totale des données mockées de l'IA Micum & Raccordement 100% réel à Google Gemini 3.5 Flash sur l'ensemble du back-office.
  - **Phase F3 :** Médiathèque & Téléversement Cloudflare R2 / Local, Upload d'avatars.
  - **🚀 DevOps :** Déploiement Vercel (Frontend) synchronisé avec Railway (Backend Go + PostgreSQL) et Cloudflare R2 (Stockage CDN).
  - **Jalon F4.0 :** Raccordement réel de la gestion des Rubriques & Sous-rubriques (`/admin/rubriques`) à l'API Go (`categoriesApi`) avec persistance PostgreSQL et création dynamique pour alimenter la rédaction d'articles.
  - **Jalon F4.0.1 :** Enrichissement contextuel de MICUM pour la page Rubriques (`registerEditor` + `updateEditorData`) et ajout de la capacité d'annulation (abort) des requêtes IA en cours sur tout le back-office.
  - **Phase F4 (F4.1, F4.2, F4.3) :** Module Articles & Grandes Enquêtes d'Investigation 100% raccordé à l'API Go (Service typé `articlesApi`, Catalogue `/admin/articles` avec Skeletons et KPIs réels, Formulaires de rédaction `/admin/articles/nouveau` et `/admin/articles/[id]` sans mock, et lecture publique dynamique bilingue).
  - **Phase F5 (F5.0 à F5.4) :** Module Le Fil & Flux SSE temps réel 100% raccordé à l'API Go (Service typé `filApi`, Hook React `useFilStream`, Composant `FilLiveStream`, Desk rédactionnel `/admin/fil` avec CRUD réel des éditions et dépêches 60s, et pages publiques bilingues synchronisées).
- **Prochaine phase au programme :** **Phase F6 — Intégration Tracker Chantiers (6 Statuts) & Baromètre RELANCE** (synchronisée avec la Semaine 6 du Backend).

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

### 👑 Extension F2.1 : Interface d'Édition du Compte Personnel (Superadmin & Desk)
- **Date :** 15 Septembre 2026
- **Objectif :** Offrir au Superadmin et à l'ensemble des journalistes la possibilité d'éditer directement leurs informations personnelles (nom, adresse email, titre, avatar, mot de passe) depuis l'en-tête de l'administration et depuis la table des utilisateurs, avec rafraîchissement temps réel de la session active sans déconnexion.
- **Fichiers modifiés :**
  - `lib/api/auth.ts` : Ajout de la méthode `updateMe(input)` communicant avec l'endpoint `PUT /api/v1/auth/me`.
  - `components/admin/AuthGuard.tsx` : Ajout de la fonction `updateUserSession(data)` dans `AuthContext` permettant de propager instantanément les modifications de profil dans l'état React sans recharger la page.
  - `components/admin/AdminHeader.tsx` : Rendu de la capsule utilisateur interactif (bouton d'édition) et ouverture d'une modale dédiée "Mon Profil Rédactionnel" avec formulaire de saisie, gestion du chargement et alertes d'erreur/succès.
  - `app/admin/utilisateurs/page.tsx` : Câblage de la mise à jour directe dans la table : lorsqu'un utilisateur modifie sa propre fiche, la session courante est automatiquement synchronisée avec les nouvelles informations.
- **Vérifications :** Validation du typage TypeScript (`tsc --noEmit`), contrôle des flux de requêtes et mise à jour dynamique du nom/avatar dans le header.
- **État :** Validé et terminé.

---

### 🔒 Extension F2.2 : Gouvernance Déontologique Superadmin & Filtrage RBAC
- **Date :** 16 Septembre 2026
- **Objectif :** Aligner l'interface utilisateur sur les règles de sécurité strictes du backend Go : interdire la sélection du rôle `Superadmin` pour les créateurs non-superadmins, et verrouiller les actions de modification sur le compte du Superadmin pour tout autre utilisateur.
- **Fichiers modifiés :**
  - `app/admin/utilisateurs/page.tsx` : Filtrage dynamique des options de rôle dans le sélecteur de création selon le statut de l'utilisateur connecté (`currentUser?.role === 'superadmin'`), verrouillage du bouton d'édition et avertissement déontologique explicite si un non-superadmin tente d'interagir avec le compte Superadmin.
- **Vérifications :** Test des droits utilisateurs avec différents rôles, vérification du rejet élégant avec message bilingue en cas de tentative non autorisée.
- **État :** Validé et terminé.

---

### ✉️ Extension F2.3 : Notifications Email Resend & Mots de Passe Mémorables (8 Caractères)
- **Date :** 17 Septembre 2026
- **Objectif :** Intégrer l'information de distribution des accès par email via Resend (`Info@burkina-news.com`) et doter le formulaire de création/réinitialisation d'un générateur de mots de passe de 8 caractères à la fois mémorisables (phonétiques) et résistants aux attaques.
- **Fichiers modifiés :**
  - `app/admin/utilisateurs/page.tsx` :
    - Mention claire dans l'en-tête de la modale que les identifiants et alertes de modification sont expédiés automatiquement à l'adresse de l'utilisateur via Resend.
    - Ajout d'une fonction de génération de mots de passe mémorisables respectant la structure : Syllabe prononçable (ex: `Koba`, `Zida`, `Faso`, `Bolo`) + 2 chiffres + 1 caractère spécial (`!@#$%*`) + 1 lettre = 8 caractères.
    - Toggle pour afficher/masquer le mot de passe en clair et bouton "Copier".
- **Vérifications :** Validation de la conformité des mots de passe générés (exactement 8 caractères, lisibles et mémorisables), compilation TypeScript validée (`npx tsc --noEmit` = code 0).
- **État :** Validé et terminé.

---

### 🏷️ Extension F2.4 : Auto-assignation du Titre Rédactionnel selon le Rôle
- **Date :** 17 Septembre 2026
- **Objectif :** Automatiser le renseignement du champ "Fonction / Titre rédactionnel" dès la sélection du rôle dans le formulaire d'utilisateur, tout en conservant la possibilité de modification manuelle par l'administrateur.
- **Fichiers modifiés :**
  - `lib/api/types.ts` & `app/admin/utilisateurs/page.tsx` :
    - Définition des correspondances officielles de la Charte déontologique :
      - `superadmin` ➔ *Administrateur Général & Directeur de Publication*
      - `directeur_editorial` ➔ *Directeur Éditorial & Rédacteur en Chef*
      - `redacteur` ➔ *Grand Reporter & Journaliste d'Investigation*
      - `data_desk` ➔ *Analyste Données & Responsable Tracker des Chantiers*
      - `ia_desk` ➔ *Responsable Veille & Curation IA Micum*
      - `auditeur` ➔ *Médiateur Déontologique & Contrôle de l'Information*
    - Pré-remplissage dynamique sur l'événement `onChange` du champ rôle lorsque le titre est vierge ou correspond à l'ancienne valeur par défaut.
- **Vérifications :** Test d'auto-remplissage et vérification de la persistance lors d'une personnalisation manuelle.
- **État :** Validé et terminé.

---

### 🗂️ Extension F2.5 : Refonte Dynamique du CRUD Rubriques & Section Histoire
- **Date :** 17 Septembre 2026
- **Objectif :** Remplacer les configurations statiques de rubriques par un CRUD complet et dynamique dans `/admin/rubriques`, clarifier le rôle éditorial de la Section Histoire, et assouplir la structure en supprimant la section rigide des "4 Produits d'Information" au profit d'un système de gestion flexible.
- **Fichiers modifiés :**
  - `app/admin/rubriques/page.tsx` :
    - Implémentation du CRUD complet des Rubriques (création, édition bilingue FR/EN, suppression avec vérification des dépendances, choix de couleur Faso).
    - Implémentation du CRUD complet des Sous-rubriques (rattachement à la catégorie parente, activation/désactivation, métadonnées bilingues).
    - Valorisation de la **Section Histoire & Mémoire** (`histoire`) comme rubrique fondamentale du patrimoine burkinabè avec thématiques associées (Révolution d'août 1983, Résistances anticoloniales, Pères de la Nation).
    - Suppression de la section superflue des "4 Produits d'Information et Leurs Sous-menus Officiels".
  - `components/admin/AdminSidebar.tsx` : Clarification de l'accès direct vers les Rubriques & Histoire.
- **Vérifications :** Tests complets de création/édition/suppression, confirmation de la réactivité de l'UI.
- **État :** Validé et terminé.

---

### 🤖 Extension F2.6 : Éradication des Mocks IA Micum & Connexion Réelle à Gemini 3.5 Flash
- **Date :** 17 Septembre 2026
- **Objectif :** Supprimer 100% des réponses mockées et simulées de l'assistant IA Micum dans tout le back-office, diagnostiquer et corriger les erreurs de modèles obsolètes (404), et brancher toutes les actions en direct sur Google Gemini 3.5 Flash via l'API officielle.
- **Fichiers modifiés :**
  - `lib/ai/providers.ts` : Remplacement des modèles dépréciés par la chaîne de modèles actifs (`gemini-3.5-flash`, `gemini-3.1-flash-lite`, `gemini-flash-lite-latest`, etc.) avec sélection par défaut de `gemini-3.5-flash`.
  - `app/api/admin/ai/route.ts` :
    - Raccordement réel des 8 actions de l'IA :
      1. `translate` : Traduction journalistique certifiée FR ↔ EN (respect strict des devises FCFA, acronymes ministériels burkinabè et rigueur factuelle).
      2. `compile_fil` : Synthèse d'événements et de bulletins officiels en dépêches factuelles 60s avec argumentaire "Pourquoi c'est important".
      3. `convert_signalement` : Traitement des signalements du public en rectificatifs déontologiques certifiés avec niveaux de confiance.
      4. `extract_indicators` : Analyse de discours et textes officiels pour en extraire des indicateurs macroéconomiques et les aligner sur le référentiel PND 2026-2030.
      5. `morning_brief` : Synthèse intelligente de l'état du desk (articles en relecture, chantiers d'infrastructure au ralenti, signalements en cours).
      6. `generate_newsletter` : Élaboration de la newsletter hebdomadaire avec titres d'accroche et angles prioritaires.
      7. `suggest_quote` : Suggestion de citations percutantes bilingues pour la manchette de la Une.
      8. `extract_article` & `extract_project` : Extraction d'entités structurées depuis des coupures de presse ou rapports techniques.
    - Suppression définitive de 150+ lignes de templates de simulation mock et de fonctions mortes (`translateHeadingEn`, `translateFrToEn`, etc.).
  - `components/admin/MicumCopilot.tsx` : Suppression du bouton "Charger un exemple..." et nettoyage des simulations.
  - `components/admin/MicumBriefing.tsx` : Ajout d'un appel automatique au montage (`useEffect`) avec affichage d'un `Skeleton` élégant pendant la génération par l'IA.
  - `app/admin/une/page.tsx` : Câblage du bouton "Suggérer avec Micum" pour les citations de la Une avec spinner `Loader2` et notification toast.
- **Vérifications :**
  - Test en direct avec la clé API Google Gemini : requête réussie avec génération réelle et retour JSON validé.
  - Compilation TypeScript sans faute (`npx tsc --noEmit` = code 0).
- **État :** Validé et terminé.

---

### 📦 Phase F3 : Médias, Téléversement Cloudflare R2 / Local & Photos de Profil
- **Date :** 15 Septembre 2026
- **Objectif :** Raccorder le frontend Next.js 16 au système de stockage médias du backend Go (Semaine 3), avec téléversement réel des fichiers vers Cloudflare R2 ou en local, et modification dynamique de la photo de profil (Avatar).
- **Fichiers créés / modifiés :**
  - `lib/api/types.ts` : Types `MediaFileDTO`, `MediaFolder` (`avatars`, `content`, `sources`, `projects`, `issues`) et `StorageType`.
  - `lib/api/media.ts` : Service `mediaApi` avec méthodes `upload(file, folder)`, `uploadAvatar(file)`, `list(folder, page, limit)`, `delete(id)`.
  - `lib/api/index.ts` : Export de `mediaApi`.
  - `components/admin/ImageUploader.tsx` : Remplacement du faux mock base64 par l'appel à `mediaApi.upload(file, folder)`. Support du dossier cible et notification du moteur utilisé (Cloudflare R2 ou local).
  - `components/admin/AdminHeader.tsx` : Intégration de `ImageUploader` avec `folder="avatars"` dans la modale "Mon Profil Rédactionnel" pour le Superadmin et tous les membres connectés.
  - `app/admin/utilisateurs/page.tsx` : Intégration de `ImageUploader` avec `folder="avatars"` dans le formulaire de création et modification d'utilisateur.
- **Vérifications :** Typage TypeScript sans erreur (`npx tsc --noEmit` = code 0).
- **État :** Validé et terminé.

---

### 🗂️ Jalon F4.0 : Client API Rubriques & Raccordement Dynamique à PostgreSQL
- **Date :** 17 Septembre 2026
- **Objectif :** Raccorder la gestion des Rubriques & Sous-rubriques de l'écran `/admin/rubriques` à l'API Go réelle (`categoriesApi`), permettant l'enregistrement, l'édition et la suppression en direct dans la base de données PostgreSQL, indispensable pour alimenter les listes déroulantes lors de la création d'articles.
- **Fichiers créés / modifiés :**
  - `lib/api/types.ts` : Ajout des DTOs stricts `CategoryDTO`, `SubCategoryDTO`, `CreateCategoryInput`, `UpdateCategoryInput`, `CreateSubCategoryInput`, `UpdateSubCategoryInput`.
  - `lib/api/categories.ts` : Nouveau service singleton `categoriesApi` implémentant les méthodes complètes :
    - `listCategories(includeInactive)`
    - `getCategory(codeOrSlug)`
    - `createCategory(input)`
    - `updateCategory(code, input)`
    - `deleteCategory(code)`
    - `createSubCategory(categoryCode, input)`
    - `updateSubCategory(id, input)`
    - `deleteSubCategory(id)`
  - `lib/api/index.ts` : Export de `categoriesApi` et des DTOs associés.
  - `data/types.ts` : Extension de l'interface `SubCategory` avec le champ optionnel `id?: string`.
  - `app/admin/rubriques/page.tsx` :
    - Remplacement de `fetch('/api/admin/data')` par les appels aux méthodes typées de `categoriesApi`.
    - Mappeurs automatiques DTO ↔ Frontend (`mapCategoryDto`, `mapSubCategoryDto`).
    - Enregistrement des rubriques et sous-rubriques directement dans PostgreSQL avec notifications de succès explicites.
    - **Élimination intégrale des mocks (Zero Mock Purge)** : Suppression totale des imports de données mockées (`defaultCategories`, `defaultSubCategories`, `referentiel`), initialisation des états React à tableau vide `[]`, intégration de skeletons de chargement élégants pendant la requête et d'un écran d'état vide (`empty state`) avec bouton d'action si aucune donnée n'est présente. Zéro affichage de données mockées à l'écran.
    - **Sécurisation RBAC de l'interface & Masquage conditionnel des boutons CRUD :**
      - Intégration de `useAdminAuth()` et `normalizeRoleCode()`.
      - Masquage strict de tous les boutons de création, modification et suppression (`+ Nouvelle Rubrique`, `+ Nouvelle Sous-rubrique`, `Modifier / Cadrer`, `Supprimer`, `+ Ajouter sous-rubrique`, boutons d'action des cartes sous-rubriques) pour les rôles non autorisés (Rédacteurs, Desk Données, Desk IA, Auditeur Déontologique).
      - Affichage d'un badge distinctif `Mode Consultation Rédactionnelle` et verrouillage interne des fonctions handlers et modales.
      - Préservation du lien `Rédiger` permettant aux journalistes de lancer immédiatement la rédaction d'un article rattaché à la sous-rubrique.
  - `app/admin/page.tsx` :
    - Adaptation du lien du dashboard selon les droits de l'utilisateur connecté (`Gérer les rubriques →` pour le Superadmin et la Direction Éditoriale, `Consulter les rubriques →` pour les autres membres du desk).
- **Vérifications :**
  - Compilation TypeScript sans faute (`npx tsc --noEmit` = code 0).
- **État :** Validé et terminé.

---

### 🤖 Jalon F4.0.1 : Enrichissement Contextuel MICUM & Capacité d'Annulation des Requêtes IA
- **Date :** 17 Septembre 2026
- **Objectif :** Doter MICUM (copilote IA du back-office) d'une conscience contextuelle des données réelles de la page Rubriques et permettre à tout utilisateur d'annuler une requête IA en cours sur n'importe quelle page.
- **Fichiers modifiés :**
  - `components/admin/MicumContext.tsx` :
    - Extension du type union `sectionId` dans `ActiveEditorConfig` avec l'ajout de `'rubriques'`.
  - `app/admin/rubriques/page.tsx` :
    - Import de `useMicum` depuis `MicumContext`.
    - Appel de `registerEditor()` via `useEffect` pour pousser les données live (catégories, sous-catégories, compteurs) vers MICUM au chargement.
    - Appel de `updateEditorData()` à chaque changement des catégories/sous-catégories pour maintenir la synchronisation temps réel.
  - `components/admin/MicumSidePanel.tsx` :
    - Import de l'icône `Square` (lucide-react) pour le bouton d'arrêt.
    - Ajout d'un `AbortController` ref (`abortControllerRef`) pour piloter l'annulation des requêtes `fetch`.
    - Intégration du `signal` du contrôleur dans le `fetch()` de `handleSend`.
    - Nouvelle fonction `handleAbort()` pour annuler la requête en cours et nettoyer le contrôleur.
    - Gestion propre de l'`AbortError` dans le `catch` : message dédié `⏹ Requête annulée par l'utilisateur` au lieu d'un message d'erreur.
    - **UI — Bouton Stop double :**
      - Dans la barre de progression (loading indicator) : bouton rouge « Arrêter » avec icône `Square`.
      - Le bouton d'envoi (coin droit du textarea) se transforme en bouton stop rouge pendant le chargement, remplaçant la flèche par un carré plein.
  - `app/api/admin/ai/route.ts` :
    - **Résolution du bug `[undefined] undefined` :** Correction du constructeur de prompt système `buildScreenContext`. Les propriétés utilisées étaient erronées (`cat.id`, `cat.label`, `cat.description`), ce qui générait pour Gemini une liste de rubriques `[undefined] undefined` et sans sous-rubriques, poussant l'IA à rapporter un faux bug système. Remplacement par les vraies propriétés (`cat.code`, `cat.nameFr`, `cat.descriptionFr`, `cat.slug`).
    - **Priorisation temps réel de PostgreSQL :** Consommation directe de `activeEditorData` (contenant les 6 rubriques et 25 sous-rubriques avec leurs statistiques issues de PostgreSQL) et injection de l'arborescence complète (rubriques + sous-rubriques rattachées + compteurs d'articles) dans le prompt de MICUM.
- **Vérifications :**
  - Compilation TypeScript sans faute (`npx tsc --noEmit` = code 0).
- **État :** Validé et terminé.

---

### 📰 Phase F4 : Raccordement Complet du Module Articles & Grandes Enquêtes d'Investigation à l'API Go
- **Date :** 21 Septembre 2026
- **Objectif :** Raccorder l'intégralité du cycle de vie des articles d'investigation au backend Go (Semaine 4) : création du client API typé `articlesApi`, éradication des données locales mockées de `/api/admin/data` et de `@/data/mock/referentiel`, dynamisation du catalogue `/admin/articles` avec Skeletons de chargement et KPIs temps réel, et connexion des formulaires de rédaction et d'édition (`/admin/articles/nouveau`, `/admin/articles/[id]`) avec prise en charge dynamique des rubriques, téléversement média Cloudflare R2 / Local et synchronisation du copilote IA Micum.
- **Fichiers créés / modifiés :**
  - `lib/api/types.ts` :
    - Définition des types d'investigation : `ArticleFormat` (7 formats : `decryptage`, `terrain`, `vrai-ou-faux`, `edito`, `le-chiffre`, `trois-questions`, `analyse`), `ArticleStatus` (`draft`, `review`, `published`, `archived`), `ArticleConfidence` (`high`, `medium`, `low`).
    - DTOs complets : `DocumentSourceDTO`, `ArticleDTO`, `ArticleDetailDTO`, `CreateArticleInput`, `UpdateArticleInput`, `ArticleFilterParams`.
  - `lib/api/articles.ts` :
    - Client API singleton `articlesApi` :
      - `listArticles` : Consultation publique paginée avec filtres combinés.
      - `getArticle` : Consultation d'une enquête par slug avec articles connexes.
      - `adminListArticles` : Liste complète des articles de la rédaction avec filtres par statut et recherche.
      - `adminGetArticle` : Récupération des données pour l'éditeur.
      - `createArticle` : Création sécurisée avec injection du token JWT de l'auteur.
      - `updateArticle` : Mise à jour complète (textes, traductions, métadonnées).
      - `updateArticleStatus` : Workflow de transition de statut éditorial.
      - `deleteArticle` : Suppression sécurisée RBAC.
  - `lib/api/index.ts` :
    - Export centralisé de `articlesApi` et des DTOs associés.
  - `components/admin/ArticleEditorForm.tsx` :
    - Éradication de l'import statique `SUB_CATEGORIES` depuis `@/data/mock/referentiel`.
    - Chargement dynamique et asynchrone des rubriques et sous-rubriques depuis PostgreSQL via `categoriesApi.listCategories()`.
    - Normalisation bidirectionnelle des champs (`title` / `title_fr`, `excerpt` / `excerpt_fr`, `body` / `body_fr`, etc.).
    - Connexion du composant `ImageUploader` vers le dossier `content`.
    - Préservation totale du pont contextuel Micum (`registerEditor` et `updateEditorData`) pour l'assistance IA en direct.
  - `app/admin/articles/page.tsx` :
    - Remplacement des appels `/api/admin/data` par `articlesApi.adminListArticles()`.
    - Intégration de filtres serveur réactifs (rubrique, format, statut éditorial, recherche texte).
    - Calcul dynamique des KPIs sur les articles réels (total, rubrique Histoire, enquêtes décryptage, bilinguisme EN).
    - Badges de statuts clairs (`Publié`, `En relecture`, `Archivé`, `Brouillon`).
    - Modale de confirmation et suppression directe via `articlesApi.deleteArticle(id)`.
  - `app/admin/articles/nouveau/page.tsx` :
    - Soumission directe vers `articlesApi.createArticle()` avec notification toast et redirection vers le catalogue.
  - `app/admin/articles/[id]/page.tsx` :
    - Chargement réel de l'enquête par `articlesApi.adminGetArticle(id)` avec Skeleton de chargement.
    - Mise à jour en base via `articlesApi.updateArticle(id, payload)`.
  - `app/fr/[category]/[slug]/page.tsx` & `app/en/[category]/[slug]/page.tsx` :
    - Résolution dynamique de l'enquête depuis l'API Go (`articlesApi.getArticle(slug)`) avec fallback résilient sur les articles statiques pour la compilation `next build`.
- **Vérifications :**
  - Compilation TypeScript sans faute : `npx tsc --noEmit` validé avec code de sortie 0.
- **État :** Validé et terminé.

---

### ⚡ Phase F5 : Intégration Le Fil (Dépêches 60s, Éditions Hebdo & Streaming SSE)
- **Date :** 21 Septembre 2026
- **Objectif :** Raccorder l'intégralité du module Le Fil au backend Go (Semaine 5) : streaming temps réel Server-Sent Events (SSE) pour les dépêches 60 secondes, consolidation des éditions hebdomadaires de 10 faits vérifiés, éradication définitive de `/api/admin/data` dans le desk `/admin/fil`, et dynamisation des pages publiques bilingues (`/fr/fil`, `/en/fil`, `/fr/fil/[slug]`, `/en/fil/[slug]`).
- **Fichiers créés / modifiés :**
  - `lib/api/types.ts` :
    - Définition des interfaces DTOs : `BriefDTO`, `BriefFactDTO`, `CreateBriefInput`, `UpdateBriefInput`, `CreateFactInput`, `UpdateFactInput`, `BriefFilterParams`, `FactFilterParams`.
  - `lib/api/fil.ts` :
    - Service client singleton `filApi` :
      - `listFacts` : Consultation paginée des faits vérifiés 60s.
      - `listBriefs` : Consultation paginée des éditions hebdomadaires consolidées.
      - `getBriefBySlug` : Récupération d'une édition avec tous ses faits rattachés.
      - `getStreamUrl` : URL absolue du flux SSE (`/fil/stream`).
      - `adminListBriefs` : Liste complète des éditions pour le back-office.
      - `adminCreateBrief` & `adminUpdateBrief` & `adminDeleteBrief` : CRUD d'éditions hebdomadaires.
      - `adminCreateFact` & `adminUpdateFact` & `adminDeleteFact` : CRUD de dépêches avec broadcast SSE instantané.
  - `lib/api/index.ts` :
    - Export centralisé de `filApi` et des DTOs associés.
  - `hooks/useFilStream.ts` :
    - Hook React robuste de connexion EventSource à `/api/v1/fil/stream` avec gestion sécurisée de l'exécution côté client (`typeof window !== 'undefined'`), reconnexion automatique exponentielle plafonnée à 15s, gestion du heartbeat 30s et écouteurs d'événements typés (`connected`, `heartbeat`, `new_fact`, `update_fact`, `delete_fact`, `new_brief`, `update_brief`, `delete_brief`).
  - `components/fil/FilLiveStream.tsx` :
    - Composant d'affichage du flux direct 60s avec balise d'état pulsante (`Diffusion SSE active` / `Connexion en attente`), liste des dernières dépêches reçues en temps réel et liens vers les sources officielles.
  - `app/admin/fil/page.tsx` :
    - Refonte complète du desk rédactionnel sans aucune dépendance mock ou `/api/admin/data`.
    - Raccordement direct à `filApi` et `categoriesApi`.
    - Indicateur visuel d'état du flux SSE en direct dans l'en-tête.
    - Gestion dynamique des éditions et sélection d'édition avec rechargement des 10 faits.
    - Modales bilingues FR/EN complètes avec prévisualisation et traduction Micum.
  - `app/fr/fil/page.tsx` & `app/en/fil/page.tsx` :
    - Intégration du composant `<FilLiveStream />` en tête de page pour le direct des dépêches.
    - Récupération dynamique des éditions depuis `filApi.listBriefs()` avec fallback résilient pour le rendu statique `next build`.
  - `app/fr/fil/[slug]/page.tsx` & `app/en/fil/[slug]/page.tsx` :
    - Chargement de l'édition spécifique via `filApi.getBriefBySlug(slug)`.
    - Affichage des 10 faits avec horodatage, rubrique, source primaire vérifiable et angle déontologique ("Pourquoi surveiller").
- **Vérifications :**
  - Validation du typage strict : `npx tsc --noEmit` exécuté avec 0 erreur (code de sortie 0).
  - Tests backend complets : `go test -v ./...` (100% PASS, 0 régression).
  - Compilation binaire backend : `go build -v -o /dev/null ./cmd/api` (code 0).
- **État :** Validé et terminé.

---

### 🛡️ Phase F4.4 : Éradication Totale des Mocks du Back-Office & Raccordement aux 48 Articles Réels
- **Date :** 21 Septembre 2026
- **Objectif :** Supprimer l'ensemble des données mockées résiduelles dans le back-office (`/admin`), connecter le Dashboard d'accueil `/admin` et la page `/admin/rubriques` aux endpoints réels (`articlesApi`, `categoriesApi`, `filApi`), et garantir la pleine exploitation des 48 articles d'investigation injectés via le seed PostgreSQL du backend Go.
- **Fichiers modifiés :**
  - `app/admin/rubriques/page.tsx` :
    - Remplacement de l'appel résiduel `fetch('/api/admin/data')` par `articlesApi.adminListArticles({ limit: 1000 })`.
    - Calcul en direct des compteurs d'articles par rubrique et sous-rubrique sur la base des 48 articles réels enregistrés dans PostgreSQL.
    - Synchronisation en temps réel avec le contexte du copilote IA Micum.
  - `app/admin/page.tsx` (Dashboard Général) :
    - Remplacement de la dépendance exclusive à `/api/admin/data` par les appels combinés à `articlesApi.adminListArticles({ limit: 1000 })`, `categoriesApi.listCategories()` et `filApi.adminListBriefs({ limit: 50 })`.
    - Calcul dynamique des KPIs majeurs : total des articles d'investigation (48 articles réels), répartition par rubrique (y compris Histoire), état des dépêches du Fil, et affichage des articles récents issus de la base de données.
    - Fallback résilient préservé pour les modules futurs (Tracker de chantiers et signalements de contact prévus en Semaines 6 et 8).
- **Vérifications :**
  - Compilation TypeScript sans faute : `npx tsc --noEmit` validé avec 0 erreur (code 0).
  - Validation des tests backend : `go test -v ./...` (100% PASS).
  - Binaire API Go : compilation réussie `go build -v -o /dev/null ./cmd/api` (code 0).
- **État :** Validé et terminé.

---

### 🖼️ Phase F4.5 : Pagination du Catalogue d'Articles, Rétablissement des Images Distinctes & Filtrage par Sous-Rubriques
- **Date :** 21 Septembre 2026
- **Objectif :** Résoudre l'affichage homogène de l'image de substitution (`/images/lead.jpeg`) sur l'ensemble des 48 articles du catalogue back-office, paginer la table des articles (`/admin/articles`) pour éviter le chargement monolithique d'un seul bloc, et afficher les sous-rubriques associées avec filtrage dynamique contextuel :
  - **Correction de l'affichage des vignettes :**
    - Résolution de la divergence de nommage du champ média entre l'entité Go (`Image`) et l'interface DTO frontend (`featured_image`).
    - Mise en place de la lecture bivalente `art.image || art.featured_image || '/images/lead.jpeg'` avec gestionnaire `onError` garantissant le repli gracieux sans rupture visuelle.
    - Rétablissement des visuels d'enquêtes authentiques (Unsplash, Sidwaya, usines industrielles) sur chaque ligne du catalogue.
  - **Mise en place de la pagination complète :**
    - Ajout des états de pagination (`currentPage`, `pageSize` par défaut à 10, `meta`).
    - Sélecteur de taille de page configurable (10, 15, 20 ou 50 articles par vue).
    - Barre de navigation inférieure avec compteurs textuels précis (*"Affichage de 1 à 10 sur 48 articles"*), boutons *Précédent* / *Suivant* désactivés aux bornes, et numéros de pages interactifs avec mise en valeur de la page active en vert Faso `#087443`.
    - Réinitialisation automatique à la page 1 lors de l'application de tout filtre ou terme de recherche.
  - **Gestion des Sous-Rubriques :**
    - Affichage de la sous-rubrique sous la rubrique principale dans la deuxième colonne avec chevron typographique (`› {sous_rubrique}`).
    - Sélecteur de sous-rubriques dynamique apparaissant automatiquement dès qu'une rubrique principale est sélectionnée, alimenté par `category.sub_categories`.
  - **Indépendance des KPIs globaux du catalogue :**
    - Dissociation du chargement des KPIs (`loadKpis` sur l'ensemble des articles en base) pour que le total (48 articles), le compte Histoire (8), les Grands Décryptages (12) et le bilinguisme (48/48) restent exhaustifs et ne soient pas tronqués par la pagination de la table.
- **Fichiers modifiés :**
  - `app/admin/articles/page.tsx` : Intégration de la pagination, du filtrage sous-rubrique, de l'affichage des images et des KPIs découplés.
  - `lib/api/types.ts` : Support normalisé de `image` et `featured_image` sur `ArticleDTO`.
  - `lib/api/articles.ts` : Normalisation bivalente des champs d'image dans les réponses d'API.
  - `CHRONOLOGIE_ET_SUIVI_FRONTEND.md` : Ajout de la tâche F4.5 validée.
- **Vérifications :**
  - Validation TypeScript : `npx tsc --noEmit` exécuté avec succès (code 0, 0 erreur).
- **État :** Validé et terminé.

---

### 🌐 Phase F4.6 : Raccordement Complet de l'Espace Visiteur (FR & EN) aux Données Dynamiques PostgreSQL
- **Date :** 21 Septembre 2026
- **Objectif :** Raccorder l'ensemble des pages publiques de consultation de l'espace visiteur (en français et en anglais) aux articles et rubriques réels de la base PostgreSQL, afin d'assurer une synchronisation immédiate avec le back-office et d'éradiquer les mocks côté lecteur :
  - **Module d'adaptation universel (`lib/api/mappers.ts`) :**
    - Implémentation des fonctions pures `mapArticleDTOToArticle`, `mapCategoryDTOToCategory` et `mapSubCategoryDTOToSubCategory`.
    - Garantit la compatibilité ascendante stricte entre les DTOs RESTful de l'API Go et les types d'interface UI (`Article`, `Category`, `SubCategory`).
    - Gestion robuste du bilinguisme (champs anglais `title_en`, `excerpt_en`, `body_en`, `name_en` avec repli textuel sur le français si non renseigné).
  - **Pages de rubriques dynamiques (`components/CategoryLayout.tsx`) :**
    - Récupération dynamique des 48 articles d'investigation via `articlesApi.listArticles({ category: categoryCode, limit: 100 })`.
    - Récupération des rubriques et sous-rubriques officielles via `categoriesApi.getCategory(categoryCode)`.
    - Calcul en direct des compteurs d'articles publiés par sous-rubrique (`category.subCategories`) et filtrage instantané par le paramètre URL `?sub=...`.
    - Maintien du préchargement statique immédiat pour éliminer tout temps de chargement vide ou saut visuel (CLS).
  - **Pages d'accueil publiques (`app/fr/page.tsx` & `app/en/page.tsx`) :**
    - Transition des Server Components vers le chargement asynchrone des 48 articles réels via `articlesApi.listArticles({ limit: 50 })`.
    - Composition dynamique de la Une : article Lead (décryptage d'ouverture), sélection des 4 enquêtes secondaires, enquête de terrain et fact-check avec visuels authentiques issus de PostgreSQL.
    - Fallback résilient préservé pour le store local en cas d'indisponibilité réseau ou lors de la compilation statique `next build`.
  - **Sécurisation des composants visuels (`ArticleCard.tsx` & `Header.tsx`) :**
    - Normalisation de la lecture des images sur les 4 variantes de cartes (`lead`, `horizontal`, `compact`, `default`) avec gestionnaire d'erreur `onError` vers `/images/lead.jpeg`.
    - Alimentation du méga-menu desktop et du menu mobile de `Header.tsx` à partir des rubriques et sous-rubriques réelles chargées via `categoriesApi.listCategories(true)`.
- **Fichiers modifiés / créés :**
  - `lib/api/mappers.ts` : Fonctions d'adaptation universelles des DTOs en modèles métier.
  - `lib/api/index.ts` : Export centralisé des mappers.
  - `components/CategoryLayout.tsx` : Raccordement dynamique des pages de rubriques `/fr/[category]` et `/en/[category]`.
  - `app/fr/page.tsx` & `app/en/page.tsx` : Raccordement asynchrone des pages d'accueil bilingues.
  - `components/editorial/ArticleCard.tsx` : Gestion bivalente des images et gestionnaire `onError`.
  - `components/layout/Header.tsx` : Synchronisation des sous-rubriques dans la navigation.
  - `CHRONOLOGIE_ET_SUIVI_FRONTEND.md` : Ajout de la tâche F4.6 validée.
- **Vérifications :**
  - Compilation TypeScript : `npx tsc --noEmit` exécuté avec succès (code 0, 0 erreur).
  - Tests backend : `go test -v ./...` validé à 100% (PASS).
  - Binaire backend : compilation réussie `go build -v -o /dev/null ./cmd/api` (code 0).
- **État :** Validé et terminé.

---

### 🚀 Phase F4.7 : Éradication Définitive des Mocks d'Articles & Raccordement 100% PostgreSQL de la Lecture et Recherche (FR & EN)
- **Date :** 21 Septembre 2026
- **Objectif :** Atteindre 0 import mock d'articles dans l'intégralité du frontend, connecter les pages de lecture d'article (`/[category]/[slug]`), le moteur de recherche documentaire (`/recherche`), les pages de numéros (`/numeros/[slug]`) et les chantiers liés (`/tracker/projets/[slug]`) aux endpoints réels de l'API Go et à PostgreSQL.
- **Réalisations clés :**
  - **Pages de lecture d'article (`app/fr/[category]/[slug]/page.tsx` & `app/en/[category]/[slug]/page.tsx`) :**
    - Suppression totale de `getArticleBySlug`, `getCategoryByCode`, `getSubCategoryByCode` et `getArticles`.
    - Chargement direct de l'enquête par son slug via `articlesApi.getArticle(slug)`.
    - Chargement dynamique de la rubrique et de la sous-rubrique via `categoriesApi.getCategory(categoryCode)`.
    - Chargement des articles connexes (« Sur le Même Sujet ») via `articlesApi.listArticles({ category: article.category, limit: 10 })` avec exclusion de l'article courant.
    - Configuration `export const dynamic = 'force-dynamic'` pour un cycle de vie 100% dynamique.
  - **Moteur de recherche bilingue (`app/fr/recherche/page.tsx` & `app/en/recherche/page.tsx`) :**
    - Suppression totale de `getArticles('fr')` et `getArticles('en')`.
    - Chargement asynchrone des 48 articles réels via `articlesApi.listArticles({ limit: 100 })` et recherche réactive instantanée sur les données PostgreSQL réelles.
  - **Pages d'accueil FR/EN (`app/fr/page.tsx` & `app/en/page.tsx`) :**
    - Suppression des imports `articles` et `getArticles`. Remplacement par les articles réels issus de `articlesApi.listArticles({ limit: 50 })` avec garde sécurisée.
  - **Pages de projets tracker & numéros (`app/fr/tracker/projets/[slug]/page.tsx`, `app/en/tracker/projets/[slug]/page.tsx`, `app/fr/numeros/[slug]/page.tsx`, `app/en/numeros/[slug]/page.tsx`) :**
    - Suppression des imports `@/data/mock/articles` et raccordement à `articlesApi.listArticles({ limit: 100 })`.
  - **Composant Rubrique (`components/CategoryLayout.tsx`) :**
    - Élimination de `getArticlesByCategory`. Remplacement par un état initial vide avec Skeletons animés élégants jusqu'à l'arrivée des articles PostgreSQL.
- **Vérifications :**
  - Validation du typage strict : `npx tsc --noEmit` validé avec 0 erreur (code 0).
  - Tests backend : `go test -v ./...` validé à 100% (PASS).
  - Compilation binaire backend : `go build -v -o /dev/null ./cmd/api` (code 0).
  - Synchronisation Swagger : `swag init -g cmd/api/main.go -o docs` (code 0).
  - Recherche globale de `@/data/mock/articles` dans le code : **0 occurrence restante**.
- **État :** Validé et terminé.

---

### 🏗️ Phase F6 : Intégration Tracker des Chantiers (6 Statuts stricts) & Baromètre RELANCE
- **Date :** 21 Septembre 2026
- **Objectif :** Connecter la cartographie des 60 chantiers d'infrastructure (les 6 statuts stricts de la direction, l'historique non-écrasé des PV, les acteurs, les budgets en FCFA) et le Baromètre RELANCE des indicateurs macroéconomiques du PND 2026-2030 aux endpoints réels de l'API Go et à PostgreSQL.
- **Réalisations clés :**
  - **Types & Contrats DTOs (`lib/api/types.ts`) :**
    - Typage strict des 6 statuts officiels : `annonce`, `engage`, `en-construction`, `inaugure`, `operationnel`, `impact-mesure`.
    - DTOs pour les chantiers : `ProjectDTO`, `ProjectStatsDTO`, `ProjectStatusHistoryDTO`, `ProjectActorDTO`, `ProjectSourceDTO`, `ProjectFilterParams`.
    - DTOs pour le Baromètre : `IndicatorDTO`, `IndicatorDataPointDTO`, `IndicatorFilterParams`.
    - DTOs de mutations administratives : `CreateProjectInput`, `UpdateProjectInput`, `ChangeProjectStatusInput`, `CreateIndicatorInput`, `UpdateIndicatorInput`, `CreateDataPointInput`.
  - **Services Clients API & Adaptateurs (`lib/api/tracker.ts`, `lib/api/barometre.ts`, `lib/api/mappers.ts`, `lib/api/index.ts`) :**
    - `trackerApi` : implémentation complète des méthodes de consultation (`listProjects`, `getProject`, `getStats`) et de gestion administrative (`adminCreateProject`, `adminUpdateProject`, `adminChangeProjectStatus`, `adminDeleteProject`).
    - `barometreApi` : implémentation des méthodes publiques (`listIndicators`, `getIndicator`) et administratives (`adminCreateIndicator`, `adminUpdateIndicator`, `adminAddDataPoint`, `adminDeleteIndicator`).
    - Fonctions d'adaptation universelles `mapProjectDTOToProject` et `mapIndicatorDTOToIndicator` garantissant la compatibilité ascendante et le bilinguisme (FR/EN) sur l'ensemble de l'interface utilisateur.
  - **Espace d'Administration Back-Office (`/admin/projets` & `/admin/indicateurs`) :**
    - `app/admin/projets/page.tsx` : affichage des chantiers réels de PostgreSQL avec leurs budgets FCFA et taux d'avancement, modale de changement de statut strict avec archivage obligatoire d'un PV contradictoire, et suppression protégée.
    - `app/admin/projets/nouveau/page.tsx` : formulaire complet de création de chantier raccordé à `trackerApi.adminCreateProject`.
    - `app/admin/projets/[id]/page.tsx` : formulaire d'édition de fiche documentaire raccordé à `trackerApi.adminUpdateProject`.
    - `app/admin/indicateurs/page.tsx` : tableau de bord des indicateurs du Baromètre RELANCE avec création, mise à jour des cibles 2028/2030 et suppression via `barometreApi`.
  - **Espace Visiteur Public (FR & EN) :**
    - `app/fr/tracker/page.tsx` & `app/en/tracker/page.tsx` : raccordement dynamique des statistiques globales (`trackerApi.getStats`), des chantiers réels (`trackerApi.listProjects`) et du Baromètre RELANCE (`barometreApi.listIndicators`) avec filtrage interactif.
    - `app/fr/tracker/projets/[slug]/page.tsx` & `app/en/tracker/projets/[slug]/page.tsx` : fiche détaillée de chantier avec historique des PV et documents officiels (`trackerApi.getProject`).
    - `app/fr/tracker/indicateurs/page.tsx` & `app/en/tracker/indicateurs/page.tsx` : catalogue complet des indicateurs macroéconomiques (`barometreApi.listIndicators`).
    - `app/fr/tracker/indicateurs/[slug]/page.tsx` & `app/en/tracker/indicateurs/[slug]/page.tsx` : fiche détaillée d'un indicateur avec historique annuel et projets liés (`barometreApi.getIndicator`).
- **Vérifications :**
  - Validation du typage strict TypeScript et des contrats d'interfaces DTO.
  - Tests unitaires et d'intégration backend : `go test -v ./...` (100% PASS).
  - Compilation binaire Go : `go build -v -o /dev/null ./cmd/api` et `go build -v -o /dev/null ./cmd/seed` (code 0).
  - Documentation Swagger OpenAPI 3.0 régénérée avec succès.
### 🗺️ Phase F6.1 : Découpage Territorial Officiel (17 Régions, 47 Provinces, 351 Communes), Recherche Conditionnelle & Ordre Éditorial Alfred
- **Date :** 28 Septembre 2026
- **Objectif :** Aligner l'architecture sur la doctrine éditoriale d'Alfred (Directeur éditorial) et le décret officiel portant réorganisation territoriale du Burkina Faso.
- **Réalisations clés :**
  - **Mega-Menu Horizontal Pleine Largeur (`components/layout/Header.tsx`) :**
    - Menu déroulant pleine largeur (`w-full left-0 right-0`) avec grille responsive (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4`).
    - Épuration visuelle : affichage exclusif du nom des sous-rubriques (suppression des descriptions verbeuses) avec flèche directionnelle discrète et badge de comptage.
  - **Ordre Éditorial Officiel des 6 Rubriques :**
    - Ordre strict : `ÉCONOMIE` (1), `CHANTIERS` (2), `AGRICULTURE` (3), `SOCIÉTÉ` (4), `SÉCURITÉ` (5), `HISTOIRE` (6).
    - Alignement dans `data/mock/translations.ts`, `data/mock/categories.ts`, et seeding PostgreSQL (`SeedDefaultCategories`).
    - Justification éditoriale Alfred : affirmation de la ligne "Résultats mesurables et vérifiables en priorité", reléguant la sécurité polémique en 5e position.
  - **Référentiel Territorial Dynamique & Recherche Conditionnelle en Cascade :**
    - Intégration complète des données officielles : 17 régions, 47 provinces, 351 communes/départements dans `data/mock/referentiel-territoire.ts`.
    - Client API typé `lib/api/territories.ts` câblé sur `/api/v1/territories` avec fallback autonome et types `TerritoryDTO` / `TerritoryFilter` dans `lib/api/types.ts`.
    - Composant de filtrage `components/tracker/FilterBar.tsx` avec triple cascade : sélection Région -> filtre Provinces -> sélection Province -> filtre Communes/Villes, avec réinitialisation automatique cohérente.
    - Synchronisation des pages Tracker publiques `app/fr/tracker/page.tsx` et `app/en/tracker/page.tsx` avec les 17 régions et la recherche affinée par commune.
    - Mise à jour du formulaire back-office `components/admin/ProjectEditorForm.tsx` pour l'assignation territoriale officielle des nouveaux chantiers.
- **Vérifications :**
  - Typage TypeScript : `pnpm exec tsc --noEmit` -> 0 erreur.
  - Tests unitaires et intégration Go : `go test -v ./...` -> 100% PASS.
  - Compilation binaire Go : `go build -v -o /dev/null ./cmd/api` et `./cmd/seed` -> 0 erreur.
- **État :** Validé et terminé.

---

### 🗺️ Phase F6.2 : Harmonisation Intégrale du Corpus Éditorial (Articles, Chantiers, Dépêches) & Résolution des Clés React Homonymes
- **Date :** 28 Septembre 2026
- **Objectif :** Résoudre les avertissements de duplication de clés React causés par les communes homonymes (`Boussouma` et `Namissiguima`) et déployer le découpage officiel (17 régions, 47 provinces, 351 communes) à l'ensemble du corpus éditorial : 10 chantiers majeurs, 40 articles d'investigation et dépêches du fil d'actualités.
- **Réalisations clés :**
  - **Résolution Définitive des Clés Dupliquées React :**
    - Identification des homonymies territoriales réelles du Burkina Faso :
      - *Boussouma* : commune dans le Boulgou (Région Nakambé) ET dans le Sandbondtenga (Région Kuilsé).
      - *Namissiguima* : commune dans le Yatenga (Région Yaadga) ET dans le Sandbondtenga (Région Kuilsé).
    - Déduplication par ensemble `Set` dans `getCommunesByCondition` (`data/mock/referentiel-territoire.ts`).
    - Sécurisation des clés React avec suffixe d'index unique (`key={...-${c}-${idx}}`) dans `components/tracker/FilterBar.tsx`, `app/fr/tracker/page.tsx` et `app/en/tracker/page.tsx`.
  - **Harmonisation des 10 Chantiers Majeurs (`data/mock/projects.ts`) :**
    - Koudougou (`proj-01`) : Région Nando, Province Boulkiemdé.
    - Kaya (`proj-02`) : Région Kuilsé, Province Sandbondtenga.
    - Bobo-Dioulasso (`proj-03`) : Région Guiriko, Province Houet.
    - Bassiéri (`proj-04`) : Région Oubri, Province Kourwéogo.
    - Dédougou (`proj-05`) : Région Bankui, Province Mouhoun.
    - Banfora (`proj-07`) : Région Tannounyan, Province Comoé.
    - Kiéré (`proj-08`) : Région Guiriko, Province Tuy.
    - Zina (`proj-09`) : Région Sourou, Province Sourou.
    - Semences certifiées (`proj-10`) : Déploiement étendu aux 17 régions.
  - **Harmonisation des Articles d'Investigation (`data/mock/articles.ts`) :**
    - Article 19 (FMDL) : Remplacement de la province du Sanmatenga par Sandbondtenga (FR & EN).
    - Article 23 (PDI) : Transition de l'ancienne Boucle du Mouhoun vers la région de Bankui (FR & EN, titre, slug et tags).
    - Article 27 (RN11) : Désenclavement routier entre les régions du Djôrô et du Guiriko (au lieu de Sud-Ouest et Hauts-Bassins).
    - Article 15 (Samendéni) : Impact agricole sur les régions du Guiriko et de Bankui.
    - Article 35 (Pastoralisme) : Pistes transhumance dans les régions du Liptako et du Goulmou.
    - Article 39 / 11 (Santé Dori) : CSPS de Dori rattaché à la région du Liptako (FR & EN).
  - **Harmonisation des Dépêches (`data/mock/briefs.ts`) :**
    - Dépêches 60s rattachées aux régions du Kuilsé et de Bankui.
- **Vérifications :**
  - Validation TypeScript sans erreur : `pnpm exec tsc --noEmit` (code 0).
  - Zéro avertissement console React sur les homonymies de communes.
- **État :** Validé et terminé.
 
---

### Entrée F6.8 — Différenciation chromatique des 6 boutons filtres et barres d'avancement des cartes du Tracker
- **Objectif :** Doter les 6 statuts du Tracker d'une identité visuelle immédiatement identifiable et intuitive, reflétant rigoureusement le niveau d'avancement réel des chantiers.
- **Réalisations :**
  - **Système de Design Statut (`data/types.ts`) :**
    - 01 Annoncé : Ardoise `#64748B` (slate-500)
    - 02 Engagé : Bleu royal `#2563EB` (blue-600)
    - 03 En construction : Orange chantier `#EA580C` (orange-600)
    - 04 Inauguré : Sarcelle / Cyan d'eau `#0D9488` (teal-600)
    - 05 Opérationnel : Vert Faso `#087443` (emerald-700)
    - 06 Impact mesuré : Violet améthyste `#7C3AED` (purple-600)
    - Objet de thème unifié `PROJECT_STATUS_THEMES` avec styles actifs, pastilles, badges et jauges.
  - **Boutons Filtres du Tracker (`app/fr/tracker/page.tsx` & `app/en/tracker/page.tsx`) :**
    - Au repos : bordure supérieure d'accentuation spécifique de 3px, badge numéroté `01..06` avec point coloré dédié, et barre de progression calibrée.
    - À l'état actif (`selectedStatus === status`) : fond plein et bordure dans la couleur vive du jalon, typographie blanche et icône checkmark blanche.
  - **Fiches et Cartes Chantiers (`components/tracker/ProjectCard.tsx`) :**
    - Jauge d'avancement 6 segments : chaque segment franchi jusqu'au statut actuel s'affiche dans la couleur exacte de son étape (ardoise ➔ bleu ➔ orange ➔ sarcelle ➔ vert ➔ violet), les segments non atteints restant gris neutre.
    - Libellé d'avancement (`currentIndex + 1 / 6`) et nom du jalon mis en valeur dans la couleur exacte du statut.
  - **Badges et Feuilles de Projet (`StatusBadge.tsx`, `app/fr/tracker/projets/[slug]/page.tsx`, `app/en/tracker/projets/[slug]/page.tsx`) :**
    - Cohérence chromatique totale des badges d'état et des frises chronologiques d'audit contradictoire.
- **Vérifications :**
  - Validation TypeScript sans faute : `pnpm tsc --noEmit` (code 0).
  - Tests unitaires et intégration Go backend : `go test ./...` (code 0).
- **État :** Validé et terminé.

---

*(Les entrées suivantes seront ajoutées lors de l'intégration des phases F7 à F10 synchronisées avec les semaines backend)*





