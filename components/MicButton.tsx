import React from 'react';
import MicIcon from './icons/MicIcon';
import LoadingIcon from './icons/LoadingIcon';

interface MicButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  onClick: () => void;
}

const MicButton: React.FC<MicButtonProps> = ({
  isListening,
  isProcessing,
  isSpeaking,
  onClick,
}) => {
  const isDisabled = isProcessing || isSpeaking;
  let buttonClasses = 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-400 shadow-purple-500/30';
  let icon = <MicIcon className="w-7 h-7" />;
  let ariaLabel = 'Empezar a grabar';

  if (isProcessing) {
    buttonClasses = 'bg-gray-700/50 border-gray-600 cursor-not-allowed';
    icon = <LoadingIcon className="w-7 h-7" />;
    ariaLabel = 'Procesando...';
  } else if (isSpeaking) {
    buttonClasses = 'bg-gray-700/50 border-gray-600 cursor-not-allowed';
    icon = <MicIcon className="w-7 h-7 text-gray-500" />;
    ariaLabel = 'El asistente está hablando';
  } else if (isListening) {
    buttonClasses = 'bg-red-500/30 hover:bg-red-500/40 border-red-400 shadow-red-500/40 animate-pulse';
    icon = <MicIcon className="w-7 h-7" />;
    ariaLabel = 'Dejar de grabar';
  }

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-500/50 border ${buttonClasses}`}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
};

export default MicButton;
