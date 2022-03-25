import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import './Edit.css';

function Edit() {
  const dispatch = useDispatch();
  const history = useHistory();
  const edit = useSelector((store) => store.edit);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch({
      type: 'SAVE_EDIT',
      payload: edit,
    });

    // console.log('submitting');

    history.push('/user');
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

  const handleColor = (e) => {
    dispatch({
      type: 'SET_COLOR',
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
            rows={5}
            value={edit.about}
            onChange={handleAbout}
          ></textarea>
        </div>
        <p>Ship Color:</p>
        <div className='colorContainer'>
          <input
            type='range'
            min={0}
            max={360}
            value={edit.color}
            onChange={handleColor}
          />
          <div className='ship-color-demo'>
            <img
              src='shipColor.png'
              alt='Ship Color Image'
              style={{
                filter: `hue-rotate(${edit.color}deg)`,
              }}
            />
            <img
              className='overlay-image'
              src='ShipParts.png'
              alt='Ship Parts Image'
            />
          </div>
        </div>
        <div className='button-container'>
          <button type='submit'>Save</button>
          <button
            className='free red'
            type='button'
            onClick={() => {
              history.push('/user');
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default Edit;
