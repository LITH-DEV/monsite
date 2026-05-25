# MonSite - Application de Gestion de Budget et Projets

Application full-stack de gestion de projets avec suivi budgétaire et conseiller d'investissement intelligent.

## 🏗️ Architecture

```
monsite/
├── backend/
│   ├── routes/
│   │   ├── projects.js
│   │   ├── transactions.js
│   │   └── dashboard.js
│   ├── index.js
│   ├── supabase.js
│   ├── .env.example
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   └── KpiCard.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Analysis.jsx
│   │   │   └── Tracking.jsx
│   │   ├── supabase.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── .env.example
│   └── .gitignore
│
├── sql/
│   └── init.sql
│
├── .gitignore
└── README.md
```

## 📋 Fonctionnalités

### Dashboard
- 4 KPIs : Budget total, Dépenses totales, Projets actifs, Projets en retard
- Graphique courbe : Entrées vs Sorties par mois
- Diagramme donut : Répartition des dépenses par projet
- Carte d'activité récente

### Gestion des Projets
- Création de projets avec budget et dates
- Suivi du statut (pending, active, completed, late)
- Barre de progression

### Analyse d'Investissement
- Conseiller IA pour optimiser les allocations budgétaires
- Recommandations prioritaires basées sur l'urgence

### Suivi de Projet
- Historique des dépenses
- Détails par transaction
- Filtrage par projet

## 🛠️ Stack Technique

**Backend:**
- Node.js + Express
- Supabase (PostgreSQL)
- CORS
- Dotenv

**Frontend:**
- React + Vite
- Axios pour les requêtes API
- Recharts pour les graphiques
- TailwindCSS pour le styling
- React Router pour la navigation

## 📝 Installation et Configuration

### 1. Cloner et initialiser

```bash
git clone https://github.com/LITH-DEV/monsite.git
cd monsite
```

### 2. Supabase - Créer les tables

1. Va sur [supabase.com](https://supabase.com)
2. Crée un nouveau projet
3. Va dans l'éditeur SQL
4. Exécute le contenu du fichier `sql/init.sql`
5. Récupère :
   - **Project URL** (SUPABASE_URL)
   - **Anon Public Key** (SUPABASE_KEY)

### 3. Backend

```bash
cd backend
npm install
```

Crée `backend/.env` :
```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=ta_clé_anon
PORT=3000
```

Lance le serveur :
```bash
npm start
# ou en dev avec auto-reload
npm run dev
```

Le backend s'exécute sur `http://localhost:3000`

### 4. Frontend

```bash
cd frontend
npm install
```

Crée `frontend/.env.local` :
```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=ta_clé_anon
```

Lance le serveur de développement :
```bash
npm run dev
```

Le frontend s'exécute sur `http://localhost:5173`

## 📡 API Endpoints

### Projets
| Méthode | Route | Action |
|---------|-------|--------|
| GET | `/api/projects` | Tous les projets |
| GET | `/api/projects/:id` | Détail d'un projet |
| POST | `/api/projects` | Créer un projet |
| PUT | `/api/projects/:id` | Modifier un projet |
| DELETE | `/api/projects/:id` | Supprimer un projet |

### Transactions
| Méthode | Route | Action |
|---------|-------|--------|
| GET | `/api/transactions` | Toutes les transactions |
| GET | `/api/transactions/project/:projectId` | Transactions d'un projet |
| POST | `/api/transactions` | Ajouter une dépense/revenu |

### Dashboard
| Méthode | Route | Action |
|---------|-------|--------|
| GET | `/api/dashboard/kpis` | Les 4 KPIs |
| GET | `/api/dashboard/chart` | Données graphique (courbe) |
| GET | `/api/dashboard/donut` | Données donut (répartition) |
| GET | `/api/dashboard/activity` | Activité récente |

## 🗄️ Structure de Données Supabase

### Table `projects`
```sql
id: UUID (primary key)
name: TEXT (not null)
estimated_cost: NUMERIC (not null)
spent: NUMERIC (default 0)
start_date: DATE
end_date: DATE
status: TEXT (pending|active|completed|late)
created_at: TIMESTAMP
```

### Table `transactions`
```sql
id: UUID (primary key)
project_id: UUID (foreign key)
amount: NUMERIC (not null)
label: TEXT
date: DATE
type: TEXT (expense|income)
created_at: TIMESTAMP
```

### Table `budget`
```sql
id: UUID (primary key)
total: NUMERIC (not null)
updated_at: TIMESTAMP
```

## 🚀 Démarrage rapide

```bash
# Terminal 1 - Backend
cd backend
cp .env.example .env
# Édite .env avec tes clés Supabase
npm install
npm start

# Terminal 2 - Frontend
cd frontend
cp .env.example .env.local
# Édite .env.local avec tes clés Supabase
npm install
npm run dev
```

Accès à l'application : `http://localhost:5173`

## 📖 Utilisation

1. **Dashboard** - Vue globale des KPIs et graphiques
2. **Projets** - Créer, modifier, supprimer des projets
3. **Analyse** - Conseiller IA pour optimiser les investissements
4. **Suivi** - Enregistrer les dépenses et suivre l'historique

## 🔐 Sécurité

- Les clés Supabase sont stockées dans `.env` (ignoré par git)
- CORS configuré pour localhost en développement
- À adapter en production

## 📝 Licence

MIT

## 🤝 Support

Pour toute question, crée une issue sur GitHub.
