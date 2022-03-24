import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import './Race.css';

function Race() {
  const history = useHistory();

  // refs
  const gameBoard = useRef();

  const socket = useSelector((store) => store.socket);
  const user = useSelector((store) => store.user);

  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [game, setGame] = useState(null);

  const [gameCodeValue, setGameCodeValue] = useState('');

  useEffect(() => {
    socket?.on('race-finished', (game) => {
      // setFinished(true);
      if (game.players.filter((s) => s.id === socket.id)[0].finishTime) {
        setFinished(true);
      }
      setGame(game);
    });

    socket?.on('game-joined', (game) => {
      setGame(game);
    });

    socket?.on('game-started', (game) => {
      console.log('in game-started');
      setGame(game);
      setStarted(true);
    });

    return () => {
      socket?.removeAllListeners('race-finished');
      socket?.removeAllListeners('game-joined');
      socket?.removeAllListeners('game-started');
    };
  }, [socket]);

  useEffect(() => {
    if (!started) return;

    main(socket, gameBoard, user, game);
  }, [socket, gameBoard, started]);

  const handleGameStart = () => {
    socket?.emit('start-game');
  };

  const handleGameCreate = () => {
    socket?.emit('create-game', {
      id: socket.id,
      username: user.username,
      x: 200,
      y: 1950,
      rotation: 0,
    });
  };

  const handleGameJoin = () => {
    // console.log({
    //   gameCode: gameCodeValue,
    //   id: socket.id,
    //   username: user.username,
    //   x: 200,
    //   y: 1950,
    //   rotation: 0,
    // });
    socket?.emit('join-game', {
      gameCode: gameCodeValue.toLowerCase(),
      playerState: {
        id: socket.id,
        username: user.username,
        x: 200,
        y: 1950,
        rotation: 0,
      },
    });
  };

  const goToHome = () => {
    history.push('/home');
  };

  console.log({ game });
  return (
    <>
      {finished ? (
        <div>
          <h1>Finished</h1>
          <button onClick={goToHome}>New Game</button>
          <div>
            {game.players
              .sort((a, b) => {
                if (a.finishTime === undefined) {
                  return 1;
                }
                if (b.finishTime === undefined) {
                  return -1;
                }
                return a.finishTime - b.finishTime;
              })
              .map((p, index) => {
                return (
                  <p key={index}>
                    {p?.finishTime &&
                      ((p.finishTime - game.startTime) / 1000).toFixed(3)}{' '}
                    {p.username} {index + 1}
                  </p>
                );
              })}
          </div>
        </div>
      ) : (
        <>
          {started ? (
            <>
              <div className='game-container'>
                <div className='game-board-container'>
                  <div ref={gameBoard} className='game-board'>
                    <canvas
                      id='test-canvas'
                      className='game-board canvas'
                    ></canvas>
                  </div>
                </div>
                <div
                  id='positionContainer'
                  className='position-container'
                ></div>
                <div className='timer-container'>
                  <h1 id='timer'>0.00</h1>
                </div>
              </div>
            </>
          ) : (
            <>
              <button onClick={handleGameCreate}>Create Game</button>

              <div>
                <input
                  type='text'
                  placeholder='Game Code'
                  value={gameCodeValue}
                  onChange={(e) => setGameCodeValue(e.target.value)}
                />
                <button onClick={handleGameJoin}>Join Game</button>
              </div>

              {game && (
                <>
                  <h1>{game.gameCode}</h1>
                  {game.players[0].id === socket.id && (
                    <button onClick={handleGameStart}>Start Game</button>
                  )}
                  <div>
                    {game?.players.map((p, index) => {
                      return <p key={index}>{p.username}</p>;
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export default Race;

function main(socket, gameBoard, user, initialGameState) {
  // exit if socket does not exist
  if (!socket || !gameBoard.current) return;

  // the gameBoard DOM reference
  const board = gameBoard.current;

  // setup the images we will use
  const blueRocket = document.createElement('img');
  blueRocket.src = './blue-ship.png';
  blueRocket.height = 50;

  function getRedRocket() {
    const redRocket = document.createElement('img');
    redRocket.src = './red-ship.png';
    redRocket.height = 50;
    return redRocket;
  }

  // setup the player ship on the dom
  const playerShip = document.createElement('div');
  playerShip.classList.add('ship');
  playerShip.appendChild(blueRocket);

  // setup the stars background DOM reference
  const stars = document.createElement('div');
  stars.classList.add('game-board-stars');
  board.appendChild(stars);

  // put the player on the game board
  board.appendChild(playerShip);

  // setup test code
  const testCanvas = document.getElementById('test-canvas');
  const testContext = testCanvas.getContext('2d');

  testCanvas.width = 700;
  testCanvas.height = 2000;

  const timerDeltaTime = Date.now();
  const timerFramerate = 1000 / 20;

  const timer = document.getElementById('timer');
  function runTimer() {
    if (Date.now() - timerDeltaTime > timerFramerate) {
      let time = Date.now() - initialGameState.startTime;

      if (time < 0) {
        timer.textContent = Math.abs(Math.floor(time / 1000));
      } else {
        timer.textContent = (time / 1000).toFixed(2);
      }
    }

    window.requestAnimationFrame(runTimer);
  }
  runTimer();

  // SETUP NAMES
  const players = [];
  const positionContainer = document.getElementById('positionContainer');

  for (let p of initialGameState.players) {
    const pElement = document.createElement('p');
    pElement.classList.add('place-marker');
    pElement.textContent = '-' + p.username;

    if (p.id === socket.id) {
      pElement.style.color = 'var(--blue-1)';
    } else {
      pElement.style.color = 'var(--red-1)';
    }

    positionContainer.appendChild(pElement);

    players.push(pElement);
  }
  // SETUP NAMES

  testContext.fillStyle = 'red';
  // setup test code

  let player = {
    id: socket.id,
    username: user.username,
    x: 200,
    y: 1950,
    rotation: 0,
  };
  const rocketSpeed = 50;
  const rotationSpeed = 45;

  // this array contains the list of asteroids that will be on the screen
  let asteroidDOM = [];

  // this is used to figure out which movement pattern we are using.
  let asteroidIndex = 0;

  // the draw function will move the ships whenever needed
  function draw() {
    playerShip.style.marginLeft = `${player.x}px`;
    playerShip.style.marginTop = `${player.y}px`;
    playerShip.style.transform = `rotate(${player.rotation}deg)`;

    if (player.y < 1600) {
      board.style.marginBottom = `${-1 * (1600 - player.y)}px`;
      stars.style.marginBottom = `${(-1 * player.y) / 2}px`;
    } else {
      board.style.marginBottom = `0px`;
      stars.style.marginBottom = '-800px';
    }
    // window.requestAnimationFrame(draw);
  }
  draw();

  // remove the event listener when we leave the page
  window.addEventListener('hashchange', removeListeners);
  window.addEventListener('beforeunload', removeListeners);

  // set up socket listeners
  socket.on('ship-move', drawAllShips);

  // socket.emit('join-game', {
  //   gameCode: 'room',
  //   playerState: player,
  // });

  // set up window listeners
  window.addEventListener('keydown', handleTurn);

  // the move interval is responsible for moving the ship when needed
  let moveInterval;
  setupAsteroids();

  function setupGameLoop() {
    if (Date.now() - initialGameState.startTime < 0) {
      window.requestAnimationFrame(setupGameLoop);
    } else {
      moveInterval = setInterval(() => {
        if (Date.now() - initialGameState.startTime < 0) {
          if (asteroidDOM.length === 0) {
            setupAsteroids();
          }
          return;
        }

        // set the x and y positions of the player
        player.x =
          Math.sin(player.rotation * 0.0174533) * rocketSpeed + player.x;
        player.y =
          Math.cos((player.rotation + 180) * 0.0174533) * rocketSpeed +
          player.y;

        // if the player is out of bounds reset their ship
        if (player.x > 700 || player.x < 0 || player.y > 2000) {
          transportPlayerToStart();
          // player.y = 1950;
          // player.x = 200;
          // player.rotation = 0;
        } else if (player.y < -50) {
          socket.emit('finish-game', {
            id: socket.id,
            username: user.username,
            user_id: user.id,
            finishTime: Date.now(),
          });

          clearInterval(moveInterval);
          return true;
        }

        moveAsteroids();

        socket.emit('move', player);

        draw();
      }, 400);
    }
  }
  setupGameLoop();

  function handleTurn(e) {
    switch (e.key) {
      case 'ArrowRight':
        player.rotation += rotationSpeed;
        break;
      case 'ArrowLeft':
        player.rotation -= rotationSpeed;
        break;
      case 'd':
        player.rotation += rotationSpeed;
        break;
      case 'a':
        player.rotation -= rotationSpeed;
        break;
      default:
        break;
    }

    socket.emit('move', player);

    draw();
  }

  // setInterval(() => {
  //   square.y -= 50;
  // }, 500);

  function drawAllShips(gameState) {
    // console.log(gameState);

    let players = gameState.players; //.filter((p) => p.id !== socket.id);

    players.forEach((player, index) => {
      if (player.id === socket.id) {
        setNameMarker(player.y, index);
      } else {
        let playerElement = document.getElementById(player.id);

        if (playerElement) {
          playerElement.style.marginLeft = `${player.x}px`;
          playerElement.style.marginTop = `${player.y}px`;
          playerElement.style.transform = `rotate(${player.rotation}deg)`;
        } else {
          let p = document.createElement('div');
          p.classList.add('ship');
          p.appendChild(getRedRocket());
          p.id = player.id;

          // console.log(p);

          board.appendChild(p);
        }
        setNameMarker(player.y, index);
      }
    });
  }

  function setNameMarker(position, index) {
    players[index].style.marginTop = `${(position * 90) / 2000}vh`;
  }

  function setupAsteroids() {
    initialGameState.asteroids.forEach((asteroid, index) => {
      let aElement = document.createElement('div');
      aElement.classList.add('asteroid');
      aElement.style.marginLeft = `${asteroid[5].x}px`;
      aElement.style.marginTop = `${asteroid[5].y + index * 100}px`;

      aElement.style.animationDuration = `${
        Math.floor(Math.random() * 30) + 10
      }s`;

      asteroidDOM.push({
        asteroid: aElement,
        x: asteroid[5].x,
        y: asteroid[5].y + index * 100,
      });

      board.appendChild(aElement);
    });
  }

  function moveAsteroids() {
    if (asteroidIndex >= 5) {
      asteroidIndex = 0;
    }

    initialGameState.asteroids.forEach((asteroid, index) => {
      // console.log(asteroidDOM);
      // console.log(asteroid[asteroidIndex]);
      let dom = asteroidDOM[index];

      let movement = asteroid[asteroidIndex];

      dom.x += movement.x;
      dom.y += movement.y;

      dom.asteroid.style.marginLeft = `${dom.x}px`;
      dom.asteroid.style.marginTop = `${dom.y}px`;

      if (dom.x > 700) {
        dom.x = -100;
      }

      if (dom.y > 1900) {
        dom.y = -100;
      }

      // if (checkCollision(player, dom) === true) {
      //   console.log('BOOOM');
      //   transportPlayerToStart();
      // }
    });

    asteroidIndex++;
  }

  function transportPlayerToStart() {
    player.y = 1950;
    player.x = 200;

    draw();
  }

  let collisionCheckRate = 1000 / 10;
  let collisionDeltaTime = Date.now();
  function watchAstroidCollisions() {
    if (Date.now() - collisionDeltaTime > collisionCheckRate) {
      collisionDeltaTime = Date.now();

      testContext.clearRect(0, 0, testCanvas.width, testCanvas.height);

      let playerSpot = {
        x: Number(
          window.getComputedStyle(playerShip)['margin-left'].split('px')[0],
        ),
        y:
          Number(
            window.getComputedStyle(playerShip)['margin-top'].split('px')[0],
          ) + 10,
      };

      testContext.fillStyle = 'blue';
      testContext.fillRect(playerSpot.x, playerSpot.y, 30, 30);

      for (let a of asteroidDOM) {
        let position = {
          x: Number(
            window.getComputedStyle(a.asteroid)['margin-left'].split('px')[0],
          ),
          y: Number(
            window.getComputedStyle(a.asteroid)['margin-top'].split('px')[0],
          ),
        };

        testContext.fillStyle = 'red';
        testContext.fillRect(position.x, position.y, 50, 50);

        if (checkCollision(playerSpot, position) === true) {
          transportPlayerToStart();
        }
      }
    }
    // console.log(playerSpot);
    window.requestAnimationFrame(watchAstroidCollisions);
  }
  watchAstroidCollisions();

  // a is a point and b is a box with a width and height of 50
  // we will be checking whether or not a is inside b
  function checkCollision(a, b) {
    return (
      (a.x >= b.x && a.x <= b.x + 50 && a.y >= b.y && a.y <= b.y + 50) ||
      (a.x + 30 >= b.x &&
        a.x + 30 <= b.x + 50 &&
        a.y + 30 >= b.y &&
        a.y + 30 <= b.y + 50)
    );
  }

  function removeListeners() {
    // clear the event listeners
    window.removeEventListener('keydown', handleTurn);

    // clear the moveInterval
    clearInterval(moveInterval);

    // remove the socket listeners
    socket.removeAllListeners('ship-move');

    // leave the game when we leave the page
    socket.emit('leave');
  }
}
