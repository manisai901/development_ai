import { GoogleGenerativeAI } from '@google/generative-ai';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Note: Storing your API key in the frontend (VITE_ prefix) is NOT recommended
// for production applications as anyone inspecting the network can see it.
// We are doing this here for lightweight testing and demonstration purposes.
// For production, this logic should be moved to a backend server or Vercel serverless function.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// ============================================================================
// MODEL CONFIGURATION
// ============================================================================

export type ModelType = 'default' | 'fast' | 'reasoning' | 'lite';

interface ModelConfig {
  name: string;
  description: string;
  useCase: string;
  speed: number; // 1-5 stars
  quality: number; // 1-5 stars
}

const MODEL_CONFIG: Record<ModelType, string> = {
  default: 'gemini-2.5-flash', // Best for most tasks
  reasoning: 'gemini-2.5-pro', // More advanced reasoning
  fast: 'gemini-2.0-flash', // Fast, reliable
  lite: 'gemini-2.5-flash-lite', // Lightweight, faster
};

const MODEL_INFO: Record<ModelType, ModelConfig> = {
  default: {
    name: 'Mani AI 2.5 Flash',
    description: 'Latest, fastest, and most capable model. Best for all-purpose tasks.',
    useCase: 'General chat, code, creative writing',
    speed: 5,
    quality: 4,
  },
  reasoning: {
    name: 'Mani AI 2.5 Pro',
    description: 'More advanced reasoning and complex problem-solving.',
    useCase: 'Complex logic, advanced analysis, research',
    speed: 3,
    quality: 5,
  },
  fast: {
    name: 'Mani AI 2.0 Flash',
    description: 'Fast and reliable for most use cases.',
    useCase: 'Quick responses, simple tasks',
    speed: 4,
    quality: 4,
  },
  lite: {
    name: 'Mani AI 2.5 Lite',
    description: 'Lightweight version for quick responses.',
    useCase: 'Simple queries, fast turnaround',
    speed: 5,
    quality: 3,
  },
};

// Generation configuration for response quality
const GENERATION_CONFIG = {
  temperature: 0.7, // 0.0 = deterministic, 1.0 = creative
  topP: 0.95, // Nucleus sampling - diversity in responses
  topK: 40, // Top-K sampling
  maxOutputTokens: 4096,
};

// ============================================================================
// ERROR HANDLING
// ============================================================================

interface ApiError extends Error {
  code?: string;
  status?: number;
}

const getErrorMessage = (error: any): string => {
  if (!error) return 'Unknown error occurred';

  // Handle specific HTTP status codes
  if (error.message?.includes('404')) {
    return 'Model not found. The model you\'re using may be deprecated. Try using gemini-2.5-flash instead.';
  }
  if (error.message?.includes('401')) {
    return 'Invalid API key. Please check your VITE_GEMINI_API_KEY in .env.local';
  }
  if (error.message?.includes('429')) {
    return 'Rate limit exceeded. Please wait a moment and try again.';
  }
  if (error.message?.includes('500')) {
    return 'Gemini API server error. Please try again later.';
  }
  if (error.message?.includes('API key')) {
    return 'Gemini API Key is missing. Add VITE_GEMINI_API_KEY to your .env.local file.';
  }

  return error.message || 'Failed to connect to AI service';
};

// ============================================================================
// PUBLIC FUNCTIONS
// ============================================================================

/**
 * Validate if the API key is working
 */
export const validateApiKey = async (): Promise<boolean> => {
  if (!genAI) {
    console.error('API key not configured');
    return false;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_CONFIG.default,
    });
    const result = await model.generateContent('test');
    return !!result.response.text();
  } catch (error) {
    console.error('API validation failed:', error);
    return false;
  }
};

/**
 * Get model information
 */
export const getModelInfo = (modelType: ModelType = 'default'): ModelConfig => {
  return MODEL_INFO[modelType];
};

/**
 * Get all available models
 */
export const getAvailableModels = (): Array<{ type: ModelType; config: ModelConfig }> => {
  return (Object.keys(MODEL_INFO) as ModelType[]).map((type) => ({
    type,
    config: MODEL_INFO[type],
  }));
};

/**
 * Stream chat completion with Gemini API
 *
 * @param prompt - The user's prompt/question
 * @param onChunk - Callback for each streamed chunk
 * @param onFinish - Callback when streaming completes
 * @param onError - Callback for errors
 * @param modelType - Type of model to use ('default', 'reasoning', 'fast', 'lite')
 */
export const streamChatCompletion = async (
  prompt: string,
  onChunk: (chunk: string) => void,
  onFinish?: () => void,
  onError?: (error: ApiError) => void,
  modelType: ModelType = 'default'
): Promise<void> => {
  if (!genAI) {
    const error = new Error(
      'Gemini API Key is missing. Add VITE_GEMINI_API_KEY to your .env.local file and restart the server.'
    ) as ApiError;
    console.error(error.message);
    if (onError) onError(error);
    return;
  }

  const selectedModel = MODEL_CONFIG[modelType] || MODEL_CONFIG.default;
  const modelInfo = MODEL_INFO[modelType] || MODEL_INFO.default;

  console.log(`[Gemini] Using model: ${modelInfo.name} (${selectedModel})`);

  try {
    const model = genAI.getGenerativeModel({
      model: selectedModel,
      generationConfig: GENERATION_CONFIG,
    });

    console.log(`[Gemini] Sending prompt: ${prompt.substring(0, 100)}...`);
    const startTime = Date.now();
    let chunkCount = 0;

    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        onChunk(chunkText);
        chunkCount++;
      }
    }

    const responseTime = Date.now() - startTime;
    console.log(
      `[Gemini] Response complete. Chunks: ${chunkCount}, Time: ${responseTime}ms`
    );

    if (onFinish) onFinish();
  } catch (error: any) {
    const apiError = new Error(getErrorMessage(error)) as ApiError;
    apiError.code = error.code;
    apiError.status = error.status;

    console.error('[Gemini] API Error:', {
      message: error.message,
      code: error.code,
      status: error.status,
      userMessage: apiError.message,
    });

    if (onError) onError(apiError);
  }
};

/**
 * Non-streaming chat completion (simpler use case)
 * Useful for settings validation or simple one-off requests
 */
export const getChatCompletion = async (
  prompt: string,
  modelType: ModelType = 'default'
): Promise<string> => {
  if (!genAI) {
    throw new Error(
      'Gemini API Key is missing. Add VITE_GEMINI_API_KEY to your .env.local file.'
    );
  }

  const selectedModel = MODEL_CONFIG[modelType] || MODEL_CONFIG.default;
  const modelInfo = MODEL_INFO[modelType] || MODEL_INFO.default;

  console.log(`[Gemini] Using model: ${modelInfo.name} (${selectedModel})`);

  try {
    const model = genAI.getGenerativeModel({
      model: selectedModel,
      generationConfig: GENERATION_CONFIG,
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    const errorMessage = getErrorMessage(error);
    console.error('[Gemini] API Error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

/**
 * Get the current selected model name
 */
export const getCurrentModelName = (modelType: ModelType = 'default'): string => {
  return MODEL_CONFIG[modelType] || MODEL_CONFIG.default;
};
