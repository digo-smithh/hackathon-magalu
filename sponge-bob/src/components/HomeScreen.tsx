import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Plus, Play, Users, Trophy, Sparkles } from 'lucide-react';
import { GameList } from '../types/task';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getMissionsByUser } from '../API/userService.ts';
import { useAuth } from '../auth/AuthProvider.tsx';

interface HomeScreenProps {
  onSelectList: (list: GameList) => void;
  onCreateMission: () => void;
  gameLists?: GameList[];
  onRefreshLists?: () => void;
}

export function HomeScreen({ onSelectList, onCreateMission }: HomeScreenProps) {
  const { user } = useAuth();
  const [missions, setMissions] = useState<GameList[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMissionsByUser(user?.id); // Replace '1' with actual user ID
        setMissions(data);
      }
      catch (error) {
        console.error('Error fetching missions:', error);
      }
    }
    
    fetchData();
  }, []);

   return (
    <div className="min-h-screen relative overflow-hidden" style={{ 

      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      
      backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(255, 255, 0, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 90% 30%, rgba(255, 105, 180, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, rgba(218, 112, 214, 0.15) 0%, transparent 30%),
        url('/fundo-menu.jpg')
      `
    }}>
      {/* Bikini Bottom Decorative Elements - Bubbles */}
      <div className="absolute top-20 left-10 w-12 h-12 rounded-full bg-white/30 animate-pulse" />
      <div className="absolute top-40 right-20 w-8 h-8 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-1/4 w-16 h-16 rounded-full bg-white/25 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-60 right-1/3 w-10 h-10 rounded-full bg-white/35 animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-20 right-16 w-14 h-14 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              {/* Pineapple Icon */}
              <div className="w-20 h-20 relative">
                <div className="absolute bottom-0 w-full h-16 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-lg" style={{
                  clipPath: 'polygon(20% 0%, 80% 0%, 95% 20%, 95% 80%, 80% 100%, 20% 100%, 5% 80%, 5% 20%)'
                }} />
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-gradient-to-t from-green-500 to-green-600" style={{
                  clipPath: 'polygon(0% 100%, 20% 0%, 40% 50%, 60% 0%, 80% 50%, 100% 0%, 100% 100%)'
                }} />
              </div>
              <Sparkles size={20} className="absolute -top-2 -right-2 text-pink-500 animate-pulse" />
            </div>
          </div>
          <h1 className="text-pink-600 text-5xl font-bold mb-4 drop-shadow-lg">
            Bob Esponja em: derrotando materias
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed">
            Mergulhe numa aventura epica na Fenda do Biquini!
            Crie tarefas e derrote seus amigos terminando-as primeiro!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg"
            onClick={onCreateMission}
            className="bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-600 hover:to-purple-600 border-blue-600 shadow-2xl px-8 py-6 rounded-lg transform hover:scale-105 transition-all duration-200"
          >
            <Plus size={20} className="mr-3" />
            Criar Nova Missão
          </Button>
        </div>

        {/* Game Lists Grid */}
        {missions.length > 0 && (
          <div>
            <h2 className="text-pink-600 text-2xl font-bold text-center mb-8 drop-shadow-md">
              Suas Missões na Fenda do Biquini
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {missions.map(list => (
                <Card 
                  key={list.id}
                  className="bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 border-4 border-yellow-400 shadow-2xl hover:shadow-pink-400/50 transition-all duration-300 hover:scale-105 cursor-pointer group"
                  onClick={() => onSelectList(list)}
                >
                  <CardHeader className="pb-3 bg-gradient-to-r from-yellow-200 to-pink-200 border-b-2 border-yellow-400">
                    <CardTitle className="text-pink-700 flex items-start justify-between">
                      <span className="leading-tight">{list.name}</span>
                      <Play size={16} className="text-purple-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardTitle>
                    <CardDescription className="text-purple-600">
                      {list.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-purple-700">
                        <Users size={14} className="mr-1" />
                        <span>{list.players.length} aventureir{list.players.length !== 1 ? 'os' : 'o'}</span>
                      </div>
                      
                      <div className="flex items-center text-yellow-700 font-bold">
                        <Trophy size={14} className="mr-1" />
                        <span>
                          {list.players.find(p => p.isCurrentUser)?.totalPoints || 0} ⭐
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex -space-x-2">
                      {list.players.slice(0, 3).map(player => (
                        <div
                          key={player.id}
                          className="w-8 h-8 rounded-full border-2 border-pink-400 overflow-hidden bg-gradient-to-br from-yellow-200 to-pink-200 shadow-md"
                        >
                          <ImageWithFallback
                            src={player.avatar}
                            alt={player.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {list.players.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-pink-400 bg-gradient-to-br from-yellow-200 to-pink-200 flex items-center justify-center text-xs text-purple-700 font-bold shadow-md">
                          +{list.players.length - 3}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {missions.length === 0 && (
          <Card className="bg-gradient-to-br from-yellow-200 to-pink-500 border-purple-400 shadow-2xl max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🍍</div>
              <h3 className="text-pink-700 mb-2 font-bold">Nenhuma missão criada</h3>
              <p className="text-purple-600 text-sm">
                Crie sua primeira missão e comece a competir com seus amigos na Fenda do Biquini!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}