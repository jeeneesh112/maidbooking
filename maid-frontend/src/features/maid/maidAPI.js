import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5556/api',
});

export const addMaid = async (maidData) => {
    try {
        const response = await API.post('/maid/add', maidData);
        return response.data;
    } catch (error) {
        console.error('Error adding maid:', error);
        throw error;
    }
    }

export const getMaid = async (maidId) => {
    try {
        const response = await API.post('/maid/get_by_id', { id : maidId });
        return response.data;
    } catch (error) {
        console.error('Error fetching maid:', error);
        throw error;
    }
}

export const getMaidsByArea = async (area, page, limit) => {
    try {
        const response = await API.post('/maid/get_by_area', { area, page, limit });
        return response.data;
    } catch (error) {
        console.error('Error fetching maids by area:', error);
        throw error;
    }
}

export const deleteMaid = async (maidId) => {
    try {
        const response = await API.post('/maid/delete', { id: maidId });
        return response.data;
    } catch (error) {
        console.error('Error deleting maid:', error);
        throw error;
    }
}

export const updateMaid = async (maidId, maidData) => {
    try {
        const response = await API.post('/maid/update', { id: maidId, ...maidData });
        return response.data;
    } catch (error) {
        console.error('Error updating maid:', error);
        throw error;
    }
}
