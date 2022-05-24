import axios from 'axios';
import React from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';

import createOption from '../utilities/createOptions';

const FindLeafSelector = ({ value, setValue }) => {
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const loadOptions = (val, callback) => {
    // callback(filterFunc(val));
    axios.get('api/leafs/search', { params: { val } })
      .then(({ data }) => callback(data));
  };

  const reformatLabel = (val) => `Add ${val}`;

  const handleCreate = (val) => {
    setLoading(true);
    window.setTimeout(async () => {
      const newOption = await createOption(val);
      setOptions([...options, newOption]);
      setValue(newOption);
      setLoading(false);
    }, 1000);
  };

  const handleChange = (val) => {
    // if (val !== null) {
    //   setValue(undefined);
    // }
    setValue(val);
  };

  return (
    <AsyncCreatableSelect
      isClearable
      formatCreateLabel={reformatLabel}
      onChange={handleChange}
      cacheOptions
      loadOptions={loadOptions}
      options={options}
      isLoading={loading}
      value={value}
      onCreateOption={handleCreate}
    />
  );
};

export default FindLeafSelector;
