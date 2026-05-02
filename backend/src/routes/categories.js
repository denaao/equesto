const express = require('express');
const db = require('../database');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/categories - lista todas as categorias ativas
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM categories WHERE active = TRUE ORDER BY sort_order, name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// GET /api/categories/grouped - agrupadas por grupo
router.get('/grouped', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM categories WHERE active = TRUE ORDER BY sort_order, name`
    );

    const grouped = {};
    for (const cat of result.rows) {
      const group = cat.group_name || 'Outros';
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(cat);
    }

    res.json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// ---- ROTAS ADMIN (protegidas) ----

// POST /api/categories
router.post('/', auth, async (req, res) => {
  const { name, slug, group_name, icon, sort_order } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ error: 'Nome e slug são obrigatórios' });
  }
  try {
    const result = await db.query(
      `INSERT INTO categories (name, slug, group_name, icon, sort_order)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, slug, group_name, icon, sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') return res.status(409).json({ error: 'Slug já existe' });
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
});

// PUT /api/categories/:id
router.put('/:id', auth, async (req, res) => {
  const { name, slug, group_name, icon, sort_order, active } = req.body;
  try {
    const result = await db.query(
      `UPDATE categories
       SET name=$1, slug=$2, group_name=$3, icon=$4, sort_order=$5, active=$6
       WHERE id=$7 RETURNING *`,
      [name, slug, group_name, icon, sort_order, active, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM categories WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir categoria' });
  }
});

module.exports = router;
