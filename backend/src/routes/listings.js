const express = require('express');
const db = require('../database');
const auth = require('../middleware/auth');

const router = express.Router();

// ============================================================
// ROTAS PÚBLICAS
// ============================================================

// GET /api/listings
// Query params: search, category, city, state, type, featured, page, limit
router.get('/', async (req, res) => {
  const {
    search = '',
    category,
    city,
    state,
    type,
    featured,
    page = 1,
    limit = 20,
  } = req.query;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const params = [];
  const conditions = ['l.active = TRUE', 'l.approved = TRUE'];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(l.name ILIKE $${params.length} OR l.description ILIKE $${params.length})`);
  }

  if (category) {
    params.push(category);
    conditions.push(`c.slug = $${params.length}`);
  }

  if (city) {
    params.push(`%${city}%`);
    conditions.push(`l.city ILIKE $${params.length}`);
  }

  if (state) {
    params.push(state);
    conditions.push(`l.state = $${params.length}`);
  }

  if (type) {
    params.push(type);
    conditions.push(`l.type = $${params.length}`);
  }

  if (featured === 'true') {
    conditions.push('l.featured = TRUE');
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const countResult = await db.query(
      `SELECT COUNT(*) FROM listings l
       LEFT JOIN categories c ON l.category_id = c.id
       ${where}`,
      params
    );

    params.push(parseInt(limit));
    params.push(offset);

    const result = await db.query(
      `SELECT
         l.id, l.name, l.type, l.city, l.state,
         l.photo_url, l.whatsapp, l.phone, l.website,
         l.featured, l.description, l.services,
         c.name AS category_name, c.slug AS category_slug, c.icon AS category_icon,
         l.created_at
       FROM listings l
       LEFT JOIN categories c ON l.category_id = c.id
       ${where}
       ORDER BY l.featured DESC, l.sort_order, l.name
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar anúncios' });
  }
});

// GET /api/listings/featured - destaques para a home
router.get('/featured', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT
         l.id, l.name, l.type, l.city, l.state,
         l.photo_url, l.whatsapp,
         c.name AS category_name, c.slug AS category_slug, c.icon AS category_icon
       FROM listings l
       LEFT JOIN categories c ON l.category_id = c.id
       WHERE l.active = TRUE AND l.approved = TRUE AND l.featured = TRUE
       ORDER BY l.sort_order, l.name
       LIMIT 10`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar destaques' });
  }
});

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT
         l.*,
         c.name AS category_name, c.slug AS category_slug, c.icon AS category_icon
       FROM listings l
       LEFT JOIN categories c ON l.category_id = c.id
       WHERE l.id = $1 AND l.active = TRUE AND l.approved = TRUE`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Anúncio não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar anúncio' });
  }
});

// ============================================================
// ROTAS ADMIN (protegidas)
// ============================================================

// GET /api/listings/admin/all - sem filtro de approved
router.get('/admin/all', auth, async (req, res) => {
  const { page = 1, limit = 50, search = '', approved } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const params = [];
  const conditions = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`l.name ILIKE $${params.length}`);
  }

  if (approved !== undefined) {
    params.push(approved === 'true');
    conditions.push(`l.approved = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const countResult = await db.query(
      `SELECT COUNT(*) FROM listings l ${where}`, params
    );

    params.push(parseInt(limit));
    params.push(offset);

    const result = await db.query(
      `SELECT l.*, c.name AS category_name
       FROM listings l
       LEFT JOIN categories c ON l.category_id = c.id
       ${where}
       ORDER BY l.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar anúncios' });
  }
});

// POST /api/listings
router.post('/', auth, async (req, res) => {
  const {
    name, category_id, type, description, services,
    city, state, whatsapp, phone, website,
    photo_url, featured, active, approved, sort_order,
  } = req.body;

  if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });

  try {
    const result = await db.query(
      `INSERT INTO listings
         (name, category_id, type, description, services,
          city, state, whatsapp, phone, website,
          photo_url, featured, active, approved, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [
        name, category_id, type, description,
        services || [],
        city, state, whatsapp, phone, website,
        photo_url,
        featured || false,
        active !== false,
        approved || false,
        sort_order || 0,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar anúncio' });
  }
});

// PUT /api/listings/:id
router.put('/:id', auth, async (req, res) => {
  const {
    name, category_id, type, description, services,
    city, state, whatsapp, phone, website,
    photo_url, featured, active, approved, sort_order,
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE listings SET
         name=$1, category_id=$2, type=$3, description=$4, services=$5,
         city=$6, state=$7, whatsapp=$8, phone=$9, website=$10,
         photo_url=$11, featured=$12, active=$13, approved=$14, sort_order=$15
       WHERE id=$16 RETURNING *`,
      [
        name, category_id, type, description,
        services || [],
        city, state, whatsapp, phone, website,
        photo_url, featured, active, approved, sort_order,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar anúncio' });
  }
});

// PATCH /api/listings/:id/approve
router.patch('/:id/approve', auth, async (req, res) => {
  const { approved } = req.body;
  try {
    const result = await db.query(
      'UPDATE listings SET approved=$1 WHERE id=$2 RETURNING id, name, approved',
      [approved, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar aprovação' });
  }
});

// DELETE /api/listings/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM listings WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir anúncio' });
  }
});

module.exports = router;
