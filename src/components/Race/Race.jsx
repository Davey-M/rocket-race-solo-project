import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

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
        <canvas ref={gameBoard} className='game-board'></canvas>
      </div>
    </>
  );
}

export default Race;

function main(socket, gameBoard) {
  // exit if socket does not exist
  if (!socket || !gameBoard) return;

  const canvas = gameBoard.current;
  const context = canvas.getContext('2d');

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  let square = { x: 0, y: 0 };

  console.log({ canvas, context });

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'red';
    context.fillRect(square.x, square.y, 50, 50);

    window.requestAnimationFrame(draw);
  }
  draw();

  setInterval(() => {
    square.y += 50;
  }, 500);

  function logic() {}
}
