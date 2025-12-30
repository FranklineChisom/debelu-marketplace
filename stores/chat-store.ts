/**
 * Chat store for managing conversation state
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ChatMessage, ChatContext, QuickAction, TypingState } from "@/types";
import type { ProductSummary } from "@/types";

interface ChatStore {
    // State
    messages: ChatMessage[];
    context: ChatContext;
    isTyping: TypingState;
    sessionId: string | null;

    // UI State
    activePanel: 'none' | 'product_detail' | 'compare' | 'cart' | 'checkout' | 'order_detail' | 'tracking';
    activePanelData: any; // For passing data like orderId or specific product to the panel

    selectedProduct: ProductSummary | null;
    comparingProducts: ProductSummary[] | null;
    isSidebarOpen: boolean;
    history: { id: string; title: string; date: string; preview: string }[];

    // Actions
    addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
    addUserMessage: (content: string) => void;
    addAssistantMessage: (content: string, options?: Partial<ChatMessage>) => void;
    addProductsMessage: (content: string, products: ChatMessage["products"]) => void;
    updateLastMessage: (updates: Partial<ChatMessage>) => void;

    setTyping: (isTyping: boolean, message?: string) => void;

    // UI Actions
    openPanel: (panel: ChatStore['activePanel'], data?: any) => void;
    closePanel: () => void;

    setSelectedProduct: (product: ProductSummary | null) => void;
    setComparingProducts: (products: ProductSummary[] | null) => void;
    toggleSidebar: () => void;

    updateContext: (updates: Partial<ChatContext>) => void;

    clearMessages: () => void;
    startNewSession: () => void;
    populateWithMockData: () => void;
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

// Mock Products for Initial State
const MOCK_PRODUCTS: ProductSummary[] = [
    {
        id: "dell-inspiron-15",
        name: "Dell Inspiron 15 3000 Series",
        price: 320000,
        compareAtPrice: 350000,
        vendorId: "v1",
        vendorName: "Gadget Hub UNILAG",
        rating: 4.5,
        reviewCount: 24,
        image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=800",
        stock: 5,
        category: "Laptops",
        campusId: "unilag",
        attributes: {
            "Processor": "Intel Core i5 11th Gen",
            "RAM": "8GB DDR4",
            "Storage": "256GB SSD",
            "Condition": "New"
        }
    },
    {
        id: "hp-pavilion-15",
        name: "HP Pavilion 15 (Clean UK Use)",
        price: 285000,
        compareAtPrice: 300000,
        vendorId: "v2",
        vendorName: "Campus Tech Solutions",
        rating: 4.2,
        reviewCount: 18,
        image: "https://images.unsplash.com/photo-1588872657578-839e535e0854?auto=format&fit=crop&q=80&w=800",
        stock: 2,
        category: "Laptops",
        campusId: "unilag",
        attributes: {
            "Processor": "AMD Ryzen 5",
            "RAM": "16GB",
            "Storage": "512GB SSD",
            "Condition": "UK Used"
        }
    },
    {
        id: "lenovo-ideapad",
        name: "Lenovo Ideapad 3",
        price: 210000,
        compareAtPrice: 240000,
        vendorId: "v3",
        vendorName: "Student Gadgets",
        rating: 4.8,
        reviewCount: 56,
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800",
        stock: 8,
        category: "Laptops",
        campusId: "unilag",
        attributes: {
            "Processor": "Intel Core i3",
            "RAM": "8GB",
            "Storage": "1TB HDD",
            "Condition": "New"
        }
    }
];

const MOCK_MESSAGES: ChatMessage[] = [
    {
        id: "msg_1",
        role: "user",
        type: "text",
        content: "I need a specialized laptop for coding. My budget is around 250k - 300k. Any good options?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
        id: "msg_2",
        role: "assistant",
        type: "text",
        content: "I found some great options for you within that range! Since you're coding, I prioritized good RAM and fast SSD storage.",
        timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    },
    {
        id: "msg_3",
        role: "assistant",
        type: "products",
        content: "Here are the top picks available on campus right now:",
        products: MOCK_PRODUCTS,
        timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        quickActions: [
            { id: "qa_1", label: "Compare Specs", action: "compare" },
            { id: "qa_2", label: "Show cheaper options", action: "filter_price" }
        ]
    },
    {
        id: "msg_4",
        role: "user",
        type: "text",
        content: "The Dell looks good. Can I see more details?",
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    },
    {
        id: "msg_5",
        role: "assistant",
        type: "product-detail",
        content: "The Dell Inspiron 15 is a workhorse. It features an 11th Gen Intel Core i5, which is excellent for compiling code and running virtual machines. The 256GB SSD ensures fast boot times.",
        product: MOCK_PRODUCTS[0],
        timestamp: new Date(Date.now() - 1000 * 60 * 1.5).toISOString(),
    },
    {
        id: "msg_6",
        role: "user",
        type: "text",
        content: "Okay, add it to my cart along with a USB-C hub.",
        timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    },
    {
        id: "msg_7",
        role: "assistant",
        type: "cart",
        content: "I've added the Dell Inspiron 15 and a generic USB-C Hub to your cart.",
        timestamp: new Date(Date.now() - 1000 * 30).toISOString(),
        quickActions: [
            { id: "qa_checkout", label: "Proceed to Checkout", action: "checkout", variant: "default" },
            { id: "qa_keep_shopping", label: "Keep Shopping", action: "keep_shopping" }
        ]
    },
    {
        id: "msg_8",
        role: "user",
        type: "text",
        content: "Let's checkout now.",
        timestamp: new Date(Date.now() - 1000 * 20).toISOString(),
    },
    {
        id: "msg_9",
        role: "assistant",
        type: "order-confirmation",
        content: "Great! Your order has been placed successfully.",
        order: {
            id: "ord_123",
            orderNumber: "DBL-2024-8832",
            items: [],
            total: 332500,
            status: "pending",
            date: new Date().toISOString(),
            itemCount: 2,
            createdAt: new Date().toISOString()
        },
        timestamp: new Date(Date.now() - 1000 * 5).toISOString(),
    }
];

export const useChatStore = create<ChatStore>()(
    persist(
        (set, get) => ({
            messages: MOCK_MESSAGES,
            context: initialContext,
            isTyping: { isTyping: false },
            sessionId: null,

            activePanel: 'none',
            activePanelData: null,
            selectedProduct: null,
            comparingProducts: null,
            isSidebarOpen: true,

            // Mock History
            history: [
                { id: "1", title: "Product Inquiry: Nike Air Max", date: "Today", preview: "Do you have this in size 42?" },
                { id: "2", title: "Shipping to Lagos", date: "Yesterday", preview: "How long does delivery take?" },
                { id: "3", title: "Bulk Order Questions", date: "Last Week", preview: "I need 50 units of..." },
                { id: "4", title: "HP Pavilion Specs", date: "Last Week", preview: "Is the RAM upgradable?" },
                { id: "5", title: "Payment Issues", date: "2 Weeks Ago", preview: "My card was declined..." },
            ],

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

            // ... (other actions remain same until setTyping)

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

            openPanel: (panel, data) => {
                set({ activePanel: panel, activePanelData: data, isSidebarOpen: false }); // Close sidebar when panel opens on mobile?
            },

            closePanel: () => {
                set({ activePanel: 'none', activePanelData: null, selectedProduct: null, comparingProducts: null });
            },

            setSelectedProduct: (product) => {
                set({
                    selectedProduct: product,
                    comparingProducts: null,
                    activePanel: product ? 'product_detail' : 'none'
                });
            },

            setComparingProducts: (products) => {
                set({
                    comparingProducts: products,
                    selectedProduct: null,
                    activePanel: products ? 'compare' : 'none'
                });
            },

            toggleSidebar: () => {
                set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
            },

            updateContext: (updates) => {
                set((state) => ({
                    context: { ...state.context, ...updates },
                }));
            },

            clearMessages: () => {
                set({ messages: [], context: initialContext, selectedProduct: null });
            },

            startNewSession: () => {
                set({
                    sessionId: generateId(),
                    messages: [],
                    context: initialContext,
                    isTyping: { isTyping: false },
                    selectedProduct: null,
                });
            },

            populateWithMockData: () => {
                set({
                    messages: MOCK_MESSAGES,
                    context: initialContext,
                    sessionId: generateId(),
                });
            },
        }),
        {
            name: "debelu-chat-demo-v2",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                messages: state.messages.slice(-50),
                context: state.context,
                sessionId: state.sessionId,
            }),
        }
    )
);
