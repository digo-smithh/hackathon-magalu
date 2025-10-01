// src/types/task.ts

// Define os tipos de chefões possíveis, incluindo 'none'
export type BossType = 'none' | 'fish-1' | 'fish-2' | 'fish-3' | 'fish-4' | 'fish-5' | 'fish-6';

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  completed: boolean;
  points: number;
  isFinal: boolean;
  createdAt: string;
  bossType?: BossType;
  bossName?: string; // Adicionado para o nome personalizado
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  totalPoints: number;
  completedTasks: number;
  totalTasks: number;
  isCurrentUser?: boolean;
  currentPosition?: number; // Position on the map (task index)
}

export interface GameList {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  participants: Player[]; // O campo foi corrigido de 'players' para 'participants'
  createdById: string; // O campo foi corrigido de 'createdBy' para 'createdById'
  createdAt: string;
  isActive: boolean;
}// src/types/task.ts

export type BossType = 'none' | 'fish-1' | 'fish-2' | 'fish-3' | 'fish-4' | 'fish-5' | 'fish-6';

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  completed: boolean;
  points: number;
  isFinal: boolean;
  createdAt: string;
  bossType?: BossType;
  bossName?: string;
}

// Este é o tipo que os componentes usarão internamente
export interface Player {
  id: string;
  name: string;
  avatar: string;
  totalPoints: number;
  completedTasks: number;
  totalTasks: number;
  isCurrentUser: boolean;
}

// Este é o formato real dos participantes que vêm do backend
export interface ParticipantResponse {
  user_id: string;
  total_points: number;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export interface GameList {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  participants: ParticipantResponse[]; // Usando o tipo correto da resposta do backend
  createdById: string;
  createdAt: string;
  isActive: boolean;
}