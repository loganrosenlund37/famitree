import axios from 'axios';

async function getAllLeafs(search) {
  const URL = search.length > 0 ? 'api/leafs/search' : 'api/leafs';
  try {
    const { data } = await axios.get(URL, { params: { val: search } });
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export default getAllLeafs;
