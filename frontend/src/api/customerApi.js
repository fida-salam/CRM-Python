import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/customers/';

export const customerApi = {
  // GET all customers
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // GET single customer
  getById: async (id) => {
    const response = await axios.get(`${API_URL}${id}/`);
    return response.data;
  },

  // POST create customer
  create: async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  // PUT update customer
  update: async ({ id, data }) => {
    const response = await axios.put(`${API_URL}${id}/`, data);
    return response.data;
  },

  // DELETE customer
  delete: async (id) => {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  }
};