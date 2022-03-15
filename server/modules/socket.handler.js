function socketHandler(socket) {
  // console.log(socket.id);

  socket.conn.on('close', () => {
    console.log(socket.id, 'Disconnected');
  })
}

module.exports = socketHandler;