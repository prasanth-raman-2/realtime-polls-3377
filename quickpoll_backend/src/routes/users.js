// Users router for registration and authentication

const express = require('express');
const ctrl = require('../controllers/users');

const router = express.Router();

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);

module.exports = router;
