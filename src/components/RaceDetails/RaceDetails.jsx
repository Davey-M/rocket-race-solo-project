import { useParams } from 'react-router-dom';

function RaceDetails() {
  const id = useParams().id;

  return (
    <>
      <h1>Race Details {id}</h1>
    </>
  );
}

export default RaceDetails;
