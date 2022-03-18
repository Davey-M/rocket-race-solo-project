import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import RaceCard from '../RaceCard/RaceCard';

function RaceDetails() {
  const dispatch = useDispatch();
  const id = useParams().id;
  const race = useSelector((store) => store.race);

  useEffect(() => {
    dispatch({
      type: 'GET_RACE',
      payload: id,
    });
  }, []);

  return (
    <>
      <h1>Race Details</h1>
      <p>{JSON.stringify(race)}</p>
      <div>
        {race.players &&
          race.players
            .sort((a, b) => a.sort - b.sort)
            .map((player, index) => {
              return (
                <RaceCard
                  key={index}
                  one={player.finish_time}
                  two={player.username}
                  three={player.place}
                />
              );
            })}
      </div>
    </>
  );
}

export default RaceDetails;
