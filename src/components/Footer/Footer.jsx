import React, { useEffect, useState } from 'react';
import './Footer.css';
import { useLocation } from 'react-router-dom';

// This is one of our simplest components
// It doesn't have local state, so it can be a function component.
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is, so it doesn't need 'connect()'

function Footer() {
  const location = useLocation();

  const [render, setRender] = useState(true);

  useEffect(() => {
    setRender(!(location.pathname === '/race'));
    // console.log(location.pathname);
  }, [location]);

  return <>{render && <FooterContent />}</>;
}

function FooterContent() {
  return (
    <footer>
      <a href='mailto:davey.meuer@gmail.com'>
        <p>Contact Me</p>
      </a>
      <h3>
        <span className='red'>Rocket</span> <span className='blue'>Race</span>
      </h3>
      <a href='https://github.com/Davey-M' target='_blank'>
        <p>Check out my other projects</p>
      </a>
    </footer>
  );
}
export default Footer;
