import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

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
      <h1>Race Details {JSON.stringify(race)}</h1>
    </>
  );
}

export default RaceDetails;
