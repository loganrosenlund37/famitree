import React from 'react';
import reactDom from 'react-dom';

const Modal = ({
  open, children, onClose, isStatic = true,
}) => {
  if (!open) return null;

  return reactDom.createPortal(
    <div className="backdrop" onClick={isStatic ? null : onClose} onKeyDown={isStatic ? null : onClose}>
      <div className="modal">
        {children}
      </div>
    </div>,
    document.getElementById('portal'),
  );
};

export default Modal;
