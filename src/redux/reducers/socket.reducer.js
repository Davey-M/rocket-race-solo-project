const socket = (state = null, action) => {

  if (action.type === 'SET_SOCKET') {
    return action.payload;
  }

  return state;
}

export default socket