import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Plus, Trophy, Sparkles, Skull } from 'lucide-react';
import { Task, BossType } from '../types/task';

interface AddTaskModalProps {
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
}

export function AddTaskModal({ onAddTask }: AddTaskModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [points, setPoints] = useState(10);
  const [isFinal, setIsFinal] = useState(false);
  const [bossType, setBossType] = useState<BossType>('none');

  const bossOptions: { value: BossType; label: string; emoji: string }[] = [
    { value: 'none', label: 'Sem Chefão', emoji: '🌊' },
    { value: 'plankton', label: 'Plâncton', emoji: '🦠' },
    { value: 'mermaid-man', label: 'Sereia Elástico', emoji: '🦸' },
    { value: 'dennis', label: 'Dennis', emoji: '💪' },
    { value: 'bubble-bass', label: 'Bubble Bass', emoji: '🐟' },
    { value: 'flying-dutchman', label: 'Holandês Voador', emoji: '👻' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !deadline) return;
    
    onAddTask({
      title: title.trim(),
      description: description.trim(),
      deadline,
      points: isFinal ? points * 2 : points,
      isFinal,
      bossType
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setDeadline('');
    setPoints(10);
    setIsFinal(false);
    setBossType('none');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-pink-500 hover:bg-pink-600 text-white shadow-lg border-2 border-yellow-400 font-bold">
          <Plus size={16} className="mr-2" />
          Nova Etapa
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md border-3 border-purple-500 bg-yellow-100">
        <DialogHeader>
          <DialogTitle className="text-pink-700 flex items-center">
            <Sparkles size={20} className="mr-2" />
            Criar Nova Etapa
          </DialogTitle>
          <DialogDescription className="text-purple-700">
            Adicione uma nova etapa à sua missão na Fenda do Biquíni
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-purple-700">Nome da Etapa*</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Encontrar a Espátula Dourada"
              className="mt-1 bg-white/80 border-2 border-yellow-300"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-purple-700">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes sobre esta etapa..."
              className="mt-1 bg-white/80 border-2 border-yellow-300"
              rows={3}
            />
          </div>
          
          <div>
            <Label className="text-purple-700 flex items-center gap-2 mb-2">
              <Skull size={16} />
              Chefão da Etapa
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {bossOptions.map((boss) => (
                <button
                  key={boss.value}
                  type="button"
                  onClick={() => setBossType(boss.value)}
                  className={`p-2 rounded-lg border-2 transition-all duration-200 text-center hover:scale-105 ${
                    bossType === boss.value
                      ? 'border-purple-500 bg-purple-100 shadow-lg'
                      : 'border-yellow-300 bg-white/80 hover:border-pink-400'
                  }`}
                >
                  <div className="text-xl mb-1">{boss.emoji}</div>
                  <div className="text-xs font-bold text-purple-700">{boss.label}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deadline" className="text-purple-700">Prazo*</Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 bg-white/80 border-2 border-yellow-300"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="points" className="text-purple-700">Pontos</Label>
              <Input
                id="points"
                type="number"
                min="1"
                max="100"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="mt-1 bg-white/80 border-2 border-yellow-300"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-pink-200 border-2 border-purple-500">
            <Checkbox
              id="isFinal"
              checked={isFinal}
              onCheckedChange={(checked) => setIsFinal(checked as boolean)}
            />
            <Label htmlFor="isFinal" className="flex items-center cursor-pointer text-purple-800 font-bold">
              <Trophy size={16} className="mr-2 text-yellow-700" />
              Missão Final (dobra os pontos!)
            </Label>
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-2 border-purple-500 text-purple-700 hover:bg-purple-100 font-bold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white border-2 border-yellow-400 font-bold"
            >
              Criar Etapa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}