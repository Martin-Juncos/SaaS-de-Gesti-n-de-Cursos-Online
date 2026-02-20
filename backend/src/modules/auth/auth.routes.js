const { Router } = require('express');
const { register, login, me } = require('./auth.controller');
const { authenticateJwt } = require('../../middlewares/authenticateJwt');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateJwt, me);

module.exports = router;
