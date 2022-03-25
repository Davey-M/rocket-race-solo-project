const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

router.get('/', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const sqlText = `
        SELECT "username", COALESCE("img", '') as "image", COALESCE("about", '') as "about", "color" FROM "user"
        WHERE "id" = $1;
      `
      const sqlOptions = [req.user.id]

      const response = await pool.query(sqlText, sqlOptions);

      res.send(response.rows);
    } catch (err) {
      console.error('Error in edit get', err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(403);
  }
})

router.put('/', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const sqlText = `
        UPDATE "user"
        SET "img" = $2, "about" = $3, "color" = $4
        WHERE "id" = $1;
      `
      const { image, about, color } = req.body;
      const sqlOptions = [req.user.id, image, about, color]

      const response = await pool.query(sqlText, sqlOptions);

      res.send(response.rows);
    } catch (err) {
      console.error('Error in edit get', err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(403);
  }
})

module.exports = router;