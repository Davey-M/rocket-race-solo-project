import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Race.css';

function Race() {
  const dispatch = useDispatch();
  // get the socket instance from the reducer
  const socket = useSelector((store) => store.socket);
  const user = useSelector((store) => store.user);

  // const [game, setGame] = useState(null);
  const game = useSelector((store) => store.game);
  const [time, setTime] = useState(0.0);
  const [inputValue, setInputValue] = useState('');

  let started = false;

  // this useEffect sets up the io listeners subscriptions
  useEffect(() => {
    socket?.on('test', (stuff) => {
      console.log(stuff);
    });

    // socket receives all the changes to the overall game state
    socket?.on('update-game-state', (game) => {
      console.log(game);
      // setGame(game);
      dispatch({
        type: 'SET_GAME',
        payload: game,
      });
    });

    // this socket sets the race clock
    socket?.on('update-race-clock', (clock) => {
      setTime(clock);
    });

    // on component unmount we unsubscribe from all the io listeners
    return () => {
      socket.removeAllListeners('test');
      socket.removeAllListeners('update-game-state');
      socket.removeAllListeners('game-start');
    };
  }, []);

  useEffect(() => {
    // setup the keydown listener
    window.addEventListener('keydown', handleGo);

    return () => {
      // unsubscribe from the keydown listener
      window.removeEventListener('keydown', handleGo);
    };
  }, [game]);

  const handleCreateGame = () => {
    socket.emit('create-game', {
      user_id: user.id,
      socket_id: socket.id,
      x: 0,
      y: 0,
    });
  };

  const handleJoinGame = () => {
    socket.emit('join-game', {
      game_id: inputValue,
      user_id: user.id,
      socket_id: socket.id,
      x: 0,
      y: 0,
    });
  };

  const handleStartGame = () => {
    socket.emit('start-game');
  };

  const handleGo = () => {
    if (started || Date.now() > game?.startTime) {
      started = true;

      console.log(game);
    }
  };

  const handleGameEnd = () => {
    socket.emit('finish-game', time);
  };

  return (
    <>
      <div className='race-view-container'>
        <div className='info-container'>
          <div className='spinner-container circle'>
            <div className='shade-container'></div>
            <div className='spinner'>
              <div></div>
            </div>
          </div>
          <div className='pointer'></div>
          <div className='time-container'>
            <h1>{time <= 0 ? Math.abs(Math.floor(time / 10)) : time / 10}</h1>
          </div>
        </div>
        <div className='race-container'>
          <div>
            {game?.started ? (
              <>
                {/* this is rendered if you are in a game and the game is started */}
                <div>
                  <button className='red' onClick={handleGameEnd}>
                    End Game
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  {game ? (
                    <>
                      {/* this is only rendered if you are already in a game but it is not started */}
                      <h1>Game Id: {game.game_id}</h1>
                      <ul>
                        <p>
                          <b>Players:</b>
                        </p>
                        {game.players.map((item, index) => {
                          return <li key={index}>{item.socket_id}</li>;
                        })}
                      </ul>
                      {/* this renders the start game button if you are the person who created the room
                      the logic to validate this person is done within the socket on the server */}
                      {game.players[0].socket_id === socket.id && (
                        <button onClick={handleStartGame}>Start Game</button>
                      )}
                    </>
                  ) : (
                    <>
                      {/* this is rendered if you are not in a game and it is not started */}
                      <div>
                        <button onClick={handleCreateGame}>Create Game</button>
                      </div>
                      <div>
                        <input
                          type='text'
                          placeholder='Game Code'
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button onClick={handleJoinGame}>Join Game</button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Race;
