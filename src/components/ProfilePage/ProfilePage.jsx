import { useParams, useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import RaceCard from '../RaceCard/RaceCard';
import Modal from '../Modal/Modal';

import './ProfilePage.css';

function ProfilePage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const user = useSelector((store) => store.user);
  const id = useParams().id ? useParams().id : user.id;
  const profile = useSelector((store) => store.profile);

  // delete state
  const [deleteCheck, setDeleteCheck] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
          <p className='about-section'>
            {profile.about || (
              <span style={{ opacity: 0.3 }}>*No About Section*</span>
            )}
          </p>
        </div>
        <div className='races-container'>
          <h2 className='dark-back profile-header'>Recent Races</h2>
          <div className='races-scroll'>
            {profile?.finish_time?.map((time, index) => {
              if (time == null) {
                return;
              }

              const handleClick = () => {
                history.push(`/race/${profile.race_id[index]}`);
              };

              // console.log(time);
              return (
                <div className='profile-card-holder'>
                  <RaceCard
                    key={index}
                    one={time}
                    three={profile.place[index]}
                    click={handleClick}
                  />
                  {id === user.id && (
                    <h3
                      className='red delete-time'
                      onClick={() => {
                        const card_id = profile.card_id[index];
                        setDeleteId(card_id);
                        setDeleteCheck(true);
                      }}
                    >
                      X
                    </h3>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Modal
        open={deleteCheck}
        className='delete-modal'
        outerClass='delete-modal-outer'
      >
        <h1>Pizza Time!</h1>
        <p>You are deleting {deleteId}</p>
        <p>This cannot be undone</p>
        <div>
          <button>Delete</button>
          <div className='vert-gap'></div>
          <button className='free red' onClick={() => setDeleteCheck(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}

export default ProfilePage;
