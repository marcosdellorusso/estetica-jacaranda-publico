import bcrypt from 'bcrypt';
import pool from './index';
import { createServicio } from './queries/servicios';

import 'dotenv/config';

async function seed() {

  /* ---------- usuario de prueba ---------- */
  const hash = await bcrypt.hash('user', 10);

  await pool.query(
    'INSERT INTO usuarios (dni, password, rol) VALUES ($1, $2, $3) ON CONFLICT (dni) DO UPDATE SET password = $2',
    ['user', hash, 'user']
  );

  console.log('✅ Seed ejecutado con éxito');
}

seed().catch((err) => {
  console.error('❌ Error al ejecutar seed:', err);
});