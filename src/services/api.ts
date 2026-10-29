import { ScreenAnalysisData, ServerStatus } from '../types';

export async function getServerStatus(): Promise<ServerStatus> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    return {
      status: 'offline',
      appName: 'DeskSense',
      version: '0.9.0-preview',
      aiConfigured: false,
      model: null,
      environment: 'development',
      platform: 'Web Environment',
      serverTime: new Date().toISOString(),
    };
  }
}

export interface AnalyzeScreenResponse {
  success: boolean;
  data?: ScreenAnalysisData;
  configured?: boolean;
  error?: string;
}

export async function analyzeScreen(
  imageBase64: string,
  question: string,
  osContext: string = 'Windows 11'
): Promise<AnalyzeScreenResponse> {
  try {
    const res = await fetch('/api/analyze-screen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        question,
        osContext,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        configured: data.configured !== undefined ? data.configured : true,
        error: data.error || `Server error (${res.status})`,
      };
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error communicating with DeskSense backend.',
    };
  }
}

export interface AskAssistantResponse {
  success: boolean;
  data?: {
    summary: string;
    category: string;
    prerequisites?: string;
    steps: Array<{
      stepNumber: number;
      title: string;
      instruction: string;
      actionType: any;
      targetElement: string;
      tip?: string;
    }>;
    expectedResult: string;
    learningTakeaway: string;
  };
  configured?: boolean;
  error?: string;
}

export async function askAssistant(
  question: string,
  osContext: string = 'Windows 11'
): Promise<AskAssistantResponse> {
  try {
    const res = await fetch('/api/ask-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        osContext,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        configured: data.configured !== undefined ? data.configured : true,
        error: data.error || `Server error (${res.status})`,
      };
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error communicating with DeskSense backend.',
    };
  }
}
