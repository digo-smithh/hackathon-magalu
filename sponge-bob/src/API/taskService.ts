import api from './api';

export const createTaskForMission = async (missionId: string, taskData: any) => {
    const response = await api.post(`/missions/${missionId}/tasks/`, taskData);
    return response.data;
};

export const getTasksByMission = async (missionId: string) => {
    const response = await api.get(`/missions/${missionId}/tasks/`);
    return response.data;
}