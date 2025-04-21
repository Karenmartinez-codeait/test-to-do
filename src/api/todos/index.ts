import axios from 'axios';
//localhost:5000/todos/?_page=1&_limit=5
const API_URL = 'http://localhost:5000/todos';

const getTodos = async (page: number, limit = 5) => {
  const res = await axios.get(API_URL, {
    params: {
      _page: page,
      _limit: limit,
    },
  });

  return res.data;
};

export { getTodos };
