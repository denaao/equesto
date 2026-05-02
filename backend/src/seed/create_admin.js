// Script para criar o usuário admin inicial
// Execute: node src/seed/create_admin.js
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const db = require('../database');

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@equesto.com.br';
  const password = process.env.ADMIN_PASSWORD || 'Equesto@2024!';
  const name = process.env.ADMIN_NAME || 'Admin Equesto';

  const hash = await bcrypt.hash(password, 10);

  try {
    const result = await db.query(
      `INSERT INTO admin_users (email, password_hash, name)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET password_hash = $2
       RETURNING id, email, name`,
      [email, hash, name]
    );
    console.log('✅ Admin criado/atualizado:');
    console.log('   Email:', result.rows[0].email);
    console.log('   Senha:', password);
    console.log('\n⚠️  Troque a senha após o primeiro login!');
  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
  process.exit(0);
}

createAdmin();
