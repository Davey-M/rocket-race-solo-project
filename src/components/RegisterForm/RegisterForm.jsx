import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: 'REGISTER',
      payload: {
        username: username,
        password: password,
      },
    });
  }; // end registerUser

  return (
    <form className='formPanel card shadow' onSubmit={registerUser}>
      <h2>Register User</h2>
      {errors.registrationMessage && (
        <h3 className='alert' role='alert'>
          {errors.registrationMessage}
        </h3>
      )}
      <div>
        <label htmlFor='username'>
          {/* Username: */}
          <input
            type='text'
            name='username'
            value={username}
            required
            onChange={(event) => setUsername(event.target.value)}
            placeholder='Username'
          />
        </label>
      </div>
      <div>
        <label htmlFor='password'>
          {/* Password: */}
          <input
            type='password'
            name='password'
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
            placeholder='Password'
          />
        </label>
      </div>
      <div>
        <button type='submit' name='submit'>
          Register
        </button>
      </div>
    </form>
  );
}

export default RegisterForm;
