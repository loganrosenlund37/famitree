import React from 'react';
import { useNavigate } from 'react-router-dom';

const LeafInfoCard = ({ title, leaf = '' }) => {
  const navigate = useNavigate();
  const navigateToLeaf = () => {
    navigate('/leaf', { state: { _id: leaf._id, label: leaf.label } });
  };

  return (
    <div className="flex flex-col items-center">
      <h4 className="text-xl">{title}</h4>
      {
        leaf
          ? <button type="button" className="border-2 px-4 text-orange-600 hover:bg-slate-300 hover:border-orange-600 m-1 p-1" onClick={navigateToLeaf}>{leaf.label}</button>
          : null
      }
    </div>
  );
};

export default LeafInfoCard;
