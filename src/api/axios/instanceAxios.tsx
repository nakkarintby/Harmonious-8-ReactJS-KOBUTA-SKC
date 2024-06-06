import axios from "axios";

const instanceAxios = axios.create({
    //DEV
    baseURL: 'http://127.0.0.1:8000',
    headers: {
      'Content-Type': 'application/json',
      'Accept' : 'application/json',
      'Authorization' : ''
    },
  });
export default instanceAxios

const setAuthToken = (token: string) => {
  instanceAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  instanceAxios.defaults.headers['Authorization'] = `Bearer ${token}`;
};

export { setAuthToken};