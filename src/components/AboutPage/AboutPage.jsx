import React from 'react';

import './AboutPage.css';

import crowdedImg from './Crowded.jpg';
import raceImg from './Race.jpg';
import peaceImg from './Peace.jpg';
import gamePlayImg from './in-progress-race.png';

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
                  Steer with "a" & "d" keys or use the "right" & "left" arrow
                  keys
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
          <div>
            <h3>Thank You:</h3>
            <ul>
              <li>Prime Digital Academy</li>
              <li>Liz Kerber</li>
              <li>The Adams Cohort</li>
              <li>My Family</li>
              <li>Monica</li>
            </ul>
            <p>I could not have done this without all of your support.</p>
          </div>
          <div>
            <h3>Technologies:</h3>
            <ul>
              <li>React</li>
              <li>Socket.io</li>
              <li>Express.js</li>
              <li>Node.js</li>
              <li>React Redux</li>
              <li>Javascript</li>
              <li>HTML/CSS</li>
              <li>Postgresql</li>
            </ul>
          </div>
          <div>
            <h3>Contact:</h3>
            <p>
              <b>Email:</b> davey.meuer@gmail.com
            </p>
            <p>
              <b>Github:</b> github.com/Davey-M
            </p>
            <p>
              <b>LinkedIn:</b> www.linkedin.com/in/david-meuer-218611152
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
