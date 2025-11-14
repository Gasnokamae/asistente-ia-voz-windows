import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { sendMessageToGemini } from './services/geminiService';
import { Message } from './types';
import Avatar from './components/Avatar';
import ChatBubble from './components/ChatBubble';
import CommandBubble from './components/CommandBubble';
import MicButton from './components/MicButton';
import SendIcon from './components/icons/SendIcon';

// --- Helper Component: ApiKeyModal ---
const ApiKeyModal: React.FC<{ onSave: (key: string) => void }> = ({ onSave }) => {
    const [key, setKey] = useState('');
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-lg">
            <div className="bg-bg-dark border border-cyan-glow/50 rounded-2xl p-8 w-full max-w-md text-center shadow-2xl shadow-cyan-glow/20 fade-in-up">
                <h2 className="text-2xl font-orbitron text-cyan-glow mb-4">Configuración Requerida</h2>
                <p className="text-gray-300 mb-6">Por favor, ingresa tu clave de API de Google Gemini para continuar. Tu clave se guardará localmente en tu navegador.</p>
                <input
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Pega tu API Key aquí"
                    className="w-full bg-black/50 border border-cyan-400/50 rounded-lg text-white p-3 text-center focus:outline-none focus:ring-2 focus:ring-cyan-glow transition-all"
                    aria-label="API Key Input"
                />
                <button
                    onClick={() => key.trim() && onSave(key.trim())}
                    disabled={!key.trim()}
                    className="mt-6 w-full bg-cyan-400/80 hover:bg-cyan-300 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg text-lg transition-all duration-300"
                >
                    Guardar y Empezar
                </button>
                <p className="mt-4 text-xs text-gray-400">
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                        Obtén una clave de API de Google AI Studio
                    </a>
                </p>
            </div>
        </div>
    );
};

// --- Helper Component: HistoryModal ---
const HistoryModal: React.FC<{ isOpen: boolean; onClose: () => void; history: Message[]; onClearHistory: () => void; }> = ({ isOpen, onClose, history, onClearHistory }) => {
    if (!isOpen) return null;

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'user' | 'model'>('all');

    const filteredHistory = useMemo(() => {
        return history
            .filter(item => {
                const matchesType = filterType === 'all' || item.role === filterType;
                const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesType && matchesSearch;
            })
            .slice()
            .reverse();
    }, [history, searchTerm, filterType]);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-lg fade-in-up">
            <div className="bg-bg-dark border border-purple-glow/50 rounded-2xl p-6 w-full max-w-3xl h-[80vh] text-left shadow-2xl shadow-purple-glow/20 flex flex-col">
                <div className="flex justify-between items-center pb-4 border-b border-purple-400/30 mb-4">
                    <h2 className="text-xl font-orbitron text-purple-glow">Historial de Chat</h2>
                    <button onClick={onClose} className="text-white text-3xl hover:text-purple-300 transition-colors">&times;</button>
                </div>
                <div className="flex gap-4 mb-4">
                    <input type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-grow bg-black/50 border border-purple-400/50 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-glow transition-all" />
                    <select value={filterType} onChange={e => setFilterType(e.target.value as any)} className="bg-black/50 border border-purple-400/50 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-glow transition-all appearance-none text-center">
                        <option value="all">Todos</option>
                        <option value="user">Usuario</option>
                        <option value="model">Asistente</option>
                    </select>
                </div>
                <div className="flex-grow overflow-y-auto pr-2">
                    {filteredHistory.length > 0 ? filteredHistory.map((item, index) => (
                        <div key={index} className={`p-3 rounded-lg mb-3 border-l-4 ${item.role === 'user' ? 'bg-cyan-500/10 border-cyan-400' : 'bg-purple-500/10 border-purple-400'}`}>
                            <p className="text-gray-300 whitespace-pre-wrap break-words">{item.text}</p>
                        </div>
                    )) : <p className="text-center text-gray-500 mt-8">No se encontraron resultados.</p>}
                </div>
                <div className="pt-4 border-t border-purple-400/30 mt-4 text-right">
                    <button onClick={onClearHistory} className="bg-pink-glow/80 hover:bg-pink-glow text-white font-bold py-2 px-4 rounded-lg transition-colors">Borrar Historial</button>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [mode, setMode] = useState<'cmd' | 'voiceaccess'>('cmd');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [inputText, setInputText] = useState('');
    const [statusText, setStatusText] = useState('Haz clic en el micrófono o escribe un mensaje');
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) setApiKey(savedKey);

        const savedHistory = localStorage.getItem('chat_history');
        if (savedHistory) {
             try {
                setMessages(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Could not parse chat history:", e);
                localStorage.removeItem('chat_history');
            }
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('chat_history', JSON.stringify(messages));
        }
    }, [messages]);

    const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(scrollToBottom, [messages]);
    
    const speak = useCallback((textToSpeak: string) => {
        if (!textToSpeak || !('speechSynthesis' in window)) return;

        speechSynthesis.cancel(); 
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'es-ES';
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
    }, []);

    const handleSendMessage = useCallback(async (messageText: string) => {
        if (!messageText.trim() || isProcessing || !apiKey) return;
        
        speechSynthesis.cancel();
        setIsSpeaking(false);
        if (isListening) recognitionRef.current?.stop();
        
        const newUserMessage: Message = { role: 'user', text: messageText.trim() };
        setMessages((prev) => [...prev, newUserMessage]);
        setInputText('');
        setIsProcessing(true);
        setStatusText('Pensando...');

        try {
            const { text, sources, commandInfo } = await sendMessageToGemini(apiKey, messageText.trim(), mode);
            const newModelMessage: Message = { role: 'model', text, sources, commandInfo };
            setMessages((prev) => [...prev, newModelMessage]);
            if (!commandInfo) {
              speak(text);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = { role: 'model', text: 'Lo siento, ha ocurrido un error. Por favor, revisa la consola o tu API Key para más detalles.' };
            setMessages((prev) => [...prev, errorMessage]);
            speak(errorMessage.text);
        } finally {
            setIsProcessing(false);
        }
    }, [apiKey, isProcessing, isListening, mode, speak]);
    
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setStatusText('Reconocimiento de voz no soportado.');
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'es-ES';

        recognition.onstart = () => { setIsListening(true); setStatusText('Escuchando...'); };
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => setStatusText(`Error de reconocimiento: ${event.error}`);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            handleSendMessage(transcript);
        };
        recognitionRef.current = recognition;
    }, [handleSendMessage]);

    const handleMicClick = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else if (!isProcessing && !isSpeaking) {
            speechSynthesis.cancel();
            recognitionRef.current?.start();
        }
    };
    
    const handleSaveApiKey = (key: string) => {
        localStorage.setItem('gemini_api_key', key);
        setApiKey(key);
    };

    const handleClearHistory = () => {
        if (window.confirm('¿Estás seguro? Esta acción borrará todo el historial.')) {
            setMessages([]);
            localStorage.removeItem('chat_history');
            setIsHistoryModalOpen(false);
        }
    };

    if (!apiKey) {
        return <ApiKeyModal onSave={handleSaveApiKey} />;
    }

    return (
        <div className="flex flex-col h-screen bg-bg-dark text-white p-4 gap-4">
             <header className="flex-shrink-0 flex justify-between items-center">
                <h1 className="text-xl font-bold font-orbitron text-gray-300">Asistente de IA</h1>
                <button onClick={() => setIsHistoryModalOpen(true)} className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    Historial
                </button>
            </header>
            
            <main className="flex-grow flex flex-col min-h-0">
                {messages.length === 0 ? (
                     <div className="flex-grow flex flex-col items-center justify-center text-center">
                        <Avatar isSpeaking={isSpeaking} isListening={isListening} />
                        <h2 className="text-3xl font-orbitron mt-8 mb-2 text-cyan-300">Asistente Activado</h2>
                        <p className="text-gray-400">Selecciona un modo y empieza a interactuar.</p>
                    </div>
                ) : (
                    <div className="flex-grow overflow-y-auto pr-2">
                        {messages.map((msg, index) => {
                            if (msg.role === 'model' && msg.commandInfo) {
                                return <CommandBubble key={index} commandInfo={msg.commandInfo} introText={msg.text} />;
                            }
                            return <ChatBubble key={index} message={msg} />;
                        })}
                        <div ref={chatEndRef} />
                    </div>
                )}
            </main>

            <footer className="flex-shrink-0 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(inputText); }}
                            placeholder="Escribe un comando o pregunta..."
                            disabled={isProcessing || isListening || isSpeaking}
                            className="w-full bg-black/30 border border-gray-600 rounded-full py-3 pl-5 pr-14 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 transition-all"
                        />
                        <button onClick={() => handleSendMessage(inputText)} disabled={!inputText.trim() || isProcessing || isListening || isSpeaking} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-cyan-300 hover:bg-cyan-500/20 disabled:text-gray-500 disabled:hover:bg-transparent transition-colors">
                            <SendIcon className="w-6 h-6"/>
                        </button>
                    </div>
                    <MicButton isListening={isListening} isProcessing={isProcessing} isSpeaking={isSpeaking} onClick={handleMicClick} />
                </div>
                 <div className="flex justify-center items-center gap-4">
                    <button onClick={() => setMode('cmd')} className={`px-4 py-2 rounded-full font-semibold border transition-all ${mode === 'cmd' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'}`}>
                        Modo CMD
                    </button>
                    <button onClick={() => setMode('voiceaccess')} className={`px-4 py-2 rounded-full font-semibold border transition-all ${mode === 'voiceaccess' ? 'bg-purple-500/20 border-purple-400' : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'}`}>
                        Modo Voice Access
                    </button>
                </div>
                <p className="text-center text-sm text-gray-400 h-5 transition-opacity">{!isListening && !isProcessing && !isSpeaking ? `Modo actual: ${mode === 'cmd' ? 'CMD' : 'Voice Access'}` : statusText}</p>
            </footer>
            <HistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} history={messages} onClearHistory={handleClearHistory} />
        </div>
    );
};

export default App;
