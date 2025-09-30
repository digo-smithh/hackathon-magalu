import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Calendar, Clock, Trophy, Scroll, Skull } from 'lucide-react';
import { Task, BossType } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const getBossEmoji = (bossType?: BossType) => {
  switch (bossType) {
    case 'plankton': return '🦠';
    case 'mermaid-man': return '🦸';
    case 'dennis': return '💪';
    case 'bubble-bass': return '🐟';
    case 'flying-dutchman': return '👻';
    default: return null;
  }
};

const getBossName = (bossType?: BossType) => {
  switch (bossType) {
    case 'plankton': return 'Plâncton';
    case 'mermaid-man': return 'Sereia Elástico';
    case 'dennis': return 'Dennis';
    case 'bubble-bass': return 'Bubble Bass';
    case 'flying-dutchman': return 'Holandês Voador';
    default: return null;
  }
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const isOverdue = new Date(task.deadline) < new Date() && !task.completed;
  const timeLeft = Math.ceil((new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const bossEmoji = getBossEmoji(task.bossType);
  const bossName = getBossName(task.bossType);
  
  return (
    <div className={`p-5 rounded-xl border-3 transition-all duration-300 shadow-lg ${
      task.completed
        ? 'bg-green-300 border-green-600'
        : isOverdue
        ? 'bg-red-300 border-red-600 animate-pulse'
        : 'bg-yellow-200 border-pink-500 hover:border-purple-500 hover:shadow-xl'
    }`}>
      <div className="flex items-start gap-4">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="mt-1 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-600 border-2 w-5 h-5"
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-bold text-lg ${
                  task.completed ? 'line-through text-gray-500' : 'text-pink-700'
                }`}>
                  {task.title}
                </h3>
                {bossEmoji && (
                  <span className="text-xl" title={`Chefão: ${bossName}`}>
                    {bossEmoji}
                  </span>
                )}
              </div>
              
              {task.description && (
                <p className={`text-sm mb-2 ${
                  task.completed ? 'text-gray-400' : 'text-purple-600'
                }`}>
                  {task.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge className={`${
                  task.completed 
                    ? 'bg-green-500 text-white border-green-700' 
                    : 'bg-yellow-400 text-purple-800 border-purple-600'
                } border-2 font-bold`}>
                  <Trophy size={12} className="mr-1" />
                  {task.points} ⭐
                </Badge>
                
                <Badge className="bg-purple-400 text-white border-2 border-purple-700 font-bold">
                  <Calendar size={12} className="mr-1" />
                  {new Date(task.deadline).toLocaleDateString('pt-BR')}
                </Badge>
                
                {!task.completed && (
                  <Badge className={`border-2 font-bold ${
                    isOverdue 
                      ? 'bg-red-500 text-white border-red-700 animate-pulse' 
                      : timeLeft <= 1 
                      ? 'bg-orange-400 text-white border-orange-600' 
                      : 'bg-blue-400 text-white border-blue-600'
                  }`}>
                    <Clock size={12} className="mr-1" />
                    {isOverdue 
                      ? 'Expirado!' 
                      : timeLeft === 0 
                      ? 'Hoje!' 
                      : `${timeLeft} dias`
                    }
                  </Badge>
                )}

                {task.isFinal && (
                  <Badge className="bg-pink-500 text-white border-2 border-yellow-400 shadow-md font-bold">
                    🏆 Missão Final (Pontos Duplos!)
                  </Badge>
                )}

                {bossName && (
                  <Badge className="bg-red-500 text-white border-2 border-red-700 font-bold">
                    <Skull size={12} className="mr-1" />
                    {bossName}
                  </Badge>
                )}
              </div>
            </div>
            
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-100 rounded-lg"
              title="Remover etapa"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6L14 14M6 14L14 6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}