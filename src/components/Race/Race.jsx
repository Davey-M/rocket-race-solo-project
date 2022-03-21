import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function Race() {
  const socket = useSelector((store) => store.socket);
  const game = useSelector((store) => store.game);

  useEffect(() => {}, []);

  return (
    <>
      <div className='game-board'></div>
    </>
  );
}

export default Race;
