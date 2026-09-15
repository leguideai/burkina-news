# 🇧🇫 BURKINA NEWS · RÈGLES & CHARTE TECHNIQUE DU FRONTEND NEXT.JS
**Fichier de référence absolu — Obligation stricte pour toute IA et tout développeur intervenant sur le frontend**  
*Dernière mise à jour : 15 Septembre 2026 | Version 1.0*

---

## 1. RÈGLE MÉTHODOLOGIQUE : DÉVELOPPEMENT TÂCHE PAR TÂCHE & SYNCHRONISATION
1. **Synchronisation stricte avec le Backend :** Le développement et l'intégration du frontend suivent rigoureusement le rythme d'achèvement des semaines du backend Go (`burkina-news-backend`).
2. **Pas de travail précipité sans endpoint :** Un écran frontend n'est raccordé à l'API que lorsque les endpoints correspondants sont entièrement codés, testés unitairement et validés côté backend.
3. **Transition hybride sans régression :** Les modules du site dont les endpoints backend sont prêts (ex: Auth, Utilisateurs) utilisent l'API réelle. Les modules dont les semaines backend sont à venir (ex: Articles, Tracker) conservent temporairement leurs jeux de données locaux mockés afin que le site reste 100% fonctionnel et présentable sans jamais casser de parcours utilisateur.
4. **Validation et mise à jour documentaire :** À chaque jalon d'intégration complété, les fichiers [`CHRONOLOGIE_ET_SUIVI_FRONTEND.md`](file:///Users/mac/Music/burkina-news-project/burkina-news/CHRONOLOGIE_ET_SUIVI_FRONTEND.md) et [`JOURNAL_DES_TRAVAUX_FRONTEND.md`](file:///Users/mac/Music/burkina-news-project/burkina-news/JOURNAL_DES_TRAVAUX_FRONTEND.md) doivent être immédiatement actualisés.

---

## 2. RÈGLE D'ARCHITECTURE API : CLIENT CENTRALISÉ & ZÉRO DUPLICATION
1. **Client HTTP Singleton (`lib/api/client.ts`) :**  
   - Il est **strictement interdit** d'écrire des appels `fetch('http://localhost:8080/...')` directs éparpillés dans les composants React.
   - Tout appel vers l'API Go passe par le client HTTP unique `apiClient` ou par les services de domaine spécialisés (`lib/api/auth.ts`, `lib/api/users.ts`, `lib/api/articles.ts`, etc.).
2. **Gestion automatique du jeton Bearer JWT :**  
   - Le client injecte systématiquement l'en-tête `Authorization: Bearer <token>` lorsque l'utilisateur est authentifié.
3. **Interception du code 401 & Auto-Refresh transparent :**  
   - Si une requête échoue avec un code HTTP 401 (token d'accès expiré), le client intercepte l'erreur, sollicite automatiquement l'endpoint `POST /api/v1/auth/refresh` avec le refresh token, met à jour les tokens et rejoue la requête initiale en toute transparence pour l'utilisateur.
   - Si le refresh token est lui-même révoqué ou expiré, le client effectue une déconnexion propre et redirige l'utilisateur vers `/admin/login`.
4. **Configuration centralisée par variables d'environnement :**  
   - L'URL de base de l'API est définie par `process.env.NEXT_PUBLIC_API_URL` (par défaut `http://localhost:8080/api/v1`).

---

## 3. RÈGLE DES MODÈLES & TYPAGE TYPESCRIPT STRICT
1. **Conformité absolue avec le Backend Go :**  
   - Les interfaces TypeScript dans `lib/api/types.ts` doivent être le miroir exact des structures JSON retournées par le backend Go (`internal/models` et `pkg/response`).
2. **Structure enveloppe standard :**  
   Toutes les réponses de l'API sont typées avec :
   ```typescript
   export interface ApiResponse<T> {
     success: boolean;
     data: T;
     message_fr: string;
     message_en: string;
     meta?: PaginationMeta;
   }
   ```
3. **Typage des erreurs :**  
   Les erreurs retournées par l'API doivent être typées selon le schéma unifié :
   ```typescript
   export interface ApiErrorResponse {
     success: false;
     data: null;
     error_code: string;
     message_fr: string;
     message_en: string;
     details?: Array<{
       field: string;
       message_fr: string;
       message_en: string;
     }>;
   }
   ```

---

## 4. RÈGLE DE L'EXPÉRIENCE UTILISATEUR : SKELETONS SYSTÉMATIQUES
1. **Interdiction formelle des écrans blancs et des spinners génériques nus :**  
   - L'utilisateur ne doit jamais être confronté à une page vide ou un simple spinner centré pendant le chargement des données.
2. **Skeletons reproduisant la disposition réelle :**  
   - **Tables de données (ex: liste des utilisateurs, articles) :** Afficher systématiquement `SkeletonTable` avec l'en-tête de colonnes et des lignes grisées animées (`animate-pulse`).
   - **Formulaires :** Utiliser `SkeletonForm` reproduisant les champs de saisie.
   - **Cartes et grilles :** Utiliser des Skeletons de cartes respectant les ratios d'image et la hauteur des titres.
3. **Transitions fluides :** Éviter les sauts de mise en page (*Cumulative Layout Shift - CLS*) en conservant les dimensions des conteneurs lors du passage de l'état Skeleton à l'état réel.

---

## 5. RÈGLE DE GESTION DES ERREURS & BILINGUISME (FR / EN)
1. **Affichage bilingue respectant la langue de l'interface :**  
   - En interface française, afficher `message_fr`.
   - En interface anglaise, afficher `message_en`.
   - Si un message de l'API est manquant, utiliser un message de repli clair et élégant.
2. **Erreurs de validation par champ :**  
   - Lorsque l'API renvoie un tableau `details` avec des champs spécifiques en erreur (ex: `email`, `password`), le formulaire doit surligner le champ concerné en rouge et afficher le message précis sous l'input.
3. **Respect des blocages déontologiques :**  
   - Les messages spécifiques du backend (ex: *« Impossible de suspendre ou supprimer le dernier Superadministrateur »*) doivent être fidèlement présentés dans les notifications Toast sans être masqués par un message générique.

---

## 6. RÈGLE DE SÉCURITÉ DES SESSIONS CÔTÉ CLIENT
1. **Stockage des tokens :**  
   - L'Access Token et le Refresh Token sont gérés de manière sécurisée (cookies sécurisés `bn_access_token` et `bn_refresh_token`).
   - Aucune empreinte de mot de passe ni clé secrète ne doit jamais transiter ou être stockée côté client.
2. **Protection des routes d'administration :**  
   - Le composant `AuthGuard` protège l'ensemble des routes sous `/admin/*` (sauf `/admin/login`).
   - Lors du chargement d'une page protégée, `AuthGuard` interroge `GET /api/v1/auth/me` avec le token d'accès. Si la session est invalide, l'accès est bloqué et l'utilisateur est redirigé vers `/admin/login`.
3. **Déconnexion propre :**  
   - Toute déconnexion appelle `POST /api/v1/auth/logout` pour révoquer le refresh token en base de données, vide les cookies locaux et redirige vers la mire de connexion.
