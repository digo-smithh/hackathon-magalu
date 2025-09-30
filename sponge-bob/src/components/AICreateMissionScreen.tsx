import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Sparkles, Trash2, Edit2, Plus, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { BossType } from '../types/task';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AICreateMissionScreenProps {
  onBack: () => void;
  onSaveMission: (mission: {
    name: string;
    description: string;
    steps: Array<{
      id: string;
      title: string;
      description: string;
      points: number;
      deadline: string;
      bossType: BossType;
    }>;
  }) => void;
}

interface GeneratedTask {
  id: string;
  title: string;
  description: string;
  points: number;
  deadline: string;
  bossType: BossType;
}

export function AICreateMissionScreen({ onBack, onSaveMission }: AICreateMissionScreenProps) {
  const [aiPrompt, setAiPrompt] = useState('');
  const [missionName, setMissionName] = useState('');
  const [missionDescription, setMissionDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<GeneratedTask | null>(null);

  // Placeholder for AI generation - você substituirá isso pela sua integração de IA
  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Ops! 🐠', {
        description: 'Por favor, descreva sua missão primeiro.',
      });
      return;
    }

    setIsGenerating(true);

    // Simula processamento de IA (substitua com sua chamada de IA real)
    setTimeout(() => {
      // MOCK - Aqui você fará a chamada para sua API de IA
      // Exemplo de resposta esperada da IA:
      const mockAIResponse = {
        missionName: 'Missão Exemplo',
        missionDescription: 'Descrição gerada pela IA',
        tasks: [
          {
            id: `task-${Date.now()}-1`,
            title: 'Task 1 gerada pela IA',
            description: 'Descrição da primeira task',
            points: 10,
            deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            bossType: 'none' as BossType,
          },
          {
            id: `task-${Date.now()}-2`,
            title: 'Task 2 gerada pela IA',
            description: 'Descrição da segunda task',
            points: 15,
            deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            bossType: 'plankton' as BossType,
          },
        ],
      };

      // IMPORTANTE: Substitua esta parte com sua chamada de IA
      // const aiResponse = await fetch('SUA_API_DE_IA', {
      //   method: 'POST',
      //   body: JSON.stringify({ prompt: aiPrompt }),
      // });
      // const data = await aiResponse.json();

      setMissionName(mockAIResponse.missionName);
      setMissionDescription(mockAIResponse.missionDescription);
      setGeneratedTasks(mockAIResponse.tasks);
      
      toast.success('🧽 Missão gerada!', {
        description: 'Revise as tasks e faça ajustes se necessário.',
      });
      
      setIsGenerating(false);
    }, 2000);
  };

  const handleEditTask = (task: GeneratedTask) => {
    setEditingTaskId(task.id);
    setEditForm(task);
  };

  const handleSaveEdit = () => {
    if (!editForm) return;

    setGeneratedTasks(tasks =>
      tasks.map(task => task.id === editForm.id ? editForm : task)
    );
    setEditingTaskId(null);
    setEditForm(null);
    toast.success('✅ Task atualizada!');
  };

  const handleDeleteTask = (taskId: string) => {
    setGeneratedTasks(tasks => tasks.filter(task => task.id !== taskId));
    toast.success('🗑️ Task removida!');
  };

  const handleAddNewTask = () => {
    const newTask: GeneratedTask = {
      id: `task-${Date.now()}`,
      title: 'Nova Task',
      description: '',
      points: 10,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      bossType: 'none',
    };
    setGeneratedTasks([...generatedTasks, newTask]);
    handleEditTask(newTask);
  };

  const handleSaveMission = () => {
    if (!missionName.trim()) {
      toast.error('Ops! 📝', {
        description: 'Por favor, dê um nome para sua missão.',
      });
      return;
    }

    if (generatedTasks.length === 0) {
      toast.error('Ops! 📋', {
        description: 'Adicione pelo menos uma task à missão.',
      });
      return;
    }

    onSaveMission({
      name: missionName,
      description: missionDescription,
      steps: generatedTasks,
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #7DD3C0 50%, #F5DEB3 100%)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
            style={{ background: '#FFE135', color: '#030213' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl" style={{ color: '#FF0000' }}>
              ✨ Criar Missão com IA
            </h1>
            <p className="text-sm" style={{ color: '#030213', opacity: 0.7 }}>
              Descreva sua missão e deixe a IA gerar as tasks!
            </p>
          </div>
        </div>

        {/* AI Prompt Input */}
        <Card className="border-4" style={{ borderColor: '#FFE135', background: 'rgba(255, 255, 255, 0.95)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#DA70D6' }}>
              <Sparkles className="w-6 h-6" />
              Descreva sua Missão
            </CardTitle>
            <CardDescription>
              Escreva livremente sobre o que você quer fazer. A IA vai transformar em tasks organizadas!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Exemplo: Preciso organizar minha casa este final de semana. Quero limpar a sala, arrumar o quarto, fazer compras no mercado e preparar as refeições para a semana..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="min-h-[150px] border-2 focus:border-[#FF69B4]"
              disabled={isGenerating || generatedTasks.length > 0}
            />
            
            {generatedTasks.length === 0 && (
              <Button
                onClick={handleGenerateWithAI}
                disabled={isGenerating}
                className="w-full"
                style={{ background: '#FF69B4', color: '#ffffff' }}
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Gerando Missão...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar Missão com IA
                  </>
                )}
              </Button>
            )}

            {generatedTasks.length > 0 && (
              <Button
                onClick={() => {
                  setGeneratedTasks([]);
                  setMissionName('');
                  setMissionDescription('');
                  setAiPrompt('');
                }}
                variant="outline"
                className="w-full"
              >
                🔄 Gerar Nova Missão
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Generated Mission */}
        {generatedTasks.length > 0 && (
          <>
            {/* Mission Details */}
            <Card className="border-4" style={{ borderColor: '#66D9EF', background: 'rgba(255, 255, 255, 0.95)' }}>
              <CardHeader>
                <CardTitle style={{ color: '#FF0000' }}>📋 Detalhes da Missão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="missionName">Nome da Missão</Label>
                  <Input
                    id="missionName"
                    value={missionName}
                    onChange={(e) => setMissionName(e.target.value)}
                    className="border-2 focus:border-[#FFE135]"
                    placeholder="Ex: Limpeza da Casa"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="missionDescription">Descrição</Label>
                  <Textarea
                    id="missionDescription"
                    value={missionDescription}
                    onChange={(e) => setMissionDescription(e.target.value)}
                    className="border-2 focus:border-[#FFE135]"
                    placeholder="Descreva o objetivo da missão..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Generated Tasks */}
            <Card className="border-4" style={{ borderColor: '#FF69B4', background: 'rgba(255, 255, 255, 0.95)' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle style={{ color: '#DA70D6' }}>
                    🎯 Tasks Geradas ({generatedTasks.length})
                  </CardTitle>
                  <Button
                    onClick={handleAddNewTask}
                    size="sm"
                    style={{ background: '#00FF7F', color: '#030213' }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-lg border-2"
                    style={{ 
                      borderColor: editingTaskId === task.id ? '#FFE135' : '#E8D5A0',
                      background: editingTaskId === task.id ? '#FFFEF0' : '#ffffff'
                    }}
                  >
                    {editingTaskId === task.id && editForm ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-1 rounded" style={{ background: '#FFE135', color: '#030213' }}>
                            Task {index + 1}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              style={{ background: '#00FF7F', color: '#030213' }}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Salvar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingTaskId(null);
                                setEditForm(null);
                              }}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Título</Label>
                          <Input
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Descrição</Label>
                          <Textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Pontos</Label>
                            <Input
                              type="number"
                              value={editForm.points}
                              onChange={(e) => setEditForm({ ...editForm, points: parseInt(e.target.value) || 0 })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Prazo</Label>
                            <Input
                              type="date"
                              value={editForm.deadline}
                              onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Boss (Opcional)</Label>
                          <Select
                            value={editForm.bossType}
                            onValueChange={(value) => setEditForm({ ...editForm, bossType: value as BossType })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Sem Boss</SelectItem>
                              <SelectItem value="plankton">🦠 Plankton</SelectItem>
                              <SelectItem value="mermaid-man">🦸 Homem Sereia</SelectItem>
                              <SelectItem value="dennis">😈 Dennis</SelectItem>
                              <SelectItem value="bubble-bass">🐟 Bubble Bass</SelectItem>
                              <SelectItem value="flying-dutchman">👻 Holandês Voador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-1 rounded text-sm" style={{ background: '#FFE135', color: '#030213' }}>
                                Task {index + 1}
                              </span>
                              <span style={{ color: '#FF0000' }}>{task.title}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditTask(task)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex gap-4 text-sm mt-2">
                          <span className="px-2 py-1 rounded" style={{ background: '#FF69B4', color: '#ffffff' }}>
                            ⭐ {task.points} pts
                          </span>
                          <span className="px-2 py-1 rounded" style={{ background: '#7DD3C0', color: '#030213' }}>
                            📅 {new Date(task.deadline).toLocaleDateString('pt-BR')}
                          </span>
                          {task.bossType !== 'none' && (
                            <span className="px-2 py-1 rounded" style={{ background: '#DA70D6', color: '#ffffff' }}>
                              Boss: {task.bossType}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button
              onClick={handleSaveMission}
              className="w-full h-14"
              style={{ background: '#00FF7F', color: '#030213' }}
            >
              <Check className="w-5 h-5 mr-2" />
              Salvar Missão
            </Button>
          </>
        )}
      </div>
    </div>
  );
}