export type TaskCategory =
  | 'Browser basics'
  | 'Downloading and managing files'
  | 'Folders and file organization'
  | 'Basic Windows operations'
  | 'Display and accessibility settings'
  | 'Bluetooth and common device settings'
  | 'Installing and uninstalling applications safely'
  | 'Screenshots and screen recording'
  | 'ZIP files and document handling'
  | 'Basic computer troubleshooting';

export type ActionType =
  | 'click'
  | 'right_click'
  | 'double_click'
  | 'type'
  | 'shortcut'
  | 'look'
  | 'drag';

export interface GuidanceStep {
  stepNumber: number;
  title: string;
  instruction: string;
  actionType: ActionType;
  targetElement: string;
  tip?: string;
  status?: 'pending' | 'current' | 'done' | 'stuck';
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  difficulty: 'First-time User' | 'Beginner' | 'Elementary';
  osContext: string;
  summary: string;
  prerequisites: string;
  steps: GuidanceStep[];
  expectedResult: string;
  commonProblems: { issue: string; solution: string }[];
  learningTakeaway: string;
  tags: string[];
}

export interface ScreenAnalysisData {
  interfaceDescription: string;
  activeApplication: string;
  visibleElements: string[];
  interpretation: string;
  confidence: 'high' | 'medium' | 'low' | 'needs_clarification';
  confidenceReason: string;
  clarificationQuestion?: string;
  steps: GuidanceStep[];
  expectedResult: string;
  learningTakeaway: string;
}

export interface ScreenCapture {
  dataUrl: string;
  timestamp: number;
  sourceType: 'display_media' | 'file_upload' | 'clipboard';
  dimensions?: { width: number; height: number };
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  question: string;
  category?: string;
  completedSteps: number;
  totalSteps: number;
  source: 'ai_vision' | 'ai_text' | 'task_library';
  takeaway?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  confirmBeforeDiscard: boolean;
  saveHistory: boolean;
}

export interface ServerStatus {
  status: string;
  appName: string;
  version: string;
  aiConfigured: boolean;
  model: string | null;
  environment: string;
  platform: string;
  serverTime: string;
}
