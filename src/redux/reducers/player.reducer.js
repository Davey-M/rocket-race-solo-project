const player = (state = {
  x: 200,
  y: 1950,
  rotation: 0,
}, action) => {

  if (action.type === 'SET_PLAYER') {
    return action.payload;
  }

  return state;
}

export default player;