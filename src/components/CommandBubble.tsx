import React, { useState } from 'react';
import { CommandInfo } from '../types';
import VoiceAccessIcon from './icons/VoiceAccessIcon';

const TerminalIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
);
  
const ClipboardIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
);

interface CommandBubbleProps {
  commandInfo: CommandInfo;
  introText: string;
}

const CommandBubble: React.FC<CommandBubbleProps> = ({ commandInfo, introText }) => {
  const [copyText, setCopyText] = useState('Copiar');

  const handleCopy = () => {
    navigator.clipboard.writeText(commandInfo.command);
    setCopyText('¡Copiado!');
    setTimeout(() => setCopyText('Copiar'), 2000);
  };

  const isCmdMode = commandInfo.type === 'cmd';

  const Icon = isCmdMode ? 
    <TerminalIcon className="w-6 h-6 text-cyan-300" /> :
    <VoiceAccessIcon className="w-6 h-6 text-purple-300" />;

  return (
    <div className="flex items-start my-4 justify-start fade-in-up">
      <div className="flex-shrink-0 mr-3 order-1">
        <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center border border-gray-700">
          {Icon}
        </div>
      </div>
      <div className="max-w-md md:max-w-2xl order-2">
        <div className="px-5 py-3 rounded-2xl rounded-bl-none shadow-lg backdrop-blur-sm bg-purple-500/10 border border-purple-500/20 text-gray-200">
          {introText && <p className="text-lg leading-relaxed whitespace-pre-wrap mb-4">{introText}</p>}
          
          <div className="bg-black/30 border border-gray-700/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider font-orbitron">
              {isCmdMode ? 'Comando CMD' : 'Comando de Voice Access'}
            </h3>

            {isCmdMode ? (
              <div className="flex items-center justify-between gap-4 bg-black/50 p-3 rounded-md font-mono text-cyan-300 border border-cyan-500/20">
                <span className="break-all">{commandInfo.command}</span>
                <button
                  onClick={handleCopy}
                  className="flex-shrink-0 flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1 rounded-md text-sm transition-colors border border-gray-600"
                  aria-label="Copiar comando"
                >
                  <ClipboardIcon className="w-4 h-4" />
                  {copyText}
                </button>
              </div>
            ) : (
              <div className="bg-black/50 p-4 rounded-md text-purple-300 text-lg font-medium italic border border-purple-500/20">
                <p className="text-center">"{commandInfo.command}"</p>
              </div>
            )}
            
            <p className="text-gray-300 mt-3 text-sm">{commandInfo.explanation}</p>
          </div>

          {isCmdMode ? (
            <div className="mt-4 bg-yellow-900/30 border border-yellow-700/40 text-yellow-300 p-3 rounded-lg text-sm">
              <p><strong className="font-semibold">Advertencia de seguridad:</strong> Por razones de seguridad, esta aplicación web no puede ejecutar comandos directamente. Debes copiar este comando y pegarlo manualmente en el Símbolo del sistema (CMD).</p>
            </div>
          ) : (
             <div className="mt-4 bg-purple-900/30 border border-purple-700/40 text-purple-300 p-3 rounded-lg text-sm">
              <p><strong className="font-semibold">Instrucción:</strong> Di este comando en voz alta mientras Windows Voice Access está activo (busca el icono del micrófono en la barra de tareas).</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandBubble;