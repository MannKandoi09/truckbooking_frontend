import api from './api';

// 1. Saare customers fetch karne ke liye (GET)
export const getAllCustomers = () => {
  return api.get('/admin/customers');
};

// 2. Naya customer add karne ke liye (POST)
export const addCustomer = (customerData) => {
  return api.post('/admin/customers', customerData);
};

// 3. Existing customer ko update karne ke liye (PUT)
export const updateCustomer = (id, customerData) => {
  return api.put(`/admin/customers/${id}`, customerData);
};

// 4. Customer ko deactivate (soft delete) karne ke liye (DELETE)
export const deleteCustomer = (id) => {
  return api.delete(`/admin/customers/${id}`);
};

// (Optional) Agar kabhi ek single customer ki detail fetch karni ho
export const getCustomerById = (id) => {
  return api.get(`/admin/customers/${id}`);
};