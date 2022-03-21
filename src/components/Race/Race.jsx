import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './Race.css';

function Race() {
  const dispatch = useDispatch();

  const socket = useSelector((store) => store.socket);
  const game = useSelector((store) => store.game);

  const player = {
    x: 200,
    y: 200,
    rotation: 0,
  };
  const playerSpeed = 100;
  const turningSpeed = 10;

  // socket setup useEffect
  useEffect(() => {
    socket?.on('message', (m) => {
      console.log('message', m);
    });

    socket?.on('ship-move', (gameState) => {
      dispatch({
        type: 'SET_GAME',
        payload: gameState,
      });
    });

    return () => {
      socket?.removeAllListeners('message');
      socket?.removeAllListeners('ship-move');
    };
  }, [socket]);

  // keypress listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeys);

    return () => {
      window.removeEventListener('keydown', handleKeys);
    };
  }, []);

  function handleKeys(e) {
    // console.log(e.key);

    switch (e.key) {
      case 'ArrowUp':
        player.x = Math.sin(player.rotation) * player.x;
        return;
      default:
        return;
    }
  }

  return (
    <>
      {socket && (
        <div className='game-board'>
          <div
            className='ship me'
            style={{
              marginTop: player.x,
              marginLeft: player.y,
              transform: `rotate(${player.rotation}deg)`,
            }}
          ></div>
          {game?.map((racer) => {
            if (racer.id === socket.id) return '';
            return (
              <div
                className='ship'
                style={{
                  x: racer.x,
                  y: racer.y,
                  transform: `rotate(${racer.rotation}deg)`,
                }}
              ></div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Race;
