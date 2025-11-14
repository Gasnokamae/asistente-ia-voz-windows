import { GoogleGenAI, Chat, FunctionDeclaration, Type } from "@google/genai";
import { Source, CommandInfo } from '../types';

let chat: Chat | null = null;
let currentMode: 'cmd' | 'voiceaccess' | null = null;
let apiKey: string | null = null;

const executeWindowsCommandFunctionDeclaration: FunctionDeclaration = {
  name: 'executeWindowsCommand',
  description: 'Generates a Windows CMD command to open or manage applications and provides an explanation. Use for tasks like opening programs (start chrome), system tools (taskmgr), etc.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      command: {
        type: Type.STRING,
        description: 'The exact CMD command to be executed. E.g., "start chrome", "taskmgr".'
      },
      explanation: {
        type: Type.STRING,
        description: 'A brief, user-friendly explanation of what the command does or an explanation of limitations if a direct command is not possible.'
      },
    },
    required: ['command', 'explanation'],
  },
};

const generateVoiceAccessCommandFunctionDeclaration: FunctionDeclaration = {
  name: 'generateVoiceAccessCommand',
  description: 'Generates an advanced natural language command for Windows Voice Access to control the OS. Use for tasks like opening apps, managing windows, clicking specific elements by name or type, scrolling, or dictating text. Provide a clear explanation.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      command: {
        type: Type.STRING,
        description: 'The exact natural language phrase to be spoken to Windows Voice Access. E.g., "abre Chrome", "maximiza la ventana", "cierra la ventana".'
      },
      explanation: {
        type: Type.STRING,
        description: 'A brief, user-friendly explanation of what the command does and when to use it.'
      },
    },
    required: ['command', 'explanation'],
  },
};

const getApiKey = async (): Promise<string> => {
    if (apiKey) {
        return apiKey;
    }
    // The electronAPI is exposed via the preload script in an Electron environment.
    if (window.electronAPI) {
        const key = await window.electronAPI.getApiKey();
        if (!key) {
             throw new Error("API_KEY no encontrada. Asegúrate de que está configurada en tu archivo .env y que has reiniciado la aplicación.");
        }
        apiKey = key;
        return apiKey;
    }
    // This part should not be reached in the Electron app.
    throw new Error("No se pudo acceder al entorno seguro para obtener la API Key. La aplicación debe ejecutarse a través de Electron.");
}

const initializeChat = async (mode: 'cmd' | 'voiceaccess') => {
  const key = await getApiKey();
  const ai = new GoogleGenAI({ apiKey: key });

  const isCmdMode = mode === 'cmd';
  
  const systemInstruction = isCmdMode 
    ? `Eres un asistente de IA conversacional y experto en la línea de comandos de Windows (CMD), diseñado para ayudar a una persona con paraplejia a controlar su PC. Tu objetivo es interpretar peticiones en español natural y convertirlas en comandos CMD funcionales usando la herramienta \`executeWindowsCommand\`. Responde siempre en español.
Ejemplos de peticiones y su comando CMD correspondiente:
- "Quiero abrir Google Chrome" -> \`start chrome\`
- "Necesito ver mis archivos" -> \`explorer\`
- "Abre la calculadora" -> \`calc\`
- "Lanza el administrador de tareas" -> \`taskmgr\`
- "Quiero apagar el ordenador en una hora" -> \`shutdown /s /t 3600\`
Para peticiones que no se pueden realizar directamente con un comando CMD sencillo (como "sube el volumen" o "cierra la ventana actual"), explica la limitación de forma amable y sugiere que el usuario podría intentarlo en "Modo Voice Access" para un control más granular de la interfaz. Siempre debes llamar a la función \`executeWindowsCommand\` cuando una acción sea posible.`
    : `Eres un asistente de IA experto en accesibilidad y control de PC, especializado en Windows Voice Access. Tu misión es ayudar a una persona con paraplejia a interactuar de forma fluida y natural con CUALQUIER aplicación. Interpreta sus peticiones en español conversacional y tradúcelas al comando de Voice Access MÁS PRECISO y EFECTIVO usando la herramienta \`generateVoiceAccessCommand\`. Responde siempre en español.

Tu conocimiento debe cubrir todas las facetas de Voice Access:

1.  **Clics e Interacción con Elementos:**
    *   Petición: "haz clic en el botón Guardar" -> Comando: \`clic en Guardar\`
    *   Petición: "pulsa Aceptar" -> Comando: \`clic en Aceptar\`
    *   **Importante:** Si el nombre no es claro, enséñale al usuario a usar superposiciones. Petición: "quiero hacer clic en ese icono" -> Comando: \`mostrar números\`. Explicación: "Di 'mostrar números' para ver etiquetas numéricas en todos los elementos. Luego, di 'clic en [número]' para seleccionar el que necesitas."

2.  **Escritura y Dictado:**
    *   Petición: "escribe 'hola mundo'" -> Comando: \`escribe "hola mundo"\`
    *   Petición: "rellena el campo de usuario con 'admin'" -> Comando: \`escribe "admin"\`
    *   Petición: "empieza a escribir" -> Comando: \`activar dictado\`

3.  **Navegación en Menús y Aplicaciones:**
    *   Para acciones de un solo paso: Petición: "abre el menú archivo" -> Comando: \`clic en Archivo\`
    *   Para acciones multi-paso, divídelas en la explicación. Petición: "ve a Archivo y luego Guardar" -> Comando: \`clic en Archivo\`. Explicación: "Primero, di 'clic en Archivo'. Una vez que se abra el menú, di 'clic en Guardar'."

4.  **Control de Ventanas:**
    *   Petición: "cambia a la ventana de Word" -> Comando: \`cambiar a Word\`
    *   Petición: "mueve esta ventana a la izquierda" -> Comando: \`mover ventana a la izquierda\`
    *   Petición: "cierra esto" -> Comando: \`cerrar ventana\`
    *   Petición: "maximiza" -> \`maximizar ventana\`

5.  **Uso de Atajos de Teclado:**
    *   Petición: "copia el texto seleccionado" -> Comando: \`presionar control c\`
    *   Petición: "pega lo que copié" -> Comando: \`presionar control v\`
    *   Petición: "deshacer" -> Comando: \`presionar control z\`
    *   Petición: "guarda el archivo" -> Comando: \`presionar control s\`

6.  **Scroll y Desplazamiento:**
    *   Petición: "baja en la página" -> Comando: \`bajar página\`
    *   Petición: "sube un poco" -> Comando: \`desplazar hacia arriba\`
    *   Petición: "ve hasta el final" -> Comando: \`ir a la parte inferior\`

Tu respuesta SIEMPRE debe usar la función \`generateVoiceAccessCommand\`. La explicación que proporciones es crucial para guiar al usuario.`;

  const tools = isCmdMode
    ? [{ functionDeclarations: [executeWindowsCommandFunctionDeclaration] }]
    : [{ functionDeclarations: [generateVoiceAccessCommandFunctionDeclaration] }];

  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
      tools: tools,
    },
  });
  currentMode = mode;
};

export const sendMessageToGemini = async (message: string, mode: 'cmd' | 'voiceaccess'): Promise<{ text: string; sources: Source[]; commandInfo?: CommandInfo }> => {
  if (!chat || currentMode !== mode) {
    await initializeChat(mode);
  }

  if (!chat) {
    throw new Error("Chat initialization failed.");
  }

  try {
    const result = await chat.sendMessage({ message });

    const functionCalls = result.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        const { command, explanation } = call.args as { command: string, explanation: string };

        if (call.name === 'executeWindowsCommand') {
            const commandInfo: CommandInfo = { type: 'cmd', command, explanation };
            const introText = `He generado un comando CMD para ti. Como no puedo ejecutarlo directamente, tendrás que copiarlo y pegarlo en el Símbolo del sistema.`;
            return { text: introText, sources: [], commandInfo };
        }
        
        if (call.name === 'generateVoiceAccessCommand') {
            const commandInfo: CommandInfo = { type: 'voiceaccess', command, explanation };
            const introText = `Aquí tienes un comando para Windows Voice Access. Solo tienes que decirlo en voz alta mientras Voice Access está escuchando.`;
            return { text: introText, sources: [], commandInfo };
        }
    }

    const text = result.text;
    
    return { text, sources: [], commandInfo: undefined };
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    await initializeChat(mode); 
    throw error;
  }
};
