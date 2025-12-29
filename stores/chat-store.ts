/**
 * Chat store for managing conversation state
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ChatMessage, ChatContext, QuickAction, TypingState } from "@/types";

interface ChatStore {
    // State
    messages: ChatMessage[];
    context: ChatContext;
    isTyping: TypingState;
    sessionId: string | null;

    // Actions
    addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
    addUserMessage: (content: string) => void;
    addAssistantMessage: (content: string, options?: Partial<ChatMessage>) => void;
    addProductsMessage: (content: string, products: ChatMessage["products"]) => void;
    updateLastMessage: (updates: Partial<ChatMessage>) => void;

    setTyping: (isTyping: boolean, message?: string) => void;

    updateContext: (updates: Partial<ChatContext>) => void;

    clearMessages: () => void;
    startNewSession: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const initialContext: ChatContext = {
    viewedProducts: [],
    comparedProducts: [],
    cartItemCount: 0,
    preferences: {
        budgetSensitive: false,
        preferredCategories: [],
        preferredBrands: [],
    },
};

export const useChatStore = create<ChatStore>()(
    persist(
        (set, get) => ({
            messages: [],
            context: initialContext,
            isTyping: { isTyping: false },
            sessionId: null,

            addMessage: (message) => {
                const newMessage: ChatMessage = {
                    id: generateId(),
                    timestamp: new Date().toISOString(),
                    ...message,
                };

                set((state) => ({
                    messages: [...state.messages, newMessage],
                }));
            },

            addUserMessage: (content) => {
                get().addMessage({
                    role: "user",
                    type: "text",
                    content,
                });
            },

            addAssistantMessage: (content, options = {}) => {
                get().addMessage({
                    role: "assistant",
                    type: "text",
                    content,
                    ...options,
                });
            },

            addProductsMessage: (content, products) => {
                get().addMessage({
                    role: "assistant",
                    type: "products",
                    content,
                    products,
                });
            },

            updateLastMessage: (updates) => {
                set((state) => {
                    if (state.messages.length === 0) return state;

                    const newMessages = [...state.messages];
                    const lastIndex = newMessages.length - 1;
                    newMessages[lastIndex] = {
                        ...newMessages[lastIndex],
                        ...updates,
                    };

                    return { messages: newMessages };
                });
            },

            setTyping: (isTyping, message) => {
                set({ isTyping: { isTyping, message } });
            },

            updateContext: (updates) => {
                set((state) => ({
                    context: { ...state.context, ...updates },
                }));
            },

            clearMessages: () => {
                set({ messages: [], context: initialContext });
            },

            startNewSession: () => {
                set({
                    sessionId: generateId(),
                    messages: [],
                    context: initialContext,
                    isTyping: { isTyping: false },
                });
            },
        }),
        {
            name: "debelu-chat",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                messages: state.messages.slice(-50), // Keep last 50 messages
                context: state.context,
                sessionId: state.sessionId,
            }),
        }
    )
);
