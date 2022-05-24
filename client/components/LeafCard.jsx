import React from 'react';
import { useNavigate } from 'react-router-dom';

import getAge from '../utilities/getAge';

const LeafCard = ({ leaf }) => {
  const navigate = useNavigate();
  const showLeaf = () => navigate('/leaf', { state: { _id: leaf?._id, label: leaf?.label } });

  const age = leaf?.dob ? getAge(leaf.dob) : null;

  return (
    <button type="button" className="flex flex-row justify-between w-full p-2 border-2 mb-4 cursor-pointer hover:bg-slate-300 hover:border-white hover:text-orange-600" onClick={showLeaf}>
      <div className="ml-4">{leaf?.label}</div>
      <div className="mr-4">{age}</div>
    </button>
  );
};

export default LeafCard;
