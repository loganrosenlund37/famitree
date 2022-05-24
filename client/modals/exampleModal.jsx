import React, { useState } from 'react';

import Modal from './Modal';

const ExampleModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const callBack = () => {
    console.log('This is from the callback function');
  };

  return (
    <>
      <button type="button" className="btn" onClick={() => setIsOpen(true)}>Example Modal</button>
      <Modal open={isOpen} onClose={closeModal} cb={callBack}>
        <div className="modal-header">
          <h3>Example Modal Header</h3>
        </div>
        <div className="modal-body">
          This is the body of an example modal.
        </div>
      </Modal>
    </>
  );
};

export default ExampleModal;
