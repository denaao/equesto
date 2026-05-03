require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ============================================================
// Middlewares globais
// ============================================================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  'https://equesto.vercel.app',
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // permite requests sem origin (ex: mobile, Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS bloqueado: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ============================================================
// Rotas
// ============================================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/upload', require('./routes/upload'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'Equesto API', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// ============================================================
// Start — roda migrations antes de abrir o servidor
// ============================================================
const PORT = process.env.PORT || 3000;

async function start() {
  if (process.env.NODE_ENV === 'production') {
    const fs = require('fs');
    const path = require('path');
    const db = require('./database');
    const migrationDir = path.join(__dirname, '..', 'migrations');
    const files = fs.readdirSync(migrationDir).filter(f => f.endsWith('.sql')).sort();
    console.log('🔄 Executando migrations...');
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationDir, file), 'utf8');
      console.log(`  → ${file}`);
      await db.query(sql);
    }
    console.log('✅ Migrations concluídas!');
  }

  app.listen(PORT, () => {
    console.log(`🐎 Equesto API rodando na porta ${PORT}`);
    console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
  });
}

start().catch(err => {
  console.error('❌ Erro ao iniciar:', err);
  process.exit(1);
});
