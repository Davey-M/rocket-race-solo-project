import './Modal.css';

import { useRef } from 'react';

function Modal(props) {
  const outerComponent = useRef();

  return (
    <>
      <div
        className={props.open ? 'modal-container' : 'modal-container closed'}
        onClick={(e) => {
          if (e.target === outerComponent.current) {
            props.outerClick();
          }
        }}
        ref={outerComponent}
      >
        <div
          {...props}
          className={'modal-outer card shadow ' + props.className}
        >
          {props.children}
        </div>
      </div>
    </>
  );
}

export default Modal;
