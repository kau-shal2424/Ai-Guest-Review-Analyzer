import axios from 'axios';

const ADMIN_BASE = `${import.meta.env.VITE_API_BASE_URL}/admin`;

// Dashboard stats
export const fetchAdminDashboard = async () => {
  const res = await axios.get(`${ADMIN_BASE}/dashboard`);
  return res.data;
};

// All reviews system-wide (admin only)
export const fetchAllReviews = async (params = {}) => {
  const res = await axios.get(`${ADMIN_BASE}/reviews`, { params });
  return res.data;
};

// Users management
export const fetchAllUsers = async (params = {}) => {
  const res = await axios.get(`${ADMIN_BASE}/users`, { params });
  return res.data;
};

export const updateUser = async (userId, data) => {
  const res = await axios.put(`${ADMIN_BASE}/users/${userId}`, data);
  return res.data;
};

export const deleteUser = async (userId) => {
  await axios.delete(`${ADMIN_BASE}/users/${userId}`);
};

// Analytics
export const fetchAnalytics = async (period = 'all') => {
  const res = await axios.get(`${ADMIN_BASE}/analytics`, { params: { period } });
  return res.data;
};

// Export data (Full datasets for CSV & PDF)
export const fetchExportData = async () => {
  const res = await axios.get(`${ADMIN_BASE}/export-data`);
  return res.data;
};
