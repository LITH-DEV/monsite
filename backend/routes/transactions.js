const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET toutes les transactions
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, projects(name)')
    .order('date', { ascending: false });

  if (error) return res.status(400).json({ error });
  res.json(data);
});

// GET transactions d'un projet
router.get('/project/:projectId', async (req, res) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('project_id', req.params.projectId)
    .order('date', { ascending: false });

  if (error) return res.status(400).json({ error });
  res.json(data);
});

// POST ajouter une transaction
router.post('/', async (req, res) => {
  const { project_id, amount, label, date, type } = req.body;

  if (!project_id || !amount) {
    return res.status(400).json({ error: 'project_id and amount are required' });
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert([{ project_id, amount, label, date: date || new Date().toISOString().split('T')[0], type: type || 'expense' }])
    .select()
    .single();

  if (error) return res.status(400).json({ error });

  // Mettre à jour le "spent" du projet si c'est une dépense
  if (type === 'expense') {
    const { data: project } = await supabase
      .from('projects')
      .select('spent')
      .eq('id', project_id)
      .single();

    await supabase
      .from('projects')
      .update({ spent: (project?.spent || 0) + amount })
      .eq('id', project_id);
  }

  res.status(201).json(data);
});

module.exports = router;
