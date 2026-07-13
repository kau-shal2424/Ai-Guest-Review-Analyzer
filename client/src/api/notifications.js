import axios from 'axios';

const BASE = `${import.meta.env.VITE_API_BASE_URL}/notifications`;

export const fetchNotifications = async () => {
  const res = await axios.get(BASE);
  return res.data;
};

export const getUnreadCount = async () => {
  const res = await axios.get(`${BASE}/count`);
  return res.data.count;
};

export const markNotificationRead = async (id) => {
  const res = await axios.put(`${BASE}/${id}/read`);
  return res.data;
};

export const markAllRead = async () => {
  const res = await axios.put(`${BASE}/read-all`);
  return res.data;
};

export const deleteNotification = async (id) => {
  await axios.delete(`${BASE}/${id}`);
};
