import apiClient from '../lib/api';
import axios from 'axios';
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

  reorder: async (propertyIds) => {
    const { data } = await apiClient.post('/properties/reorder', {
      propertyIds,
    });
    return data;
  },

  delete: async (id) => {
    const { data } = await apiClient.delete(`/properties/${id}`);
    return data;
  },

  uploadImages: async (propertyId, files, onProgress) => {
    // files may be either an array of File or a FormData (in case caller pre-made it)
    let formData = files instanceof FormData ? files : new FormData();
    if (!(files instanceof FormData)) {
      // Validate file sizes client-side to avoid large uploads being rejected
      const MAX_BYTES = 50 * 1024 * 1024; // 50 MB
      for (const file of files || []) {
        if (file.size > MAX_BYTES) {
          throw new Error(
            `File too large: ${file.name} (${Math.round(file.size / (1024 * 1024))}MB). Max is 50MB.`
          );
        }
      }
      // Use 'images' (no [] suffix) so express-fileupload maps to req.files.images
      (files || []).forEach((file) => formData.append('images', file));
    }

    // Use axios to support upload progress reporting in browser
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const url = `/properties/${propertyId}/images`;
    const config = {
      headers: {
        ...headers,
      },
      timeout: 300000, // 5 minutes
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          try {
            onProgress(percent);
          } catch (e) {
            // swallow progress handler errors
          }
        }
      },
    };

    // Ensure we do NOT send any JSON Content-Type header from axios defaults
    // so the browser can set the correct multipart boundary for FormData.
    // Setting it to undefined here overrides the axios default and allows
    // the browser to set the correct 'multipart/form-data; boundary=...' header.
    if (config.headers) {
      config.headers['Content-Type'] = undefined;
    }

    // Use axios directly for FormData upload so default JSON Content-Type on apiClient
    // does not pollute this request. Include Authorization manually.
    if (token)
      config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    const target = apiClient.defaults?.baseURL
      ? `${apiClient.defaults.baseURL.replace(/\/$/, '')}${url}`
      : url;
    const response = await axios.post(target, formData, config);
    return response.data;
  },

  deleteImage: async (propertyId, imageId) => {
    const { data } = await apiClient.delete(
      `/properties/${propertyId}/images/${imageId}`
    );
    return data;
  },
};

// Inquiries API
// Inquiries API removed — use direct contact channels

// Contact API
export const contactAPI = {
  sendMessage: async (messageData) => {
    const { data } = await apiClient.post('/contact', messageData);
    return data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const { data } = await apiClient.get('/dashboard/stats');
    // Dashboard endpoint returns { success: true, data: stats }
    // Return the inner stats object to make it easier for callers
    return data.data;
  },
};

// User Management API
export const userAPI = {
  // Agent-specific endpoints
  getAgentStats: async () => {
    const { data } = await apiClient.get('/agent/stats');
    return data.data;
  },
  // Get clients for a specific agent (admin only)
  getAgentClients: async (agentId) => {
    const { data } = await apiClient.get(`/users/agents/${agentId}/clients`);
    return data.data || [];
  },
  addClient: async (clientData) => {
    const { data } = await apiClient.post('/agent/clients', clientData);
    return data.data;
  },
  updateClient: async (clientId, clientData) => {
    const { data } = await apiClient.put(
      `/agent/clients/${clientId}`,
      clientData
    );
    return data.data;
  },

  deleteClient: async (clientId) => {
    const { data } = await apiClient.delete(`/agent/clients/${clientId}`);
    return data.data;
  },

  updatePassword: async (passwordData) => {
    const { data } = await apiClient.put('/auth/change-password', passwordData);
    return data.data;
  },
  // Get all users (admin only)
  getAll: async () => {
    const { data } = await apiClient.get('/users');
    return data.data;
  },

  // Create a new user (admin only)
  create: async (userData) => {
    const { data } = await apiClient.post('/users', userData);
    return data.data;
  },

  // Delete a user (admin only)
  delete: async (userId) => {
    const { data } = await apiClient.delete(`/users/${userId}`);
    return data;
  },

  // Update user role (admin only)
  updateRole: async (userId, role) => {
    const { data } = await apiClient.put(`/users/${userId}/role`, { role });
    return data.data;
  },

  // Toggle agent status (admin only)
  toggleStatus: async (userId, isActive) => {
    const { data } = await apiClient.patch(`/users/${userId}/status`, {
      isActive,
    });
    return data.data;
  },

  // Get user by ID (admin only)
  getById: async (userId) => {
    const { data } = await apiClient.get(`/users/${userId}`);
    return data.data;
  },
};

// News & Events API
export const newsEventsAPI = {
  // Admin methods
  adminGetAll: async (params) => {
    const { data } = await apiClient.get('/news-events/admin', { params });
    return data;
  },

  create: async (formData) => {
    const { data } = await apiClient.post('/news-events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  update: async (id, formData) => {
    const { data } = await apiClient.put(`/news-events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  delete: async (id) => {
    const { data } = await apiClient.delete(`/news-events/${id}`);
    return data;
  },

  // Public methods
  getAll: async (params) => {
    const { data } = await apiClient.get('/news-events', { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`/news-events/${id}`);
    return data;
  },
};
