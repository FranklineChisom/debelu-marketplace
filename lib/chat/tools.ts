/**
 * Chat AI Tool Registry - Apple Standard
 * 
 * Single source of truth for all chat tool definitions,
 * types, and result handling.
 */

// ============================================================================
// TOOL TYPE DEFINITIONS
// ============================================================================

/** All available tool names in the chat system */
export type ToolName = 'search_marketplace' | 'compare_products' | 'open_ui_panel';

/** Tool invocation state machine */
export type ToolState = 'call' | 'partial-call' | 'result';

/** UI panels that can be opened via tools */
export type UIPanel = 'cart' | 'checkout' | 'orders';

// ============================================================================
// TOOL RESULT INTERFACES (Type-safe contracts)
// ============================================================================

/** Product returned from search_marketplace */
export interface ProductResult {
    id: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    image?: string;
    images?: Array<string | { url: string }>;
    category?: string;
    rating?: number;
    reviewCount?: number;
    vendorId?: string;
    vendorName?: string;
    vendor_name?: string;
    stock?: number;
    campusId?: string;
    campus_id?: string;
    attributes?: Record<string, string>;
}

/** Result from search_marketplace tool */
export type SearchMarketplaceResult = ProductResult[] | string;

/** Result from compare_products tool */
export type CompareProductsResult = ProductResult[] | string;

/** Result from open_ui_panel tool */
export interface OpenUIPanelResult {
    panel: UIPanel;
    status: 'opened';
}

// ============================================================================
// TOOL INVOCATION TYPE
// ============================================================================

/** Base tool invocation structure */
export interface ToolInvocation<T = unknown> {
    toolCallId: string;
    toolName: ToolName;
    args: Record<string, unknown>;
    state: ToolState;
    result?: T;
}

/** Type-safe tool invocation variants */
export type SearchToolInvocation = ToolInvocation<SearchMarketplaceResult>;
export type CompareToolInvocation = ToolInvocation<CompareProductsResult>;
export type UIPanelToolInvocation = ToolInvocation<OpenUIPanelResult>;

/** Union of all tool invocations */
export type AnyToolInvocation = SearchToolInvocation | CompareToolInvocation | UIPanelToolInvocation;

// ============================================================================
// TOOL UTILITIES
// ============================================================================

/** Type guard: Check if result is an array of products */
export function isProductArray(result: unknown): result is ProductResult[] {
    return Array.isArray(result) && result.length > 0 && typeof result[0] === 'object' && 'id' in result[0];
}

/** Type guard: Check if invocation has a successful result */
export function hasResult(invocation: ToolInvocation): boolean {
    return invocation.state === 'result' && invocation.result !== undefined;
}

/** Type guard: Check if tool is in loading state */
export function isLoading(invocation: ToolInvocation): boolean {
    return invocation.state === 'call' || invocation.state === 'partial-call';
}

/** Extract products from search or compare tool result */
export function extractProducts(result: unknown): ProductResult[] {
    if (isProductArray(result)) {
        return result;
    }
    return [];
}

// ============================================================================
// VERCEL AI DATA STREAM PROTOCOL TYPES
// ============================================================================

/** Protocol line prefixes for Vercel AI SDK Data Stream */
export const STREAM_PROTOCOL = {
    TEXT: '0:',           // Text content
    TOOL_CALL: '9:',      // Tool call initiated
    TOOL_RESULT: 'a:',    // Tool result received
    ERROR: 'e:',          // Error occurred
    FINISH: 'd:',         // Stream finished
    STEP_FINISH: 'e:',    // Step finished (multi-step)
} as const;

/** Parsed tool call from stream */
export interface StreamToolCall {
    toolCallId: string;
    toolName: string;
    args: Record<string, unknown>;
}

/** Parsed tool result from stream */
export interface StreamToolResult {
    toolCallId: string;
    result: unknown;
}
