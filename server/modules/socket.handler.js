let test = []

function socketHandler(socket, io) {
  // console.log(socket.id);

  test.push(socket.id);


  socket.conn.on('close', () => {
    // console.log(socket.id, 'Disconnected');
    test = test.filter(item => item !== socket.id);
  })
}

module.exports = socketHandler;