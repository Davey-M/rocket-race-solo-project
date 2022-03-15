import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Race.css';

function Race() {
  // get the socket instance from the reducer
  const socket = useSelector((store) => store.socket);
  const user = useSelector((store) => store.user);

  const [game, setGame] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    socket?.on('test', (stuff) => {
      console.log(stuff);
    });

    socket?.on('update-game-state', (game) => {
      console.log(game);
      setGame(game);
    });

    socket?.on('game-start', () => {
      setGameStarted(true);
    });

    return () => {
      socket.removeAllListeners('test');
      socket.removeAllListeners('update-game-state');
      socket.removeAllListeners('game-start');
    };
  }, []);

  const handleGameStart = () => {
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
            <h1>time</h1>
          </div>
        </div>
        <div className='race-container'>
          <div>
            {gameStarted ? (
              <>
                {/* this is rendered if you are in a game and the game is started */}
                <div></div>
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
                        <button>Start Game</button>
                      )}
                    </>
                  ) : (
                    <>
                      {/* this is rendered if you are not in a game and it is not started */}
                      <div>
                        <button onClick={handleGameStart}>Start Game</button>
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
