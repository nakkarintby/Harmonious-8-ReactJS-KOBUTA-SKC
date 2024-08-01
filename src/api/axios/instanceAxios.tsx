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
  sessionStorage.setItem('authToken', `Bearer ${token}`);
  if (token) {
    instanceAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete instanceAxios.defaults.headers.common['Authorization'];
  }
};

// Interceptor to ensure the token is included in every request
instanceAxios.interceptors.request.use(
  (config) => {
    let tokenSession =  sessionStorage.getItem('authToken')
      config.headers['Authorization'] = tokenSession;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
const refreshToken = async () => {
  // Replace with your actual token refresh logic
  const response = await axios.post('https://d742apsi01-wa02skc.azurewebsites.net/refresh-token', {
    // Include any necessary data for refreshing the token
  });
  return response.data.token; // Assume the new token is in response.data.token
};

// Response interceptor to handle 401 errors
instanceAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      setAuthToken(newToken);
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      return instanceAxios(originalRequest);
    }
    return Promise.reject(error);
  }
);

export { setAuthToken };
export default instanceAxios;