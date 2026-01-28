import api from './axios';

const API_URL = '/users/';

export const userApi = {
  // GET all users
  getAll: async () => {
    const response = await api.get(API_URL);
    return response.data;
  },

  // GET single user
  getById: async (id) => {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  },

  // POST create user
  create: async (data) => {
    const response = await api.post(API_URL, data);
    return response.data;
  },

  // PUT update user
  update: async ({ id, data }) => {
    const response = await api.put(`${API_URL}${id}/`, data);
    return response.data;
  },

  // DELETE user (soft delete/deactivate)
  delete: async (id) => {
    const response = await api.delete(`${API_URL}${id}/`);
    return response.data;
  },

  // POST activate user
  activate: async (id) => {
    const response = await api.post(`${API_URL}${id}/activate/`);
    return response.data;
  },

  // GET current user
  getCurrentUser: async () => {
    const response = await api.get(`${API_URL}me/`);
    return response.data;
  }
};