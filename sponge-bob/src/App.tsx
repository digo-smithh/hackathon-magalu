// src/App.tsx

import { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { AddMissionScreen, TaskStep } from './components/AddMissionScreen';
import { Toaster } from './components/ui/sonner';
import { GameList, Task } from './types/task';
import { createMissionWithTasks, getMission } from './API/missionService';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { LoginScreen } from './components/LoginScreen';
import { AICreateMissionScreen } from './components/AICreateMissionScreen';
import { getMissionsByUser } from './API/userService';
import { toast } from 'sonner';

type Screen = 'home' | 'game' | 'add-mission' | 'sign-up' | 'login' | 'ai-create-mission';

function AppContent() {
  const { user } = useAuth();

  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedGameList, setSelectedGameList] = useState<GameList | null>(null);
  const [gameLists, setGameLists] = useState<GameList[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function loadGameLists() {
      if (user) {
        try {
          const missions = await getMissionsByUser(user.id);
          setGameLists(missions);
        } catch (error) {
          console.error("Erro ao buscar missões:", error);
          toast.error("Falha ao carregar as missões.");
        }
      }
    }
    loadGameLists();
  }, [refreshKey, user]);

  const handleSelectList = async (gameList: GameList) => {
    try {
      const fullGameList = await getMission(gameList.id);
      setSelectedGameList(fullGameList);
      setCurrentScreen('game');
    } catch (error) {
      console.error("Erro ao buscar detalhes da missão:", error);
      toast.error("Não foi possível carregar os detalhes da missão.");
    }
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedGameList(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCreateMission = () => {
    setCurrentScreen('add-mission');
  };

  const handleCreateAIMission = () => {
    setCurrentScreen('ai-create-mission');
  };

  const handleSaveMission = (missionData: {
    name: string;
    description: string;
    steps: TaskStep[];
  }) => {
    const tasks: Omit<Task, 'id'>[] = missionData.steps.map((step) => ({
      title: step.title,
      description: step.description,
      deadline: step.deadline,
      points: step.points,
      completed: false,
      isFinal: false,
      createdAt: new Date().toISOString(),
      bossType: step.bossType,
      bossName: step.bossName,
    }));

    if (tasks.length > 0) {
      tasks[tasks.length - 1].isFinal = true;
      tasks[tasks.length - 1].points *= 2;
    }
    
    const finalMissionPayload = {
      name: missionData.name,
      description: missionData.description,
      createdById: user ? user.id : '',
      tasks: tasks,
    };

    createMissionWithTasks(finalMissionPayload);

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
            onCreateAIMission={handleCreateAIMission}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
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

       {currentScreen === 'ai-create-mission' && (
          <AICreateMissionScreen
            onBack={handleBackToHome}
            onSaveMission={handleSaveMission}
          />
        )}
      </div>
      <Toaster position="top-center" />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}