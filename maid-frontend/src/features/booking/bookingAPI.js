import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5556/api",
    });

export const createBooking = async (bookingData, token) => {
    try {
        const response = await API.post("/booking/create", bookingData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Failed to create booking";
        throw new Error(message);
    }
}

export const getBookingsByUser = async ({ page, limit }, token) => {
    try {
        const response = await API.post(
            "/booking/get_by_user",
            { page, limit },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("getBookingsByUser response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching bookings by user:", error);
        throw error;
    }
}

export const getallBookings = async ({ page, limit }, token) => {
    try {
        const response = await API.post(
            "/booking/all_bookings",
            { page, limit },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        throw error;
    }
}

export const getmaidviseBookings = async ({ maidId}, token) => {
    try {
        const response = await API.post(
            "/booking/get_by_maid",
            {  maidId},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching maidwise bookings:", error);
        throw error;
    }
}