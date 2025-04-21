import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5556/api',
});

export const userInfo = async (data) => {
  try {
    const res = await API.post('/profile/userInfo', data);
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    throw new Error(message);
  }
};
