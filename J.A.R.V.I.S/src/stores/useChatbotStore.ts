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

  clearMessages: () => {
    set({ messages: [] });
  },
}));
