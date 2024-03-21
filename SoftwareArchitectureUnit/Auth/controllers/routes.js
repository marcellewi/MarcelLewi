const express = require('express');
const AuthController = require('./controller');

const router = new express.Router();
const auth = new AuthController();

router.post('/auth/login', (req, res) => auth.login(req, res));
router.post('/auth/register', (req, res) => auth.register(req, res));
router.get('/auth/verifyToken', (req, res) => auth.verifyToken(req, res));
router.get('/auth/logs', (req, res) => auth.logs(req, res));
router.get('/auth/getLoggedUser', (req, res) => auth.getLoggedUser(req, res));

module.exports = router;
