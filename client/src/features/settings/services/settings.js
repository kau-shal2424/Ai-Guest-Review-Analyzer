import axios from 'axios';

const BASE = `${import.meta.env.VITE_API_BASE_URL}/settings`;

export const getSettings = async () => {
  const res = await axios.get(BASE);
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await axios.put(`${BASE}/profile`, data);
  return res.data;
};

export const changePassword = async (data) => {
  const res = await axios.put(`${BASE}/password`, data);
  return res.data;
};

export const updateNotifications = async (data) => {
  const res = await axios.put(`${BASE}/notifications`, data);
  return res.data;
};

export const updateTheme = async (theme) => {
  const res = await axios.put(`${BASE}/theme`, { theme });
  return res.data;
};

export const deleteAccount = async () => {
  await axios.delete(`${BASE}/account`);
};
