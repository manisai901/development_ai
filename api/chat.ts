import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ============================================================================
// RATE LIMITING
// ============================================================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in ms
const RATE_LIMIT_MAX_REQUESTS = 10; // Max 10 requests per minute

const getClientIp = (req: VercelRequest): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
};

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // Create new record
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Rate limit exceeded
  }

  record.count++;
  return true;
};

const getRateLimitInfo = (ip: string): { remaining: number; limit: number } => {
  const record = rateLimitMap.get(ip);
  if (!record) {
    return { remaining: RATE_LIMIT_MAX_REQUESTS, limit: RATE_LIMIT_MAX_REQUESTS };
  }

  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - record.count);
  return { remaining, limit: RATE_LIMIT_MAX_REQUESTS };
};

// ============================================================================
// GEMINI API CONFIGURATION
// ============================================================================

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('⚠️ GEMINI_API_KEY is not set in environment variables');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Model configuration
const MODEL_CONFIG: Record<string, string> = {
  default: 'gemini-2.5-flash',
  reasoning: 'gemini-2.5-pro',
  fast: 'gemini-2.0-flash',
  lite: 'gemini-2.5-flash-lite',
};

const GENERATION_CONFIG = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 4096,
};

// ============================================================================
// ERROR HANDLING
// ============================================================================

const getErrorMessage = (error: any): string => {
  if (error.message?.includes('401')) {
    return 'Invalid Gemini API key';
  }
  if (error.message?.includes('429')) {
    return 'Gemini API rate limit exceeded';
  }
  if (error.message?.includes('500')) {
    return 'Gemini API server error';
  }
  if (error.message?.includes('API key')) {
    return 'Gemini API key not configured on backend';
  }
  return error.message || 'Failed to generate response';
};

// ============================================================================
// MAIN HANDLER
// ============================================================================

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const clientIp = getClientIp(req);

    // Rate limiting check
    if (!checkRateLimit(clientIp)) {
      const rateLimitInfo = getRateLimitInfo(clientIp);
      console.warn(`[Rate Limit] Blocked request from ${clientIp}`);

      res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS));
      res.setHeader('X-RateLimit-Remaining', '0');

      return res.status(429).json({
        success: false,
        error: `Rate limit exceeded. Maximum ${RATE_LIMIT_MAX_REQUESTS} requests per minute.`,
        rateLimit: rateLimitInfo,
      });
    }

    // Get rate limit info for response headers
    const rateLimitInfo = getRateLimitInfo(clientIp);
    res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS));
    res.setHeader('X-RateLimit-Remaining', String(rateLimitInfo.remaining));

    // Validate API key is configured
    if (!genAI || !apiKey) {
      console.error('[API] Gemini API key not configured');
      return res.status(500).json({
        success: false,
        error: 'Backend not properly configured. GEMINI_API_KEY is missing.',
      });
    }

    // Parse request body
    const { prompt, modelType = 'default' } = req.body;

    // Validate prompt
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid prompt. Must provide a non-empty string.',
      });
    }

    // Validate model type
    if (!Object.keys(MODEL_CONFIG).includes(modelType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid modelType. Must be one of: ${Object.keys(MODEL_CONFIG).join(', ')}`,
      });
    }

    const selectedModel = MODEL_CONFIG[modelType];

    console.log('[API] Request received', {
      ip: clientIp,
      modelType,
      model: selectedModel,
      promptLength: prompt.length,
      rateLimitRemaining: rateLimitInfo.remaining,
    });

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({
      model: selectedModel,
      generationConfig: GENERATION_CONFIG,
    });

    // Generate content
    const startTime = Date.now();
    const result = await model.generateContent(prompt);
    const responseTime = Date.now() - startTime;

    const responseText = result.response.text();

    console.log('[API] Response generated', {
      model: selectedModel,
      responseLength: responseText.length,
      responseTime: `${responseTime}ms`,
    });

    return res.status(200).json({
      success: true,
      response: responseText,
      model: selectedModel,
      timestamp: new Date().toISOString(),
      responseTime,
    });
  } catch (error: any) {
    const errorMessage = getErrorMessage(error);

    console.error('[API] Error:', {
      message: error.message,
      errorMessage,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
