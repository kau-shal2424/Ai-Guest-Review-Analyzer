import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/reviews';

export const fetchReviews = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const searchReviews = async (query) => {
  if (!query) return fetchReviews();
  const response = await axios.get(`${API_BASE_URL}/search`, {
    params: { q: query }
  });
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const updateReview = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data);
  return response.data;
};
