import { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { AddMissionScreen } from './components/AddMissionScreen';
import { Toaster } from './components/ui/sonner';
import { GameList, Task } from './types/task';
import { createMissionWithTasks } from './API/missionService';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { LoginScreen } from './components/LoginScreen';

type Screen = 'home' | 'game' | 'add-mission' | 'sign-up' | 'login';

function AppContent() {
  const { user } = useAuth();

  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedGameListId, setSelectedGameListId] = useState<string | null>(null);
  const [gameLists, setGameLists] = useState<GameList[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadGameLists();
  }, [refreshKey]);

  const loadGameLists = () => {
    const lists = [] as GameList[];
    setGameLists(lists);
  };

  const handleSelectList = (gameList: GameList) => {
    setSelectedGameListId(gameList.id);
    setCurrentScreen('game');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedGameListId(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCreateMission = () => {
    setCurrentScreen('add-mission');
  };

  const handleSaveMission = (mission: {
    name: string;
    description: string;
    createdBy?: string;
    tasks: Array<{
      title: string;
      description: string;
      deadline: string;
      completed: boolean;
      points: number;
      isFinal: boolean;
      createdAt: string;
      bossType: string;
    }>;
  }) => {
    const tasks: Task[] = mission.tasks.map((step) => ({
      title: step.title,
      description: step.description,
      deadline: step.deadline,
      completed: false,
      points: step.points,
      isFinal: false,
      createdAt: new Date().toISOString(),
      bossType: step.bossType,
    }));

    if (tasks.length > 0) {
      tasks[tasks.length - 1].isFinal = true;
      tasks[tasks.length - 1].points *= 2;
    }
    
    mission = {
      ...mission,
      createdBy: user ? user.id : '',
    } 
    createMissionWithTasks(mission);

    alert('Missão criada com sucesso!');

    setRefreshKey(prev => prev + 1);
    setCurrentScreen('home');
  };

  const handleOnLoginSuccess = () => {


    setRefreshKey(prev => prev + 1);
    setCurrentScreen('home');
  }

  const handleOnNavigateToSignUp = () => {
    setRefreshKey(prev => prev + 1);
    setCurrentScreen('login'); 
  }

  const selectedGameList = gameLists.find(list => list.id === selectedGameListId) || null;

  // Lógica de renderização
  if (!user) {
    return <LoginScreen onLoginSuccess={handleOnLoginSuccess} onNavigateToSignUp={handleOnNavigateToSignUp}/>;
  }

  return (
    <>
      <div className="min-h-screen">
        {currentScreen === 'home' && (
          <HomeScreen 
            gameLists={gameLists}
            onSelectList={handleSelectList}
            onCreateMission={handleCreateMission}
            onRefreshLists={() => setRefreshKey(prev => prev + 1)}
          />
        )}
        
        {currentScreen === 'game' && selectedGameList && (
          <GameScreen 
            gameList={selectedGameList} 
            onBack={handleBackToHome}
            onUpdateLists={() => setRefreshKey(prev => prev + 1)}
          />
        )}
        
        {currentScreen === 'add-mission' && (
          <AddMissionScreen
            onBack={handleBackToHome}
            onSaveMission={handleSaveMission}
          />
        )}
      </div>
      <Toaster position="top-center" />
    </>
  );
}

// 2. ALTERE SEU COMPONENTE APP PARA FICAR ASSIM:
//    Ele agora só serve para "envolver" o AppContent com o provedor.
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}