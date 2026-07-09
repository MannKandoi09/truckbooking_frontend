import api from './api'; // Tumhara created axios instance

const API_URL = "/admin/trucks";

export const getAllTrucks = () => api.get(API_URL);

export const addTruck = (truckData) => api.post(API_URL, truckData);

export const getTruckById = (id) => api.get(`${API_URL}/${id}`);

export const updateTruck = (id, truckData) => api.put(`${API_URL}/${id}`, truckData);

export const deleteTruck = (id) => api.delete(`${API_URL}/${id}`);

export const uploadTruckImage = (truckId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    // Yahan hum alag headers bhej rahe hain kyunki file upload mein multipart chahiye
    return api.post(`${API_URL}/${truckId}/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};
