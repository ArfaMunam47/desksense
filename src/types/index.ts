export type TaskCategory =
  | 'Computer Basics'
  | 'Files and Folders'
  | 'Internet and Browsers'
  | 'Windows Settings'
  | 'Devices and Connectivity'
  | 'Documents and Productivity'
  | 'Programming and Development'
  | 'Troubleshooting';

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
  difficulty: 'First-time User' | 'Beginner' | 'Elementary' | 'Intermediate';
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

export type CodingTaskType =
  | 'explain_error'
  | 'explain_code'
  | 'terminal_output'
  | 'env_troubleshoot'
  | 'install_dependency'
  | 'fix_issue'
  | 'next_steps';

export interface CodingHelpRequest {
  taskType: CodingTaskType;
  environment: string;
  description: string;
  codeSnippet?: string;
  errorMessage?: string;
  imageBase64?: string;
  followUpHistory?: Array<{ role: 'user' | 'assistant'; text: string }>;
}

export interface CodingHelpResponse {
  identifiedGoal: string;
  problemExplanation: string;
  likelyCauses: string[];
  safeSolutionSummary: string;
  isPotentiallyDestructive: boolean;
  destructiveWarning?: string;
  steps: GuidanceStep[];
  codeDiffOrSnippet?: {
    language: string;
    description: string;
    code: string;
  };
  learningTakeaway: string;
  suggestedFollowUps?: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  question: string;
  category?: string;
  completedSteps: number;
  totalSteps: number;
  source: 'ai_vision' | 'ai_text' | 'task_library' | 'coding_help';
  takeaway?: string;
  codingContext?: {
    taskType: CodingTaskType;
    environment: string;
    summary: string;
  };
}

export interface AppSettings {
  // General
  defaultOs: 'Windows 11' | 'Windows 10' | 'macOS' | 'Linux';
  beginnerTerminologyMode: boolean;
  startupDestination: 'home' | 'guided' | 'tasks' | 'coding';
  // Appearance
  theme: 'light' | 'dark' | 'system';
  fontSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  compactMode: boolean;
  // Privacy
  confirmBeforeDiscard: boolean;
  saveHistory: boolean;
  anonymizePathsInSnippets: boolean;
  // Screen Capture
  captureMethod: 'browser_prompt' | 'clipboard_default';
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

export type NavTab =
  | 'home'
  | 'guided'
  | 'tasks'
  | 'coding'
  | 'history'
  | 'about'
  | 'settings';
