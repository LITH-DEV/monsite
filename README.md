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
│   └── .gitignore
│
├── sql/
│   └── init.sql
│
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

### Suivi de Projet
- Historique des dépenses
- Détails par transaction

## 🛠️ Stack Technique

**Backend:** Node.js + Express + Supabase
**Frontend:** React + Vite + TailwindCSS

## 📡 API Endpoints

| Méthode | Route | Action |
|---------|-------|--------|
| GET | `/api/projects` | Tous les projets |
| POST | `/api/projects` | Créer un projet |
| GET | `/api/transactions` | Toutes les transactions |
| GET | `/api/dashboard/kpis` | Les 4 KPIs |
