import axios from "axios";

const instanceAxios = axios.create({
  baseURL: 'https://d742apsi01-wa02skc.azurewebsites.net',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Function to set the Authorization token
const setAuthToken = (token: string) => {
  if (token) {
    instanceAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete instanceAxios.defaults.headers.common['Authorization'];
  }
};

// Interceptor to ensure the token is included in every request
instanceAxios.interceptors.request.use(
  (config) => {
    const token = instanceAxios.defaults.headers.common['Authorization'];
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { setAuthToken };
export default instanceAxios;