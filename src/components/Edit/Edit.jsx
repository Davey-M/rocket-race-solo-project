import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Edit.css';

function Edit() {
  const dispatch = useDispatch();
  const edit = useSelector((store) => store.edit);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch({
      type: 'SAVE_EDIT',
      payload: edit,
    });

    console.log('submitting');
  };

  const handleImage = (e) => {
    dispatch({
      type: 'SET_IMAGE',
      payload: e.target.value,
    });
  };

  const handleAbout = (e) => {
    dispatch({
      type: 'SET_ABOUT',
      payload: e.target.value,
    });
  };

  useEffect(() => {
    dispatch({
      type: 'GET_EDIT',
    });
    return () => {
      dispatch({
        type: 'CLEAR_EDIT',
      });
    };
  }, []);

  return (
    <div className='edit-container'>
      <h2 className='dark-back edit-header'>Edit Profile</h2>
      <form onSubmit={handleSubmit} className='edit-form'>
        <div>
          <p>
            <b>{edit.username}</b>
          </p>
        </div>
        <div>
          <p>Image URL:</p>
          <input
            type='text'
            placeholder='Image URL'
            value={edit.image}
            onChange={handleImage}
          />
        </div>
        <div className='long-section'>
          <p>About Me:</p>
          {/* <input type='text' placeholder='About' /> */}
          <textarea
            name=''
            id=''
            cols='30'
            rows='3'
            value={edit.about}
            onChange={handleAbout}
          ></textarea>
        </div>
        <div className='button-container'>
          <button type='submit'>Save</button>
          <button className='free red' type='button'>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default Edit;
