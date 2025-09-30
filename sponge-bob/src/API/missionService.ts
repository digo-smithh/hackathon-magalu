// src/API/missionService.ts

import { Task } from '../types/task';
import api from './api';

export const getMissionByUserId = async (userId: string) => {
  const response = await api.get(`/users/${userId}/missions/`);
  return response.data;
}

export const getMission = async (missionId: string) => {
    const response = await api.get(`/missions/${missionId}/`);
    return response.data;
}

export const addParticipantToMission = async (missionId: string, userId: string) => {
    const response = await api.post(`/missions/${missionId}/participants/`, { userId });
    return response.data;
}

export const createMissionWithTasks = async (missionData: object) => {
    console.log("Enviando para o backend:", { mission: missionData });
    // CORRIGIDO: Garante que o payload esteja aninhado corretamente
    const response = await api.post(`/missions/with-tasks/`, { mission: missionData });
    return response.data;
}