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

  socket.conn.on('close', () => {
    // console.log(socket.id, 'Disconnected');

  })

  socket.on('create-game', ({ user_id, socket_id, x, y }) => {
    current_game_id = generateGameCodes();

    games[current_game_id] = {
      players: [
        { user_id, socket_id, x, y, time: null, place: null }
      ],
      winner: null,
      startTime: null,
    }

    socket.join(current_game_id);

    io.to(current_game_id).emit('update-game-state', {
      game_id: current_game_id,
      game: games[current_game_id]
    });
  })

  socket.on('join-game', ({ game_id, user_id, socket_id, x, y }) => {
    if (games[game_id]) {
      current_game_id = game_id

      games[current_game_id].players = [
        ...games[current_game_id].players,
        { user_id, socket_id, x, y, time: null, place: null }
      ];

      socket.join(current_game_id);

      io.to(current_game_id).emit('update-game-state', {
        game_id: current_game_id,
        game: games[current_game_id]
      });
    } else {
      console.log('this game does not exist');
    }
  })

  socket.on('finish-game', ({ finish_time }) => {

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