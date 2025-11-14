// These interfaces are now available throughout the project without explicit imports.

// Add type definitions for the Web Speech API (SpeechRecognition) to resolve TypeScript errors.
// These interfaces describe the shape of the objects used for speech recognition.
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

type SpeechRecognitionErrorCode =
  | 'no-speech'
  | 'aborted'
  | 'audio-capture'
  | 'network'
  | 'not-allowed'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'language-not-supported';

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: SpeechRecognitionErrorCode;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

// Declares the constructor for SpeechRecognition, allowing `new SpeechRecognition()`.
declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};


declare global {
  interface Window {
    // For browsers that support the standard SpeechRecognition API
    SpeechRecognition: typeof SpeechRecognition;
    // For browsers that support the prefixed version (e.g., older Chrome)
    webkitSpeechRecognition: typeof SpeechRecognition;
    // Fix: Define the electronAPI object exposed by the preload script for type safety.
    electronAPI: {
      getApiKey: () => Promise<string>;
    };
  }
}
// Fix: Add an empty export to treat this file as a module, which is required for global augmentation. This resolves errors with 'declare global' and allows types like 'webkitSpeechRecognition' to be recognized correctly.
export {};
