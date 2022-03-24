import React from 'react';

import './AboutPage.css';

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
          <p>
            You are an astronaut whose planet is becoming too crowded. You have
            to get out of here and find a new planet. The only problem is that
            you are not the only astronaut with this plan. Be the first to get
            to a new planet and you can have it all to yourself. Good luck!
          </p>
        </div>
      </section>
      <section>
        <h1 className='red-back about-header'>How To Play</h1>
        <ul>
          <li></li>
        </ul>
      </section>
      <section>
        <h1 className='dark-back about-header'>Acknowledgments</h1>
      </section>
    </div>
  );
}

export default AboutPage;
