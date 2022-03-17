const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

router.get('/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const id = req.params.id;

      const sqlText = `
        SELECT "id", "username", "about", "img" FROM "user" WHERE "id" = $1;
      `

      const sqlOptions = [id];

      const response = await pool.query(sqlText, sqlOptions);

      res.send(response.rows);
    } catch (err) {
      res.sendStatus(500);
    }
  }
  else {
    res.sendStatus(403);
  }
});

module.exports = router;