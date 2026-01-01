"use client";

import { useState, useCallback, useRef } from "react";
import { useChatStore } from "@/stores";
import {
    STREAM_PROTOCOL,
    ToolInvocation,
    ToolName,
    isProductArray
} from "@/lib/chat/tools";

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: Date;
    timestamp?: Date;
    toolInvocations?: ToolInvocation[];
}

interface UseChatStreamOptions {
    sessionId: string;
    initialMessages?: ChatMessage[];
    onFinish?: (message: ChatMessage) => void;
    onToolCall?: (invocation: ToolInvocation) => void;
}

/**
 * Apple-Standard Chat Stream Hook
 * 
 * Handles full Vercel AI Data Stream protocol including:
 * - Text content (0:)
 * - Tool calls (9:)
 * - Tool results (a:)
 * - Finish signals (d:)
 */
export function useChatStream({
    sessionId,
    initialMessages = [],
    onFinish,
    onToolCall
}: UseChatStreamOptions) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState("");
    const addMessage = useChatStore((state) => state.addMessage);
    const setActivePanel = useChatStore((state) => state.setActivePanel);
    const setPanelData = useChatStore((state) => state.setPanelData);

    // Track tool invocations during stream
    const toolInvocationsRef = useRef<Map<string, ToolInvocation>>(new Map());

    const append = useCallback(async (message: { role: string; content: string; id?: string }) => {
        setIsLoading(true);
        toolInvocationsRef.current.clear();

        // 1. Add User Message
        const userMsg: ChatMessage = {
            id: message.id || crypto.randomUUID(),
            role: 'user',
            content: message.content,
            createdAt: new Date(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);

        try {
            // 2. Fetch API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg],
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`API Error ${response.status}: ${text.slice(0, 100)}`);
            }
            if (!response.body) throw new Error("No response body");

            // 3. Setup Assistant Message Placeholder
            const assistantId = crypto.randomUUID();
            const assistantMsg: ChatMessage = {
                id: assistantId,
                role: 'assistant',
                content: '',
                createdAt: new Date(),
                timestamp: new Date(),
                toolInvocations: []
            };
            setMessages(prev => [...prev, assistantMsg]);

            // 4. Parse Stream with Full Protocol Support
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let finalContent = "";
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Process buffer by lines
                const lines = buffer.split('\n');
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (!line.trim()) continue;

                    // === TEXT CONTENT (0:) ===
                    if (line.startsWith(STREAM_PROTOCOL.TEXT)) {
                        try {
                            const textContent = JSON.parse(line.slice(2));
                            finalContent += textContent;
                        } catch {
                            // Skip malformed text lines
                        }
                    }

                    // === TOOL CALL START (9:) ===
                    else if (line.startsWith(STREAM_PROTOCOL.TOOL_CALL)) {
                        try {
                            const toolData = JSON.parse(line.slice(2));
                            const invocation: ToolInvocation = {
                                toolCallId: toolData.toolCallId,
                                toolName: toolData.toolName as ToolName,
                                args: toolData.args || {},
                                state: 'call'
                            };

                            toolInvocationsRef.current.set(toolData.toolCallId, invocation);

                            // Notify callback for UI panel tools
                            if (onToolCall) {
                                onToolCall(invocation);
                            }

                            // Update message with pending tool
                            updateAssistantMessage(assistantId, finalContent, Array.from(toolInvocationsRef.current.values()));
                        } catch {
                            // Skip malformed tool call lines
                        }
                    }

                    // === TOOL RESULT (a:) ===
                    else if (line.startsWith(STREAM_PROTOCOL.TOOL_RESULT)) {
                        try {
                            const resultData = JSON.parse(line.slice(2));
                            const existing = toolInvocationsRef.current.get(resultData.toolCallId);

                            if (existing) {
                                existing.state = 'result';
                                existing.result = resultData.result;
                                toolInvocationsRef.current.set(resultData.toolCallId, existing);

                                // Handle side-effect tools (panel opening)
                                handleToolSideEffects(existing);

                                // Update message with completed tool
                                updateAssistantMessage(assistantId, finalContent, Array.from(toolInvocationsRef.current.values()));
                            }
                        } catch {
                            // Skip malformed result lines
                        }
                    }

                    // === FINISH (d:) ===
                    else if (line.startsWith(STREAM_PROTOCOL.FINISH)) {
                        // Stream complete, no action needed
                    }
                }

                // Live Update (text only, tools update separately)
                setMessages(prev => prev.map(m =>
                    m.id === assistantId
                        ? {
                            ...m,
                            content: finalContent,
                            toolInvocations: Array.from(toolInvocationsRef.current.values())
                        }
                        : m
                ));
            }

            // 5. Final Message Save
            const finalAssistantMsg: ChatMessage = {
                ...assistantMsg,
                content: finalContent,
                toolInvocations: Array.from(toolInvocationsRef.current.values())
            };

            addMessage(sessionId, finalAssistantMsg as Parameters<typeof addMessage>[1]);
            if (onFinish) onFinish(finalAssistantMsg);

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            console.error("Stream failed:", errorMessage);

            // Add error message to chat
            const errorMsg: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: `I apologize, but I encountered an issue: ${errorMessage}. Please try again.`,
                createdAt: new Date(),
                timestamp: new Date()
            };
            setMessages(prev => [...prev.slice(0, -1), errorMsg]); // Replace loading message
        } finally {
            setIsLoading(false);
        }
    }, [sessionId, messages, addMessage, onFinish, onToolCall, setActivePanel, setPanelData]);

    // Helper: Update assistant message in state
    const updateAssistantMessage = (id: string, content: string, tools: ToolInvocation[]) => {
        setMessages(prev => prev.map(m =>
            m.id === id ? { ...m, content, toolInvocations: tools } : m
        ));
    };

    // Helper: Handle tool side effects (panel opening, etc.)
    const handleToolSideEffects = (invocation: ToolInvocation) => {
        if (invocation.toolName === 'open_ui_panel' && invocation.result) {
            const result = invocation.result as { panel: string };
            setActivePanel(result.panel as 'cart' | 'checkout' | 'orders');
        }

        if (invocation.toolName === 'compare_products' && isProductArray(invocation.result)) {
            setActivePanel('compare');
            setPanelData({
                type: 'compare',
                products: invocation.result
            });
        }

        if (invocation.toolName === 'search_marketplace' && isProductArray(invocation.result)) {
            // Only open intelligence panel for larger result sets
            if (invocation.result.length > 3) {
                setActivePanel('intelligence');
                setPanelData({
                    type: 'intelligence',
                    products: invocation.result
                });
            }
        }
    };

    return {
        messages,
        append,
        input,
        setInput,
        isLoading
    };
}
