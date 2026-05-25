-- Projets
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  estimated_cost NUMERIC NOT NULL,
  spent NUMERIC DEFAULT 0,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions (dépenses et revenus)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  label TEXT,
  date DATE DEFAULT CURRENT_DATE,
  type TEXT DEFAULT 'expense',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Budget global
CREATE TABLE IF NOT EXISTS budget (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total NUMERIC NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_project_id ON transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- Données de démonstration (optionnel)
-- Insérer un budget initial
INSERT INTO budget (total) VALUES (50000) ON CONFLICT DO NOTHING;

-- Insérer des projets de démonstration
INSERT INTO projects (name, estimated_cost, spent, status, start_date, end_date) VALUES
  ('Refonte Site Web', 15000, 8500, 'active', '2024-01-15', '2024-06-30'),
  ('Développement App Mobile', 20000, 12000, 'active', '2024-02-01', '2024-07-31'),
  ('Migration Serveurs', 8000, 0, 'pending', '2024-03-01', '2024-04-30'),
  ('Formation Équipe', 5000, 2500, 'completed', '2024-01-01', '2024-02-28')
ON CONFLICT DO NOTHING;

-- Insérer des transactions de démonstration
INSERT INTO transactions (project_id, amount, label, date, type) 
SELECT id, 5000, 'Paiement initial', '2024-01-20', 'expense' FROM projects WHERE name = 'Refonte Site Web'
ON CONFLICT DO NOTHING;

INSERT INTO transactions (project_id, amount, label, date, type) 
SELECT id, 3500, 'Livrable intermédiaire', '2024-03-15', 'expense' FROM projects WHERE name = 'Refonte Site Web'
ON CONFLICT DO NOTHING;

INSERT INTO transactions (project_id, amount, label, date, type) 
SELECT id, 8000, 'Première phase', '2024-02-05', 'expense' FROM projects WHERE name = 'Développement App Mobile'
ON CONFLICT DO NOTHING;

INSERT INTO transactions (project_id, amount, label, date, type) 
SELECT id, 4000, 'Deuxième phase', '2024-03-20', 'expense' FROM projects WHERE name = 'Développement App Mobile'
ON CONFLICT DO NOTHING;

INSERT INTO transactions (project_id, amount, label, date, type) 
SELECT id, 2500, 'Formation complète', '2024-02-28', 'expense' FROM projects WHERE name = 'Formation Équipe'
ON CONFLICT DO NOTHING;
