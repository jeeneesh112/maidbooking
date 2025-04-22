import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5556/api',
});

export const signup = async (data) => {
  try{
    console.log('Data in API:', data);
    const res = await API.post('/auth/signup', data);
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Signup failed';
    throw new Error(message);
  }
};

export const login = async (data) => {
  try {
    const res = await API.post('/auth/login', data);
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    throw new Error(message);
  }
};

export const verifyOtp = async (data) => {
  try {
    const res = await API.post('/auth/verify_otp', data);
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || 'OTP verification failed';
    throw new Error(message);
  }
}
