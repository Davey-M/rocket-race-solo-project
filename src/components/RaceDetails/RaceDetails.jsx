import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import RaceCard from '../RaceCard/RaceCard';

function RaceDetails() {
  const dispatch = useDispatch();
  const id = useParams().id;
  const race = useSelector((store) => store.race);
  const user = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({
      type: 'GET_RACE',
      payload: id,
    });
  }, []);

  return (
    <>
      <h2>{race.time}</h2>
      <h1>Winner: {race.winner}</h1>
      <div>
        <h2 className='dark-back header'>Players</h2>
        <div
          style={{
            backgroundColor: 'var(--blue-3)',
            padding: '10px',
          }}
        >
          {race.players
            ?.sort((a, b) => a.place - b.place)
            ?.map((player, index) => {
              // console.log(player);
              return (
                <RaceCard
                  key={index}
                  one={`${player.finish_time} seconds`}
                  two={player.username}
                  three={player.place}
                  player_id={player.user_id}
                />
              );
            })}
        </div>
      </div>
    </>
  );
}

export default RaceDetails;
