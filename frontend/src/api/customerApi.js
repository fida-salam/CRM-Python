import api from './axios';

const API_URL = '/customers/';

export const customerApi = {
  // GET all customers
  getAll: async () => {
    const response = await api.get(API_URL);
    return response.data;
  },

  // GET single customer
  getById: async (id) => {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  },

  // POST create customer
  create: async (data) => {
    const response = await api.post(API_URL, data);
    return response.data;
  },

  // PUT update customer
  update: async ({ id, data }) => {
    const response = await api.put(`${API_URL}${id}/`, data);
    return response.data;
  },

  // DELETE customer
  delete: async (id) => {
    const response = await api.delete(`${API_URL}${id}/`);
    return response.data;
  }
};