import './Modal.css';

import { useRef } from 'react';

function Modal(props) {
  const innerComponent = useRef();

  return (
    <>
      <div
        className='modal-container'
        onClick={(e) => {
          console.log(e.target === innerComponent.current);

          if (e.target !== innerComponent.current) {
            props.outerClick();
          }
        }}
      >
        <div
          {...props}
          className='modal-outer card shadow'
          ref={innerComponent}
        >
          {props.children}
        </div>
      </div>
    </>
  );
}

export default Modal;
