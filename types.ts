
export interface Source {
  uri: string;
  title: string;
}

export interface CommandInfo {
    type: 'cmd' | 'voiceaccess';
    command: string;
    explanation: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: Source[];
  commandInfo?: CommandInfo;
}
