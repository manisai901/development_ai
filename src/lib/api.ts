import { GoogleGenerativeAI } from '@google/generative-ai';

// Note: Storing your API key in the frontend (VITE_ prefix) is NOT recommended
// for production applications as anyone inspecting the network can see it.
// We are doing this here for lightweight testing and demonstration purposes.
// For production, this logic should be moved to a backend server or Vercel serverless function.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const streamChatCompletion = async (
  prompt: string,
  onChunk: (chunk: string) => void,
  onFinish?: () => void,
  onError?: (error: any) => void
) => {
  if (!genAI) {
    const errorMsg = "Gemini API Key is missing. Add VITE_GEMINI_API_KEY to your .env.local file and restart the server.";
    console.error(errorMsg);
    if (onError) onError(new Error(errorMsg));
    return;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        onChunk(chunkText);
      }
    }

    if (onFinish) onFinish();
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (onError) onError(error);
  }
};
