import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5556/api",
});

export const addMaid = async (maidData, token) => {
  try {
    const response = await API.post("/maid/add", maidData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to add maid";
    throw new Error(message);
  }
};

export const getMaid = async (maidId) => {
  try {
    const response = await API.post("/maid/get_by_id", { id: maidId });
    return response.data;
  } catch (error) {
    console.error("Error fetching maid:", error);
    throw error;
  }
};

export const getMaidsByArea = async ({ area, page, limit }, token) => {
  try {
    const response = await API.post(
      "/maid/get_by_area",
      { area, page, limit },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching maids by area:", error);
    throw error;
  }
};

export const deleteMaid = async (data,token) => {
  try {
    console.log("deleteMaid maidId   data:", data);
    const response = await API.post("/maid/delete", data,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting maid:", error);
    throw error;
  }
};

export const updateMaid = async (maidId, maidData) => {
  try {
    const response = await API.post("/maid/update", {
      id: maidId,
      ...maidData,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating maid:", error);
    throw error;
  }
};
