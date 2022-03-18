import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

function LeaderBoardView() {
  const dispatch = useDispatch();
  const history = useHistory();

  const leaderboard = useSelector((store) => store.leaderboard);

  useEffect(() => {
    dispatch({
      type: 'GET_LEADERBOARD',
    });
  }, []);

  const handleWinnerClick = (id) => {
    history.push(`/user/${id}`);
  };

  const handleCardClick = (id) => {
    history.push(`/race/${id}`);
  };

  // console.log(leaderboard);
  return (
    <>
      <div>
        {leaderboard.map((race, index) => {
          console.log(race);
          return (
            <p
              key={index}
              className='card'
              onClick={() => handleCardClick(race.race_id)}
            >
              <span>{race.time.split('T')[0]}</span>
              <span onClick={() => handleWinnerClick(race.user_id)}>
                {race.winner}
              </span>
              <span>{race.finish_time}</span>
            </p>
          );
        })}
      </div>
    </>
  );
}

export default LeaderBoardView;
