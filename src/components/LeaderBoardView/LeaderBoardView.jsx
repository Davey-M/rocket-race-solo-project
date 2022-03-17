import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function LeaderBoardView() {
  const dispatch = useDispatch();

  const leaderboard = useSelector((store) => store.leaderboard);

  useEffect(() => {
    dispatch({
      type: 'GET_LEADERBOARD',
    });
  }, []);

  // console.log(leaderboard);
  return (
    <>
      <div>
        {leaderboard.map((race, index) => {
          return (
            <p key={index} className='card'>
              <span>{race.time.split('T')[0]}</span>
              <span>{race.winner}</span>
              <span>{race.finish_time}</span>
            </p>
          );
        })}
      </div>
    </>
  );
}

export default LeaderBoardView;
