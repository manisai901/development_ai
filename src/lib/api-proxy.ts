export async function streamChatCompletionViaProxy({
  prompt,
  onChunk,
  onFinish,
  onError,
}: {
  prompt: string;
  onChunk: (chunk: string) => void;
  onFinish?: () => void;
  onError?: (error: Error) => void;
}) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.body) throw new Error('No response body');

    const decoder = new TextDecoder('utf-8');
    let buf = '';
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      // Process any full SSE events in the buffer
      let idx;
      while ((idx = buf.indexOf('\n\n')) !== -1) {
        const chunk = buf.slice(0, idx);
        buf = buf.slice(idx + 2);

        if (chunk.startsWith('data:')) {
          const payload = chunk.replace('data:', '').trim();
          if (payload === '[DONE]') {
            if (onFinish) onFinish();
            return;
          }
          try {
            const { content, error } = JSON.parse(payload);
            if (error) {
              if (onError) onError(new Error(error));
              return;
            }
            if (content != null && onChunk) onChunk(content);
          } catch (err) {
            // Ignore malformed JSON
          }
        }
      }
    }
    if (onFinish) onFinish();
  } catch (err: any) {
    if (onError) onError(err);
  }
}
