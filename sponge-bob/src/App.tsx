import { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { AddMissionScreen, TaskStep } from './components/AddMissionScreen';
import { Toaster } from './components/ui/sonner';
import { GameList, Task } from './types/task';
import { createMissionWithTasks } from './API/missionService';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { LoginScreen } from './components/LoginScreen';
import { AICreateMissionScreen } from './components/AICreateMissionScreen';

type Screen = 'home' | 'game' | 'add-mission' | 'sign-up' | 'login' | 'ai-create-mission';

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

  const handleCreateAIMission = () => {
    setCurrentScreen('ai-create-mission');
  };

  const handleSaveMission = (missionData: {
    name: string;
    description: string;
    steps: TaskStep[]; // Recebe os 'steps' do formulário
  }) => {
    // Converte 'steps' do formulário para o formato 'Task' da API
    const tasks: Task[] = missionData.steps.map((step) => ({
      id: step.id,
      title: step.title,
      description: step.description,
      deadline: step.deadline,
      completed: false,
      points: step.points,
      isFinal: false,
      createdAt: new Date().toISOString(),
      bossType: step.bossType,
      bossName: step.bossName,
    }));

    // Lógica para a tarefa final
    if (tasks.length > 0) {
      tasks[tasks.length - 1].isFinal = true;
      tasks[tasks.length - 1].points *= 2;
    }
    
    // Monta o objeto final que será enviado para a API
    const finalMissionPayload = {
      name: missionData.name,
      description: missionData.description,
      createdBy: user ? user.id : '', // Adiciona o ID do usuário aqui
      tasks: tasks, // Envia o array de 'tasks' formatado
    };

    createMissionWithTasks(finalMissionPayload);

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

// 2. ALTERE SEU COMPONENTE APP PARA FICAR ASSIM:
//    Ele agora só serve para "envolver" o AppContent com o provedor.
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}