const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

router.get('/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const id = req.params.id;

      const sqlText = `
        SELECT
          "user"."id", "username",
          "about", "img",
          array_agg("users_races"."finish_time") AS "finish_time",
          array_agg("users_races"."place") AS "place",
          array_agg("users_races"."race_id") AS "race_id",
          array_agg("users_races"."id") AS "card_id"
        FROM "user"
        FULL JOIN "users_races"
          ON "user"."id" = "users_races"."user_id"
        WHERE "user"."id" = $1
        GROUP BY "user"."id";
      `

      const sqlOptions = [id];

      const response = await pool.query(sqlText, sqlOptions);

      res.send(response.rows);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
  else {
    res.sendStatus(403);
  }
});

router.delete('/race/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const deleteId = req.params.id;

      const sqlText = `
        DELETE FROM "users_races" WHERE "id" === $1 AND "user_id" === $2
      `
      const sqlOptions = [deleteId, req.user.id]

      await pool.query(sqlText, sqlOptions);

      res.sendStatus(201);
    } catch (err) {
      console.log('Error in delete route', err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(403);
  }
})

module.exports = router;