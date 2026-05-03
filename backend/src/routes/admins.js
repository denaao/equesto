const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database');
const auth = require('../middleware/auth');

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(auth);

// GET /api/admins — lista todos os admins
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, name, created_at FROM admin_users ORDER BY created_at ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar admins' });
  }
});

// POST /api/admins — cria novo admin
router.post('/', async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Senha deve ter pelo menos 8 caracteres' });
  }

  try {
    const existing = await db.query(
      'SELECT id FROM admin_users WHERE email = $1',
      [email.toLowerCase()]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const hash = await bcrypt.hash(password, 12);
    const result = await db.query(
      `INSERT INTO admin_users (email, name, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, created_at`,
      [email.toLowerCase(), name || null, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar admin' });
  }
});

// DELETE /api/admins/:id — remove admin (não pode deletar a si mesmo)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (id === req.admin.id) {
    return res.status(400).json({ error: 'Você não pode excluir sua própria conta' });
  }

  try {
    const result = await db.query(
      'DELETE FROM admin_users WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin não encontrado' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir admin' });
  }
});

module.exports = router;
