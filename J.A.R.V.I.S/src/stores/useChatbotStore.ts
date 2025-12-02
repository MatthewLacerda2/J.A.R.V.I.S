import { create } from 'zustand';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotStore {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  updateLastAssistantMessage: (content: string) => void;
  clearMessages: () => void;
}

export const useChatbotStore = create<ChatbotStore>((set) => ({
  messages: [],

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  addUserMessage: (content) => {
    set((state) => ({
      messages: [...state.messages, { role: 'user', content }],
    }));
  },

  addAssistantMessage: (content) => {
    set((state) => ({
      messages: [...state.messages, { role: 'assistant', content }],
    }));
  },

  updateLastAssistantMessage: (content) => {
    set((state) => {
      const newMessages = [...state.messages];
      const lastIndex = newMessages.length - 1;
      if (lastIndex >= 0 && newMessages[lastIndex].role === 'assistant') {
        newMessages[lastIndex] = { ...newMessages[lastIndex], content };
      } else {
        // If last message is not assistant, add a new one
        newMessages.push({ role: 'assistant', content });
      }
      return { messages: newMessages };
    });
  },

  clearMessages: () => {
    set({ messages: [] });
  },
}));
