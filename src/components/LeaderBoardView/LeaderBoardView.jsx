import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './LeaderBoardView.css';

// component imports
import RaceCard from '../RaceCard/RaceCard';

function LeaderBoardView() {
  const dispatch = useDispatch();
  const history = useHistory();

  const leaderboard = useSelector((store) => store.leaderboard);

  useEffect(() => {
    dispatch({
      type: 'GET_LEADERBOARD',
    });
  }, []);

  const handleCardClick = (id) => {
    history.push(`/race/${id}`);
  };

  // console.log(leaderboard);
  return (
    <>
      <div className='leaderboard-container'>
        <h2 className='dark-back leaderboard-header'>Leaderboard</h2>
        {leaderboard.map((race, index) => {
          // console.log(race);
          const time = new Date(race.time);
          return (
            <RaceCard
              key={index}
              one={time.toLocaleDateString()}
              two={race.winner}
              three={race.finish_time + ' seconds'}
              player_id={race.user_id}
              click={() => handleCardClick(race.race_id)}
            />
          );
        })}
      </div>
    </>
  );
}

export default LeaderBoardView;
