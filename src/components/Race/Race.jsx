import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './Race.css';

function Race() {
  const dispatch = useDispatch();

  const socket = useSelector((store) => store.socket);
  const game = useSelector((store) => store.game);

  const [player, setPlayer] = useState({
    x: 200,
    y: 200,
    rotation: 0,
  });
  // const player = {
  //   x: 200,
  //   y: 200,
  //   rotation: 0,
  // };
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
        setPlayer({
          id: socket?.id,
          x: Math.sin(player.rotation) * playerSpeed + player.x,
          y: Math.cos(player.rotation) * playerSpeed + player.y,
          rotation: player.rotation,
        });
        // player.x = Math.sin(player.rotation) * playerSpeed + player.x;
        // player.y = Math.cos(player.rotation) * playerSpeed + player.y;
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
            // if (racer.id === socket.id) return '';
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
