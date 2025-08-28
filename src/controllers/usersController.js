const express = require('express');
const router = express.Router();
const userService = require('../services/userService');


router.post('/', (req, res) => {
  try {
    const user = userService.registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', (req, res) => {
  res.json(userService.listUsers());
});

module.exports = router;
