import { Ollama } from 'ollama';
import { ChatMessage } from '../stores/useChatbotStore';

const ollama = new Ollama({
  host: 'http://localhost:11434',
});

/**
 * Sends a message to Ollama and streams the response
 * Maintains conversation history for context
 * @param conversationHistory - Previous messages in the conversation (includes current user message)
 * @param onChunk - Callback function to handle each chunk of the streamed response
 * @param model - The Ollama model to use (default: 'qwen3-vl:235b-cloud')
 * @returns Promise<void>
 */
export async function sendMessageToOllama(
  conversationHistory: ChatMessage[],
  onChunk: (chunk: string) => void,
  model: string = 'qwen3-vl:235b-cloud'
): Promise<void> {
  // Build messages array for Ollama API
  // The conversationHistory already includes the current user message
  const messages = conversationHistory.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  try {
    const response = await ollama.chat({
      model,
      messages,
      stream: true,
    });

    // Stream the response
    for await (const chunk of response) {
      if (chunk.message?.content) {
        onChunk(chunk.message.content);
      }
    }
  } catch (error) {
    console.error('Error sending message to Ollama:', error);
    throw error;
  }
}