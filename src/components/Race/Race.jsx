import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './Race.css';

// ship image imports
import blueShip from './blue-ship.png';
import redShip from './red-ship.png';

function Race() {
  const dispatch = useDispatch();

  const socket = useSelector((store) => store.socket);
  const game = useSelector((store) => store.game);

  const [player, setPlayer] = useState({
    x: 200,
    y: 200,
    rotation: 0,
  });
  let playerLocal = {
    x: 200,
    y: 200,
    rotation: 0,
  };
  const playerSpeed = 100;
  const turningSpeed = 45;

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

    setPlayer({
      ...player,
      id: socket?.id,
    });

    return () => {
      socket?.removeAllListeners('message');
      socket?.removeAllListeners('ship-move');
    };
  }, [socket]);

  // keypress listener
  useEffect(() => {
    socket?.emit('move', player);

    window.addEventListener('keydown', handleKeys);

    return () => {
      window.removeEventListener('keydown', handleKeys);
    };
  }, [player]);

  const handleKeys = (e) => {
    // console.log(player);
    switch (e.key) {
      case 'ArrowUp':
        setPlayer({
          ...player,
          x:
            Math.sin((player.rotation - 90) * 0.0174533) * playerSpeed +
            player.x,
          y:
            Math.cos((player.rotation - 90) * 0.0174533) * playerSpeed +
            player.y,
        });
        // playerLocal.x = Math.sin(player.rotation) * playerSpeed + player.x;
        // playerLocal.y = Math.cos(player.rotation) * playerSpeed + player.y;
        break;
      case 'ArrowRight':
        setPlayer({
          ...player,
          rotation: player.rotation + turningSpeed,
        });
        break;
      case 'ArrowLeft':
        setPlayer({
          ...player,
          rotation: player.rotation - turningSpeed,
        });
        break;
      default:
        break;
    }
  };

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
          >
            <img src={blueShip} alt='' />
          </div>
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
              >
                <img src={redShip} alt='' />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Race;
