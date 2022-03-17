const leaderboard = (state = [], action) => {

  if (action.type === 'SET_LEADERBOARD') {
    return action.payload;
  }

  return state;
}

export default leaderboard;