export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  backgroundImage?: string;
}

export interface CustomAudio {
  id: string;
  name: string;
  url: string;
  type: 'notification' | 'victory' | 'tick';
}

export interface UserSettings {
  theme: Theme;
  customAudios: CustomAudio[];
  backgroundImage?: string;
  soundEnabled: boolean;
  notifications: boolean;
}

export interface TimerState {
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isFinished: boolean;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PomodoroSession {
  id: string;
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  currentSession: number;
  isBreak: boolean;
  completedSessions: number;
}