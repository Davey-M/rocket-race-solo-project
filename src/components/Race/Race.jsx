import './Race.css';

function Race() {
  return (
    <>
      <div className='race-view-container'>
        <div className='info-container'>
          <div>
            <div className='spinner-container card round shadow'>
              <div className='spinner'></div>
            </div>
            <h1>time</h1>
          </div>
        </div>
        <div className='race-container'></div>
      </div>
    </>
  );
}

export default Race;
