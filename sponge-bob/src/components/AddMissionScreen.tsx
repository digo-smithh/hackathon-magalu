import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Plus, X, Star, Flag, Skull } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { BossType } from '../types/task';
import { BikiniBottomBackground } from './BikiniBottomBackground';

export interface TaskStep {
  id: string;
  title: string;
  description: string;
  points: number;
  deadline: string;
  bossType: BossType;
  bossName: string;
}


interface AddMissionScreenProps {
  onBack: () => void;
  onSaveMission: (mission: {
    name: string;
    description: string;
    steps: TaskStep[]; // Ele envia um array de 'steps'
  }) => void;
}

export function AddMissionScreen({ onBack, onSaveMission }: AddMissionScreenProps) {
  const [missionName, setMissionName] = useState('');
  const [missionDescription, setMissionDescription] = useState('');
  const [steps, setSteps] = useState<TaskStep[]>([]);
  
  const [currentStep, setCurrentStep] = useState({
    title: '',
    description: '',
    points: 10,
    deadline: '',
    bossType: 'none' as BossType,
    bossName: ''
  });

  const bossOptions: { value: BossType; image: string }[] = [
    { value: 'fish-1', image: '/images/fish-5.png' },
    { value: 'fish-2', image: '/images/fish-2.png' },
    { value: 'fish-3', image: '/images/fish-3.png' },
    { value: 'fish-4', image: '/images/fish-4.png' },
    { value: 'fish-5', image: '/images/fish-6.png' },
    { value: 'fish-6', image: '/images/fish-7.png' }
  ];

  const handleAddStep = () => {
    if (!currentStep.title.trim()) { toast.error('Adicione um titulo para a etapa!'); return; }
    if (!currentStep.deadline) { toast.error('Adicione um prazo para a etapa!'); return; }
    
    const newStep: TaskStep = { id: Date.now().toString(), ...currentStep };

    setSteps([...steps, newStep]);
    setCurrentStep({ title: '', description: '', points: 10, deadline: '', bossType: 'none', bossName: '' });

    alert('Etapa adicionada! 🎉');
  };

  const handleRemoveStep = (id: string) => { setSteps(steps.filter(step => step.id !== id)); toast.info('Etapa removida'); };
  
  const handleSaveMission = () => {
    if (currentStep.bossType !== 'none' && !currentStep.bossName.trim()) { toast.error('Adicione um nome para o chefao!'); return; }
    if (!missionName.trim()) { toast.error('Adicione um nome para a missao!'); return; }
    if (steps.length === 0) { toast.error('Adicione pelo menos uma etapa!'); return; }

    onSaveMission({ 
        name: missionName, 
        description: missionDescription, 
        steps 
    });

    alert('Missao criada com sucesso! 🌟');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BikiniBottomBackground />
      {/* Header */}
      <div className="relative z-10 bg-pink-400 backdrop-blur-sm border-b-3 border-purple-600 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="bg-yellow-400 hover:bg-yellow-300 text-purple-800 border-2 border-purple-600 shadow-md font-bold">
                <ArrowLeft size={16} className="mr-2" /> Voltar
              </Button>
              <div>
                <h1 className="text-purple-800 font-bold text-2xl drop-shadow-lg">Nova Missao na Fenda do Biquini</h1>
                <p className="text-purple-700 font-semibold">Crie suas etapas e adicione aventureiros!</p>
              </div>
            </div>
            <Button onClick={handleSaveMission} className="bg-pink-500 hover:bg-pink-600 text-white border-2 border-yellow-400 shadow-xl font-bold">
              <Star size={16} className="mr-2" /> Salvar Missao
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Mission Info Card */}
          <Card className="border-3 border-pink-500 shadow-2xl bg-yellow-100">
            <CardHeader className="bg-pink-300 border-b-3 border-purple-500">
              <CardTitle className="text-purple-800 flex items-center font-bold">
                <Flag size={24} className="mr-3 text-purple-700" /> Informacões da Missao
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="missionName" className="text-purple-700">Nome da Missao*</Label>
                <Input id="missionName" value={missionName} onChange={(e) => setMissionName(e.target.value)} placeholder="Ex: Caca ao Tesouro da Lagosta Traicoeira" className="mt-1 bg-white/80 border-2 border-pink-300 focus:border-purple-400" />
              </div>
              <div>
                <Label htmlFor="missionDescription" className="text-purple-700">Descricao</Label>
                <Textarea id="missionDescription" value={missionDescription} onChange={(e) => setMissionDescription(e.target.value)} placeholder="Descreva a aventura epica na Fenda do Biquini..." className="mt-1 bg-white/80 border-2 border-pink-300 focus:border-purple-400" rows={3} />
              </div>
              <div>
          
                
                {currentStep.bossType !== 'none' && (
                  <div className="mt-4 mb-2">
                    <Label htmlFor="bossName" className="text-purple-700">Nome do Chefao*</Label>
                    <Input
                      id="bossName"
                      value={currentStep.bossName}
                      onChange={(e) => setCurrentStep({ ...currentStep, bossName: e.target.value })}
                      placeholder="Ex: Peixoto, o Conquistador"
                      className="mt-1 bg-white/80 border-2 border-pink-300 focus:border-purple-400"
                    />
                  </div>
                )}
                
                {/* 👇 ATUALIZAcaO 2: Grid com 3 colunas e botões menores */}
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {bossOptions.map((boss) => (
                    <button key={boss.value} type="button" onClick={() => setCurrentStep({ ...currentStep, bossType: boss.value })} className={`w-full h-24 p-1 rounded-lg border-2 flex items-center justify-center transition-all duration-200 overflow-hidden ${currentStep.bossType === boss.value ? 'border-purple-500 bg-purple-100 shadow-lg' : 'border-yellow-300 bg-white/80 hover:border-pink-400'}`}>
                      
                        <img src={boss.image} alt={boss.value} className="w-full h-full object-cover rounded-md" />
                      
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Steps List */}
          {steps.length > 0 && (
            <Card className="border-3 border-purple-500 shadow-2xl bg-pink-100">
              <CardHeader className="bg-purple-400 border-b-3 border-purple-600">
                <CardTitle className="text-white font-bold">Etapas da Missao ({steps.length})</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-3 p-4 rounded-lg bg-yellow-200 border-3 border-pink-500 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold border-2 border-purple-600 shadow-md">{index + 1}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-pink-700 font-bold">{step.title}</h3>
                        {step.bossType !== 'none' && (
                          <img src={bossOptions.find(b => b.value === step.bossType)?.image} alt={step.bossName} className="w-6 h-6 rounded-full object-cover border-2 border-red-500"/>
                        )}
                      </div>
                      {step.description && <p className="text-purple-600 text-sm mt-1">{step.description}</p>}
                      <div className="flex items-center space-x-4 mt-2 text-sm flex-wrap gap-1">
                        <span className="text-yellow-700 font-bold">⭐ {step.points} pontos</span>
                        <span className="text-purple-600">📅 {new Date(step.deadline).toLocaleDateString('pt-BR')}</span>
                        {step.bossType !== 'none' && <span className="text-red-600 font-bold">👾 {step.bossName}</span>}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveStep(step.id)} className="text-red-500 hover:text-red-700 hover:bg-red-100"><X size={16} /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Add Step Card */}
          <Card className="border-3 border-purple-500 shadow-2xl bg-yellow-100">
            <CardHeader className="bg-yellow-400 border-b-3 border-purple-500">
              <CardTitle className="text-purple-800 flex items-center font-bold"><Plus size={24} className="mr-3 text-purple-700" /> Adicionar Nova Etapa</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="stepTitle" className="text-purple-700">Titulo da Etapa*</Label>
                <Input id="stepTitle" value={currentStep.title} onChange={(e) => setCurrentStep({ ...currentStep, title: e.target.value })} placeholder="Ex: Encontrar a Espatula Dourada" className="mt-1 bg-white/80 border-2 border-yellow-300 focus:border-pink-400" />
              </div>
              <div>
                <Label htmlFor="stepDescription" className="text-purple-700">Descricao</Label>
                <Textarea id="stepDescription" value={currentStep.description} onChange={(e) => setCurrentStep({ ...currentStep, description: e.target.value })} placeholder="Detalhes sobre esta etapa..." className="mt-1 bg-white/80 border-2 border-yellow-300 focus:border-pink-400" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stepPoints" className="text-purple-700">Pontos</Label>
                  <Input id="stepPoints" type="number" min="1" value={currentStep.points} onChange={(e) => setCurrentStep({ ...currentStep, points: parseInt(e.target.value) || 10 })} className="mt-1 bg-white/80 border-2 border-yellow-300 focus:border-pink-400" />
                </div>
                <div>
                  <Label htmlFor="stepDeadline" className="text-purple-700">Prazo*</Label>
                  <Input id="stepDeadline" type="datetime-local" value={currentStep.deadline} onChange={(e) => setCurrentStep({ ...currentStep, deadline: e.target.value })} className="mt-1 bg-white/80 border-2 border-yellow-300 focus:border-pink-400" />
                </div>
              </div>
              <Button onClick={handleAddStep} className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold border-2 border-purple-600 shadow-lg"><Plus size={16} className="mr-2" /> Adicionar Etapa</Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="border-3 border-purple-400 shadow-xl bg-pink-100">
            <CardContent className="pt-6">
              <p className="text-purple-800 text-sm font-semibold">
                💡 <strong>Dica:</strong> Adicione varias etapas para criar uma jornada epica na Fenda do Biquini! A última etapa pode ser o desafio final com mais pontos! 🏆
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}