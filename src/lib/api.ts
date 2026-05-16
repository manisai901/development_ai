export interface StreamResponse {
  content: string;
  isDone: boolean;
}

export const streamChatCompletion = async (
  prompt: string,
  onChunk: (chunk: string) => void,
  onFinish?: () => void,
  onError?: (error: any) => void
) => {
  try {
    // Example using an abstract endpoint
    // In a real app, this would be your backend URL e.g., import.meta.env.VITE_API_URL + '/chat'
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // If your backend needs Firebase token
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('No readable stream found in response');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      // Depending on the backend (e.g. OpenAI), you might need to parse SSE lines: 'data: {...}'
      // Here we assume a raw text stream or a simplistic SSE parser for demonstration
      
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            continue;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              onChunk(parsed.content);
            }
          } catch (e) {
            // Ignore parse errors on incomplete chunks
          }
        } else {
          // If the backend streams raw text instead of SSE events:
          if (line) {
             onChunk(line);
          }
        }
      }
    }

    if (onFinish) onFinish();
  } catch (error) {
    if (onError) onError(error);
  }
};
