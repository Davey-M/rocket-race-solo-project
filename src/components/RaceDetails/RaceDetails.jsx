import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// css file
import './RaceDetails.css';

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

  const labelPosition = (place) => {
    switch (place) {
      case 1:
        return `${place}st`;
      case 2:
        return `${place}nd`;
      case 3:
        return `${place}rd`;
      default:
        return `${place}th`;
    }
  };

  return (
    <>
      <div className='race-detail-details'>
        <div>
          {(() => {
            // this functions formats the time it is invoked immediately

            // split the time and the date
            let splitTime = race.time.split('T').join('Z').split('Z');

            // the time is the second part of the split time
            let timer = splitTime[1].split(':');

            // change to am/pm from army time
            let amPm = Number(timer[0]) > 12 ? 'PM' : 'AM';
            let hour = Number(timer[0]) > 12 ? Number(timer[0]) - 12 : timer[0];
            let time = `${hour}:${timer[1]} ${amPm}`;

            return (
              <>
                <p>{splitTime[0]}</p>
                <p>{time}</p>
              </>
            );
          })()}
        </div>
        <h1>
          Winner: <u>{race.winner}</u>
        </h1>
      </div>
      <div className='race-detail-container'>
        <h2 className='dark-back header'>Players</h2>
        <div className='race-detail-list'>
          {race.players
            ?.sort((a, b) => a.place - b.place)
            ?.map((player, index) => {
              // console.log(player);
              return (
                <RaceCard
                  key={index}
                  one={`${player.finish_time} seconds`}
                  two={player.username}
                  three={labelPosition(player.place)}
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
