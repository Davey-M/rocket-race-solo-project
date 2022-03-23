let games = {};
let gameCodes = [];

function socketHandler(socket, io) {
  // console.log(socket.id);
  let currentGameCode = null;

  socket.on('disconnect', () => {
    games[currentGameCode]?.players.filter((s) => s.id !== socket.id);

    emitGame(currentGameCode);
  })

  socket.on('leave', () => {
    if (!games[currentGameCode]) return;

    games[currentGameCode].players = games[currentGameCode]?.players.filter((s) => s.id !== socket.id);

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
    games[currentGameCode].startTime = Date.now() + 10_000;

    io.to(currentGameCode).emit('game-started', games[currentGameCode]);
  })

  socket.on('finish-game', (finishedPlayer) => {
    console.log({
      gameCode: currentGameCode,
      ...finishedPlayer
    });

    io.to(socket.id).emit('race-finished', games[currentGameCode]);
  })

  function emitGame(gameCode) {
    io.to(gameCode).emit('ship-move', games[gameCode])
  }
}

module.exports = socketHandler;


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
    [], [],
    [], [],
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