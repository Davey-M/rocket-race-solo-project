import './Home.css';

import { useHistory } from 'react-router-dom';

function Home() {
  const history = useHistory();

  const handleRaceClick = () => {
    history.push('/race');
  };

  return (
    <>
      <div className='home-page-container'>
        <div className='blue-header'>
          <h1 className='very-big blue-back'>Rocket</h1>
        </div>
        <div className='red-header'>
          <h1 className='very-big red-back'>Race</h1>
        </div>
      </div>
      <div className='sub-header'>
        <button className='free red'>How To Play</button>
        <button onClick={handleRaceClick}>Race</button>
        <h2>Race for peace and quiet.</h2>
      </div>
    </>
  );
}

export default Home;
