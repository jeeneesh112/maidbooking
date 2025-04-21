import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5556/api',
});

export const signup = async (data) => {
  const res = await API.post('/auth/signup', data);
  return res.data;
};

export const login = async (data) => {
  const res = await API.post('/auth/login', data);
  return res.data;
};

export const verifyOtp = async ({ otp }) => {
  const res = await API.post('/auth/verify-otp', { otp });
  return res.data;
};
