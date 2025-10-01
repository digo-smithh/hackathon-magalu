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
  email: string;
  username: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  createdMissions: string;
  participations: string;
}

export interface GameList {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  participants: Player[];
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}