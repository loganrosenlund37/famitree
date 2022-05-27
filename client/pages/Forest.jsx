/* eslint-disable */
import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

import { BsPersonPlus } from 'react-icons/bs';

import getAllLeafs from '../requests/getAllLeafs';
import useDocumentTitle from '../hooks/useDocumentTitle';
// import ExampleModal from '../modals/exampleModal';
import Search from '../components/Search';
import LeafCard from '../components/LeafCard';
import AddEditLeafModal from '../modals/AddEditLeafModal';
import useInput from '../hooks/useInput';
import Spinner from '../components/Spinner';

const Forest = () => {
  const { value: search, bind: bindSearch } = useInput('');
  const { status, data: leafs, error } = useQuery(['leafs', search], () => getAllLeafs(search), { refetchOnWindowFocus: false, refetchOnReconnect: false });
  useDocumentTitle('');

  return (
    <>
      <div className="flex flex-row justify-between mt-4 mx-3">
        <div className="ml-auto mr-auto">
          <Search bind={bindSearch} />
        </div>
        <AddEditLeafModal leaf={null} />
      </div>
      {
				status === 'loading'
				  ? (
            <div className="flex justify-center mt-5 text-xl text-orange-600"><h2>Loading...</h2></div>
          )
				  : status === 'error'
				    ? <span>Error: {error.message}</span>
				    : (
							<div className="m-4 mt-6">
								{leafs?.map((leaf) => (
									<LeafCard leaf={leaf} key={leaf._id} />
								))}
							</div>
				    )
				}
    </>
  );
};

export default Forest;
