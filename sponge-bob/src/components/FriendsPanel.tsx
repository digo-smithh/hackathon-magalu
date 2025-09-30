import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { X, UserPlus, Trophy, Target } from 'lucide-react';
import { GameList, Player } from '../types/task';
import { toast } from 'sonner@2.0.3';

interface FriendsPanelProps {
  gameList: GameList;
  onClose: () => void;
  onUpdate: () => void;
}

const MOCK_AVATARS = [
  'https://images.unsplash.com/photo-1494790108755-2616b96e5c4f?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
];

export function FriendsPanel({ gameList, onClose, onUpdate }: FriendsPanelProps) {
  const [friendName, setFriendName] = useState('');

  const handleAddFriend = () => {
    if (!friendName.trim()) {
      toast.error('Digite o nome do aventureiro!');
      return;
    }

    const randomAvatar = MOCK_AVATARS[Math.floor(Math.random() * MOCK_AVATARS.length)];
    
    const updatedList = addPlayerToGameList(gameList.id, {
      name: friendName.trim(),
      avatar: randomAvatar,
      isCurrentUser: false,
    });

    if (updatedList) {
      toast.success(`🎉 ${friendName} entrou na aventura!`, {
        description: 'O aventureiro foi adicionado à missão!',
      });
      setFriendName('');
      onUpdate();
    }
  };

  // Sort players by points (descending)
  const sortedPlayers = [...gameList.players].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card 
        className="bg-yellow-100 border-3 border-purple-500 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-pink-400 p-6 border-b-3 border-purple-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center text-2xl border-3 border-purple-500 shadow-lg">
                👥
              </div>
              <div>
                <h2 className="text-white font-bold text-2xl drop-shadow-lg">Aventureiros</h2>
                <p className="text-yellow-100">Adicione amigos para competir!</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X size={24} />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Add Friend Section */}
          <div className="mb-6 p-4 bg-white/80 rounded-lg border-2 border-pink-300 shadow-md">
            <Label className="text-purple-700 mb-2 flex items-center gap-2">
              <UserPlus size={16} />
              Adicionar Novo Aventureiro
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                placeholder="Nome do aventureiro..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
                className="bg-white border-2 border-yellow-300 focus:border-purple-400"
              />
              <Button
                onClick={handleAddFriend}
                className="bg-pink-500 hover:bg-pink-600 text-white border-2 border-yellow-400 shadow-lg font-bold"
              >
                <UserPlus size={16} className="mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          {/* Players Leaderboard */}
          <div>
            <h3 className="text-pink-700 font-bold mb-4 flex items-center gap-2">
              <Trophy size={20} className="text-yellow-600" />
              Ranking de Aventureiros
            </h3>
            
            <div className="space-y-3">
              {sortedPlayers.map((player, index) => {
                const completionPercentage = player.totalTasks > 0 
                  ? Math.round((player.completedTasks / player.totalTasks) * 100)
                  : 0;

                return (
                  <div
                    key={player.id}
                    className={`p-4 rounded-lg border-3 shadow-md transition-all hover:scale-[1.02] ${
                      player.isCurrentUser
                        ? 'bg-yellow-300 border-pink-500 shadow-pink-400/50'
                        : 'bg-pink-100 border-purple-500'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Ranking Position */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 shadow-md ${
                        index === 0 
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 border-yellow-600 text-yellow-900 text-lg' 
                          : index === 1
                          ? 'bg-gradient-to-br from-gray-300 to-gray-400 border-gray-500 text-gray-800'
                          : index === 2
                          ? 'bg-gradient-to-br from-orange-400 to-orange-500 border-orange-600 text-orange-900'
                          : 'bg-gradient-to-br from-purple-300 to-purple-400 border-purple-500 text-purple-800'
                      }`}>
                        {index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </div>

                      {/* Avatar */}
                      <Avatar className="w-12 h-12 border-2 border-pink-400 shadow-md">
                        <AvatarImage src={player.avatar} alt={player.name} />
                        <AvatarFallback className="bg-gradient-to-br from-yellow-200 to-pink-200 text-purple-700 font-bold">
                          {player.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* Player Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-purple-700 font-bold">{player.name}</h4>
                          {player.isCurrentUser && (
                            <Badge className="bg-pink-500 text-white border-pink-600 text-xs">
                              Você
                            </Badge>
                          )}
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-purple-800 mb-1 font-bold">
                            <span>{player.completedTasks} de {player.totalTasks} etapas</span>
                            <span>{completionPercentage}%</span>
                          </div>
                          <div className="h-2 bg-purple-300 rounded-full overflow-hidden border border-purple-500">
                            <div 
                              className="h-full bg-pink-500 transition-all duration-500"
                              style={{ width: `${completionPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-700 font-bold">
                          <Trophy size={16} />
                          <span className="text-lg">{player.totalPoints}</span>
                        </div>
                        <div className="text-xs text-purple-600">pontos</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-6 p-4 bg-pink-200 rounded-lg border-2 border-purple-500">
            <p className="text-purple-800 text-sm font-semibold">
              💡 <strong>Dica:</strong> Os aventureiros competem para ver quem completa as etapas primeiro! 
              O ranking é atualizado em tempo real conforme vocês avançam na missão. 🏆
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}