import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Trophy, CheckCircle, Clock, Users, Flag } from 'lucide-react';
import { Task, Player } from '../types/task';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface GameMapProps {
  tasks: Task[];
  players: Player[];
  currentPlayer: Player;
}

export function GameMap({ tasks, players, currentPlayer }: GameMapProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Sort tasks by creation date to create the path
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Calculate player positions based on completed tasks
  const getPlayerPosition = (player: Player) => {
    const completedTasksCount = sortedTasks.filter((task, index) => {
      // Simulate different progress for different players
      if (player.isCurrentUser) {
        return task.completed;
      }
      // Mock progress for other players based on their totalPoints
      return index < (player.totalPoints / 20); // Rough calculation
    }).length;
    
    return Math.min(completedTasksCount, sortedTasks.length - 1);
  };

  // Generate path coordinates for the map
  const generatePathCoordinates = () => {
    const coordinates = [];
    const centerX = 50;
    const centerY = 50;
    const radius = 35;
    
    for (let i = 0; i < sortedTasks.length; i++) {
      const angle = (i / (sortedTasks.length - 1)) * Math.PI * 1.5 - Math.PI * 0.25;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      coordinates.push({ x, y });
    }
    
    return coordinates;
  };

  const pathCoordinates = generatePathCoordinates();

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-blue-800">
          <div className="flex items-center">
            <MapPin size={20} className="mr-2" />
            Mapa da Aventura
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Users size={12} className="mr-1" />
            {players.length} jogadores
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Map Container */}
        <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 border-2 border-blue-200">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-30">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1709149003766-4755fe533cc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHBhdGglMjB0cmFpbHxlbnwxfHx8fDE3NTkyNTYyODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Trilha da aventura"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Clouds */}
          <div className="absolute top-4 left-8 w-16 h-8 bg-white/70 rounded-full animate-pulse" />
          <div className="absolute top-12 right-12 w-20 h-10 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-8 left-16 w-12 h-6 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

          {/* Task Path */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            
            {/* Path Line */}
            {pathCoordinates.length > 1 && (
              <path
                d={`M ${pathCoordinates[0].x}% ${pathCoordinates[0].y}% ${pathCoordinates
                  .slice(1)
                  .map(coord => `L ${coord.x}% ${coord.y}%`)
                  .join(' ')}`}
                stroke="url(#pathGradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="10,5"
                className="animate-pulse"
              />
            )}
          </svg>

          {/* Task Checkpoints */}
          {sortedTasks.map((task, index) => {
            const coord = pathCoordinates[index];
            if (!coord) return null;

            return (
              <div
                key={task.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                onClick={() => setSelectedTask(task)}
              >
                {/* Checkpoint Marker */}
                <div className={`relative w-8 h-8 rounded-full border-3 transition-all duration-300 group-hover:scale-125 ${
                  task.completed
                    ? 'bg-green-500 border-green-600 shadow-lg shadow-green-500/50'
                    : task.isFinal
                    ? 'bg-yellow-500 border-yellow-600 shadow-lg shadow-yellow-500/50 animate-pulse'
                    : 'bg-blue-500 border-blue-600 shadow-lg shadow-blue-500/50'
                }`}>
                  {task.completed ? (
                    <CheckCircle size={16} className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  ) : task.isFinal ? (
                    <Trophy size={16} className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  ) : (
                    <Clock size={16} className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>

                {/* Task Number */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full text-xs flex items-center justify-center border border-gray-300">
                  {index + 1}
                </div>

                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                    {task.title}
                  </div>
                  <div className="w-2 h-2 bg-black/80 transform rotate-45 mx-auto -mt-1"></div>
                </div>
              </div>
            );
          })}

          {/* Player Avatars */}
          {players.map(player => {
            const position = getPlayerPosition(player);
            const coord = pathCoordinates[position];
            if (!coord) return null;

            return (
              <div
                key={player.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: `${coord.x + (Math.random() - 0.5) * 8}%`, 
                  top: `${coord.y + (Math.random() - 0.5) * 8}%` 
                }}
              >
                <div className="relative group">
                  <Avatar className={`h-12 w-12 border-3 transition-all duration-300 hover:scale-110 ${
                    player.isCurrentUser 
                      ? 'border-yellow-400 shadow-lg shadow-yellow-400/50' 
                      : 'border-white shadow-lg'
                  }`}>
                    <AvatarImage src={player.avatar} alt={player.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {player.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Player name tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      {player.name}
                      <br />
                      <span className="text-yellow-300">{player.totalPoints} pts</span>
                    </div>
                    <div className="w-2 h-2 bg-black/80 transform rotate-45 mx-auto -mt-1"></div>
                  </div>

                  {/* Crown for leader */}
                  {players.findIndex(p => p.totalPoints >= player.totalPoints) === 0 && players.length > 1 && (
                    <div className="absolute -top-2 -right-2">
                      <Trophy size={16} className="text-yellow-500 fill-yellow-500" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Finish Line */}
          {pathCoordinates.length > 0 && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: `${pathCoordinates[pathCoordinates.length - 1].x}%`, 
                top: `${pathCoordinates[pathCoordinates.length - 1].y}%` 
              }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-white to-red-500 rounded-full border-4 border-yellow-400 flex items-center justify-center animate-pulse">
                <Flag size={20} className="text-yellow-600" />
              </div>
            </div>
          )}
        </div>

        {/* Task Details Panel */}
        {selectedTask && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-blue-800">{selectedTask.title}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTask(null)}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </Button>
            </div>
            {selectedTask.description && (
              <p className="text-sm text-blue-700 mb-2">{selectedTask.description}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-blue-600">
                <span>Prazo: {new Date(selectedTask.deadline).toLocaleDateString('pt-BR')}</span>
                <Badge variant={selectedTask.completed ? 'default' : 'outline'} className={
                  selectedTask.completed ? 'bg-green-100 text-green-800' : ''
                }>
                  {selectedTask.points} pts
                </Badge>
                {selectedTask.isFinal && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Final
                  </Badge>
                )}
              </div>
              <div className={`text-sm font-medium ${
                selectedTask.completed ? 'text-green-600' : 'text-blue-600'
              }`}>
                {selectedTask.completed ? '✓ Concluída' : 'Pendente'}
              </div>
            </div>
          </div>
        )}

        {/* Map Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Concluída</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Pendente</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            <span>Tarefa Final</span>
          </div>
          <div className="flex items-center space-x-1">
            <Avatar className="h-3 w-3 border border-yellow-400">
              <AvatarFallback className="bg-blue-100"></AvatarFallback>
            </Avatar>
            <span>Jogadores</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}