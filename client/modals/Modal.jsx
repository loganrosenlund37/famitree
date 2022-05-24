import React from 'react';
import reactDom from 'react-dom';

const Modal = ({
  open, children, onClose, cb, btnName = 'Confirm', isStatic = true,
}) => {
  if (!open) return null;

  return reactDom.createPortal(
    <>
      <div className="modal">
        {children}
        <div className="modal-footer d-flex justify-content-center">
          <button type="button" className="btn" onClick={onClose}>Close</button>
          {
            cb ? <button type="button" className="btn" onClick={cb}>{btnName}</button> : null
          }
        </div>
      </div>
      <div className="backdrop" onClick={isStatic ? null : onClose} onKeyDown={isStatic ? null : onClose} />
    </>,
    document.getElementById('portal'),
  );
};

export default Modal;
