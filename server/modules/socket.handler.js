let game = [];

function socketHandler(socket, io) {
  // console.log(socket.id);

  socket.join('room');

  game.push({
    id: socket.id,
    x: 200,
    y: 1950,
    rotation: 0,
  });

  socket.conn.on('close', () => {
    game = game.filter((s) => s.id !== socket.id);
    io.emit('ship-move', game)
  })

  socket.on('leave', () => {
    game = game.filter((s) => s.id !== socket.id);
    io.emit('ship-move', game)
  })

  socket.on('move', (shipState) => {

    // console.log(shipState);

    game.forEach((ship, index) => {
      if (ship.id === shipState.id) {
        game[index] = {
          ...ship,
          ...shipState,
        }
      }
    })

    io.emit('ship-move', game)
  })
}



module.exports = socketHandler;