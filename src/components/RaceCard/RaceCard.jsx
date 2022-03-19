import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './RaceCard.css';

import Modal from '../Modal/Modal';

function RaceCard({ one, two, three, player_id, click = null, del = false }) {
  const history = useHistory();

  const [openDelete, setOpenDelete] = useState(false);

  const goToId = () => {
    history.push(`/user/${player_id}`);
  };

  return (
    <div
      className={click ? 'card race-card clickable-card' : 'card race-card'}
      onClick={(e) => {
        // console.log(e.nativeEvent.target.classList.contains('two'));
        let check = e.nativeEvent.target.classList.contains('two');
        if (!check && click) {
          click();
        }
      }}
    >
      <Modal open={openDelete} className='delete-modal'>
        <h1>POP!</h1>
        <p>It's gone now.</p>
        <button>Delete</button>
        <div className='vert-gap'></div>
        <button className='red free' onClick={() => setOpenDelete(false)}>
          Cancel
        </button>
      </Modal>
      <p className='section one'>{one}</p>
      <p className='section two' onClick={goToId}>
        {two}
      </p>
      {del && (
        <button className='free red' onClick={() => setOpenDelete(true)}>
          DELETE TIME
        </button>
      )}
      <p className='section three'>{three}</p>
    </div>
  );
}

export default RaceCard;
