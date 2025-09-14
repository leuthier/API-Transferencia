const express = require('express');
const usersController = require('./src/controllers/usersController');
const transferController = require('./src/controllers/transferController');
const authController = require('./src/controllers/authController');

const router = express.Router();

router.post('/users', usersController.registerUser);
router.get('/users', usersController.listUsers);

router.post('/auth/login', authController.login);

router.post('/transfers', transferController.transfer);

module.exports = router;
