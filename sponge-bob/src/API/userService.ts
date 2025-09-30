
import api from './api';

export const getUser = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const getMissionsByUser = async (userId: string | undefined) => {
  const response = await api.get(`/users/${userId}/missions/`);

  return response.data;
};