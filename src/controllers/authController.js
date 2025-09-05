const express = require('express');
const router = express.Router();
const userService = require('../services/userService');


router.post('/login', (req, res) => {
  const { email, password } = req.body;
  try{
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const token = userService.authenticate(req.body);
    res.json(token);
    
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'erro interno' });
  }
});

module.exports = router;
