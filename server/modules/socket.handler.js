/*
  games structure = {
    "game_id": {
      players: [
        {player_id, socket_id, x, y, time, place}
      ],
      winner: player_id
      startTime: timestamp
    }
  }
*/
let games = {}

function socketHandler(socket, io) {
  // console.log(socket.id);
  let current_game_id = '';
  let raceClock = -10

  socket.conn.on('close', () => {
    // console.log(socket.id, 'Disconnected');
    if (current_game_id !== '') {
      games[current_game_id].players = games[current_game_id].players.filter(player => {
        return player.socket_id !== socket.id
      })
    }

    io.to(current_game_id).emit('update-game-state', {
      game_id: current_game_id,
      ...games[current_game_id]
    });
  })

  socket.on('create-game', ({ user_id, socket_id, x, y }) => {
    if (current_game_id !== '') {
      socket.leave(current_game_id);
    }

    current_game_id = generateGameCodes();

    games[current_game_id] = {
      players: [
        { user_id, socket_id, x, y, time: null, place: null }
      ],
      winner: null,
      startTime: null,
      started: false,
    }

    socket.join(current_game_id);

    io.to(current_game_id).emit('update-game-state', {
      game_id: current_game_id,
      ...games[current_game_id]
    });
  })

  socket.on('join-game', ({ game_id, user_id, socket_id, x, y }) => {
    if (games[game_id]) {
      if (current_game_id !== '') {
        socket.leave(current_game_id);
      }

      current_game_id = game_id

      games[current_game_id].players = [
        ...games[current_game_id].players,
        { user_id, socket_id, x, y, time: null, place: null }
      ];

      socket.join(current_game_id);

      io.to(current_game_id).emit('update-game-state', {
        game_id: current_game_id,
        ...games[current_game_id]
      });
    } else {
      console.log('this game does not exist');
    }
  })

  socket.on('start-game', () => {
    if (socket.id === games[current_game_id].players[0].socket_id) {
      games[current_game_id].started = true;

      games[current_game_id].startTime = Date.now() + 10_000;

      io.to(current_game_id).emit('update-game-state', {
        game_id: current_game_id,
        ...games[current_game_id]
      });
    }

    raceClock = -10;
    let raceClockInterval = setInterval(() => {
      raceClock = (Math.floor((Date.now() - games[current_game_id].startTime) / 100))
      io.to(current_game_id).emit('update-race-clock', raceClock);
      if (games[current_game_id].winner) {
        clearInterval(raceClockInterval);
      }
    }, 100);
  })

  socket.on('finish-game', () => {
    let finishTime = raceClock / 10
    console.log(socket.id, 'finished in', finishTime, 'seconds');

    games[current_game_id].players.map(player => {
      if (player.socket_id === socket.id) {
        player.time = finishTime
        player.place = games[current_game_id].players.filter(p => p.place).length + 1;
      }
    })

    if (games[current_game_id].players.filter(p => p.place === null).length === 0) {
      games[current_game_id].winner = games[current_game_id].players.filter(p => p.place === 1)[0].user_id;
    }

    io.to(current_game_id).emit('update-game-state', {
      game_id: current_game_id,
      ...games[current_game_id]
    });
  })
}

const gameCodeSymbols = '1234567890abcdefghijklmnopqrstuvwxyz';

function generateGameCodes() {
  let gameCode = '';

  do {
    for (let i = 0; i < 4; i++) {
      gameCode += gameCodeSymbols[Math.floor(Math.random() * gameCodeSymbols.length)];
    }
  } while (gameCode in games);

  return gameCode;
}

module.exports = socketHandler;