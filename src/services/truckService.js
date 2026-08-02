import api from './api';

// 1. Get All Trucks (GET /api/admin/trucks)
export const getAllTrucks = () => {
  return api.get('/admin/trucks');
};

// 2. Add New Truck (POST /api/admin/trucks)
export const addTruck = (truckData) => {
  return api.post('/admin/trucks', truckData);
};

// 3. Update Truck (PUT /api/admin/trucks/{id})
export const updateTruck = (id, truckData) => {
  return api.put(`/admin/trucks/${id}`, truckData);
};

// 4. Delete/Deactivate Truck (DELETE /api/admin/trucks/{id})
export const deleteTruck = (id) => {
  return api.delete(`/admin/trucks/${id}`);
};

// 5. Upload Truck Image (POST /api/admin/trucks/{id}/upload-image)
export const uploadTruckImage = (id, file) => {
  const formData = new FormData();
  formData.append('file', file); // 'file' wahi naam hai jo backend controller me @RequestParam("file") me hai

  return api.post(`/admin/trucks/${id}/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};