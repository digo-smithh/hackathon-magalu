import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Trophy, Target, Clock, Zap } from 'lucide-react';
import { Task, Player } from '../types/task';

interface GameProgressProps {
  tasks: Task[];
  currentPlayer: Player;
}

export function GameProgress({ tasks, currentPlayer }: GameProgressProps) {
  const completedTasks = tasks.filter(task => task.completed);
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
  
  const overdueTasks = tasks.filter(task => 
    !task.completed && new Date(task.deadline) < new Date()
  );
  
  const todayTasks = tasks.filter(task => {
    if (task.completed) return false;
    const today = new Date();
    const taskDate = new Date(task.deadline);
    return taskDate.toDateString() === today.toDateString();
  });
  
  const finalTasks = tasks.filter(task => task.isFinal);
  const completedFinalTasks = finalTasks.filter(task => task.completed);
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-blue-200 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center text-blue-800">
          <Target size={20} className="mr-2" />
          Seu Progresso
        </h2>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Trophy size={12} className="mr-1" />
          {currentPlayer.totalPoints} pontos
        </Badge>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Tarefas Completadas</span>
          <span className="text-sm font-medium text-blue-600">
            {completedTasks.length}/{totalTasks}
          </span>
        </div>
        <Progress
          value={progressPercentage}
          className="h-3"
        />
        <div className="text-xs text-gray-500 mt-1 text-center">
          {progressPercentage.toFixed(0)}% concluído
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Today's Tasks */}
        <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock size={16} className="text-orange-600 mr-2" />
              <span className="text-sm text-orange-700">Hoje</span>
            </div>
            <Badge variant="outline" className="border-orange-300 text-orange-700">
              {todayTasks.length}
            </Badge>
          </div>
        </div>
        
        {/* Overdue Tasks */}
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock size={16} className="text-red-600 mr-2" />
              <span className="text-sm text-red-700">Atrasadas</span>
            </div>
            <Badge variant="outline" className="border-red-300 text-red-700">
              {overdueTasks.length}
            </Badge>
          </div>
        </div>
        
        {/* Final Tasks */}
        <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Trophy size={16} className="text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-700">Finais</span>
            </div>
            <Badge variant="outline" className="border-yellow-300 text-yellow-700">
              {completedFinalTasks.length}/{finalTasks.length}
            </Badge>
          </div>
        </div>
        
        {/* Total Points */}
        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap size={16} className="text-green-600 mr-2" />
              <span className="text-sm text-green-700">Pontos</span>
            </div>
            <Badge variant="outline" className="border-green-300 text-green-700">
              {currentPlayer.totalPoints}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Completion Message */}
      {progressPercentage === 100 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="text-center">
            <Trophy size={24} className="mx-auto text-yellow-500 mb-2" />
            <p className="text-green-700 font-medium">Parabéns! Você completou todas as tarefas!</p>
            <p className="text-sm text-green-600 mt-1">
              Total: {currentPlayer.totalPoints} pontos conquistados! 🎉
            </p>
          </div>
        </div>
      )}
    </div>
  );
}