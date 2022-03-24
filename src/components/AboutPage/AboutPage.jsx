import React from 'react';

import './AboutPage.css';

import crowdedImg from './Crowded.jpg';
import raceImg from './Race.jpg';
import peaceImg from './Peace.jpg';
import gamePlayImg from './gameplay-screenshot.png';

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

function AboutPage() {
  return (
    <div className='about-container'>
      <section>
        <h1 className='blue-back about-header'>The Story</h1>
        <div className='content'>
          <div className='story-grid'>
            <p>
              You are an astronaut whose planet is becoming too crowded. You
              have to get out of here and find a new planet.
            </p>
            <img src={crowdedImg} alt='' />
            <img src={raceImg} alt='' />
            <p>
              The only problem is that you are not the only astronaut with this
              plan.
            </p>
            <p>
              Be the first to get to a new planet and you can have it all to
              yourself. Good luck!
            </p>
            <img src={peaceImg} alt='' />
          </div>
        </div>
      </section>
      <section>
        <h1 className='red-back about-header'>How To Play</h1>
        <div className='content'>
          <div className='story-grid'>
            <p>
              <ul>
                <li>The rocket moves automatically</li>
                <li>
                  Steer with "a" & "d" keys or use the right and left arrow keys
                </li>
                <li>
                  Hitting an asteroid will send you back to the start of the
                  race
                </li>
              </ul>
            </p>
            <img src={gamePlayImg} alt='' />
          </div>
        </div>
      </section>
      <section>
        <h1 className='dark-back about-header'>Acknowledgments</h1>
        <div className='content'>
          <p>Thank you.</p>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
