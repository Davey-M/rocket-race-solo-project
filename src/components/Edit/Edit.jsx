import './Edit.css';

function Edit() {
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('submitting');
  };

  return (
    <div className='edit-container'>
      <h2 className='dark-back edit-header'>Edit Profile</h2>
      <form onSubmit={handleSubmit} className='edit-form'>
        <div>
          <p>Username:</p>
          <input type='text' placeholder='Username' />
        </div>
        <div>
          <p>Image URL:</p>
          <input type='text' placeholder='Image URL' />
        </div>
        <div className='long-section'>
          <p>About Me:</p>
          {/* <input type='text' placeholder='About' /> */}
          <textarea name='' id='' cols='30' rows='3'></textarea>
        </div>
        <div className='button-container'>
          <button type='submit'>Save</button>
          <button className='free red' type='button'>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default Edit;
