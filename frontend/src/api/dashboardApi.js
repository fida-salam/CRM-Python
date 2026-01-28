import api from './axios';

export const dashboardApi = {
  // GET dashboard stats
  getStats: async () => {
    const response = await api.get('/dashboard/stats/');
    return response.data.data;
  },

  // GET recent activities
  getActivities: async () => {
    const response = await api.get('/dashboard/recent-activities/');
    return response.data.activities;
  },

  // GET ML insights
  getInsights: async () => {
    const response = await api.get('/dashboard/ml-insights/');
    return response.data.insights;
  },

  // GET customer analytics (optional)
  getCustomerAnalytics: async (customerId) => {
    const url = customerId 
      ? `/dashboard/customer-analytics/${customerId}/`
      : '/dashboard/customer-analytics/';
    const response = await api.get(url);
    return response.data;
  },
};

export default dashboardApi;