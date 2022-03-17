import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import './ProfilePage.css';

function ProfilePage() {
  const dispatch = useDispatch();
  const id = useParams().id;
  const profile = useSelector((store) => store.profile);

  useEffect(() => {
    dispatch({
      type: 'GET_PROFILE',
      payload: id,
    });
  }, []);

  return (
    <>
      <div className='profile-container'>
        <div className='image-container'>
          <div className='circle blue-back profile-image'></div>
        </div>
        <div className='profile-info-container'>
          <h1>{profile?.username}</h1>
          <div className='line blue-back'></div>
          <p>{profile.about || 'Nothing here'}</p>
        </div>
        <div className='races-container'>
          <h2 className='dark-back'>Recent Races</h2>
          <div>{}</div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
