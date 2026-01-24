import api from './axios';

const API_URL = '/interactions/';

export const interactionApi = {
  // GET all interactions or filter by customer
  getAll: async (customerId = null) => {
    const url = customerId ? `${API_URL}?customer=${customerId}` : API_URL;
    const response = await api.get(url);
    return response.data;
  },

  // GET single interaction
  getById: async (id) => {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  },

  // POST create interaction
  create: async (data) => {
    const response = await api.post(API_URL, data);
    return response.data;
  },

  // PUT update interaction
  update: async ({ id, data }) => {
    const response = await api.put(`${API_URL}${id}/`, data);
    return response.data;
  },

  // DELETE interaction
  delete: async (id) => {
    const response = await api.delete(`${API_URL}${id}/`);
    return response.data;
  }
};