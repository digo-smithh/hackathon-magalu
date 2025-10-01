import api from './api';

export const planMission = async (prompt: string) => {
  const response = await api.post(`/ai/plan-mission/`, {prompt});
  return response.data;
}