const race = (state = [], action) => {
  if (action.type === 'SET_RACE') {
    return action.payload;
  }

  return state;
}

export default race;