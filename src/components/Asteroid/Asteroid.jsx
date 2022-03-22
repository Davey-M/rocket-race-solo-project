import { useEffect, useState } from 'react';

function Asteroid({ asteroid, startingTop }) {
  let startingPos = asteroid[5];
  let movements = asteroid.filter((a, index) => index !== 5);

  const [position, setPosition] = useState(startingPos);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setPosition({
        x: position.x + movements[step].x,
        y: position.x + movements[step].y,
      });

      if (position.x >= 700) {
        setPosition({
          ...position,
          x: -120,
        });
      }

      setStep(step + 1);
      if (step >= 4) setStep(0);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [position, step]);

  return (
    <div
      className='asteroid'
      style={{
        marginLeft: position.x,
        marginTop: position.y + startingTop,
      }}
    ></div>
  );
}

export default Asteroid;
