import { ChatMessage } from '../stores/useChatbotStore';

const OLLAMA_BASE_URL = 'http://localhost:11434';

/**
 * Sends a message to Ollama and receives a response
 * Maintains conversation history for context
 * @param message - The user's message
 * @param conversationHistory - Previous messages in the conversation
 * @param model - The Ollama model to use (default: 'qwen3-vl:235b-cloud')
 * @returns Promise<string> - The assistant's response
 */
export async function sendMessageToOllama(
  conversationHistory: ChatMessage[],
  model: string = 'qwen3-vl:235b-cloud'
): Promise<string> {
  // Build messages array for Ollama API
  // The conversationHistory already includes the current user message
  const messages = conversationHistory.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message?.content || '';
  } catch (error) {
    console.error('Error sending message to Ollama:', error);
    throw error;
  }
}
