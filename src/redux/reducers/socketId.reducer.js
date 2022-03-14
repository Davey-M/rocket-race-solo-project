function socketId(state = '', action) {

  if (action.type === 'SET_SOCKET_ID') {
    return action.payload;
  }

  return state;
}

export default (socketId);