import axios from 'axios';

const createOption = async (label) => {
  const newid = await axios.post('api/leaf/spouseparent', { label, value: label.toLowerCase().replace(/\W/g, '') })
    .then((res) => res.data);
  const option = {
    value: label.toLowerCase().replace(/\W/g, ''),
    label,
    _id: newid,
  };
  return option;
};

export default createOption;
