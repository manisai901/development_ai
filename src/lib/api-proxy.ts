import { ApiError } from './api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface ProxyChatRequest {
  prompt: string;
  modelType?: 'default' | 'reasoning' | 'fast' | 'lite';
  onChunk?: (chunk: string) => void;
  onFinish?: () => void;
  onError?: (error: ApiError) => void;
}

const getErrorMessage = (error: any): string => {
  if (!error) return 'Unknown error occurred';

  if (error.status === 429) {
    return 'Rate limit exceeded. Maximum 10 requests per minute. Please wait a moment and try again.';
  }
  if (error.status === 401) {
    return 'Unauthorized. Please check your API key.';
  }
  if (error.status === 404) {
    return 'API endpoint not found. Make sure the backend is deployed.';
  }
  if (error.status === 500) {
    return 'Backend server error. Please try again later.';
  }

  return error.message || 'Failed to communicate with backend';
};

/**
 * Stream chat completion via backend proxy (SECURE)
 * Uses /api/chat endpoint instead of exposing API key to frontend
 */
export const streamChatCompletionViaProxy = async ({
  prompt,
  modelType = 'default',
  onChunk,
  onFinish,
  onError,
}: ProxyChatRequest): Promise<void> => {
  if (!prompt || typeof prompt !== 'string') {
    const error = new Error('Invalid prompt') as ApiError;
    if (onError) onError(error);
    return;
  }

  try {
    console.log(`[API Proxy] Sending request to ${API_BASE_URL}/chat`, {
      modelType,
      promptLength: prompt.length,
    });

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        modelType,
      }),
    });

    // Get rate limit info from headers
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const limit = response.headers.get('X-RateLimit-Limit');

    if (remaining !== null && limit !== null) {
      console.log(`[API Proxy] Rate limit: ${remaining}/${limit} remaining`);
    }

    if (!response.ok) {
      const errorData = await response.json();
      const apiError = new Error(getErrorMessage(errorData)) as ApiError;
      apiError.status = response.status;

      console.error('[API Proxy] Backend error:', {
        status: response.status,
        message: errorData.error,
      });

      if (onError) onError(apiError);
      return;
    }

    const data = await response.json();

    if (!data.success) {
      const error = new Error(data.error || 'Backend returned error') as ApiError;
      if (onError) onError(error);
      return;
    }

    console.log('[API Proxy] Response received', {
      model: data.model,
      responseLength: data.response.length,
    });

    // Stream the response as chunks for consistent behavior
    const responseText = data.response;
    const chunkSize = 50; // Characters per chunk for smooth streaming

    for (let i = 0; i < responseText.length; i += chunkSize) {
      const chunk = responseText.substring(i, i + chunkSize);
      if (onChunk) onChunk(chunk);

      // Small delay to simulate streaming effect
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    if (onFinish) onFinish();
  } catch (error: any) {
    const apiError = new Error(getErrorMessage(error)) as ApiError;

    console.error('[API Proxy] Network or parse error:', error);

    if (onError) onError(apiError);
  }
};

/**
 * Non-streaming chat completion via backend proxy
 * Useful for simple requests where streaming isn't needed
 */
export const getChatCompletionViaProxy = async (
  prompt: string,
  modelType: 'default' | 'reasoning' | 'fast' | 'lite' = 'default'
): Promise<string> => {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Invalid prompt');
  }

  try {
    console.log(`[API Proxy] Sending non-streaming request to ${API_BASE_URL}/chat`, {
      modelType,
    });

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        modelType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Backend returned error');
    }

    console.log('[API Proxy] Response received', {
      model: data.model,
      responseLength: data.response.length,
    });

    return data.response;
  } catch (error: any) {
    console.error('[API Proxy] Error:', error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Validate backend API connectivity
 * Use this in Settings or during app initialization
 */
export const validateProxyApi = async (): Promise<boolean> => {
  try {
    console.log(`[API Proxy] Validating backend at ${API_BASE_URL}/chat`);

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Test connection',
        modelType: 'default',
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log('[API Proxy] Backend validation successful');
      return true;
    }

    console.warn('[API Proxy] Backend validation failed:', data.error);
    return false;
  } catch (error) {
    console.error('[API Proxy] Backend validation error:', error);
    return false;
  }
};

/**
 * Get backend health status
 * Returns API availability and rate limit info
 */
export const getBackendStatus = async (): Promise<{
  available: boolean;
  rateLimit?: { remaining: number; limit: number };
  model?: string;
  timestamp?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'ping',
        modelType: 'lite', // Lite is fastest for status check
      }),
    });

    const remaining = response.headers.get('X-RateLimit-Remaining');
    const limit = response.headers.get('X-RateLimit-Limit');

    return {
      available: response.ok,
      rateLimit: remaining && limit ? { remaining: parseInt(remaining), limit: parseInt(limit) } : undefined,
    };
  } catch (error) {
    return { available: false };
  }
};
