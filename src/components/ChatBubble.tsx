
import React from 'react';
import { Message } from '../types';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';
import LinkIcon from './icons/LinkIcon';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const { role, text, sources } = message;
  const isUser = role === 'user';

  const bubbleClasses = isUser
    ? 'bg-cyan-500/10 border-cyan-400/30 rounded-br-none'
    : 'bg-purple-500/10 border-purple-400/30 rounded-bl-none';

  const containerClasses = isUser ? 'justify-end' : 'justify-start';

  const Icon = isUser ? UserIcon : BotIcon;
  const iconClasses = isUser ? 'text-cyan-300' : 'text-purple-300';
  const iconContainerClasses = isUser ? 'ml-3 order-2' : 'mr-3 order-1';
  const textContainerClasses = isUser ? 'order-1' : 'order-2';

  return (
    <div className={`flex items-start my-4 ${containerClasses} fade-in-up`}>
      <div className={`flex-shrink-0 ${iconContainerClasses}`}>
        <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center border border-gray-700">
          <Icon className={`w-6 h-6 ${iconClasses}`} />
        </div>
      </div>
      <div className={`max-w-md md:max-w-2xl ${textContainerClasses}`}>
        <div className={`px-5 py-3 rounded-2xl shadow-lg border text-gray-200 backdrop-blur-sm ${bubbleClasses}`}>
          <p className="text-lg leading-relaxed whitespace-pre-wrap">{text}</p>
        </div>
        {!isUser && sources && sources.length > 0 && (
          <div className="mt-3 px-2">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Fuentes:</h4>
            <ul className="space-y-2">
              {sources.map((source, index) => (
                <li key={index} className="flex items-start">
                  <a
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors duration-200 text-sm group flex items-center gap-2"
                    title={source.title}
                  >
                    <LinkIcon className="w-4 h-4 flex-shrink-0 text-gray-500 group-hover:text-cyan-300" />
                    <span className="truncate">{source.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;