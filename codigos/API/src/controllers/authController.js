const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token de autenticação
 */
router.post('/login', (req, res) => {
  try{
    const token = userService.authenticate(req.body);
    res.json(token);
  } catch(err){
    res.status(err.status || 500).json({ message: err.message || 'erro interno' });
  }
});

module.exports = router;
