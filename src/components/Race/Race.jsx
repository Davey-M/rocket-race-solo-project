import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Race.css';

function Race() {
  // get the socket instance from the reducer
  const socket = useSelector((store) => store.socket);

  socket?.on('test', (stuff) => {
    console.log(stuff);
  });

  return (
    <>
      <div className='race-view-container'>
        <div className='info-container'>
          <div className='spinner-container circle'>
            <div className='shade-container'></div>
            <div className='spinner'>
              <div></div>
            </div>
          </div>
          <div className='pointer shadow'></div>
          <div className='time-container'>
            <h1>time</h1>
          </div>
        </div>
        <div className='race-container'></div>
      </div>
    </>
  );
}

export default Race;
