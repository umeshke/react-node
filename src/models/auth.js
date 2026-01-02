import axios from 'axios';

const axiosPrivate = axios.create({ baseURL: 'http://localhost:5000', withCredentials: true });
// models/auth.js
export const loginUser = async (credentials) => {
  const response = await axiosPrivate.post('/api/auth/login', credentials);
  return response.data;
};

export const signupUser = async (userData) => {
  // Similar POST to /api/signup
  const response = await axiosPrivate.post('/api/auth/signup', userData);
  return response.data;
};
