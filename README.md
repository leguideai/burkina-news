# 🇧🇫 Burkina News — Application Web Frontend (Next.js 16)

Plateforme d'information, d'investigation et d'évaluation des politiques publiques du Burkina Faso.

---

## 🚀 Technologies Principales

- **Framework :** [Next.js 16](https://nextjs.org/) (App Router, Server Components & Client Components)
- **Bibliothèque UI :** [React 19](https://react.dev/)
- **Langage :** [TypeScript 5](https://www.typescriptlang.org/)
- **Styling :** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icônes :** [Lucide React](https://lucide.dev/)
- **Backend connecté :** [burkina-news-backend (Golang 1.24 + PostgreSQL 16)](../burkina-news-backend)

---

## ⚙️ Configuration & Variables d'Environnement

Créez ou adaptez votre fichier `.env.local` à la racine de `burkina-news/` :

```bash
# URL de l'API Backend Go
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_API_ROOT=http://localhost:8080

# Clés d'Assistant IA Rédactionnel Micum (Optionnel en dev)
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
MICUM_AI_PROVIDER=auto
```

---

## 🛠️ Commandes de Démarrage & Développement

```bash
# 1. Installation des dépendances (avec pnpm ou npm)
pnpm install
# ou : npm install

# 2. Lancement du serveur de développement local (port 3000)
pnpm dev
# ou : npm run dev

# 3. Compilation et vérification du build de production
pnpm build
# ou : npm run build

# 4. Vérification de la conformité du code (Linter)
pnpm lint
# ou : npm run lint
```

---

## 🖥️ Accès aux Espaces & Identifiants

| Espace | URL Locale | Description |
| :--- | :--- | :--- |
| **Site Public (Français)** | `http://localhost:3000/fr` | Édition d'investigation en français |
| **Site Public (Anglais)** | `http://localhost:3000/en` | Édition internationale en anglais |
| **Mire de Connexion Desk** | `http://localhost:3000/admin/login` | Accès réservé aux journalistes & administrateurs |
| **Back-office Rédactionnel** | `http://localhost:3000/admin` | Tableau de bord et gestion de la rédaction |
| **Desk Utilisateurs** | `http://localhost:3000/admin/utilisateurs` | Gestion des membres, rôles et statuts |

### Identifiants Superadmin par défaut (connectés au Backend Go) :
- **Email :** `samba@leguideai.com`
- **Mot de passe :** `BurkinaAdmin2026!`
- **Rôle :** `Superadmin`

---

## 📁 Architecture des Dossiers

```text
burkina-news/
├── app/
│   ├── admin/               # Espace rédactionnel & back-office sécurisé
│   │   ├── login/           # Mire de connexion administrative
│   │   ├── utilisateurs/    # CRUD de gestion des membres du Desk
│   │   ├── articles/        # Gestion et rédaction des enquêtes
│   │   ├── projets/         # Suivi du Tracker des Chantiers
│   │   └── ...
│   ├── fr/                  # Pages publiques en français
│   ├── en/                  # Pages publiques en anglais
│   └── api/                 # Route handlers locaux (bientôt délégués au backend Go)
├── components/
│   ├── admin/               # Composants d'administration (AuthGuard, Skeletons, Toasts)
│   ├── ui/                  # Composants d'interface génériques (boutons, inputs, modales)
│   └── ...
├── lib/
│   └── api/                 # Couche Client API Go unifiée (client.ts, auth.ts, users.ts, types.ts)
├── data/                    # Types métier et jeux de données (mocks en cours de migration)
├── public/                  # Assets statiques (logos, images, favicons)
├── REGLES_DEVELOPPEMENT_FRONTEND.md # Charte de développement obligatoire
├── CHRONOLOGIE_ET_SUIVI_FRONTEND.md # Suivi pas-à-pas des phases
└── JOURNAL_DES_TRAVAUX_FRONTEND.md  # Mémoire technique continue
```

---

## 📚 Documents de Référence
- [`REGLES_DEVELOPPEMENT_FRONTEND.md`](./REGLES_DEVELOPPEMENT_FRONTEND.md) : Règles absolues d'architecture, de typage strict et de Skeletons.
- [`CHRONOLOGIE_ET_SUIVI_FRONTEND.md`](./CHRONOLOGIE_ET_SUIVI_FRONTEND.md) : Calendrier et correspondances des phases frontend/backend.
- [`JOURNAL_DES_TRAVAUX_FRONTEND.md`](./JOURNAL_DES_TRAVAUX_FRONTEND.md) : Historique chronologique des intégrations.
