import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/interactions/';

export const interactionApi = {
  // GET all interactions or filter by customer
  getAll: async (customerId = null) => {
    const url = customerId ? `${API_URL}?customer=${customerId}` : API_URL;
    const response = await axios.get(url);
    return response.data;
  },

  // GET single interaction
  getById: async (id) => {
    const response = await axios.get(`${API_URL}${id}/`);
    return response.data;
  },

  // POST create interaction
  create: async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  // PUT update interaction
  update: async ({ id, data }) => {
    const response = await axios.put(`${API_URL}${id}/`, data);
    return response.data;
  },

  // DELETE interaction
  delete: async (id) => {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  }
};