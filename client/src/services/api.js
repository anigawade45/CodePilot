import axios from 'axios';
import { CONFIG } from '../constants/config';

const api = axios.create({
  baseURL: CONFIG.API_BASE_URL,
});

// Automatically inject the Supabase JWT into all requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const reviewService = {
  createReview: async (code, language) => {
    const response = await api.post('/review', { code, language });
    return response.data;
  },

  getReviews: async () => {
    const response = await api.get('/reviews');
    return response.data;
  },

  getReviewById: async (id) => {
    const response = await api.get(`/review/${id}`);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/review/${id}`);
    return response.data;
  },

  shareReview: async (id) => {
    const response = await api.post(`/review/${id}/share`);
    return response.data;
  }
};

export default api;
