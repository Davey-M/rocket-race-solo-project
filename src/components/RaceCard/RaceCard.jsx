import './RaceCard.css';

function RaceCard({ one, two, three }) {
  return (
    <div className='race-card'>
      <p className='section one'>{one}</p>
      <p className='section two'>{two}</p>
      <p className='section three'>{three}</p>
    </div>
  );
}

export default RaceCard;
