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

// System status endpoint
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    appName: 'DeskSense',
    version: '0.9.0-preview',
    aiConfigured: Boolean(apiKey),
    model: apiKey ? 'gemini-3.8-flash' : null,
    environment: isProduction ? 'production' : 'development',
    platform: 'Web Environment (Desktop Bridge Ready)',
    serverTime: new Date().toISOString(),
  });
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
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
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error analyzing screen:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze screen capture. Please try again.',
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
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
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error answering question:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process question. Please try again.',
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
