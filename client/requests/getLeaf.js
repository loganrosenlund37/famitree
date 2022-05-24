import axios from 'axios';

async function getLeafs(id) {
  try {
    const { data } = await axios.get('api/leaf', { params: { id } });
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export default getLeafs;
