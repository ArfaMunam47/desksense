import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Support base64 image uploads up to 25MB
app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Clean helper to format API errors into plain, human-friendly messages
function formatErrorMessage(error: any, fallback: string): string {
  let msg = error?.message || fallback;
  try {
    const parsed = JSON.parse(msg);
    if (parsed?.error?.message) {
      msg = parsed.error.message;
    }
  } catch {}

  if (
    msg.includes('503') ||
    msg.toLowerCase().includes('high demand') ||
    msg.includes('UNAVAILABLE')
  ) {
    return 'The AI assistant is experiencing a temporary spike in demand. Please try again in a few moments, or explore verified guides in the Task Library.';
  }
  return msg;
}

// Model candidates ordered by response latency and availability
// Primary fast model: gemini-3.1-flash-lite (sub-second TTFT)
const FAST_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
const VISION_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];

// Helper to generate content with per-attempt timeout and fallback
async function generateWithFallback(
  aiClient: any,
  request: any,
  candidateModels: string[] = FAST_MODELS,
  timeoutMs: number = 12000
): Promise<{ response: any; modelUsed: string; durationMs: number }> {
  let lastErr = null;
  for (const model of candidateModels) {
    const t0 = Date.now();
    try {
      const response = await Promise.race([
        aiClient.models.generateContent({
          ...request,
          model,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout on model ${model} after ${timeoutMs}ms`)), timeoutMs)
        ),
      ]);
      const durationMs = Date.now() - t0;
      console.log(`[DeskSense Perf] Generated content with ${model} in ${(durationMs / 1000).toFixed(2)}s`);
      return { response, modelUsed: model, durationMs };
    } catch (err: any) {
      lastErr = err;
      const isUnavailable =
        err?.status === 503 ||
        err?.message?.includes('503') ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('UNAVAILABLE') ||
        err?.message?.includes('Timeout');
      if (isUnavailable) {
        console.warn(`[DeskSense Fallback] Model ${model} unavailable (${err.message}). Trying next candidate...`);
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

// Helper to connect to streaming content with fallback
async function streamWithFallback(
  aiClient: any,
  request: any,
  candidateModels: string[] = FAST_MODELS,
  timeoutMs: number = 8000
): Promise<{ stream: any; modelUsed: string }> {
  let lastErr = null;
  for (const model of candidateModels) {
    try {
      const stream = await Promise.race([
        aiClient.models.generateContentStream({
          ...request,
          model,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Stream connection timeout on ${model}`)), timeoutMs)
        ),
      ]);
      return { stream, modelUsed: model };
    } catch (err: any) {
      lastErr = err;
      console.warn(`[DeskSense Fallback] Streaming on ${model} failed (${err.message}). Trying fallback...`);
      continue;
    }
  }
  throw lastErr;
}

// System status endpoint
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    appName: 'DeskSense',
    version: '0.9.0-preview',
    aiConfigured: Boolean(apiKey),
    model: apiKey ? FAST_MODELS[0] : null,
    modelsAvailable: FAST_MODELS,
    streamingSupported: true,
    environment: isProduction ? 'production' : 'development',
    platform: 'Web Environment (Desktop Bridge Ready)',
    serverTime: new Date().toISOString(),
  });
});

// Intelligent Request Understanding Engine - 14 Categories
export type RequestCategory =
  | 'computer_guidance'
  | 'windows_troubleshooting'
  | 'application_assistance'
  | 'coding_programming'
  | 'debugging_error'
  | 'project_development'
  | 'document_generation'
  | 'readme_generation'
  | 'file_folder_management'
  | 'git_github'
  | 'learning_explanations'
  | 'productivity_planning'
  | 'creative_assistance'
  | 'screen_aware';

function classifyRequestIntent(
  message: string,
  hasImage: boolean,
  attachedFile?: { name: string; content: string }
): { category: RequestCategory; label: string } {
  if (hasImage) {
    return { category: 'screen_aware', label: 'Screen Analysis' };
  }

  const lower = (message || '').toLowerCase();
  const fileName = (attachedFile?.name || '').toLowerCase();

  // 1. README Generation
  if (
    lower.includes('readme') ||
    lower.includes('read me') ||
    fileName.includes('readme') ||
    ((fileName === 'package.json' || fileName === 'requirements.txt' || fileName === 'pyproject.toml' || fileName === 'cargo.toml') &&
      (lower.includes('doc') || lower.includes('readme') || lower.includes('generate')))
  ) {
    return { category: 'readme_generation', label: 'README Generation' };
  }

  // 2. Debugging & Error Resolution
  if (
    lower.includes('error') ||
    lower.includes('traceback') ||
    lower.includes('exception') ||
    lower.includes('stack trace') ||
    lower.includes('syntaxerror') ||
    lower.includes('typeerror') ||
    lower.includes('indexerror') ||
    lower.includes('crashed') ||
    lower.includes('failed to compile') ||
    lower.includes('segmentation fault') ||
    lower.includes('bug in') ||
    lower.includes('fix this')
  ) {
    return { category: 'debugging_error', label: 'Debugging & Errors' };
  }

  // 3. Git & GitHub
  if (
    /\bgit\b/.test(lower) ||
    lower.includes('github') ||
    lower.includes('commit') ||
    lower.includes('merge conflict') ||
    lower.includes('pull request') ||
    lower.includes('git branch') ||
    lower.includes('git rebase') ||
    lower.includes('git clone') ||
    lower.includes('repository') ||
    lower.includes('untracked')
  ) {
    return { category: 'git_github', label: 'Git & GitHub' };
  }

  // 4. Project Development
  if (
    lower.includes('build a project') ||
    lower.includes('project idea') ||
    lower.includes('how to build an app') ||
    lower.includes('architecture') ||
    lower.includes('folder structure') ||
    lower.includes('tech stack') ||
    lower.includes('starter code') ||
    lower.includes('scaffold') ||
    lower.includes('create a project')
  ) {
    return { category: 'project_development', label: 'Project Development' };
  }

  // 5. Document Generation
  if (
    lower.includes('resume') ||
    lower.includes('cover letter') ||
    lower.includes('proposal') ||
    lower.includes('write an email') ||
    lower.includes('formal email') ||
    lower.includes('meeting notes') ||
    lower.includes('study notes') ||
    lower.includes('report') ||
    lower.includes('spec sheet') ||
    lower.includes('development plan')
  ) {
    return { category: 'document_generation', label: 'Document Generation' };
  }

  // 6. Coding & Programming
  if (
    lower.includes('python') ||
    lower.includes('javascript') ||
    lower.includes('typescript') ||
    lower.includes('react') ||
    lower.includes('node.js') ||
    lower.includes('html') ||
    lower.includes('css') ||
    lower.includes('sql') ||
    lower.includes('java ') ||
    lower.includes('c++') ||
    lower.includes('c#') ||
    lower.includes('rust') ||
    lower.includes('write a script') ||
    lower.includes('write code') ||
    lower.includes('function that') ||
    lower.includes('algorithm') ||
    lower.includes('api endpoint') ||
    fileName.endsWith('.py') ||
    fileName.endsWith('.js') ||
    fileName.endsWith('.ts') ||
    fileName.endsWith('.jsx') ||
    fileName.endsWith('.tsx') ||
    fileName.endsWith('.html') ||
    fileName.endsWith('.css') ||
    fileName.endsWith('.sql') ||
    fileName.endsWith('.cpp')
  ) {
    return { category: 'coding_programming', label: 'Coding & Programming' };
  }

  // 7. File & Folder Management
  if (
    lower.includes('folder') ||
    lower.includes('directory') ||
    lower.includes('zip') ||
    lower.includes('unzip') ||
    lower.includes('file explorer') ||
    lower.includes('rename file') ||
    lower.includes('move file') ||
    lower.includes('extract') ||
    lower.includes('file path')
  ) {
    return { category: 'file_folder_management', label: 'Files & Folders' };
  }

  // 8. Windows Troubleshooting
  if (
    lower.includes('bluetooth') ||
    lower.includes('wifi') ||
    lower.includes('wi-fi') ||
    lower.includes('audio') ||
    lower.includes('sound') ||
    lower.includes('microphone') ||
    lower.includes('printer') ||
    lower.includes('resolution') ||
    lower.includes('display settings') ||
    lower.includes('task manager') ||
    lower.includes('driver') ||
    lower.includes('blue screen') ||
    lower.includes('frozen')
  ) {
    return { category: 'windows_troubleshooting', label: 'Windows Troubleshooting' };
  }

  // 9. Application Assistance
  if (
    lower.includes('chrome') ||
    lower.includes('browser') ||
    lower.includes('vs code') ||
    lower.includes('vscode') ||
    lower.includes('visual studio') ||
    lower.includes('pycharm') ||
    lower.includes('intellij') ||
    lower.includes('extension') ||
    lower.includes('profile') ||
    lower.includes('terminal in vs')
  ) {
    return { category: 'application_assistance', label: 'Application Assistance' };
  }

  // 10. Productivity & Planning
  if (
    lower.includes('schedule') ||
    lower.includes('plan my day') ||
    lower.includes('productivity') ||
    lower.includes('sprint') ||
    lower.includes('checklist') ||
    lower.includes('time management')
  ) {
    return { category: 'productivity_planning', label: 'Productivity & Planning' };
  }

  // 11. Learning & Explanations
  if (
    lower.startsWith('what is') ||
    lower.startsWith('explain') ||
    lower.startsWith('how does') ||
    lower.startsWith('difference between') ||
    lower.includes('concept') ||
    lower.includes('analogy')
  ) {
    return { category: 'learning_explanations', label: 'Learning & Concepts' };
  }

  // 12. Creative Assistance
  if (
    lower.includes('name for my') ||
    lower.includes('brainstorm') ||
    lower.includes('tagline') ||
    lower.includes('pitch') ||
    lower.includes('slogan')
  ) {
    return { category: 'creative_assistance', label: 'Creative Ideas' };
  }

  return { category: 'computer_guidance', label: 'Computer Guidance' };
}

function buildSystemInstruction(
  category: RequestCategory,
  osContext: string,
  attachedFileName?: string
): string {
  const base = `You are DeskSense, an intelligent, patient, empathetic, and versatile desktop productivity and computer companion.
Your audience spans first-time computer users, students, developers, creators, and professionals.`;

  let modeSpecific = '';

  switch (category) {
    case 'readme_generation':
      modeSpecific = `INTERACTIVE README WORKFLOW:
- When a user asks to generate a README for their application:
  If they have NOT yet provided essential project details (project name, core purpose, tech stack, how to run) AND no project configuration file is attached:
  DO NOT immediately generate a generic placeholder README!
  Instead, start an interactive requirements-gathering conversation. Politely ask 2 to 3 focused, friendly questions:
  1. What is the project name and what does it do in 1-2 sentences?
  2. What tech stack or languages does it use?
  3. How do you install and run it?
  Assure them they can say "I don't know" or attach a file like package.json or requirements.txt.
- If an attached file was provided (${attachedFileName || 'project file'}), inspect its exact contents (e.g. name, dependencies, scripts, run commands) and explicitly summarize what you extracted, asking only for missing context.
- If the user HAS provided enough project information (either in this message or previous conversation):
  Generate a COMPLETE, production-ready, beautifully structured README.md formatted inside a single \`\`\`markdown code block.
  Include: Title & Pitch, Overview, Key Features, Tech Stack, Prerequisites, Installation, Usage / Commands, Project Structure, Contributing, License, Author. Ensure it is complete and ready to export as a real .md file without empty "[TODO]" placeholders.`;
      break;

    case 'document_generation':
      modeSpecific = `INTELLIGENT DOCUMENT GENERATION:
- Generate complete, professional, publication-ready documents (resumes, cover letters, formal emails, project proposals, reports, study notes, development plans).
- Format the document inside a \`\`\`markdown code block so the user can easily copy or download it.
- Use clean headings, organized bullet points, and actionable language. Avoid leaving unfinished bracketed placeholders.`;
      break;

    case 'coding_programming':
      modeSpecific = `ADVANCED CODING ASSISTANT:
- Support Python, JavaScript, TypeScript, HTML, CSS, React, Node.js, SQL, Java, C, C++, and other common languages.
- Support environments like Visual Studio Code, PyCharm, Windows Terminal, PowerShell, Git, and Command Prompt.
- Provide clean, runnable, well-commented code inside language-tagged code blocks (\`\`\`python, \`\`\`javascript, etc.).
- Explain technical decisions in calm, clear language.
- Explain terminal commands step-by-step BEFORE the user runs them.
- If any command could delete files or reset history (e.g. rm, del, git reset --hard, DROP TABLE), issue an explicit SAFETY WARNING with backup advice.
- Never pretend to have inspected code or files that the user has not shared.`;
      break;

    case 'debugging_error':
      modeSpecific = `DEBUGGING & ERROR RESOLUTION:
- Carefully analyze the error message, traceback, or code snippet provided.
- Explain why the error occurred in plain, beginner-friendly English.
- Identify 1-3 likely root causes.
- Provide the exact corrected code snippet or command.
- Explain how to avoid this error in the future.
- Never invent error lines that were not provided.`;
      break;

    case 'project_development':
      modeSpecific = `PROJECT DEVELOPMENT COMPANION:
- Help users bring ideas to life with structured guidance.
- Break projects into logical milestones: Planning -> Architecture -> Core Logic -> UI -> Testing -> Deployment.
- Recommend appropriate technology stacks with pros and cons.
- Provide clean folder structure diagrams and starter boilerplate code.
- Guide users through dependencies, project configuration, and tools.`;
      break;

    case 'git_github':
      modeSpecific = `GIT & GITHUB ASSISTANT:
- Provide clear, safe step-by-step Git commands.
- Explain what each command does before the user runs it.
- CRITICAL SAFETY: If the user is asking to delete, reset, or wipe files (e.g. git clean, git reset --hard, git checkout ., git push --force), you MUST start with a prominent WARNING explaining that changes will be permanently discarded without going to the Recycle Bin. Provide a safe inspection or dry-run check (such as git clean -nd or git status) first.`;
      break;

    case 'file_folder_management':
      modeSpecific = `FILE & FOLDER MANAGEMENT:
- Provide patient, step-by-step guidance for ${osContext}.
- Include relevant shortcuts (e.g. Ctrl+Shift+N for new folder, F2 to rename, Ctrl+Z to undo).`;
      break;

    case 'windows_troubleshooting':
      modeSpecific = `WINDOWS & SYSTEM TROUBLESHOOTING:
- Provide calm, reassuring troubleshooting steps for ${osContext}.
- Start with simple, non-destructive fixes before suggesting deep registry or driver modifications.`;
      break;

    case 'application_assistance':
      modeSpecific = `APPLICATION ASSISTANCE:
- Provide exact application-specific navigation steps (VS Code, Chrome, PyCharm, etc.).
- Describe menus, shortcuts, and settings clearly.`;
      break;

    case 'productivity_planning':
      modeSpecific = `PRODUCTIVITY & PLANNING:
- Provide structured, practical task breakdowns, checklists, or sprint plans.`;
      break;

    case 'learning_explanations':
      modeSpecific = `CONCEPT EXPLANATIONS:
- Explain complex concepts using a relatable real-world analogy first, followed by clear technical specifics.`;
      break;

    case 'creative_assistance':
      modeSpecific = `CREATIVE ASSISTANCE:
- Provide creative, memorable ideas grouped by theme with brief rationales.`;
      break;

    case 'screen_aware':
      modeSpecific = `SCREEN-AWARE ASSISTANCE:
- Carefully inspect the captured screen. Refer only to visible buttons, menus, and text. Never hallucinate elements.`;
      break;

    default:
      modeSpecific = `COMPUTER GUIDANCE:
- Explain things step-by-step in calm, plain language. Keep answers concrete, actionable, and concise.`;
  }

  const generalRules = `General Principles:
- If a request is completely ambiguous (e.g. just "help" or "fix it" without any context, code, or error), politely ask 1 short clarification question.
- If providing numbered steps, format them clearly (1., 2., 3.).
- Clearly distinguish suggestions from actions actually completed.
- When generating real outputs (documents, READMEs, scripts), provide complete, copyable, exportable content.`;

  return `${base}\n\n${modeSpecific}\n\n${generalRules}`;
}

// Real model response streaming endpoint (Server-Sent Events)
app.post('/api/chat/stream', async (req, res) => {
  const requestStart = Date.now();
  let firstTokenTime: number | null = null;
  let isClosed = false;

  res.on('close', () => {
    isClosed = true;
  });

  try {
    const {
      message,
      history = [],
      imageBase64,
      attachedFile,
      osContext = 'Windows 11',
    } = req.body;

    if (!message && !imageBase64 && !attachedFile) {
      return res.status(400).json({ error: 'Please provide a question, attached file, or screenshot.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'AI assistant is currently not configured with an API key.',
      });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Context management: keep last 6 messages to preserve requirements across turns
    const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
    const formattedHistory = recentHistory
      .map((h: any) => `${h.role === 'user' ? 'User' : 'DeskSense'}: ${h.text}`)
      .join('\n\n');

    // Intelligent Request Understanding Engine
    const intent = classifyRequestIntent(message, Boolean(imageBase64), attachedFile);

    let filePromptSection = '';
    if (attachedFile && attachedFile.content) {
      filePromptSection = `Attached File: "${attachedFile.name}" (${attachedFile.size || attachedFile.content.length} bytes)
\`\`\`${attachedFile.name.split('.').pop() || 'text'}
${attachedFile.content.slice(0, 30000)}
\`\`\`\n\n`;
    }

    const promptText = `${
      formattedHistory ? `Previous conversation context:\n${formattedHistory}\n\n` : ''
    }${filePromptSection}User Question (${osContext}): "${message || 'Please inspect the attached file / screen.'}"`;

    let contentsPayload: any;
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      contentsPayload = [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: cleanBase64,
          },
        },
        { text: promptText },
      ];
    } else {
      contentsPayload = promptText;
    }

    const systemInstruction = buildSystemInstruction(
      intent.category,
      osContext,
      attachedFile?.name
    );

    const candidateList = imageBase64 ? VISION_MODELS : FAST_MODELS;
    const { stream, modelUsed } = await streamWithFallback(
      ai,
      {
        contents: contentsPayload,
        config: { systemInstruction },
      },
      candidateList
    );

    for await (const chunk of stream) {
      if (isClosed || res.writableEnded || res.destroyed) break;
      const chunkText = chunk.text;
      if (chunkText) {
        if (!firstTokenTime) {
          firstTokenTime = Date.now() - requestStart;
          res.write(
            `event: meta\ndata: ${JSON.stringify({
              ttftMs: firstTokenTime,
              model: modelUsed,
              category: intent.category,
              categoryLabel: intent.label,
            })}\n\n`
          );
        }
        res.write(`event: delta\ndata: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }

    const totalTimeMs = Date.now() - requestStart;
    console.log(
      `[DeskSense Perf] /api/chat/stream completed in ${(totalTimeMs / 1000).toFixed(2)}s (TTFT: ${(
        (firstTokenTime || 0) / 1000
      ).toFixed(2)}s, Model: ${modelUsed}, Mode: ${intent.label})`
    );

    res.write(
      `event: done\ndata: ${JSON.stringify({
        totalTimeMs,
        ttftMs: firstTokenTime || totalTimeMs,
        model: modelUsed,
        category: intent.category,
      })}\n\n`
    );
    res.end();
  } catch (error: any) {
    console.error('Error during streaming:', error);
    const friendly = formatErrorMessage(
      error,
      'DeskSense is taking longer than expected. You can retry your question.'
    );
    if (!res.headersSent) {
      return res.status(500).json({ error: friendly });
    }
    res.write(`event: error\ndata: ${JSON.stringify({ error: friendly })}\n\n`);
    res.end();
  }
});

// Screen analysis endpoint
app.post('/api/analyze-screen', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/png', question, osContext = 'Windows 11' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        error: 'No image provided. Please provide an authorized screen capture.',
      });
    }

    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        error: 'No question provided. Please describe what you want to achieve.',
      });
    }

    if (!ai) {
      return res.status(503).json({
        configured: false,
        error:
          'AI screen understanding is currently unconfigured because GEMINI_API_KEY is not set. You can browse the verified Task Library or ask standard questions.',
      });
    }

    // Clean base64 string if data URL prefix exists
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    const promptText = `The user is a beginner or student using a computer (${osContext}).
They are asking: "${question}"

Analyze the provided screenshot carefully:
1. Identify the open application or Windows interface (e.g., Chrome browser, File Explorer, Taskbar, Settings, Desktop).
2. Note visible text, landmark buttons, tabs, or menus.
3. Formulate calm, step-by-step instructions specifically answering their question based on the actual screen contents.
4. If the control they need is visible, give exact guidance on where it is and how to click it.
5. If the screen is on the wrong tab, window, or menu, guide them to navigate to the right place.
6. Rate your confidence honestly (high, medium, low, or needs_clarification). If uncertain, explain why and ask for clarification. Do NOT hallucinate buttons that aren't there.
7. Include a reassuring computer literacy takeaway.`;

    const { response, modelUsed, durationMs } = await generateWithFallback(
      ai,
      {
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          systemInstruction: `You are DeskSense, an empathetic, patient, and precise computer literacy mentor.
Your audience consists of first-time laptop users, students, and beginners who may feel nervous or embarrassed asking basic questions.
Speak in calm, plain language. Avoid unnecessary technical jargon.
Distinguish strictly between what is clearly visible on the user's screen and assumptions.
If you cannot see the required button or window, state that clearly and tell the user how to bring it up.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              interfaceDescription: {
                type: Type.STRING,
                description: 'A brief 1-2 sentence description of what is visible on the captured screen.',
              },
              activeApplication: {
                type: Type.STRING,
                description: 'The main detected software or desktop element (e.g. Google Chrome, File Explorer, Windows Settings, Desktop).',
              },
              visibleElements: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Key visible landmarks, buttons, menus, or icons identified on the screen.',
              },
              interpretation: {
                type: Type.STRING,
                description: 'Calm explanation of what is currently on screen relevant to the question.',
              },
              confidence: {
                type: Type.STRING,
                description: 'Confidence level: high, medium, low, or needs_clarification.',
              },
              confidenceReason: {
                type: Type.STRING,
                description: 'Honest explanation of why this confidence level was chosen.',
              },
              clarificationQuestion: {
                type: Type.STRING,
                description: 'If confidence is low or needs_clarification, a gentle question to ask the user.',
              },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING, description: 'Short action title' },
                    instruction: { type: Type.STRING, description: 'Gentle, clear instruction' },
                    actionType: {
                      type: Type.STRING,
                      description: 'One of: click, right_click, double_click, type, shortcut, look, drag',
                    },
                    targetElement: { type: Type.STRING, description: 'The specific visual button, menu item, or area' },
                    tip: { type: Type.STRING, description: 'Helpful reassurance or recovery tip if they do not see it' },
                  },
                  required: ['stepNumber', 'title', 'instruction', 'actionType', 'targetElement'],
                },
              },
              expectedResult: {
                type: Type.STRING,
                description: 'What the user will see once they complete these steps.',
              },
              learningTakeaway: {
                type: Type.STRING,
                description: 'A memorable computer literacy concept that helps them next time.',
              },
            },
            required: [
              'interfaceDescription',
              'activeApplication',
              'visibleElements',
              'interpretation',
              'confidence',
              'confidenceReason',
              'steps',
              'expectedResult',
              'learningTakeaway',
            ],
          },
        },
      },
      VISION_MODELS,
      15000
    );

    res.setHeader('X-Response-Time-Ms', durationMs);
    res.setHeader('X-Model-Used', modelUsed);

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      data: parsedData,
      meta: {
        modelUsed,
        durationMs,
      },
    });
  } catch (error: any) {
    console.error('Error analyzing screen:', error);
    return res.status(500).json({
      error: formatErrorMessage(error, 'Failed to analyze screen capture. Please try again.'),
    });
  }
});

// Text-based computer question assistant endpoint
app.post('/api/ask-assistant', async (req, res) => {
  try {
    const { question, osContext = 'Windows 11' } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        error: 'Please provide a question about what you would like to do.',
      });
    }

    if (!ai) {
      return res.status(503).json({
        configured: false,
        error:
          'AI service is currently not configured with an API key. Please check the Task Library for step-by-step verified computer guides.',
      });
    }

    const promptText = `The user is a beginner or student using a computer (${osContext}).
They are asking: "${question}"

Provide a patient, beginner-friendly step-by-step breakdown.
Keep instructions very concrete (e.g. "Look at the bottom left corner for the Windows Start icon", "Press and hold the Ctrl key, then tap C").
Avoid jargon.
Return a structured response.`;

    const { response, modelUsed, durationMs } = await generateWithFallback(
      ai,
      {
        contents: promptText,
        config: {
          systemInstruction: `You are DeskSense, an empathetic computer literacy guide for beginners. Never make the user feel foolish for asking a basic question. Always assume Windows 11 unless specified otherwise. Keep steps sequential, short, and calm.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: 'Reassuring 1-2 sentence answer acknowledging their question.',
              },
              category: {
                type: Type.STRING,
                description: 'The relevant category of computer task.',
              },
              prerequisites: {
                type: Type.STRING,
                description: 'What should be open or ready before starting.',
              },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    instruction: { type: Type.STRING },
                    actionType: { type: Type.STRING },
                    targetElement: { type: Type.STRING },
                    tip: { type: Type.STRING },
                  },
                  required: ['stepNumber', 'title', 'instruction', 'actionType', 'targetElement'],
                },
              },
              expectedResult: { type: Type.STRING },
              learningTakeaway: { type: Type.STRING },
            },
            required: ['summary', 'category', 'steps', 'expectedResult', 'learningTakeaway'],
          },
        },
      },
      FAST_MODELS,
      12000
    );

    res.setHeader('X-Response-Time-Ms', durationMs);
    res.setHeader('X-Model-Used', modelUsed);

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      data: parsedData,
      meta: {
        modelUsed,
        durationMs,
      },
    });
  } catch (error: any) {
    console.error('Error answering question:', error);
    return res.status(500).json({
      error: formatErrorMessage(error, 'Failed to process question. Please try again.'),
    });
  }
});

// Dedicated Coding Help endpoint
app.post('/api/coding-help', async (req, res) => {
  try {
    const {
      taskType = 'explain_error',
      environment = 'Visual Studio Code',
      description,
      codeSnippet,
      errorMessage,
      imageBase64,
      followUpHistory = [],
    } = req.body;

    if (!description && !codeSnippet && !errorMessage && !imageBase64) {
      return res.status(400).json({
        error: 'Please provide at least a description, error message, code snippet, or screenshot.',
      });
    }

    if (!ai) {
      return res.status(503).json({
        configured: false,
        error:
          'AI Coding Assistant is currently unconfigured because GEMINI_API_KEY is not set. You can browse verified Programming guides in the Task Library.',
      });
    }

    const taskTypeLabels: Record<string, string> = {
      explain_error: 'Explain an error and how to fix it',
      explain_code: 'Explain what this code does in clear language',
      terminal_output: 'Understand terminal output or command failures',
      env_troubleshoot: 'Troubleshoot a development environment or PATH problem',
      install_dependency: 'Understand installation, package, or dependency problems',
      fix_issue: 'Get guidance fixing a coding bug or logic problem',
      next_steps: 'Understand what to do next in this software project',
    };

    const taskGoal = taskTypeLabels[taskType] || 'Software assistance';

    let promptText = `The user needs coding help in environment: ${environment}.
Task objective: ${taskGoal}.

User's description: ${description || 'Not provided'}
${errorMessage ? `Reported Error Message:\n\`\`\`\n${errorMessage}\n\`\`\`\n` : ''}
${codeSnippet ? `Provided Code Snippet:\n\`\`\`\n${codeSnippet}\n\`\`\`\n` : ''}

${
  followUpHistory.length > 0
    ? `Previous conversation context:\n${followUpHistory
        .map((h: any) => `${h.role === 'user' ? 'User' : 'DeskSense'}: ${h.text}`)
        .join('\n')}\n`
    : ''
}

Perform the following 6 requirements:
1. Identify what the user is trying to accomplish (identifiedGoal).
2. Explain the problem in calm, understandable language without assuming expert jargon (problemExplanation).
3. Identify likely causes while honestly acknowledging uncertainty if context is missing (likelyCauses).
4. Formulate a SAFE solution. If any command or code could delete data, wipe git history, or overwrite files (e.g., rm, git reset --hard, force flags), explicitly set isPotentiallyDestructive: true and state why in destructiveWarning.
5. Provide step-by-step guidance actions (steps).
6. Provide a clean, proposed code diff or replacement snippet if applicable.
7. Include a memorable developer learning takeaway.
8. Suggest 2-3 logical follow-up questions the user can ask next.`;

    const contentsParts: any[] = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      contentsParts.push({
        inlineData: {
          mimeType: 'image/png',
          data: cleanBase64,
        },
      });
    }

    contentsParts.push({
      text: promptText,
    });

    const { response, modelUsed, durationMs } = await generateWithFallback(
      ai,
      {
        contents: { parts: contentsParts },
        config: {
          systemInstruction: `You are DeskSense Coding Mentor, a patient, safety-minded programming tutor.
Your audience includes beginner coders, students, and developers troubleshooting unfamiliar tools.
Never silently propose destructive actions.
Always prioritize safety, explain potential risks of commands, and keep instructions step-by-step.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              identifiedGoal: {
                type: Type.STRING,
                description: 'Clear statement of what the user is trying to accomplish.',
              },
              problemExplanation: {
                type: Type.STRING,
                description: 'Plain-language explanation of why this error or roadblock occurred.',
              },
              likelyCauses: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of 1 to 3 plausible causes, acknowledging uncertainty.',
              },
              safeSolutionSummary: {
                type: Type.STRING,
                description: 'Summary of the safe, recommended fix.',
              },
              isPotentiallyDestructive: {
                type: Type.BOOLEAN,
                description: 'Whether any proposed command could erase files or overwrite history.',
              },
              destructiveWarning: {
                type: Type.STRING,
                description: 'Explicit warning explaining risk and backup procedure if destructive.',
              },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    instruction: { type: Type.STRING },
                    actionType: { type: Type.STRING },
                    targetElement: { type: Type.STRING },
                    tip: { type: Type.STRING },
                  },
                  required: ['stepNumber', 'title', 'instruction', 'actionType', 'targetElement'],
                },
              },
              codeDiffOrSnippet: {
                type: Type.OBJECT,
                properties: {
                  language: { type: Type.STRING },
                  description: { type: Type.STRING },
                  code: { type: Type.STRING },
                },
                required: ['language', 'description', 'code'],
              },
              learningTakeaway: {
                type: Type.STRING,
                description: 'A clear computer science or programming takeaway.',
              },
              suggestedFollowUps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 3 helpful follow-up questions.',
              },
            },
            required: [
              'identifiedGoal',
              'problemExplanation',
              'likelyCauses',
              'safeSolutionSummary',
              'isPotentiallyDestructive',
              'steps',
              'learningTakeaway',
            ],
          },
        },
      },
      FAST_MODELS,
      15000
    );

    res.setHeader('X-Response-Time-Ms', durationMs);
    res.setHeader('X-Model-Used', modelUsed);

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      data: parsedData,
      meta: {
        modelUsed,
        durationMs,
      },
    });
  } catch (error: any) {
    console.error('Error generating coding help:', error);
    return res.status(500).json({
      error: formatErrorMessage(error, 'Failed to process coding query. Please try again.'),
    });
  }
});

// Follow-up question endpoint for both Guided Help and Coding Help
app.post('/api/follow-up', async (req, res) => {
  try {
    const { context, previousSteps = [], userFollowUp, mode = 'general' } = req.body;

    if (!userFollowUp || typeof userFollowUp !== 'string') {
      return res.status(400).json({
        error: 'Please provide a follow-up question or clarification.',
      });
    }

    if (!ai) {
      return res.status(503).json({
        configured: false,
        error: 'AI service is currently not configured with an API key.',
      });
    }

    const promptText = `The user is following up on an ongoing assistance session.
Context: "${context}"
Mode: "${mode}"

Previous Steps provided so far:
${previousSteps.map((s: any) => `Step ${s.stepNumber || '-'}: ${s.title || ''} - ${s.instruction || ''}`).join('\n')}

User Follow-Up Question:
"${userFollowUp}"

Provide a patient, direct, and beginner-friendly response.
If the user is asking to clarify a specific step or says they don't understand, break down that specific action.
If they are asking "what if...", explain calmly.
Keep your response concise, empathetic, and actionable.`;

    const { response, modelUsed, durationMs } = await generateWithFallback(
      ai,
      {
        contents: promptText,
        config: {
          systemInstruction: `You are DeskSense, an empathetic computer mentor. Answer follow-up questions concisely and calmly. Do not repeat greeting fluff. Focus directly on answering the user's specific point of confusion.`,
        },
      },
      FAST_MODELS,
      8000
    );

    res.setHeader('X-Response-Time-Ms', durationMs);
    res.setHeader('X-Model-Used', modelUsed);

    return res.json({
      success: true,
      answer: response.text || 'I understand. Let us review the current step carefully.',
      meta: {
        modelUsed,
        durationMs,
      },
    });
  } catch (error: any) {
    console.error('Error answering follow-up:', error);
    return res.status(500).json({
      error: formatErrorMessage(error, 'Failed to process follow-up question. Please try again.'),
    });
  }
});

// Mounting Vite in development or static files in production
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DeskSense server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
