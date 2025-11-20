import apiClient from '../lib/api';
import { useAuthStore } from '../store/authStore';

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data.data;
  },

  getCurrentUser: async () => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  updateProfile: async (userData) => {
    const { data } = await apiClient.put('/auth/me', userData);
    return data;
  },

  changePassword: async (passwordData) => {
    const { data } = await apiClient.put('/auth/change-password', passwordData);
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
    const { user } = useAuthStore.getState();
    const { data } = await apiClient.post('/properties', {
      ...propertyData,
      userId: user?.id,
    });
    return data;
  },

  update: async (id, propertyData) => {
    const { user } = useAuthStore.getState();
    const { data } = await apiClient.put(`/properties/${id}`, {
      ...propertyData,
      userId: user?.id,
    });
    return data;
  },

  delete: async (id) => {
    const { data } = await apiClient.delete(`/properties/${id}`);
    return data;
  },

  uploadImages: async (propertyId, files) => {
    // files may be either an array of File or a FormData (in case caller pre-made it)
    let formData = files instanceof FormData ? files : new FormData();
    if (!(files instanceof FormData)) {
      (files || []).forEach((file) => formData.append('images[]', file));
    }
    // Do NOT set Content-Type header manually — axios/browser will set boundary for multipart/form-data
    // Also ensure we don't send the `Content-Type` header without boundary as a misconfigured header can cause parsing failures
    // Use fetch for file uploads to avoid axios headers overriding/boundary issues
    const token = localStorage.getItem('token');
    const baseUrl = apiClient.defaults.baseURL || '';
    const url = baseUrl.replace(/\/$/, '') + `/properties/${propertyId}/images`;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Failed to upload images');
    return data;
  },
};

// Inquiries API
// Inquiries API removed — use direct contact channels

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const { data } = await apiClient.get('/dashboard/stats');
    // Dashboard endpoint returns { success: true, data: stats }
    // Return the inner stats object to make it easier for callers
    return data.data;
  },
};
