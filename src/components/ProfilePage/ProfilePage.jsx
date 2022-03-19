import { useParams, useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import RaceCard from '../RaceCard/RaceCard';

import './ProfilePage.css';

function ProfilePage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

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
          <div className='circle blue-back profile-image'>
            {profile.img && <img src={profile.img} alt='Profile Image' />}
          </div>
        </div>
        <div className='profile-info-container'>
          <h1>{profile?.username}</h1>
          <div className='line blue-back'></div>
          <p>
            {profile.about || (
              <span style={{ opacity: 0.3 }}>*No About Section*</span>
            )}
          </p>
        </div>
        <div className='races-container'>
          <h2 className='dark-back profile-header'>Recent Races</h2>
          <div>
            {profile?.finish_time?.map((time, index) => {
              if (time == null) {
                return;
              }

              const handleClick = () => {
                history.push(`/race/${profile.race_id[index]}`);
              };

              // console.log(time);
              return (
                <RaceCard
                  key={index}
                  one={time}
                  three={profile.place[index]}
                  click={handleClick}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
