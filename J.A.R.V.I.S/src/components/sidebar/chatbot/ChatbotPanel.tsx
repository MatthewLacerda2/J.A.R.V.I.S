import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useChatbotStore } from '../../../stores/useChatbotStore';
import { checkOllamaInstalled } from '../../../utils/chatbotUtils';
import { sendMessageToOllama } from '../../../services/chatbotService';

export function ChatbotPanel() {
  const [isOllamaAvailable, setIsOllamaAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messages = useChatbotStore((state) => state.messages);
  const addUserMessage = useChatbotStore((state) => state.addUserMessage);
  const addAssistantMessage = useChatbotStore((state) => state.addAssistantMessage);
  const updateLastAssistantMessage = useChatbotStore((state) => state.updateLastAssistantMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if Ollama is installed when component mounts
    checkOllamaInstalled().then(setIsOllamaAvailable);
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!isOllamaAvailable) return;

    // Add user message immediately
    addUserMessage(content);
    
    addAssistantMessage('');
    setIsLoading(true);

    try {
      // Get current conversation history (includes the user message and empty assistant message)
      const allMessages = useChatbotStore.getState().messages;
      
      // Exclude the empty assistant message we just added - only send up to the user message
      const conversationHistory = allMessages.slice(0, -1);

      // Accumulate the full response as chunks come in
      let fullResponse = '';

      // Stream the response from Ollama
      await sendMessageToOllama(
        conversationHistory,
        (chunk) => {
          fullResponse += chunk;
          updateLastAssistantMessage(fullResponse);
        }
      );
    } catch (error) {
      console.error('Error getting response from Ollama:', error);
      updateLastAssistantMessage('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show error message if Ollama is not available
  if (isOllamaAvailable === false) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center text-gray-400 text-sm max-w-md">
            <p className="mb-2">You must install Ollama on your machine to use this feature.</p>
            <p>Go to <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 underline">ollama.com</a></p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while checking Ollama
  if (isOllamaAvailable === null) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-gray-500 text-sm">Checking Ollama...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Start a conversation with the assistant...
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <ChatInput onSendMessage={handleSendMessage} disabled={!isOllamaAvailable || isLoading} />
    </div>
  );
}
