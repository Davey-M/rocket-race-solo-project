import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import player from '../../redux/reducers/player.reducer';

import './Race.css';

function Race() {
  const gameBoard = useRef();

  const socket = useSelector((store) => store.socket);

  useEffect(() => {
    main(socket, gameBoard);
  }, [socket]);

  return (
    <>
      <div className='game-board-container'>
        {/* <canvas ref={gameBoard} className='game-board'></canvas> */}
        <div ref={gameBoard} className='game-board'></div>
      </div>
    </>
  );
}

export default Race;

function main(socket, gameBoard) {
  // exit if socket does not exist
  if (!socket || !gameBoard) return;

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

  let player = { x: 200, y: 1950, rotation: 0 };
  const rocketSpeed = 50;
  const rotationSpeed = 45;

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
  window.addEventListener('hashchange', () => {
    // clear the event listeners
    window.removeEventListener('keydown', handleTurn);

    // clear the moveInterval
    clearInterval(moveInterval);

    // remove the socket listeners
    socket.removeAllListeners('ship-move');

    // leave the game when we leave the page
    socket.emit('leave');
  });

  // set up socket listeners
  socket.on('ship-move', drawAllShips);

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
      player.y = 1950;
      player.x = 200;
      // player.rotation = 0;
    }

    draw();
  }, 300);

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

    draw();
  }

  // setInterval(() => {
  //   square.y -= 50;
  // }, 500);

  function drawAllShips(gameState) {
    console.log(gameState);
  }
}
