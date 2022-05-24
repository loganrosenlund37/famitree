import React from 'react';
import { ImSpinner8 } from 'react-icons/im';

const Spinner = () => (
  <div className="fixed top-0 left-0 right-0 bottom-0 w-auto h-auto z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <ImSpinner8 className="animate-spin z-10" size={75} color="white" />
    <h2 className="text-center text-white text-xl font-semibold mt-3">Loading...</h2>
    <p className="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
  </div>
);

export default Spinner;
