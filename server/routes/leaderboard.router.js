const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const sqlText = `
      SELECT "race".*, "user"."username" as "winner", json_agg("users_races") AS "players" FROM "race"
      FULL JOIN "users_races"
        ON "race"."id" = "users_races"."race_id"
      JOIN "user"
        ON "race"."winner_id" = "user"."id"
      WHERE "race"."id" = $1
      GROUP BY "race"."id", "user"."username";
    `
    const sqlOptions = [id];

    const response = await pool.query(sqlText, sqlOptions);

    res.send(response.rows);
  } catch (err) {
    console.log('Error in leaderboard router', err);
    res.sendStatus(500);
  }
})

// this router will get the very basic information
router.get('/', async (req, res) => {
  try {

    const sqlText = `
      SELECT date("race"."time") as "time", "user"."id" as "user_id", "user"."username" as "winner", "users_races"."finish_time" FROM "race"
      FULL JOIN "users_races"
        ON "race"."winner_id" = "users_races"."user_id" AND "race"."id" = "users_races"."race_id"
      JOIN "user"
        ON "race"."winner_id" = "user"."id"
      ORDER BY "users_races"."finish_time" ASC;
    `
    const response = await pool.query(sqlText);

    res.send(response.rows);
  } catch (err) {
    console.log('Error in leaderboard router', err);
    res.sendStatus(500);
  }
})

module.exports = router;