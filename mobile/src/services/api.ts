import axios from 'axios';

const PORT = 3333;
const HOST = '192.168.25.31';

const api = axios.create({
  baseURL: `http://${HOST}:${PORT}`,
});

export default api;
