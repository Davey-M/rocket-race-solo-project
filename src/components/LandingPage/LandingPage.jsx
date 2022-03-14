import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LandingPage.css';

// CUSTOM COMPONENTS
import RegisterForm from '../RegisterForm/RegisterForm';
import Home from '../Home/Home';

function LandingPage() {
  const [heading, setHeading] = useState('Welcome');
  const history = useHistory();

  const onLogin = (event) => {
    history.push('/login');
  };

  return (
    <div className='container'>
      <div className='grid'>
        <div className='grid-col grid-col_8'>
          <Home />
        </div>
        <div className='grid-col grid-col_4'>
          <RegisterForm />

          <center>
            <h4>Already a Member?</h4>
            <button className='btn btn_sizeSm' onClick={onLogin}>
              Login
            </button>
          </center>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
