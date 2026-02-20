const asyncHandler = require('../../utils/asyncHandler');
const HttpError = require('../../utils/httpError');
const { ensureString } = require('../../utils/validators');
const { getUserById, registerUser, loginUser } = require('./auth.service');

const register = asyncHandler(async (req, res) => {
  const fullName = ensureString(req.body.fullName, 'fullName');
  const email = ensureString(req.body.email, 'email');
  const password = ensureString(req.body.password, 'password');
  const role = req.body.role;

  if (password.length < 8) {
    throw new HttpError(400, 'password must be at least 8 characters');
  }

  const result = await registerUser({ fullName, email, password, role });
  res.status(201).json({
    success: true,
    data: result
  });
});

const login = asyncHandler(async (req, res) => {
  const email = ensureString(req.body.email, 'email');
  const password = ensureString(req.body.password, 'password');

  const result = await loginUser({ email, password });
  res.status(200).json({
    success: true,
    data: result
  });
});

const me = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);
  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  res.status(200).json({
    success: true,
    data: { user }
  });
});

module.exports = {
  register,
  login,
  me
};
