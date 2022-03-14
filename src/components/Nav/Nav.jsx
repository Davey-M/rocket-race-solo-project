import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';

function Nav() {
  const user = useSelector((store) => store.user);

  // this logic should be extracted into its own component in a little bit
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className='nav'>
      <Link to='/home'>
        <h2 className='nav-title'>Home</h2>
      </Link>
      <div className='mid-links'>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <Link className='navLink' to='/login'>
            <p>Login / Register</p>
          </Link>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <Link className='navLink' to='/leaderboard'>
              <p>Leaderboard</p>
            </Link>

            <Link className='navLink' to='/race'>
              <p>
                <b>Race</b>
              </p>
            </Link>
          </>
        )}

        <Link className='navLink' to='/about'>
          <p>About</p>
        </Link>
      </div>
      <div>
        {user.id && (
          <>
            <div className='dropdownToggle'>
              <div
                className='toggleImage circle'
                onClick={() => setNavOpen(true)}
              ></div>
              {navOpen && (
                <div className='dropdown card shadow'>
                  {/* Replace this element with a dropdown when it is created */}
                  <div
                    className='toggleImage circle'
                    onClick={() => setNavOpen(false)}
                  ></div>
                  <Link className='navLink' to='/user'>
                    <p>Profile</p>
                  </Link>
                  <LogOutButton className='navLink' />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Nav;
