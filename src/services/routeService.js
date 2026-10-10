import api from './api';

// Saare routes fetch karna (GET)
export const getAllRoutes = () => {
  return api.get('/admin/routes');
};

// Sirf active routes fetch karna Booking dropdown ke liye (GET)
export const getActiveRoutes = () => {
  return api.get('/admin/routes/active');
};

// Naya route create karna (POST)
export const createRoute = (routeData) => {
  return api.post('/admin/routes', routeData);
};

// Existing route update karna (PUT)
export const updateRoute = (id, routeData) => {
  return api.put(`/admin/routes/${id}`, routeData);
};

// Route ka status change karna (PATCH)
// Note: Handoff kehta hai request body current controller se verify karein, hum standard JSON bhej rahe hain.
export const changeRouteStatus = (id, status) => {
  return api.patch(`/admin/routes/${id}/status`, { status });
};

// Single route fetch karna
export const getRouteById = (id) => {
  return api.get(`/admin/routes/${id}`);
};