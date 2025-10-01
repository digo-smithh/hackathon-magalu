import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Waves, Fish, Shell } from 'lucide-react';
import { login } from '../auth/auth'
import { useAuth  } from '../auth/AuthProvider';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToSignUp: () => void;
}

export function LoginScreen({ onLoginSuccess, onNavigateToSignUp }: LoginScreenProps) {
  const { handleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Email e senha são obrigatórios.');

      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result && result.access_token) {

        await handleLogin(email, password);
        
        onLoginSuccess();
      } else {
        throw new Error('Token não recebido do servidor.');
      }

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" 
         style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #7DD3C0 50%, #F5DEB3 100%)' }}>
      
      {/* Animated bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              left: `${Math.random() * 100}%`,
              bottom: '-100px',
              background: 'rgba(255, 255, 255, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.6)',
              animation: `float-up ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-4" 
            style={{ borderColor: '#FFE135', background: 'rgba(255, 255, 255, 0.95)' }}>
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 rounded-full flex items-center justify-center"
                 style={{ background: '#FFE135' }}>
              <span className="text-5xl">🍍</span>
            </div>
          </div>
          <CardTitle className="text-3xl" style={{ color: '#FF0000' }}>
            QuestTasks
          </CardTitle>
          <CardDescription className="text-base">
            Entre na Fenda do Biquíni e comece suas aventuras!
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Username</Label>
              <Input
                id="email"
                type="text"
                placeholder="bob.esponja"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 focus:border-[#FFE135]"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 focus:border-[#FFE135]"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              style={{ 
                background: '#FFE135',
                color: '#030213'
              }}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Ainda não tem uma conta?{' '}
              <button
                type="button"
                onClick={onNavigateToSignUp}
                className="underline"
                style={{ color: '#FF0000' }}
                disabled={isLoading}
              >
                Criar conta
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes float-up {
          from {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
          to {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}