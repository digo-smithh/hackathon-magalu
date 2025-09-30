export function BikiniBottomBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Ocean gradient background */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(to bottom, #87CEEB 0%, #7DD3C0 40%, #66D9EF 70%, #F5DEB3 100%)',
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(255, 255, 0, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 90% 30%, rgba(255, 105, 180, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 50% 80%, rgba(218, 112, 214, 0.15) 0%, transparent 30%)
          `
        }}
      />

      {/* Floating Bubbles */}
      <div className="absolute top-20 left-10 w-12 h-12 rounded-full bg-white/30 animate-pulse shadow-lg" />
      <div className="absolute top-40 right-20 w-8 h-8 rounded-full bg-white/40 animate-pulse shadow-lg" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-1/4 w-16 h-16 rounded-full bg-white/25 animate-pulse shadow-lg" style={{ animationDelay: '2s' }} />
      <div className="absolute top-60 right-1/3 w-10 h-10 rounded-full bg-white/35 animate-pulse shadow-lg" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-20 right-16 w-14 h-14 rounded-full bg-white/30 animate-pulse shadow-lg" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-32 left-1/3 w-6 h-6 rounded-full bg-white/45 animate-pulse shadow-lg" style={{ animationDelay: '0.8s' }} />
      <div className="absolute bottom-60 right-1/4 w-9 h-9 rounded-full bg-white/35 animate-pulse shadow-lg" style={{ animationDelay: '1.2s' }} />

      {/* Kelp/Seaweed on sides */}
      <div className="absolute bottom-0 left-8 hidden md:block">
        <svg width="60" height="200" viewBox="0 0 60 200" className="opacity-60">
          <path
            d="M30 200 Q20 150 30 100 Q40 50 30 0"
            stroke="#2d7a4f"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="25" cy="40" rx="8" ry="15" fill="#3a9b65" opacity="0.8" />
          <ellipse cx="35" cy="80" rx="8" ry="15" fill="#3a9b65" opacity="0.8" />
          <ellipse cx="25" cy="120" rx="8" ry="15" fill="#3a9b65" opacity="0.8" />
          <ellipse cx="35" cy="160" rx="8" ry="15" fill="#3a9b65" opacity="0.8" />
        </svg>
      </div>

      <div className="absolute bottom-0 right-12 hidden md:block">
        <svg width="50" height="180" viewBox="0 0 50 180" className="opacity-60">
          <path
            d="M25 180 Q15 130 25 80 Q35 30 25 0"
            stroke="#2d7a4f"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="20" cy="35" rx="7" ry="12" fill="#3a9b65" opacity="0.8" />
          <ellipse cx="30" cy="70" rx="7" ry="12" fill="#3a9b65" opacity="0.8" />
          <ellipse cx="20" cy="105" rx="7" ry="12" fill="#3a9b65" opacity="0.8" />
          <ellipse cx="30" cy="140" rx="7" ry="12" fill="#3a9b65" opacity="0.8" />
        </svg>
      </div>

      <div className="absolute bottom-0 left-1/4 hidden lg:block">
        <svg width="40" height="150" viewBox="0 0 40 150" className="opacity-50">
          <path
            d="M20 150 Q12 110 20 70 Q28 30 20 0"
            stroke="#2d7a4f"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="16" cy="30" rx="6" ry="10" fill="#3a9b65" opacity="0.8" />
          <ellipse cx="24" cy="60" rx="6" ry="10" fill="#3a9b65" opacity="0.8" />
          <ellipse cx="16" cy="90" rx="6" ry="10" fill="#3a9b65" opacity="0.8" />
          <ellipse cx="24" cy="120" rx="6" ry="10" fill="#3a9b65" opacity="0.8" />
        </svg>
      </div>

      {/* Coral/Rocks on bottom */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 hidden md:block">
        <svg width="120" height="60" viewBox="0 0 120 60" className="opacity-70">
          {/* Sand mounds */}
          <ellipse cx="30" cy="50" rx="25" ry="15" fill="#E8D5A0" />
          <ellipse cx="70" cy="55" rx="30" ry="18" fill="#F4D03F" />
          <ellipse cx="100" cy="52" rx="22" ry="14" fill="#E8D5A0" />
          
          {/* Small rocks */}
          <ellipse cx="20" cy="45" rx="8" ry="6" fill="#CD8B76" opacity="0.8" />
          <ellipse cx="45" cy="48" rx="6" ry="5" fill="#B97A65" opacity="0.8" />
          <ellipse cx="85" cy="50" rx="7" ry="5" fill="#CD8B76" opacity="0.8" />
        </svg>
      </div>

      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/5 w-2 h-2 rounded-full bg-yellow-300/40 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
      <div className="absolute top-1/3 right-1/5 w-1.5 h-1.5 rounded-full bg-pink-300/40 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 rounded-full bg-purple-300/40 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.2s' }} />
    </div>
  );
}