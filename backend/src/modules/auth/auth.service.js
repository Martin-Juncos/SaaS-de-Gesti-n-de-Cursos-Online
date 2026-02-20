const bcrypt = require('bcryptjs');
const pool = require('../../db/pool');
const env = require('../../config/env');
const HttpError = require('../../utils/httpError');
const { signAccessToken } = require('../../utils/jwt');

const PUBLIC_REGISTER_ROLES = ['student', 'instructor'];

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

function mapUser(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at
  };
}

async function getUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1;', [email]);
  return result.rows[0] || null;
}

async function getUserById(userId) {
  const result = await pool.query(
    'SELECT id, full_name, email, role, created_at FROM users WHERE id = $1 LIMIT 1;',
    [userId]
  );
  return result.rows[0] ? mapUser(result.rows[0]) : null;
}

async function registerUser({ fullName, email, password, role }) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedRole = role || 'student';

  if (!PUBLIC_REGISTER_ROLES.includes(normalizedRole)) {
    throw new HttpError(400, 'Invalid role for public registration');
  }

  const existingUser = await getUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new HttpError(409, 'Email is already in use');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const insertResult = await pool.query(
    `
    INSERT INTO users (full_name, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, full_name, email, role, created_at;
  `,
    [fullName.trim(), normalizedEmail, passwordHash, normalizedRole]
  );

  const user = mapUser(insertResult.rows[0]);
  return {
    user,
    token: signAccessToken(user)
  };
}

async function loginUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const userRow = await getUserByEmail(normalizedEmail);

  if (!userRow) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, userRow.password_hash);
  if (!isValidPassword) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const user = mapUser(userRow);
  return {
    user,
    token: signAccessToken(user)
  };
}

async function bootstrapAdminIfConfigured() {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    return null;
  }

  const adminExists = await pool.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1;");
  if (adminExists.rowCount > 0) {
    return null;
  }

  const email = normalizeEmail(env.ADMIN_EMAIL);
  const existingByEmail = await getUserByEmail(email);
  if (existingByEmail) {
    return null;
  }

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
  await pool.query(
    `
    INSERT INTO users (full_name, email, password_hash, role)
    VALUES ($1, $2, $3, 'admin');
  `,
    [env.ADMIN_NAME, email, passwordHash]
  );

  console.log(`Admin user bootstrapped for ${email}`);
  return email;
}

module.exports = {
  getUserById,
  registerUser,
  loginUser,
  bootstrapAdminIfConfigured
};
