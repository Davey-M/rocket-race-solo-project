const edit = (state = {
  username: '',
  image: '',
  about: '',
  color: 201,
}, action) => {

  switch (action.type) {
    case 'SET_IMAGE':
      return { ...state, image: action.payload };
    case 'SET_ABOUT':
      return { ...state, about: action.payload };
    case 'SET_COLOR':
      return { ...state, color: action.payload };
    case 'SET_EDIT':
      return action.payload;
    case 'CLEAR_EDIT':
      return {
        username: '',
        image: '',
        about: '',
      };
    default:
      return state;
  }
}

export default edit;