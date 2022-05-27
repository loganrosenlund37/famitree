import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineUserDelete } from 'react-icons/ai';

import Modal from './Modal';

const RemoveLeafModal = ({ leaf }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen((current) => !current);

  const closeModal = () => setIsOpen((current) => !current);

  const removeLeaf = (e) => {
    e.preventDefault();

    console.log({ key: leaf._key });

    axios.delete('api/leaf/remove', {
      data: {
        leafID: leaf._id,
        leafKey: leaf._key,
      },
    })
      .then(() => navigate('/'))
      .catch((err) => console.error(`Error: ${err}`));
  };

  return (
    <>
      <button className="btn ml-2" type="button" onClick={toggleModal} label={`Remove ${leaf?.label}`} title={`Remove ${leaf?.label}`}><AiOutlineUserDelete size={20} /></button>
      <Modal open={isOpen}>
        <div className="modal-header">
          <h3 className="">Remove {leaf?.label}</h3>
        </div>
        <form onSubmit={removeLeaf} className="flex flex-col" autoComplete="off">
          <div className="modal-body">
            <p>Are you sure you want to remove {leaf?.label}?</p>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button type="button" className="btn" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn" onClick={removeLeaf}>Remove</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default RemoveLeafModal;
