const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET les 4 KPIs
router.get('/kpis', async (req, res) => {
  try {
    const { data: budget } = await supabase
      .from('budget')
      .select('total')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    const { data: projects } = await supabase
      .from('projects')
      .select('spent, status, end_date');

    const totalSpent = projects?.reduce((sum, p) => sum + (p.spent || 0), 0) || 0;
    const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
    const lateProjects = projects?.filter(p => {
      const isLate = new Date(p.end_date) < new Date() && p.status !== 'completed';
      return isLate;
    }).length || 0;

    res.json({
      total_budget: budget?.total || 0,
      total_spent: totalSpent,
      active_projects: activeProjects,
      late_projects: lateProjects
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET données mensuelles pour le graphique
router.get('/chart', async (req, res) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('amount, date, type')
    .order('date', { ascending: true });

  if (error) return res.status(400).json({ error });

  // Grouper par mois
  const months = {};
  data?.forEach(t => {
    const month = t.date.slice(0, 7); // "2024-01"
    if (!months[month]) months[month] = { income: 0, expense: 0 };
    if (t.type === 'income') months[month].income += t.amount;
    else months[month].expense += t.amount;
  });

  const result = Object.entries(months).map(([month, values]) => ({
    month,
    ...values
  }));

  res.json(result);
});

// GET répartition pour le donut
router.get('/donut', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('name, spent, status');

  if (error) return res.status(400).json({ error });

  const result = data?.map(p => ({
    name: p.name,
    value: p.spent || 0,
    status: p.status
  })) || [];

  res.json(result);
});

// GET activité récente
router.get('/activity', async (req, res) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, projects(name)')
    .order('date', { ascending: false })
    .limit(10);

  if (error) return res.status(400).json({ error });
  res.json(data);
});

module.exports = router;
