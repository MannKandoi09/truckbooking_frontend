import api from './api';

// Fetch all routes (GET)
export const getAllRoutes = () => {
  return api.get('/admin/routes');
};

// Fetch only active routes for dropdowns (GET)
export const getActiveRoutes = () => {
  return api.get('/admin/routes/active');
};

// Create new route (POST)
export const createRoute = (routeData) => {
  return api.post('/admin/routes', routeData);
};

// Update existing route (PUT)
export const updateRoute = (id, routeData) => {
  return api.put(`/admin/routes/${id}`, routeData);
};

// Change route status (PATCH with query param status)
export const changeRouteStatus = (id, status) => {
  return api.patch(`/admin/routes/${id}/status?status=${status}`);
};

// Fetch single route by ID
export const getRouteById = (id) => {
  return api.get(`/admin/routes/${id}`);
};
