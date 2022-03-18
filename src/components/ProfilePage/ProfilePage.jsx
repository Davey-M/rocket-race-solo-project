import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import './ProfilePage.css';

function ProfilePage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((store) => store.user);
  const id = useParams().id ? useParams().id : user.id;
  const profile = useSelector((store) => store.profile);

  useEffect(() => {
    console.log(id);
    dispatch({
      type: 'GET_PROFILE',
      payload: id,
    });

    return () => {
      dispatch({
        type: 'CLEAR_PROFILE',
      });
    };
  }, [location]);

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
          <div>
            {profile?.finish_time?.map((time, index) => {
              if (time == null) {
                return;
              }
              return (
                <p key={index} className='card'>
                  <span className='time'>{time}</span>
                  <span className='place'>{profile.place[index]}</span>
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
