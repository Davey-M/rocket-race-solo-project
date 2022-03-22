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

  const [started, setStarted] = useState(false);

  useEffect(() => {
    // when this component unmounts leave the game
    return () => {
      socket?.emit('leave');
    };
  }, []);

  const [player, setPlayer] = useState({
    x: 200,
    y: 1950,
    rotation: 0,
  });
  const playerSpeed = 50;
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
          x: Math.sin(player.rotation * 0.0174533) * playerSpeed + player.x,
          y:
            Math.cos((player.rotation - 180) * 0.0174533) * playerSpeed +
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

  const createGame = () => {
    socket?.emit('create-game');
  };

  return (
    <>
      {socket && (
        <>
          {!started ? (
            <div>
              <div>
                <button onClick={createGame}>Create Game</button>
                <div>
                  <input type='text' placeholder='Enter Game Code' />
                  <button>Join Game</button>
                </div>
              </div>
            </div>
          ) : (
            <div className='game-board-container'>
              <div
                className='game-board'
                style={{
                  marginBottom: player.y < 1600 ? -1 * (1600 - player.y) : 0,
                }}
              >
                <div
                  className='game-board-stars'
                  style={{
                    marginBottom:
                      player.y < 1600 ? (-1 * player.y) / 2 : (-1 * 1600) / 2,
                  }}
                ></div>
                {game?.map((racer, index) => {
                  if (racer.id === socket.id) return '';
                  console.log(racer);
                  return (
                    <div
                      key={index}
                      className='ship'
                      style={{
                        marginLeft: racer.x + 'px',
                        marginTop: racer.y + 'px',
                        transform: `rotate(${racer.rotation}deg)`,
                      }}
                    >
                      <img src={redShip} alt='' />
                    </div>
                  );
                })}
                <div
                  className='ship me'
                  style={{
                    marginLeft: player.x + 'px',
                    marginTop: player.y + 'px',
                    transform: `rotate(${player.rotation}deg)`,
                  }}
                >
                  <img src={blueShip} alt='' />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Race;
