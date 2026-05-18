import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const config = { api: { bodyParser: false } };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  if (!genAI) {
    res.status(500).end('Gemini API key not configured');
    return;
  }

  let json = '';
  await new Promise<void>(resolve => {
    req.on('data', (chunk) => { json += chunk; });
    req.on('end', resolve);
  });

  let prompt: string = '';
  let modelType: string = 'default';
  try {
    const body = JSON.parse(json || '{}');
    prompt = body?.prompt || '';
    modelType = body?.modelType || 'default';
    if (!prompt) throw new Error('No prompt');
  } catch {
    res.status(400).end('Invalid payload');
    return;
  }

  const MODEL_CONFIG: Record<string, string> = {
    default: 'gemini-2.5-flash',
    reasoning: 'gemini-2.5-pro',
    fast: 'gemini-2.0-flash',
    lite: 'gemini-2.5-flash-lite',
  };

  try {
    const selectedModel = MODEL_CONFIG[modelType] || MODEL_CONFIG.default;
    const model = genAI.getGenerativeModel({ model: selectedModel });
    const streamResult = await model.generateContentStream(prompt);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    for await (const chunk of streamResult.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err: any) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
}
