import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import './Race.css';

function Race() {
  const dispatch = useDispatch();
  const history = useHistory();
  // get the socket instance from the reducer
  const socket = useSelector((store) => store.socket);
  const user = useSelector((store) => store.user);

  const [spinAngle, setSpinAngle] = useState(90);

  // const [game, setGame] = useState(null);
  const game = useSelector((store) => store.game);
  const [time, setTime] = useState(0.0);
  const [inputValue, setInputValue] = useState('');
  // const [y, setY] = useState(0);
  let y = 0;
  // let nextClickTime = 0;
  const [nextClickTime, setNextClickTime] = useState(0);
  const [clickAvailable, setClickAvailable] = useState(false);
  const [shine, toggleShine] = useState('shine');

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
      setTime(clock.raceClock);
      // nextClickTime.shift(clock.clickIntervalClock);
      // console.log(clock.clickIntervalClock);
      setNextClickTime(clock.clickIntervalClock);
      // clickAvailable = clock.available;
      if (clickAvailable === false) {
        setClickAvailable(clock.available);
      }
      setSpinAngle(((Date.now() - clock.clickIntervalClock) / 360) * 125 - 90);
    });

    // on component unmount we unsubscribe from all the io listeners
    return () => {
      socket.removeAllListeners('test');
      socket.removeAllListeners('update-game-state');
      socket.removeAllListeners('game-start');
    };
  }, []);

  useEffect(() => {
    let player = game?.players.filter((p) => p.socket_id === socket.id)[0];
    let newY = player?.y;
    // setY(newY);
    y = newY;

    if (y >= 4000 && player?.place == null) {
      console.log('finishing');
      handleGameEnd();
    }

    // setup the keydown listener
    if (!player?.place) window.addEventListener('keydown', handleGo);
    return () => {
      // unsubscribe from the keydown listener
      window.removeEventListener('keydown', handleGo);
    };
  }, [game, nextClickTime]);

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
    // console.log(clickAvailable);
    if (started || Date.now() > game?.startTime) {
      if (!started) started = true;

      // if (y >= 4000) {
      //   handleGameEnd();
      // }

      // console.log({ nextClickTime: nextClickTime });

      // let jump = 0;
      let jump = Math.abs(Date.now() - nextClickTime);

      socket.emit('update-player-position', y + 400 - jump);

      toggleShine('shine');
      // setClickAvailable(false);
      // console.log(game);
    }
  };

  const handleGameEnd = () => {
    socket.emit('finish-game', time);
  };

  const resetGame = () => {
    dispatch({
      type: 'SET_GAME',
      payload: null,
    });
    history.push('/');
  };

  return (
    <>
      <div className='race-view-container'>
        <div className='info-container'>
          <div className='spinner-container circle'>
            <div className='shade-container'></div>
            <div
              className='spinner'
              style={{
                transform: `rotate(${spinAngle}deg)`,
              }}
            >
              <div className={shine}></div>
            </div>
          </div>
          <div className='pointer'></div>
          <div className='time-container'>
            <h1>
              {time <= 0
                ? Math.abs(Math.floor(time / 100))
                : (time / 100).toFixed(2)}
            </h1>
          </div>
        </div>
        <div className='race-container'>
          {game?.started ? (
            <div
              className='game-board'
              style={{
                marginBottom:
                  -1 *
                    game?.players.filter((p) => p.socket_id === socket.id)[0]
                      .y +
                  window.innerHeight / 4,
              }}
            >
              {/* this is rendered if you are in a game and the game is started */}
              {game?.players.map((player, index) => {
                return (
                  <div
                    key={index}
                    className={
                      'rocket' + (player.socket_id === socket.id ? ' me' : '')
                    }
                    style={{
                      marginBottom: player.y,
                      left: index * 110,
                    }}
                  ></div>
                );
              })}
            </div>
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
    </>
  );
}

export default Race;
