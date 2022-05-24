import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Settings = () => {
  useDocumentTitle(' - Settings');
  return (
    <div className="text-orange-600 text-3xl w-full min-h-full flex flex-col items-center justify-center">
      <h2>Settings</h2>
    </div>
  );
};

export default Settings;
