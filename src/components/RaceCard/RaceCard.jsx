import { useHistory } from 'react-router-dom';
import './RaceCard.css';

function RaceCard({ one, two, three, player_id, click = null }) {
  const history = useHistory();

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
      <p className='section one'>{one}</p>
      <p className='section two' onClick={goToId}>
        {two}
      </p>
      <p className='section three'>{three}</p>
    </div>
  );
}

export default RaceCard;
