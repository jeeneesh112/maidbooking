import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5556/api',
});

export const userInfo = async (data, token) => {
  try {
    const res = await API.post('/profile/userInfo', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch profile';
    throw new Error(message);
  }
};