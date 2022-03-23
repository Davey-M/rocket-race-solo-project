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
      setFinished(true);
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
      gameCode: gameCodeValue,
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
                if (!a.finishTime || !b.finishTime) return 100;

                return a.finishTime - b.finishTime;
              })
              .map((p, index) => {
                return (
                  <p key={index}>
                    {p.username} {index + 1}
                  </p>
                );
              })}
          </div>
        </div>
      ) : (
        <>
          {started ? (
            <div className='game-board-container'>
              <div ref={gameBoard} className='game-board'>
                <canvas id='test-canvas' className='game-board canvas'></canvas>
              </div>
            </div>
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

  const redRocket = document.createElement('img');
  redRocket.src = './red-ship.png';
  redRocket.height = 50;

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
  let moveInterval = setInterval(() => {
    // set the x and y positions of the player
    player.x = Math.sin(player.rotation * 0.0174533) * rocketSpeed + player.x;
    player.y =
      Math.cos((player.rotation + 180) * 0.0174533) * rocketSpeed + player.y;

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

    let players = gameState.players.filter((p) => p.id !== socket.id);

    for (let player of players) {
      let playerElement = document.getElementById(player.id);

      if (playerElement) {
        playerElement.style.marginLeft = `${player.x}px`;
        playerElement.style.marginTop = `${player.y}px`;
        playerElement.style.transform = `rotate(${player.rotation}deg)`;
      } else {
        let p = document.createElement('div');
        p.classList.add('ship');
        p.appendChild(redRocket);
        p.id = player.id;

        board.appendChild(p);
      }
    }
  }

  function setupAsteroids() {
    initialGameState.asteroids.forEach((asteroid, index) => {
      let aElement = document.createElement('div');
      aElement.classList.add('asteroid');
      aElement.style.marginLeft = `${asteroid[5].x}px`;
      aElement.style.marginTop = `${asteroid[5].y + index * 100}px`;

      asteroidDOM.push({
        asteroid: aElement,
        x: asteroid[5].x,
        y: asteroid[5].y + index * 100,
      });

      board.appendChild(aElement);
    });
  }

  function moveAsteroids() {
    if (asteroidDOM.length === 0) {
      setupAsteroids();
    }

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

  let collisionCheckRate = 1000 / 24;
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

      // testContext.fillStyle = 'blue';
      // testContext.fillRect(playerSpot.x, playerSpot.y, 30, 30);
      // testContext.fillStyle = 'red';

      for (let a of asteroidDOM) {
        let position = {
          x: Number(
            window.getComputedStyle(a.asteroid)['margin-left'].split('px')[0],
          ),
          y: Number(
            window.getComputedStyle(a.asteroid)['margin-top'].split('px')[0],
          ),
        };

        // testContext.fillRect(position.x - 25, position.y - 25, 50, 50);

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
      (a.x >= b.x - 25 &&
        a.x <= b.x + 25 &&
        a.y >= b.y - 25 &&
        a.y <= b.y + 25) ||
      (a.x + 30 >= b.x - 25 &&
        a.x + 30 <= b.x + 25 &&
        a.y + 30 >= b.y - 25 &&
        a.y + 30 <= b.y + 25)
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
