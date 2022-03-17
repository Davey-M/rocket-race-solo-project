const game = (state = null, action) => {

  if (action.type === 'SET_GAME') {
    return action.payload;
  }

  return state;
}

export default game;