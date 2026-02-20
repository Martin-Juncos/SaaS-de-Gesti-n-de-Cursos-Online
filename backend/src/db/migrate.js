const fs = require('fs');
const path = require('path');
const pool = require('./pool');

const migrationsDir = path.resolve(__dirname, '../../sql');

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function getAppliedMigrations() {
  const result = await pool.query('SELECT name FROM _migrations;');
  return new Set(result.rows.map((row) => row.name));
}

async function applyMigration(fileName, sql) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN;');
    await client.query(sql);
    await client.query('INSERT INTO _migrations (name) VALUES ($1);', [fileName]);
    await client.query('COMMIT;');
    console.log(`Applied migration: ${fileName}`);
  } catch (error) {
    await client.query('ROLLBACK;');
    throw error;
  } finally {
    client.release();
  }
}

async function runMigrations() {
  if (!fs.existsSync(migrationsDir)) {
    throw new Error(`Migrations folder not found: ${migrationsDir}`);
  }

  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      continue;
    }

    const fullPath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(fullPath, 'utf8');
    await applyMigration(file, sql);
  }
}

runMigrations()
  .then(() => {
    console.log('Database migrations completed.');
    return pool.end();
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    pool.end().finally(() => process.exit(1));
  });
