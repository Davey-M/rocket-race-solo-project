const pool = require('../modules/pool');

let games = {};
let gameCodes = [];

function socketHandler(socket, io) {
  // console.log(socket.id);
  let currentGameCode = null;

  socket.on('disconnect', () => {
    games[currentGameCode]?.players.filter((s) => s.id !== socket.id);

    socket.leave(currentGameCode);
    emitGame(currentGameCode);
  })

  socket.on('leave', () => {
    if (!games[currentGameCode]) return;

    games[currentGameCode].players = games[currentGameCode]?.players.filter((s) => s.id !== socket.id);

    socket.leave(currentGameCode);
    emitGame(currentGameCode);
  })

  socket.on('move', (shipState) => {

    // console.log(shipState);

    games[currentGameCode]?.players.forEach((ship, index) => {
      if (ship.id === socket.id) {
        games[currentGameCode].players[index] = {
          ...ship,
          ...shipState,
        }
      }
    })

    emitGame(currentGameCode);
  })

  socket.on('create-game', (playerState) => {
    currentGameCode = generateRandomCode();

    socket.join(currentGameCode);

    games[currentGameCode] = {
      gameCode: currentGameCode,
      asteroids: generateRandomAsteroids(),
      players: [
        {
          finished: false,
          ...playerState
        },
      ],
      startTime: null,
    }

    // emitGame(currentGameCode);
    io.to(currentGameCode).emit('game-joined', games[currentGameCode]);
  })

  socket.on('join-game', ({ gameCode, playerState }) => {
    currentGameCode = gameCode;
    socket.join(gameCode);

    games[gameCode]?.players.push({
      finished: false,
      ...playerState
    })

    io.to(currentGameCode).emit('game-joined', games[currentGameCode]);
  })

  socket.on('start-game', () => {
    games[currentGameCode].startTime = Date.now() + 5_000; // original wait time was 10 seconds

    io.to(currentGameCode).emit('game-started', games[currentGameCode]);
  })

  socket.on('finish-game', (finishedPlayer) => {
    console.log({
      gameCode: currentGameCode,
      ...finishedPlayer
    });

    games[currentGameCode].players = games[currentGameCode].players.map((player) => {
      if (player.id === socket.id) {
        return finishedPlayer;
      }
      return player;
    })

    if (games[currentGameCode].players.filter((p) => !p.finishTime).length === 0) {
      postRace(games[currentGameCode]);
    }

    io.to(currentGameCode).emit('race-finished', games[currentGameCode]);
  })

  socket.on('boom', (coords) => {
    io.to(currentGameCode).emit('explosion', coords);
  })

  function emitGame(gameCode) {
    io.to(gameCode).emit('ship-move', games[gameCode])
  }
}

module.exports = socketHandler;

async function postRace(race) {
  try {
    const players = race.players.sort((a, b) => {
      if (a.finishTime === undefined) {
        return 1;
      }
      if (b.finishTime === undefined) {
        return -1;
      }
      return a.finishTime - b.finishTime;
    })

    const sqlText = `
      INSERT INTO "race" ("winner_id", "time")
      VALUES ($1, to_timestamp($2 / 1000.0))
      RETURNING "id";
    `
    const sqlOptions = [players[0].user_id, race.startTime]

    let response = await pool.query(sqlText, sqlOptions);

    for (let i = 0; i < players.length; i++) {
      const player = players[i];

      const playerSqlText = `
        INSERT INTO "users_races" ("user_id", "race_id", "finish_time", "place")
        VALUES ($1, $2, $3, $4);
      `
      const playerSqlOptions = [
        player.user_id,
        response.rows[0].id,
        ((player.finishTime - race.startTime) / 1000).toFixed(2),
        i + 1,
      ];

      await pool.query(playerSqlText, playerSqlOptions);
    }
  } catch (err) {
    console.log('Error posing to database', err);
  }
}

const codeSymbols = '1234567890abcedfghijklmnopqrstuvwxyz';
function generateRandomCode() {
  let code = '';

  do {
    for (let i = 0; i < 5; i++) {
      code += codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
    }
  } while (gameCodes.includes(code))

  gameCodes.push(code);

  return code;
}

function generateRandomAsteroids() {
  let asteroids = [
    [], [],
    [], [],
    [], [],
    [], [],
    [], [],
    [], [],
    [], [],
    [], [],
    // [], [],
    // [], [],
  ];

  // console.log(asteroids);
  for (let asteroid of asteroids) {

    for (let i = 0; i < 5; i++) {
      asteroid.push({
        x: Math.floor(Math.random() * 50),
        y: Math.floor(Math.random() * 40) - 5,
      })
    }

    // setup starting position
    asteroid.push({
      x: Math.floor(Math.random() * 900) - 100,
      y: Math.floor(Math.random() * 100) - 50,
    })
  }

  return asteroids;
}