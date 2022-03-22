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

  // const canvas = gameBoard.current;
  const board = gameBoard.current;
  // const context = canvas.getContext('2d');

  const blueRocket = document.createElement('img');
  blueRocket.src = './blue-ship.PNG';
  blueRocket.height = 50;

  const playerShip = document.createElement('div');
  playerShip.classList.add('ship');
  playerShip.appendChild(blueRocket);

  const stars = document.createElement('div');
  stars.classList.add('game-board-stars');
  board.appendChild(stars);

  board.appendChild(playerShip);

  // canvas.width = canvas.clientWidth;
  // canvas.height = canvas.clientHeight;

  let player = { x: 200, y: 1950, rotation: 0 };
  const rocketSpeed = 50;
  const rotationSpeed = 45;

  // console.log({ canvas, context });

  function draw() {
    // context.clearRect(0, 0, canvas.width, canvas.height);

    // context.fillStyle = 'red';
    // // context.fillRect(square.x, square.y, 50, 50);
    // context.drawImage(blueRocket, square.x, square.y, 30, 50);

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
    window.removeEventListener('keydown', handleTurn);
    clearInterval(moveInterval);
  });

  window.addEventListener('keydown', handleTurn);

  let moveInterval = setInterval(() => {
    player.x = Math.sin(player.rotation * 0.0174533) * rocketSpeed + player.x;
    player.y =
      Math.cos((player.rotation + 180) * 0.0174533) * rocketSpeed + player.y;

    if (player.x > 700 || player.x < 0 || player.y > 2000) {
      player.y = 1950;
      player.x = 200;
      player.rotation = 0;
    }

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

    draw();
  }

  // setInterval(() => {
  //   square.y -= 50;
  // }, 500);

  function logic() {}
}
