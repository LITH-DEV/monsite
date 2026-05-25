const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET tous les projets
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error });
  res.json(data);
});

// GET un projet par ID
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error });
  res.json(data);
});

// POST créer un projet
router.post('/', async (req, res) => {
  const { name, estimated_cost, start_date, end_date } = req.body;

  if (!name || !estimated_cost) {
    return res.status(400).json({ error: 'Name and estimated_cost are required' });
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([{ name, estimated_cost, start_date, end_date, status: 'pending', spent: 0 }])
    .select()
    .single();

  if (error) return res.status(400).json({ error });
  res.status(201).json(data);
});

// PUT modifier un projet
router.put('/:id', async (req, res) => {
  const { name, estimated_cost, start_date, end_date, status, spent } = req.body;

  const { data, error } = await supabase
    .from('projects')
    .update({ name, estimated_cost, start_date, end_date, status, spent })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error });
  res.json(data);
});

// DELETE supprimer un projet
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(400).json({ error });
  res.json({ message: 'Projet supprimé' });
});

module.exports = router;
