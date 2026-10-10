import api from './api';

// Saare bookings fetch karne ke liye (GET)
export const getAllBookings = () => {
  return api.get('/admin/bookings');
};

// Naya booking create karne ke liye (POST)
export const createBooking = (bookingData) => {
  return api.post('/admin/bookings', bookingData);
};

// PENDING booking ko update karne ke liye (PUT)
export const updateBooking = (id, bookingData) => {
  return api.put(`/admin/bookings/${id}`, bookingData);
};

// Booking ka status change karne ke liye (PATCH - khali body pass ki hai backend error rokne ke liye)
export const changeBookingStatus = (id, status) => {
  return api.patch(`/admin/bookings/${id}/status?status=${status}`, {});
};

// Booking cancel karne ke liye (PATCH - khali body pass ki hai)
export const cancelBooking = (id) => {
  return api.patch(`/admin/bookings/${id}/cancel`, {});
};

// (Optional) Ek single booking ki detail fetch karne ke liye
export const getBookingById = (id) => {
  return api.get(`/admin/bookings/${id}`);
};