import axios from 'axios';

const BASE = `${import.meta.env.VITE_API_BASE_URL}/reviews`;

// Fetch only the authenticated user's own reviews
export const fetchUserReviews = async () => {
  const response = await axios.get(BASE);
  return response.data;
};

export const searchUserReviews = async (query) => {
  if (!query) return fetchUserReviews();
  const response = await axios.get(`${BASE}/search`, { params: { q: query } });
  return response.data;
};

export const filterUserReviews = async (params) => {
  const response = await axios.get(`${BASE}/filter`, { params });
  return response.data;
};

export const getUserReview = async (id) => {
  const response = await axios.get(`${BASE}/${id}`);
  return response.data;
};

export const createUserReview = async (data) => {
  const response = await axios.post(BASE, data);
  return response.data;
};

export const updateUserReview = async (id, data) => {
  const response = await axios.put(`${BASE}/${id}`, data);
  return response.data;
};

export const deleteUserReview = async (id) => {
  const response = await axios.delete(`${BASE}/${id}`);
  return response.data;
};
