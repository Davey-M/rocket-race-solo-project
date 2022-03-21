import React from 'react';

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

function AboutPage() {
  return (
    <div>
      <section>
        <h1>How To Play</h1>
      </section>
      <section>
        <h1>The story of the app</h1>
      </section>
      <section>
        <h1>Acknowledgments</h1>
      </section>
    </div>
  );
}

export default AboutPage;
