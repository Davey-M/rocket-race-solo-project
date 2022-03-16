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
    console.log(location.pathname);
  }, [location]);

  return <>{render && <FooterContent />}</>;
}

function FooterContent() {
  return <footer>&copy; Prime Digital Academy</footer>;
}
export default Footer;
