import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Race.css';

function Race() {
  // get the socket instance from the reducer
  const socket = useSelector((store) => store.socket);
  const user = useSelector((store) => store.user);

  const [game, setGame] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    socket?.on('test', (stuff) => {
      console.log(stuff);
    });

    socket?.on('update-game-state', (game) => {
      console.log(game);
      setGame(game);
    });
  });

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
                <div></div>
              </>
            ) : (
              <>
                <div>
                  {game ? (
                    <>
                      <h1>Game Id: {game.game_id}</h1>
                      <ul>
                        <p>
                          <b>Players:</b>
                        </p>
                        {game.game.players.map((item, index) => {
                          return <li key={index}>{item.socket_id}</li>;
                        })}
                      </ul>
                    </>
                  ) : (
                    <>
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
