import './Modal.css';

import { useRef } from 'react';

function Modal(props) {
  const outerComponent = useRef();

  return (
    <>
      <div
        style={{ zIndex: 100 }}
        className={
          (props.open ? 'modal-container ' : 'modal-container closed ') +
          props.outerClass
        }
        onClick={(e) => {
          if (
            e.target === outerComponent.current &&
            typeof props.outerClick === 'function'
          ) {
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
