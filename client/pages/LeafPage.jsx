/* eslint-disable react/no-array-index-key */
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';

import getLeaf from '../requests/getLeaf';
import LeafInfoCard from '../components/LeafInfoCard';
import useDocumentTitle from '../hooks/useDocumentTitle';
import AddEditLeafModal from '../modals/AddEditLeafModal';
import getAge from '../utilities/getAge';

const LeafPage = () => {
  const { _id, label } = useLocation().state;
  // eslint-disable-next-line no-unused-vars
  const { status, data: leaf, error } = useQuery(['leaf', _id], () => getLeaf(_id), { refetchOnWindowFocus: false, refetchOnReconnect: false });
  useDocumentTitle(` - ${label}`);
  const navigate = useNavigate();
  const navigateToLeaf = (next) => navigate('/leaf', { state: { _id: next._id, label: next.label } });

  return (
    <>
      <div className="flex flex-row justify-between mt-4 mx-3">
        <div className="ml-auto">
          <h1 className="text-xl ml-8 text-orange-600">{leaf?.label} {leaf?.dob ? ` - ${getAge(leaf.dob)}` : null}</h1>
        </div>
        <AddEditLeafModal leaf={leaf} add={false} />
      </div>
      <div className="m-2">
        {leaf?.spouse ? <LeafInfoCard title="Spouse" leaf={leaf.spouse} /> : null}
        {leaf?.father ? <LeafInfoCard title="Father" leaf={leaf.father} /> : null}
        {leaf?.mother ? <LeafInfoCard title="Mother" leaf={leaf.mother} /> : null}
        {leaf?.siblings ? <LeafInfoCard title="Siblings" leaf={false} /> : null}
        {
          leaf?.siblings?.length > 0
            ? (
              <div className="flex flex-wrap justify-center">
                {leaf.siblings.map((sibling) => (
                  <button type="button" className="border-2 hover:text-orange-600 hover:bg-slate-300 hover:border-slate-300 m-1 p-1" key={sibling._id} onClick={() => navigateToLeaf(sibling)}>{sibling.label}</button>
                ))}
              </div>
            )
            : null
        }
        {leaf?.children?.length > 0 ? <LeafInfoCard title="Children" leaf={false} /> : null}
        {
          leaf?.children
            ? (
              <div className="flex flex-wrap justify-center">
                {leaf?.children?.map((child) => (
                  <button type="button" className="border-2 hover:text-orange-600 hover:bg-slate-300 hover:border-slate-300 m-1 p-1" key={child._id} onClick={() => navigateToLeaf(child)}>{child.label}</button>
                ))}
              </div>
            )
            : null
        }
      </div>
    </>
  );
};

export default LeafPage;
