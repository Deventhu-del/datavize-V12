import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ChatMessage, ChatSession, ThinkingStep, Agent } from '@/lib/types';

interface ChatState {
  // Current session
  currentSession: ChatSession | null;
  currentAgent: Agent | null;
  
  // Messages
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  
  // Thinking steps
  thinkingSteps: ThinkingStep[];
  currentThinkingStep: ThinkingStep | null;
  
  // Actions
  setCurrentSession: (session: ChatSession) => void;
  setCurrentAgent: (agent: Agent) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;
  
  // Thinking steps actions
  addThinkingStep: (step: ThinkingStep) => void;
  updateThinkingStep: (id: string, updates: Partial<ThinkingStep>) => void;
  setCurrentThinkingStep: (step: ThinkingStep | null) => void;
  clearThinkingSteps: () => void;
  
  // Chat actions
  sendMessage: (content: string) => Promise<void>;
  startStreaming: () => void;
  stopStreaming: () => void;
}

export const useChatStore = create<ChatState>()(
  immer((set, get) => ({
    // Initial state
    currentSession: null,
    currentAgent: null,
    messages: [],
    isLoading: false,
    isStreaming: false,
    thinkingSteps: [],
    currentThinkingStep: null,

    // Session actions
    setCurrentSession: (session) => {
      set((state) => {
        state.currentSession = session;
        state.messages = session.messages;
      });
    },

    setCurrentAgent: (agent) => {
      set((state) => {
        state.currentAgent = agent;
      });
    },

    // Message actions
    addMessage: (message) => {
      set((state) => {
        state.messages.push(message);
      });
    },

    updateMessage: (id, updates) => {
      set((state) => {
        const message = state.messages.find(m => m.id === id);
        if (message) {
          Object.assign(message, updates);
        }
      });
    },

    clearMessages: () => {
      set((state) => {
        state.messages = [];
      });
    },

    // Thinking steps actions
    addThinkingStep: (step) => {
      set((state) => {
        state.thinkingSteps.push(step);
      });
    },

    updateThinkingStep: (id, updates) => {
      set((state) => {
        const step = state.thinkingSteps.find(s => s.id === step.id);
        if (step) {
          Object.assign(step, updates);
        }
      });
    },

    setCurrentThinkingStep: (step) => {
      set((state) => {
        state.currentThinkingStep = step;
      });
    },

    clearThinkingSteps: () => {
      set((state) => {
        state.thinkingSteps = [];
        state.currentThinkingStep = null;
      });
    },

    // Chat actions
    sendMessage: async (content) => {
      const { addMessage, addThinkingStep, updateThinkingStep, setCurrentThinkingStep } = get();
      
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      };
      addMessage(userMessage);

      // Add assistant message placeholder
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      };
      addMessage(assistantMessage);

      // Simulate thinking steps
      const thinkingSteps: ThinkingStep[] = [
        {
          id: '1',
          type: 'analysis',
          title: 'Analyzing your request',
          description: 'Understanding the context and requirements',
          status: 'active',
          timestamp: new Date(),
        },
        {
          id: '2',
          type: 'research',
          title: 'Gathering information',
          description: 'Searching relevant knowledge and data',
          status: 'pending',
          timestamp: new Date(),
        },
        {
          id: '3',
          type: 'reasoning',
          title: 'Processing information',
          description: 'Applying logic and reasoning',
          status: 'pending',
          timestamp: new Date(),
        },
        {
          id: '4',
          type: 'execution',
          title: 'Generating response',
          description: 'Creating comprehensive answer',
          status: 'pending',
          timestamp: new Date(),
        },
      ];

      // Add thinking steps
      thinkingSteps.forEach(step => addThinkingStep(step));
      setCurrentThinkingStep(thinkingSteps[0]);

      // Simulate step progression
      for (let i = 0; i < thinkingSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (i < thinkingSteps.length - 1) {
          updateThinkingStep(thinkingSteps[i].id, { status: 'completed' });
          setCurrentThinkingStep(thinkingSteps[i + 1]);
          updateThinkingStep(thinkingSteps[i + 1].id, { status: 'active' });
        } else {
          updateThinkingStep(thinkingSteps[i].id, { status: 'completed' });
          setCurrentThinkingStep(null);
        }
      }

      // Simulate response generation
      const response = `I've analyzed your request: "${content}". Based on my analysis, research, and reasoning, here's my comprehensive response. I've considered multiple perspectives and approaches to provide you with the most helpful information possible.`;

      // Update assistant message with final content
      updateMessage(assistantMessage.id, {
        content: response,
        isStreaming: false,
        thinkingSteps: thinkingSteps,
      });
    },

    startStreaming: () => {
      set((state) => {
        state.isStreaming = true;
      });
    },

    stopStreaming: () => {
      set((state) => {
        state.isStreaming = false;
      });
    },
  }))
);




