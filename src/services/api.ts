import {
  ScreenAnalysisData,
  ServerStatus,
  CodingHelpRequest,
  CodingHelpResponse,
} from '../types';

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

export interface StreamChatParams {
  message?: string;
  history?: Array<{ role: 'user' | 'assistant'; text: string }>;
  imageBase64?: string | null;
  osContext?: string;
  signal?: AbortSignal;
  onChunk: (chunk: string) => void;
  onMeta?: (meta: { ttftMs?: number; model?: string }) => void;
  onDone?: (summary: { totalTimeMs?: number; ttftMs?: number; model?: string }) => void;
  onError?: (err: string) => void;
}

export async function streamChat(params: StreamChatParams): Promise<void> {
  const {
    message,
    history = [],
    imageBase64,
    osContext = 'Windows 11',
    signal,
    onChunk,
    onMeta,
    onDone,
    onError,
  } = params;

  try {
    const res = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history,
        imageBase64: imageBase64 || undefined,
        osContext,
      }),
      signal,
    });

    if (!res.ok) {
      let errorMsg = `Server error (${res.status})`;
      try {
        const json = await res.json();
        if (json.error) errorMsg = json.error;
      } catch {}
      onError?.(errorMsg);
      throw new Error(errorMsg);
    }

    if (!res.body) {
      throw new Error('ReadableStream not supported by browser.');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split('\n\n');
      // Keep incomplete block at the end
      buffer = blocks.pop() || '';

      for (const block of blocks) {
        if (!block.trim()) continue;
        const lines = block.split('\n');
        let eventType = 'message';
        let dataStr = '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            dataStr = line.slice(6).trim();
          }
        }

        if (dataStr) {
          try {
            const parsed = JSON.parse(dataStr);
            if (eventType === 'meta') {
              onMeta?.(parsed);
            } else if (eventType === 'delta') {
              if (parsed.text) {
                onChunk(parsed.text);
              }
            } else if (eventType === 'done') {
              onDone?.(parsed);
            } else if (eventType === 'error') {
              onError?.(parsed.error || 'Streaming error');
            }
          } catch {
            // Raw text fallback
            if (eventType === 'delta') onChunk(dataStr);
          }
        }
      }
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.log('[DeskSense] Stream aborted by user.');
      return;
    }
    const msg = err.message || 'Error communicating with DeskSense AI stream.';
    onError?.(msg);
    throw err;
  }
}

export interface AnalyzeScreenResponse {
  success: boolean;
  data?: ScreenAnalysisData;
  configured?: boolean;
  error?: string;
  meta?: {
    modelUsed?: string;
    durationMs?: number;
  };
}

export async function analyzeScreen(
  imageBase64: string,
  question: string,
  osContext: string = 'Windows 11'
): Promise<AnalyzeScreenResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

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
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
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
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: 'Screen analysis took longer than 20 seconds. Please try with a simpler question or retry.',
      };
    }
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
  meta?: {
    modelUsed?: string;
    durationMs?: number;
  };
}

export async function askAssistant(
  question: string,
  osContext: string = 'Windows 11'
): Promise<AskAssistantResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

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
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
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
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: 'Assistant took longer than expected. Please retry or ask a shorter question.',
      };
    }
    return {
      success: false,
      error: err.message || 'Network error communicating with DeskSense backend.',
    };
  }
}

export interface CodingHelpApiResponse {
  success: boolean;
  data?: CodingHelpResponse;
  configured?: boolean;
  error?: string;
  meta?: {
    modelUsed?: string;
    durationMs?: number;
  };
}

export async function requestCodingHelp(
  payload: CodingHelpRequest
): Promise<CodingHelpApiResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch('/api/coding-help', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
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
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: 'Coding assistance took longer than expected. Please retry.',
      };
    }
    return {
      success: false,
      error: err.message || 'Network error communicating with DeskSense coding service.',
    };
  }
}

export interface FollowUpApiResponse {
  success: boolean;
  answer?: string;
  configured?: boolean;
  error?: string;
  meta?: {
    modelUsed?: string;
    durationMs?: number;
  };
}

export async function askFollowUpQuestion(
  context: string,
  previousSteps: any[],
  userFollowUp: string,
  mode: string = 'general'
): Promise<FollowUpApiResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch('/api/follow-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context,
        previousSteps,
        userFollowUp,
        mode,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
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
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: 'Follow-up request timed out. Please try again.',
      };
    }
    return {
      success: false,
      error: err.message || 'Network error communicating with DeskSense follow-up service.',
    };
  }
}
