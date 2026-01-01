export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
    id: string;
    role: MessageRole;
    content: string;
    timestamp: Date;

    /**
     * Smart AI Metadata
     * Contains the result of the AI reasoning process
     */
    toolCall?: {
        name: string;
        args: Record<string, unknown>;
        data: unknown;
    };

    /**
     * Vercel AI SDK Tool Invocations
     * Supports streaming tool calls
     */
    toolInvocations?: Array<{
        toolCallId: string;
        toolName: string;
        args: Record<string, unknown>;
        state: 'result' | 'partial-call' | 'call';
        result?: unknown;
    }>;

    /**
     * Action Suggestions
     * Shown below the bubble for quick user interaction
     */
    suggestions?: string[];

    /**
     * Deep Analysis Metadata
     */
    metadata?: {
        intent?: string;
        sentiment?: 'positive' | 'neutral' | 'negative' | 'weak' | 'frustrated';
        contextCategory?: string;
        highlightedIds?: string[];
    };
}

export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    updatedAt: Date;
}

/**
 * Valid UI Panel States
 * Ensure these match the available components in components/chat/panels/
 */
export type ChatPanel =
    | 'none'
    | 'product-detail'
    | 'compare'
    | 'cart'
    | 'checkout'
    | 'orders'
    | 'intelligence'
    | 'order_detail'
    | 'tracking';

// ============================================================================
// DISCRIMINATED UNION TYPES FOR PANEL DATA
// ============================================================================

import type { ProductSummary } from './product';

/** Product data used in panels (flexible for API responses) */
export interface PanelProduct {
    id: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    image?: string;
    images?: Array<string | { url: string }>;
    vendorName?: string;
    vendor_name?: string;
    vendorId?: string;
    vendor_id?: string;
    rating?: number;
    reviewCount?: number;
    review_count?: number;
    reviews?: number; // Alias for reviewCount
    stock?: number;
    category?: string;
    campusId?: string;
    campus_id?: string;
    description?: string;
    attributes?: Record<string, string | number>;
}

/** Panel data for product-detail */
export interface ProductDetailPanelData {
    type: 'product-detail';
    product: PanelProduct;
}

/** Panel data for compare */
export interface ComparePanelData {
    type: 'compare';
    products: PanelProduct[];
}

/** Panel data for intelligence */
export interface IntelligencePanelData {
    type: 'intelligence';
    products: PanelProduct[];
}

/** Panel data for order_detail */
export interface OrderDetailPanelData {
    type: 'order_detail';
    orderId: string;
    order?: {
        id: string;
        orderNumber: string;
        items: ProductSummary[];
        total: number;
        status: string;
        date: string;
        itemCount: number;
        createdAt: string;
    };
}

/** Panel data for tracking */
export interface TrackingPanelData {
    type: 'tracking';
    orderId: string;
}

/** No data needed for these panels */
export interface EmptyPanelData {
    type: 'none' | 'cart' | 'checkout' | 'orders';
}

/** Discriminated union of all panel data types */
export type PanelData =
    | ProductDetailPanelData
    | ComparePanelData
    | IntelligencePanelData
    | OrderDetailPanelData
    | TrackingPanelData
    | EmptyPanelData
    | null;

// ============================================================================
// CHAT STATE INTERFACE
// ============================================================================

/**
 * Full Chat Store Interface
 * Matches the Zustand implementation in stores/chat-store.ts
 */
export interface ChatState {
    sessions: ChatSession[];
    currentSessionId: string | null;
    activePanel: ChatPanel;
    panelData: PanelData;
    isTyping: boolean;

    // Core Actions
    addMessage: (sessionId: string, message: Message) => void;
    setTyping: (isTyping: boolean) => void;
    setActivePanel: (panel: ChatPanel) => void;
    setPanelData: (data: PanelData) => void;
    setCurrentSession: (id: string) => void;
    clearSession: (id: string) => void;

    // Panel convenience methods
    openPanel: (panel: ChatPanel, data?: PanelData) => void;
    closePanel: () => void;
    addAssistantMessage: (sessionId: string, content: string) => void;

    // Type-safe panel data access
    getProductDetailData: () => ProductDetailPanelData | null;
    getCompareData: () => ComparePanelData | null;
    getIntelligenceData: () => IntelligencePanelData | null;
    getOrderDetailData: () => OrderDetailPanelData | null;
}