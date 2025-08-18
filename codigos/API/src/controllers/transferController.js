const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

/**
 * @swagger
 * /transfers:
 *   post:
 *     summary: Realiza transferência entre usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromId:
 *                 type: string
 *               toId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transferência realizada
 */
router.post('/', (req, res) => {
  try{
    const result = userService.transfer(req.body);
    res.json(result);
  } catch(err){
    res.status(err.status || 500).json({ message: err.message || 'erro interno' });
  }
});

module.exports = router;
