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
  - **Phase F2.5 :** CRUD Complet et Dynamique des Rubriques & Sous-rubriques, préservation et mise en valeur de la Section Histoire.
  - **Phase F2.6 :** Éradication totale des données mockées de l'IA Micum & Raccordement 100% réel à Google Gemini 3.5 Flash sur l'ensemble du back-office.
  - **Phase F3 :** Médiathèque & Téléversement Cloudflare R2 / Local, Upload d'avatars.
  - **🚀 DevOps :** Déploiement Vercel (Frontend) synchronisé avec Railway (Backend Go + PostgreSQL) et Cloudflare R2 (Stockage CDN).
- **Phase prête à être traitée aujourd'hui :** **Phase F4 — Raccordement du Module Articles & Grandes Enquêtes d'Investigation** à l'API Go réelle (synchronisée avec la Semaine 4 du Backend).

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

*(Les entrées suivantes seront ajoutées lors de l'intégration des phases F4 à F10 synchronisées avec les semaines backend)*


