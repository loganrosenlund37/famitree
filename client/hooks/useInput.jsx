import React from 'react';

const useInput = (initialValue) => {
  const [value, setValue] = React.useState(initialValue);

  return {
    value,
    setValue,
    reset: () => { },
    bind: {
      value,
      onChange: (e) => setValue(e.target.value),
    },
  };
};

export default useInput;
