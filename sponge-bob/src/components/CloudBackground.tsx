import { ImageWithFallback } from './figma/ImageWithFallback';

export function CloudBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Sky Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200" />
      
      {/* Animated Clouds */}
      <div className="absolute top-10 left-0 w-96 h-48 opacity-70 animate-pulse">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1604361699483-c1c6ef4989e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGZsdWZmeSUyMGNsb3Vkc3xlbnwxfHx8fDE3NTkyNTYwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Nuvens flutuantes"
          className="w-full h-full object-cover rounded-full blur-sm"
        />
      </div>
      
      <div className="absolute top-20 right-10 w-80 h-40 opacity-60 animate-bounce" style={{ animationDuration: '4s' }}>
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1604361699483-c1c6ef4989e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGZsdWZmeSUyMGNsb3Vkc3xlbnwxfHx8fDE3NTkyNTYwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Nuvens flutuantes"
          className="w-full h-full object-cover rounded-full blur-sm"
        />
      </div>
      
      <div className="absolute bottom-32 left-20 w-72 h-36 opacity-50 animate-pulse" style={{ animationDelay: '2s' }}>
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1604361699483-c1c6ef4989e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGZsdWZmeSUyMGNsb3Vkc3xlbnwxfHx8fDE3NTkyNTYwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Nuvens flutuantes"
          className="w-full h-full object-cover rounded-full blur-sm"
        />
      </div>
    </div>
  );
}