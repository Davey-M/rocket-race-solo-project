const profile = (state = {}, action) => {
  if (action.type === 'SET_PROFILE') {
    return action.payload;
  }
  else if (action.type === 'CLEAR_PROFILE') {
    return {};
  }

  return state
}

export default profile;