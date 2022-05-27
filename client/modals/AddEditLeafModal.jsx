/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import axios from 'axios';
import { useQueryClient } from 'react-query';

import { BsPersonPlusFill } from 'react-icons/bs';
import { FaUserEdit } from 'react-icons/fa';

import Modal from './Modal';
import useInput from '../hooks/useInput';
import FindLeafSelector from '../components/FindLeafSelector';

const AddEditLeafModal = ({ leaf, add = true }) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { value: label, setValue: setLabel, bind: bindLabel } = useInput('');
  const [spouse, setSpouse] = useState({});
  const { value: dob, setValue: setDOB, bind: bindDOB } = useInput('');
  const [father, setFather] = useState({});
  const [mother, setMother] = useState({});

  React.useEffect(() => {
    setLabel(leaf?.label || '');
    setSpouse(leaf?.spouse);
    setDOB(leaf?.dob || '');
    setFather(leaf?.father);
    setMother(leaf?.mother);
  }, [leaf]);

  const openModal = () => {
    setIsOpen(true);
    window.setTimeout(() => document.getElementById('label').focus(), 50);
  };

  const closeModal = () => {
    setIsOpen(false);
    if (add) {
      setLabel('');
      setSpouse(undefined);
      setDOB('');
      setFather(undefined);
      setMother(undefined);
    }
  };

  const callback = (e) => {
    e.preventDefault();
    const URL = add ? 'api/leaf/new' : 'api/leaf/edit';
    const METHOD = add ? 'POST' : 'PUT';

    if (label == undefined || label.length < 1) {
      document.getElementById('label').focus();
    } else {
      axios({
        method: METHOD,
        url: URL,
        data: {
          leaf: {
            label,
            dob,
            value: label.toLowerCase().replace(/\W/g, ''),
          },
          spouse,
          father,
          mother,
          id: add ? null : leaf._id,
        },
      })
        .then((response) => {
          if (response.status == 200) {
            queryClient.invalidateQueries(add ? 'leafs' : 'leaf');
            closeModal();
          } else {
            // eslint-disable-next-line no-alert
            alert(`There was an issue ${add ? 'Add' : 'edit'}ing.`);
          }
        });
    }
  };

  return (
    <>
      <button className="btn mr-2" type="button" onClick={openModal} label={add ? 'Add Person' : 'Edit Person'} title={add ? 'Add Person' : `Edit ${leaf?.label}`}>{add ? <BsPersonPlusFill size={20} /> : <FaUserEdit size={20} />}</button>
      <Modal open={isOpen}>
        <div className="modal-header">
          <h3 className="">{add ? 'Add Person' : `Edit ${leaf?.label}`}</h3>
        </div>
        <form onSubmit={callback} className="flex flex-col" autoComplete="off">
          <div className="modal-body">
            <label className="" htmlFor="label">
              Name
              <input type="text" className="inpt w-full" id="label" {...bindLabel} />
            </label>
            <label className="" htmlFor="test">Spouse</label>
            <FindLeafSelector value={spouse} setValue={setSpouse} />
            <label className="" htmlFor="birthday">
              Date of Birth
              <input type="date" className="inpt w-full" id="birthday" {...bindDOB} />
            </label>
            <label className="" htmlFor="father">Father</label>
            <FindLeafSelector value={father} setValue={setFather} />
            <label className="" htmlFor="mother">Mother</label>
            <FindLeafSelector value={mother} setValue={setMother} />
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button type="button" className="btn" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn" onClick={callback}>{add ? 'Add' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddEditLeafModal;
