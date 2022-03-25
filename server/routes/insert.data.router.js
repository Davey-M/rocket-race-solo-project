const pool = require('../modules/pool');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  // if (req.isAuthenticated()) {
  await pool.query('ALTER TABLE "user" ADD "color" INT DEFAULT 7;');

  res.sendStatus(200);
  // }
  // else {
  //   res.sendStatus(403);
  // }
})

module.exports = router;