// Script para rodar as migrations no banco
// Execute: node src/migrate.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./database');

async function migrate() {
  const migrationDir = path.join(__dirname, '..', 'migrations');
  const files = fs.readdirSync(migrationDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log('🔄 Executando migrations...');
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationDir, file), 'utf8');
    console.log(`  → ${file}`);
    await db.query(sql);
  }
  console.log('✅ Migrations concluídas!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Erro nas migrations:', err);
  process.exit(1);
});
