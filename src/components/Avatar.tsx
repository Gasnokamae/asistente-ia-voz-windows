import React from 'react';

interface AvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  size?: 'small' | 'large';
}

const Avatar: React.FC<AvatarProps> = ({ isSpeaking, isListening, size = 'large' }) => {
  const isSmall = size === 'small';
  
  const containerSize = isSmall ? 48 : 200;
  const orbSize = isSmall ? 36 : 150;
  const waveStartSize = orbSize;
  const waveEndSize = orbSize * 2;
  const waveStartMargin = -orbSize / 2;
  const waveEndMargin = -orbSize;

  return (
    <>
      <style>{`
        .orb-container-${size} {
          position: relative;
          width: ${containerSize}px;
          height: ${containerSize}px;
          margin: 0 auto;
        }

        .orb-container-${size} .orb {
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${orbSize}px;
          height: ${orbSize}px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #a2fafa, #00ffff, #320a5c, #0a0a1a);
          box-shadow: 
            0 0 ${isSmall ? 2 : 10}px #00ffff, 
            0 0 ${isSmall ? 4 : 20}px #00ffff,
            0 0 ${isSmall ? 8 : 40}px #00ffff, 
            0 0 ${isSmall ? 16 : 80}px #c000ff,
            inset 0 0 ${isSmall ? 4 : 20}px rgba(255, 255, 255, 0.3);
          animation: breathe-${size} 5s ease-in-out infinite;
          transition: transform 0.3s ease;
        }

        .orb-container-${size}.orb-listening .orb {
            animation: breathe-${size} 2s ease-in-out infinite;
            transform: translate(-50%, -50%) scale(1.05);
        }

        @keyframes breathe-${size} {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.03); }
        }

        .orb-container-${size} .wave {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          border: ${isSmall ? 1 : 2}px solid var(--cyan-glow);
          opacity: 0;
          pointer-events: none;
        }

        .orb-container-${size}.speaking .wave {
          animation: wave-animation-${size} 2s ease-out infinite;
        }
        
        .orb-container-${size}.speaking .wave-2 { animation-delay: 0.5s; }
        .orb-container-${size}.speaking .wave-3 { animation-delay: 1s; }
        .orb-container-${size}.speaking .wave-4 { animation-delay: 1.5s; }

        @keyframes wave-animation-${size} {
          0% {
            width: ${waveStartSize}px;
            height: ${waveStartSize}px;
            margin-top: ${waveStartMargin}px;
            margin-left: ${waveStartMargin}px;
            opacity: 0.8;
          }
          100% {
            width: ${waveEndSize}px;
            height: ${waveEndSize}px;
            margin-top: ${waveEndMargin}px;
            margin-left: ${waveEndMargin}px;
            opacity: 0;
          }
        }
      `}</style>
      <div className={`orb-container-${size} ${isSpeaking ? 'speaking' : ''} ${isListening ? 'orb-listening' : ''}`}>
        <div className="wave wave-1"></div>
        <div className="wave wave-2"></div>
        <div className="wave wave-3"></div>
        <div className="wave wave-4"></div>
        <div className="orb"></div>
      </div>
    </>
  );
};

export default Avatar;
