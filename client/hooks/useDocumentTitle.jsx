import React from 'react';

const useDocumentTitle = (title) => {
  React.useEffect(() => {
    document.title = `Famitree${title}`;
  }, [title]);
};

export default useDocumentTitle;
