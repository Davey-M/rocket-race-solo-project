function profile(state = {}, action) {
  if (action.payload === 'SET_PROFILE') {
    return action.payload;
  }
  else if (action.payload === 'CLEAR_PROFILE') {
    return {};
  }

  return state
}