import api from './api';

// 🚀 Bulletproof Token Helper - Ye zabardasti token daalega
const getConfig = () => {
  let token = localStorage.getItem('token');
  if (token) {
    token = token.replace(/['"]+/g, ''); // Extra quotes hata dega
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// GET all drivers
export const getAllDrivers = () => {
  return api.get('/admin/drivers', getConfig());
};

// POST new driver
export const addDriver = (driverData) => {
  return api.post('/admin/drivers', driverData, getConfig());
};

// PUT update driver
export const updateDriver = (id, driverData) => {
  return api.put(`/admin/drivers/${id}`, driverData, getConfig());
};

// DELETE driver
export const deleteDriver = (id) => {
  return api.delete(`/admin/drivers/${id}`, getConfig());
};

// POST upload driver image
export const uploadDriverImage = (id, file) => {
  let token = localStorage.getItem('token');
  if (token) token = token.replace(/['"]+/g, '');

  const formData = new FormData();
  formData.append('file', file);

  return api.post(`/admin/drivers/${id}/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    },
  });
};