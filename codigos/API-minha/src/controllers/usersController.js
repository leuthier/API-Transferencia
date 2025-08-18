const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Registra um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               favored:
 *                 type: boolean
 *               balance:
 *                 type: number
 *     responses:
 *       201:
 *         description: Usuário criado
 */
router.post('/', (req, res) => {
  try{
    const user = userService.registerUser(req.body);
    res.status(201).json(user);
  } catch(err){
    res.status(err.status || 500).json({ message: err.message || 'erro interno' });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista usuários
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/', (req, res) => {
  res.json(userService.listUsers());
});

module.exports = router;
