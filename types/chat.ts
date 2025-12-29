/**
 * Chat types for the conversational interface
 */

import type { ProductSummary } from "./product";
import type { OrderSummary } from "./order";

export type MessageRole = "user" | "assistant" | "system";

export type MessageType =
    | "text"
    | "products"
    | "product-detail"
    | "cart"
    | "checkout"
    | "order-confirmation"
    | "order-status"
    | "quick-actions"
    | "typing"
    | "error";

export interface ChatMessage {
    id: string;
    role: MessageRole;
    type: MessageType;
    content: string;

    // Attachments based on type
    products?: ProductSummary[];
    product?: ProductSummary;
    order?: OrderSummary;
    quickActions?: QuickAction[];

    // Metadata
    timestamp: string;
    isStreaming?: boolean;
}

export interface QuickAction {
    id: string;
    label: string;
    action: string; // Action identifier
    icon?: string;
    variant?: "default" | "secondary" | "outline";
}

export interface ChatSession {
    id: string;
    userId: string;
    campusId: string;
    messages: ChatMessage[];
    context: ChatContext;
    createdAt: string;
    updatedAt: string;
}

export interface ChatContext {
    // Current search/filter state
    currentSearch?: string;
    currentCategory?: string;
    priceRange?: { min: number; max: number };

    // Reference to products being discussed
    viewedProducts: string[];
    comparedProducts: string[];

    // Shopping state
    cartItemCount: number;

    // User preferences learned from conversation
    preferences: {
        budgetSensitive: boolean;
        preferredCategories: string[];
        preferredBrands: string[];
    };
}

// For sending messages to the AI
export interface ChatRequest {
    message: string;
    sessionId: string;
    context: ChatContext;
}

// AI response structure
export interface ChatResponse {
    message: ChatMessage;
    suggestedActions?: QuickAction[];
    searchResults?: ProductSummary[];
}

// Typing indicator state
export interface TypingState {
    isTyping: boolean;
    message?: string; // e.g., "Searching for laptops..."
}
