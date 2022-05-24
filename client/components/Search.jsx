/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

const Search = ({ bind }) => (
  <div className="inline-block">
    <input type="text" className="inpt mr-1" placeholder="Search..." {...bind} />
  </div>
);

export default Search;
