import apiClient from '../lib/api';

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data.data;
  },
  
  register: async (userData) => {
    const { data } = await apiClient.post('/auth/register', userData);
    return data.data;
  },
  
  getCurrentUser: async () => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
};

// Properties API
export const propertiesAPI = {
  getAll: async (params) => {
    const { data } = await apiClient.get('/properties', { params });
    return data;
  },
  
  getById: async (id) => {
    const { data } = await apiClient.get(`/properties/${id}`);
    return data;
  },
  
  create: async (propertyData) => {
    const { data } = await apiClient.post('/properties', propertyData);
    return data;
  },
  
  update: async (id, propertyData) => {
    const { data } = await apiClient.put(`/properties/${id}`, propertyData);
    return data;
  },
  
  delete: async (id) => {
    const { data } = await apiClient.delete(`/properties/${id}`);
    return data;
  },
  
  uploadImages: async (propertyId, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    const { data } = await apiClient.post(
      `/properties/${propertyId}/images`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return data;
  },
};

// Inquiries API
export const inquiriesAPI = {
  create: async (inquiryData) => {
    const { data } = await apiClient.post('/inquiries', inquiryData);
    return data;
  },
  
  getAll: async (params) => {
    const { data } = await apiClient.get('/inquiries', { params });
    return data;
  },
  
  markAsRead: async (id) => {
    const { data } = await apiClient.patch(`/inquiries/${id}/read`);
    return data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const { data } = await apiClient.get('/dashboard/stats');
    return data;
  },
};
