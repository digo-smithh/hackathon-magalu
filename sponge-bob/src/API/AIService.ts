// src/API/aiService.ts

import api from './api';

// Interface para o formato de sugestão de tarefa retornado pela IA
interface TaskSuggestion {
    title: string;
    description: string;
    points: number;
}

/**
 * Envia um prompt para a API de IA e retorna uma lista de tarefas sugeridas.
 * @param prompt - A descrição da missão fornecida pelo usuário.
 * @returns Uma promessa que resolve para um array de sugestões de tarefas.
 */
export const planMissionWithAI = async (prompt: string): Promise<TaskSuggestion[]> => {
    const response = await api.post('/ai/plan-mission', { prompt });
    return response.data;
};