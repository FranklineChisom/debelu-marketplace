import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    ChatState,
    ChatSession,
    Message,
    ChatPanel,
    PanelData,
    ProductDetailPanelData,
    ComparePanelData,
    IntelligencePanelData,
    OrderDetailPanelData
} from '@/types/chat';

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            sessions: [],
            currentSessionId: null,
            activePanel: 'none',
            panelData: null,
            isTyping: false,

            // Actions
            addMessage: (sessionId, message) => set((state) => {
                const sessionIndex = state.sessions.findIndex(s => s.id === sessionId);

                // If session doesn't exist, create it
                if (sessionIndex === -1) {
                    const newSession: ChatSession = {
                        id: sessionId,
                        title: 'New Conversation',
                        messages: [message],
                        updatedAt: new Date()
                    };
                    return {
                        sessions: [newSession, ...state.sessions],
                        currentSessionId: sessionId
                    };
                }

                // Update existing session
                const newSessions = [...state.sessions];
                const session = newSessions[sessionIndex];

                newSessions[sessionIndex] = {
                    ...session,
                    messages: [...session.messages, message],
                    updatedAt: new Date()
                };

                return { sessions: newSessions };
            }),

            setTyping: (isTyping) => set({ isTyping }),

            setActivePanel: (panel) => set({ activePanel: panel }),

            setPanelData: (data) => set({ panelData: data }),

            setCurrentSession: (id) => set({ currentSessionId: id }),

            clearSession: (id) => set((state) => ({
                sessions: state.sessions.filter(s => s.id !== id),
                currentSessionId: state.currentSessionId === id ? null : state.currentSessionId
            })),

            // Convenience methods for panels
            openPanel: (panel, data) => set({ activePanel: panel, panelData: data ?? null }),

            closePanel: () => set({ activePanel: 'none', panelData: null }),

            addAssistantMessage: (sessionId, content) => {
                const message: Message = {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content,
                    timestamp: new Date()
                };
                get().addMessage(sessionId, message);
            },

            // Type-safe panel data getters (use type narrowing)
            getProductDetailData: () => {
                const data = get().panelData;
                if (data && 'type' in data && data.type === 'product-detail') {
                    return data as ProductDetailPanelData;
                }
                return null;
            },

            getCompareData: () => {
                const data = get().panelData;
                if (data && 'type' in data && data.type === 'compare') {
                    return data as ComparePanelData;
                }
                return null;
            },

            getIntelligenceData: () => {
                const data = get().panelData;
                if (data && 'type' in data && data.type === 'intelligence') {
                    return data as IntelligencePanelData;
                }
                return null;
            },

            getOrderDetailData: () => {
                const data = get().panelData;
                if (data && 'type' in data && data.type === 'order_detail') {
                    return data as OrderDetailPanelData;
                }
                return null;
            },
        }),
        {
            name: 'debelu-chat-store-v5', // Version bumped
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                sessions: state.sessions,
                currentSessionId: state.currentSessionId
            }),
        }
    )
);
