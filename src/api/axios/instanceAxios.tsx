import axios from "axios";

const instanceAxios = axios.create({
    //DEV
    baseURL: 'https://d742apsi01-wa02skc.azurewebsites.net',
    headers: {
      'Content-Type': 'application/json',
      'Accept' : 'application/json',
      'Authorization' : ''
    },
  });
export default instanceAxios

const setAuthToken = (token: string) => {
  console.log(token)
  instanceAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  instanceAxios.defaults.headers['Authorization'] = `Bearer ${token}`;
};

export { setAuthToken};

