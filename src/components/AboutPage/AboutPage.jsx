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
        <h1 className='red-back about-header'>How To Play</h1>
      </section>
      <section>
        <h1 className='blue-back about-header'>The story of the app</h1>
      </section>
      <section>
        <h1 className='dark-back about-header'>Acknowledgments</h1>
      </section>
    </div>
  );
}

export default AboutPage;
