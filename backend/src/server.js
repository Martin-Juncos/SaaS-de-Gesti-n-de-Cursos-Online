const app = require('./app');
const env = require('./config/env');
const pool = require('./db/pool');
const { bootstrapAdminIfConfigured } = require('./modules/auth/auth.service');

async function start() {
  await pool.query('SELECT 1;');
  await bootstrapAdminIfConfigured();

  app.listen(env.PORT, () => {
    console.log(`Backend listening on port ${env.PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start backend:', error);
  process.exit(1);
});
