// src/components/GameScreen.tsx

import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AddTaskModal } from './AddTaskModal';
import { TaskItem } from './TaskItem';
import { FullscreenGameMap } from './FullscreenGameMap';
import { ArrowLeft, Users, Trophy, List, Map } from 'lucide-react';
import { GameList, Task, Player } from '../types/task';
import { useAuth } from '../auth/AuthProvider';

interface GameScreenProps {
  gameList: GameList;
  onBack: () => void;
  onUpdateLists?: () => void;
}

export function GameScreen({ gameList, onBack }: GameScreenProps) {
  const { user: loggedInUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(gameList.tasks);
  const [showTaskList, setShowTaskList] = useState(false);

  // Mapeia os participantes recebidos do backend para o tipo 'Player' que o frontend utiliza
  const players: Player[] = gameList.participants.map(p => ({
    id: p.user.id,
    name: p.user.name,
    avatar: p.user.avatar || '',
    totalPoints: p.total_points,
    completedTasks: 0, // O backend não fornece este dado, então usamos um valor padrão
    totalTasks: gameList.tasks.length,
    isCurrentUser: p.user.id === loggedInUser?.id,
  }));

  // Tenta encontrar o jogador atual na lista de participantes
  let currentPlayer = players.find(p => p.isCurrentUser);

  // Se o jogador atual não for encontrado, verifica se ele é o criador da missão.
  // Se for, o adiciona à lista de jogadores para corrigir o erro.
  if (!currentPlayer && loggedInUser && gameList.createdById === loggedInUser.id) {
    const creatorAsPlayer: Player = {
      id: loggedInUser.id,
      name: loggedInUser.name,
      avatar: loggedInUser.avatar || '',
      totalPoints: 0, // O criador não tem pontos se não for um participante formal
      completedTasks: 0,
      totalTasks: gameList.tasks.length,
      isCurrentUser: true,
    };
    players.push(creatorAsPlayer);
    currentPlayer = creatorAsPlayer;
  }
  
  // Se mesmo assim o jogador não for encontrado, exibe uma mensagem de erro.
  if (!currentPlayer) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-yellow-100 text-purple-800">
            <h1 className="text-2xl font-bold mb-4">Erro: Acesso não autorizado.</h1>
            <p className="mb-8">Você não é o criador nem um participante desta missão.</p>
            <Button onClick={onBack} className="bg-pink-500 text-white">Voltar</Button>
        </div>
    );
  }

  const handleToggleTask = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === id) {
          const updatedTask = { ...task, completed: !task.completed };
          
          if (updatedTask.completed) {
            alert(`Checkpoint concluído! Você ganhou ${updatedTask.points} pontos! ⚡`);
          } else {
            alert('Checkpoint desmarcado');
          }
          
          return updatedTask;
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    alert('Checkpoint removido! 🗑️');
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    alert('Novo checkpoint adicionado! 🚀');
  };

  if (!showTaskList) {
    return (
      <FullscreenGameMap
        tasks={tasks}
        players={players}
        currentPlayer={currentPlayer}
        onBack={() => setShowTaskList(true)}
        onToggleTask={handleToggleTask}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(to bottom, #87CEEB 0%, #7DD3C0 40%, #66D9EF 70%, #F5DEB3 100%)',
      backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(255, 255, 0, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 90% 30%, rgba(255, 105, 180, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, rgba(218, 112, 214, 0.15) 0%, transparent 30%)
      `
    }}>
      <div className="bg-gradient-to-r from-pink-400/40 to-purple-400/40 backdrop-blur-sm border-b-4 border-yellow-400 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="bg-yellow-400/80 hover:bg-yellow-300 text-pink-700 border-2 border-pink-400 shadow-md"
              >
                <ArrowLeft size={16} className="mr-2" />
                Voltar
              </Button>
              
              <div>
                <h1 className="text-pink-600 font-bold text-xl drop-shadow-md">{gameList.name}</h1>
                <p className="text-purple-600">{gameList.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTaskList(false)}
                className="bg-yellow-300/80 border-2 border-purple-400 text-purple-700 hover:bg-yellow-200/80 shadow-md"
              >
                <Map size={16} className="mr-2" />
                Ver Mapa
              </Button>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-pink-300/80 text-pink-700 border-2 border-pink-500 shadow-sm">
                  <Users size={12} className="mr-1" />
                  {players.length}
                </Badge>
                <Badge variant="secondary" className="bg-yellow-300/80 text-yellow-800 border-2 border-yellow-500 shadow-sm font-bold">
                  <Trophy size={12} className="mr-1" />
                  {currentPlayer.totalPoints} ⭐
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-pink-600 text-xl font-bold drop-shadow-md">Etapas da Missão</h2>
            <AddTaskModal onAddTask={handleAddTask} />
          </div>
          
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
}