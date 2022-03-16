/*
  games structure = {
    "game_id": {
      players: [
        {player_id, socket_id, x, y, time, place}
      ],
      winner: user_id
      startTime: timestamp
    }
  }
*/
let games = {}

function socketHandler(socket, io) {
  // console.log(socket.id);
  let current_game_id = '';

  // this race clock will handle the clock logic for everyone in the race
  let raceClock = -10

  // triggers when the socket closes
  socket.conn.on('close', () => {
    // console.log(socket.id, 'Disconnected');
    if (current_game_id !== '') {
      games[current_game_id].players = games[current_game_id].players.filter(player => {
        return player.socket_id !== socket.id
      })
    }

    // send the updated game state to the clients
    sendUpdatedGameState(io, current_game_id);
  })

  socket.on('create-game', ({ user_id, socket_id, x, y }) => {
    // leave if the player is already in a game.
    if (current_game_id !== '') {
      socket.leave(current_game_id);
    }

    // set the game id to a new id
    current_game_id = generateGameCodes();

    // setup the game state object
    games[current_game_id] = {
      players: [
        { user_id, socket_id, x, y, time: null, place: null }
      ],
      winner: null,
      startTime: null,
      started: false,
    }

    // join the current game room
    socket.join(current_game_id);

    // send the updated game state to the client
    sendUpdatedGameState(io, current_game_id);
  })

  socket.on('join-game', ({ game_id, user_id, socket_id, x, y }) => {
    // check if the game exists
    if (games[game_id]) {

      // if you are currently in a game leave and join a new one
      if (current_game_id !== '') {
        socket.leave(current_game_id);
      }

      // set the current game id to the game id that was sent up
      current_game_id = game_id

      // add to the players list in the game state
      games[current_game_id].players = [
        ...games[current_game_id].players,
        { user_id, socket_id, x, y, time: null, place: null }
      ];

      // join the game room
      socket.join(current_game_id);

      // send the updated game state to the clients
      sendUpdatedGameState(io, current_game_id);
    } else {
      console.log('this game does not exist');
    }
  })

  socket.on('start-game', () => {
    // check to see if the person starting the game is authorized to
    if (socket.id === games[current_game_id].players[0].socket_id) {

      // set the game to started
      games[current_game_id].started = true;

      // set the start time to 10 seconds in the future
      games[current_game_id].startTime = Date.now() + 10_000;

      // send the updated game state to the client
      sendUpdatedGameState(io, current_game_id);
    }

    // setup the race clock interval
    raceClock = -10;
    let raceClockInterval = setInterval(() => {

      // set the race clock to the proper time
      raceClock = (Math.floor((Date.now() - games[current_game_id].startTime)) / 100)

      // send the race clock time to the clients
      io.to(current_game_id).emit('update-race-clock', raceClock);

      // if the game has a winner clear the race clock interval
      if (games[current_game_id].winner) {
        clearInterval(raceClockInterval);
      }
    }, 10);
  })

  socket.on('finish-game', (time) => {
    // set the finish time to the race clocks current time
    let finishTime = time / 10
    console.log(socket.id, 'finished in', finishTime, 'seconds');

    // change the player within the game object to have the proper finish time and place
    games[current_game_id].players.map(player => {
      if (player.socket_id === socket.id) {
        player.time = finishTime
        player.place = games[current_game_id].players.filter(p => p.place !== null).length + 1;
      }
    })

    // check to see if the game has a winner
    if (games[current_game_id].players.filter(p => p.place === null).length === 0) {
      games[current_game_id].winner = games[current_game_id].players.filter(p => p.place === 1)[0].user_id;
    }

    // send the updated game state back to the clients
    sendUpdatedGameState(io, current_game_id);
  })

  socket.on('update-player-position', (y) => {
    games[current_game_id].players.map((p) => {
      if (p.socket_id === socket.id) {
        p.y = y;
      }
    })

    sendUpdatedGameState(io, current_game_id);
  })
}

// this function sends the game state to the clients
function sendUpdatedGameState(io, current_game_id) {
  io.to(current_game_id).emit('update-game-state', {
    game_id: current_game_id,
    ...games[current_game_id]
  });
}

// these game symbols are used for creating room codes
const gameCodeSymbols = '1234567890abcdefghijklmnopqrstuvwxyz';

// create a unique game code
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