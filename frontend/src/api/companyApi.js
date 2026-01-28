import api from './axios';

const API_URL = '/companies/';

export const companyApi = {
  // GET all companies
  getAll: async () => {
    const response = await api.get(API_URL);
    return response.data;
  },

  // GET single company
  getById: async (id) => {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  },

  // POST create company
  create: async (data) => {
    const response = await api.post(API_URL, data);
    return response.data;
  },

  // PUT update company
  update: async ({ id, data }) => {
    const response = await api.put(`${API_URL}${id}/`, data);
    return response.data;
  },

  // DELETE company
  delete: async (id) => {
    const response = await api.delete(`${API_URL}${id}/`);
    return response.data;
  }
};

export default companyApi;