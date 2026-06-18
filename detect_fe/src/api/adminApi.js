import api from './axios';

export const adminApi = {
  getUsers: () => api.get('/admin/users/'),
  updateUser: (userId, data) => api.patch(`/admin/users/${userId}/`, data),
  getStats: () => api.get('/admin/stats/'),
  getAlerts: () => api.get('/admin/alerts/'),
};
