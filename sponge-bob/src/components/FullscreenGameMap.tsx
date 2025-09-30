import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BikiniBottomBackground } from './BikiniBottomBackground';
import { ArrowLeft, Trophy, Users, X } from 'lucide-react';
import { Task, Player, BossType } from '../types/task';

interface FullscreenGameMapProps {
  tasks: Task[];
  players: Player[];
  currentPlayer: Player;
  onBack: () => void;
  onToggleTask: (id: string) => void;
}

export function FullscreenGameMap({ tasks, players, currentPlayer, onBack, onToggleTask }: FullscreenGameMapProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sort tasks by creation date
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Calculate player position
  const getPlayerPosition = (player: Player) => {
    const completedTasksCount = sortedTasks.filter((task, index) => {
      if (player.isCurrentUser) {
        return task.completed;
      }
      return index < (player.totalPoints / 20);
    }).length;
    
    return Math.min(completedTasksCount, sortedTasks.length - 1);
  };

  // Generate path coordinates - vertical for mobile, winding for desktop
  const generatePathCoordinates = () => {
    const coordinates = [];
    
    // Handle edge cases
    if (sortedTasks.length === 0) {
      return [];
    }
    
    if (sortedTasks.length === 1) {
      return isMobile ? [{ x: 50, y: 50 }] : [{ x: 50, y: 50 }];
    }
    
    if (isMobile) {
      // Vertical path like Candy Crush (bottom to top)
      for (let i = 0; i < sortedTasks.length; i++) {
        const progress = i / (sortedTasks.length - 1);
        const y = 90 - (progress * 75); // Start at 90%, go to 15%
        
        // Zigzag pattern
        let x;
        const rowMod = i % 3;
        if (rowMod === 0) x = 25;
        else if (rowMod === 1) x = 50;
        else x = 75;
        
        coordinates.push({ x, y });
      }
    } else {
      // Desktop: winding path from bottom-left to top-right
      const pathSegments = [
        { x: 15, y: 75 }, // Start bottom-left
        { x: 25, y: 60 },
        { x: 40, y: 50 },
        { x: 55, y: 35 },
        { x: 70, y: 45 },
        { x: 80, y: 30 },
        { x: 85, y: 20 }  // End top-right
      ];
      
      for (let i = 0; i < sortedTasks.length; i++) {
        const progress = i / (sortedTasks.length - 1);
        const segmentIndex = Math.min(
          Math.floor(progress * (pathSegments.length - 1)),
          pathSegments.length - 2
        );
        const segmentProgress = (progress * (pathSegments.length - 1)) - segmentIndex;
        
        const current = pathSegments[segmentIndex];
        const next = pathSegments[segmentIndex + 1];
        
        const x = current.x + (next.x - current.x) * segmentProgress;
        const y = current.y + (next.y - current.y) * segmentProgress;
        
        coordinates.push({ x, y });
      }
    }
    
    return coordinates;
  };

  const pathCoordinates = generatePathCoordinates();

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

  const getStructureType = (index: number, task: Task) => {
    if (task.isFinal) return 'pineapple';
    if (index === 0) return 'rock';
    if (task.bossType && task.bossType !== 'none') return 'boss';
    if (index % 3 === 0) return 'krusty-krab';
    if (index % 2 === 0) return 'flower';
    return 'bubble';
  };

  // Handle case when there are no tasks
  if (sortedTasks.length === 0) {
    return (
      <div className="fixed inset-0 overflow-hidden">
        <BikiniBottomBackground />
        <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="bg-yellow-400 hover:bg-yellow-300 text-purple-800 border-2 border-purple-600 shadow-xl backdrop-blur-sm font-bold"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar
          </Button>
        </div>
        <div className="flex items-center justify-center h-full">
          <Card className="bg-yellow-100 border-3 border-pink-500 shadow-2xl max-w-md mx-4">
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🍍</div>
              <h3 className="text-pink-700 mb-2 font-bold">Nenhuma etapa ainda</h3>
              <p className="text-purple-700 text-sm font-semibold">
                Adicione etapas para começar sua aventura na Fenda do Biquíni! 🌊
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <BikiniBottomBackground />
      {/* Floating Header */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="bg-yellow-400 hover:bg-yellow-300 text-purple-800 border-2 border-purple-600 shadow-xl backdrop-blur-sm font-bold"
        >
          <ArrowLeft size={16} className="mr-2" />
          Voltar
        </Button>
        
        <div className="flex items-center gap-2">
          <Badge className="bg-pink-500 text-white border-2 border-purple-600 shadow-xl backdrop-blur-sm font-bold">
            <Users size={12} className="mr-1" />
            {players.length}
          </Badge>
          <Badge className="bg-yellow-400 text-purple-800 border-2 border-purple-600 shadow-xl backdrop-blur-sm font-bold">
            <Trophy size={12} className="mr-1" />
            {currentPlayer.totalPoints} ⭐
          </Badge>
        </div>
      </div>



      {/* Map Container - Scrollable */}
      <div className={`absolute inset-0 overflow-y-auto ${isMobile ? 'pt-20 pb-8' : 'pt-20 pb-20'}`}>
        <div className={`relative w-full ${isMobile ? 'min-h-[200vh]' : 'h-[800px]'} mx-auto max-w-7xl`}>
          {/* Sandy Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5DEB3" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#F4D03F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#E8D5A0" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            
            {pathCoordinates.length > 1 && (
              <path
                d={`M ${pathCoordinates[0].x}% ${pathCoordinates[0].y}% ${pathCoordinates
                  .slice(1)
                  .map(coord => `L ${coord.x}% ${coord.y}%`)
                  .join(' ')}`}
                stroke="url(#pathGradient)"
                strokeWidth="18"
                fill="none"
                strokeLinecap="round"
                className="drop-shadow-lg"
              />
            )}
          </svg>

          {/* Task Checkpoints */}
          {sortedTasks.map((task, index) => {
            const coord = pathCoordinates[index];
            if (!coord) return null;

            const structureType = getStructureType(index, task);
            const bossEmoji = getBossEmoji(task.bossType);

            return (
              <div
                key={task.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                onClick={() => setSelectedTask(task)}
              >
                <div className="relative transition-all duration-300 group-hover:scale-110">
                  {/* Pineapple House (Final Task) */}
                  {structureType === 'pineapple' && (
                    <div className="relative w-16 h-20">
                      <div className={`absolute bottom-0 w-full h-16 border-3 shadow-xl ${
                        task.completed 
                          ? 'bg-gradient-to-b from-green-500 to-green-600 border-green-800' 
                          : 'bg-gradient-to-b from-yellow-400 to-yellow-500 border-yellow-700'
                      }`} style={{
                        clipPath: 'polygon(20% 0%, 80% 0%, 95% 20%, 95% 80%, 80% 100%, 20% 100%, 5% 80%, 5% 20%)'
                      }} />
                      <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-8 ${
                        task.completed ? 'bg-green-600' : 'bg-green-500'
                      }`} style={{
                        clipPath: 'polygon(0% 100%, 20% 20%, 40% 80%, 60% 20%, 80% 80%, 100% 20%, 100% 100%)'
                      }} />
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-200 border-2 border-cyan-400 rounded-full" />
                    </div>
                  )}

                  {/* Rock (Starting Point) */}
                  {structureType === 'rock' && (
                    <div className="relative w-14 h-12">
                      <div className={`w-full h-full border-2 shadow-lg ${
                        task.completed 
                          ? 'bg-gradient-to-br from-green-600 to-green-700 border-green-800' 
                          : 'bg-gradient-to-br from-pink-400 to-pink-500 border-pink-600'
                      }`} style={{ borderRadius: '50% 50% 40% 40%' }} />
                    </div>
                  )}

                  {/* Boss Building */}
                  {structureType === 'boss' && bossEmoji && (
                    <div className="relative w-14 h-14">
                      <div className={`w-full h-full rounded-lg border-3 shadow-2xl flex items-center justify-center text-2xl ${
                        task.completed 
                          ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-700' 
                          : 'bg-gradient-to-br from-red-500 to-red-600 border-red-700 animate-pulse'
                      }`}>
                        {bossEmoji}
                      </div>
                    </div>
                  )}

                  {/* Krusty Krab */}
                  {structureType === 'krusty-krab' && (
                    <div className="relative w-12 h-14">
                      <div className={`absolute bottom-0 w-full h-10 border-2 shadow-lg ${
                        task.completed 
                          ? 'bg-gradient-to-t from-green-600 to-green-400 border-green-700' 
                          : 'bg-gradient-to-t from-red-500 to-red-400 border-red-700'
                      }`} />
                      <div className={`absolute bottom-8 w-full h-4 ${
                        task.completed ? 'bg-green-700' : 'bg-red-600'
                      }`} style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                    </div>
                  )}

                  {/* Flower */}
                  {structureType === 'flower' && (
                    <div className="relative w-10 h-12">
                      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-8 ${
                        task.completed ? 'bg-green-700' : 'bg-green-600'
                      }`} />
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`absolute w-3 h-3 rounded-full ${
                              task.completed ? 'bg-green-400 border-green-600' : 'bg-purple-400 border-purple-600'
                            } border-2`}
                            style={{
                              transform: `rotate(${i * 72}deg) translateY(-5px)`,
                              left: '50%',
                              top: '50%',
                              marginLeft: '-6px',
                              marginTop: '-6px'
                            }}
                          />
                        ))}
                        <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${
                          task.completed ? 'bg-green-500' : 'bg-yellow-400'
                        } border-2 border-yellow-600`} />
                      </div>
                    </div>
                  )}

                  {/* Bubble */}
                  {structureType === 'bubble' && (
                    <div className="relative w-10 h-10">
                      <div className={`w-full h-full rounded-full border-3 shadow-lg ${
                        task.completed 
                          ? 'bg-green-300/60 border-green-500' 
                          : 'bg-white/60 border-cyan-300'
                      }`} />
                      <div className="absolute top-1 left-1 w-3 h-3 bg-white/80 rounded-full" />
                    </div>
                  )}

                  {/* Task Number */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-300 to-pink-300 rounded-full text-xs font-bold flex items-center justify-center border-3 border-purple-500 shadow-lg text-purple-700">
                    {index + 1}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10 whitespace-nowrap">
                    <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-3 py-2 rounded-lg text-sm shadow-2xl border-2 border-yellow-400">
                      <div className="font-bold">{task.title}</div>
                      <div className="text-xs text-yellow-200">⭐ {task.points} pontos</div>
                    </div>
                    <div className="w-3 h-3 bg-pink-600 transform rotate-45 mx-auto -mt-1.5 border-l border-b border-yellow-400"></div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Players */}
          {players.map(player => {
            const position = getPlayerPosition(player);
            const coord = pathCoordinates[position];
            if (!coord) return null;

            const offsetX = (Math.random() - 0.5) * 8;
            const offsetY = (Math.random() - 0.5) * 8;

            return (
              <div
                key={player.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ 
                  left: `${coord.x + offsetX}%`, 
                  top: `${coord.y + offsetY}%` 
                }}
              >
                <div className="relative group">
                  <div className={`relative w-12 h-12 transition-all duration-300 hover:scale-110 ${
                    player.isCurrentUser ? 'animate-pulse' : ''
                  }`}>
                    <div className="absolute inset-0 border-2 border-amber-800 shadow-2xl" style={{
                      background: player.isCurrentUser 
                        ? 'linear-gradient(to bottom, #ffd700 0%, #ffed4e 30%, #d97706 60%, #92400e 100%)'
                        : 'linear-gradient(to bottom, #6b7280 0%, #9ca3af 30%, #374151 60%, #1f2937 100%)',
                      clipPath: 'polygon(30% 0%, 70% 0%, 80% 20%, 80% 40%, 90% 50%, 90% 80%, 70% 100%, 30% 100%, 10% 80%, 10% 50%, 20% 40%, 20% 20%)'
                    }} />
                    
                    <div className="absolute inset-1 rounded-lg overflow-hidden opacity-80">
                      <Avatar className="h-full w-full">
                        <AvatarImage src={player.avatar} alt={player.name} />
                        <AvatarFallback className="bg-amber-100 text-amber-800 font-bold text-xs">
                          {player.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {player.isCurrentUser && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xl">🍍</div>
                    )}
                  </div>

                  {/* Player tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30">
                    <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-2xl border-2 border-yellow-400">
                      <div className="font-bold">{player.name}</div>
                      <div className="text-xs text-yellow-200">⭐ {player.totalPoints} pontos</div>
                    </div>
                    <div className="w-3 h-3 bg-pink-600 transform rotate-45 mx-auto -mt-1.5 border-l border-b border-yellow-400"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTask(null)}>
          <Card className="bg-yellow-100 border-3 border-pink-500 shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-pink-700 font-bold text-xl">{selectedTask.title}</h3>
                  {selectedTask.description && (
                    <p className="text-purple-600 text-sm mt-2">{selectedTask.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTask(null)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <X size={20} />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className="bg-yellow-400 text-purple-800 border-2 border-purple-600 font-bold">
                  ⭐ {selectedTask.points} pontos
                </Badge>
                <Badge className="bg-purple-400 text-white border-2 border-purple-700 font-bold">
                  📅 {new Date(selectedTask.deadline).toLocaleDateString('pt-BR')}
                </Badge>
                {selectedTask.isFinal && (
                  <Badge className="bg-pink-500 text-white border-2 border-yellow-400 font-bold">
                    🏆 Tarefa Final
                  </Badge>
                )}
                {selectedTask.bossType && selectedTask.bossType !== 'none' && (
                  <Badge className="bg-red-500 text-white border-2 border-red-700 font-bold">
                    {getBossEmoji(selectedTask.bossType)} Chefão
                  </Badge>
                )}
              </div>

              <Button
                onClick={() => {
                  onToggleTask(selectedTask.id);
                  setSelectedTask(null);
                }}
                className={`w-full border-2 font-bold ${
                  selectedTask.completed
                    ? 'bg-gray-400 text-white border-gray-600 hover:bg-gray-500'
                    : 'bg-pink-500 text-white border-yellow-400 hover:bg-pink-600'
                }`}
              >
                {selectedTask.completed ? '✓ Completada' : 'Marcar como Completa'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}