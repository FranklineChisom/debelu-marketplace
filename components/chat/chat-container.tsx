"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { WelcomeState } from "./welcome-state";
import { ProductCardChat } from "./product-card-chat";
import type { ChatMessage } from "@/types";

interface ChatContainerProps {
    messages: any[]; // AI SDK messages with toolInvocations
    isLoading: boolean;
    className?: string;
}

export function ChatContainer({ messages, isLoading, className }: ChatContainerProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    if (messages.length === 0 && !isLoading) {
        return (
            <div className={cn("flex-1 flex flex-col overflow-hidden", className)}>
                <ScrollArea className="flex-1">
                    <div className="max-w-3xl mx-auto px-4 py-4">
                        <WelcomeState />
                    </div>
                </ScrollArea>
            </div>
        );
    }

    // Helper to transform AI SDK message/tools to UI ChatMessage
    const transformMessage = (msg: any): ChatMessage => {
        // Debug logging
        console.log("Transforming message:", { role: msg.role, content: msg.content, parts: msg.parts?.length, type: msg.type });

        // Base message
        let content = msg.content;

        // v6 fix: If content is empty but we have text parts, concatenate them
        if (!content && msg.parts) {
            content = msg.parts
                .filter((p: any) => p.type === 'text')
                .map((p: any) => p.text)
                .join('');
        }

        const transformed: ChatMessage = {
            id: msg.id,
            role: msg.role,
            type: "text",
            content: content,
            timestamp: msg.createdAt?.toString() || new Date().toISOString(),
        };

        // Extract tools (v6 parts or v5 toolInvocations)
        const partsTools = msg.parts?.filter((p: any) =>
            p.type?.startsWith('tool-') || p.type === 'tool-invocation'
        ) || [];
        const invocationsTools = msg.toolInvocations || [];
        const toolParts = [...partsTools, ...invocationsTools];

        // Check for product search results
        const searchTool = toolParts.find((t: any) => {
            const name = t.type?.replace('tool-', '') || t.toolName;
            return name === 'searchProducts' && (t.output || t.result);
        });

        if (searchTool) {
            const rawResult = searchTool.output || searchTool.result;
            const products = Array.isArray(rawResult) ? rawResult : (rawResult?.products || []);

            if (products.length > 0) {
                transformed.type = "products";
                transformed.products = products;

                // Add Quick Actions
                transformed.quickActions = [
                    { id: 'view', label: 'View Details', action: 'view_detail', variant: 'secondary' },
                ];

                if (products.length > 1) {
                    transformed.quickActions.push({
                        id: 'compare',
                        label: 'Compare Products',
                        action: 'compare',
                        icon: 'ArrowRightLeft',
                        variant: 'outline'
                    });
                }
            }
        }

        // Check for add to cart tool
        const cartTool = toolParts.find((t: any) => {
            const name = t.type?.replace('tool-', '') || t.toolName;
            return name === 'addToCart' && (t.output || t.result);
        });

        if (cartTool) {
            // We could show a specific "Added to Cart" bubble type if MessageBubble supports it,
            // or just rely on the text response "I've added X to your cart"
            // For now, let's keep it simple or check if MessageBubble has a cart type we want to switch to.
            // Looking at MessageBubble, it has type="cart" for CartSummaryBubble vs just text.
            // Let's assume the assistant text covers it, effectively.
        }

        return transformed;
    };

    return (
        <div className={cn("flex-1 flex flex-col overflow-hidden min-h-0", className)}>
            <ScrollArea className="flex-1" ref={scrollRef}>
                <div className="max-w-3xl mx-auto px-4 py-4 space-y-6">
                    <AnimatePresence mode="popLayout">
                        {messages.map((message) => {
                            const isUser = message.role === "user";
                            const transformedMessage = transformMessage(message);

                            return (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className={cn(
                                        "flex w-full",
                                        isUser ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {/* Use MessageBubble for everyone */}
                                    <MessageBubble message={transformedMessage} />
                                </motion.div>
                            );
                        })}

                        {isLoading && messages.length > 0 && (() => {
                            const lastMessage = messages[messages.length - 1];
                            const showThinking = lastMessage?.role === 'user' ||
                                (lastMessage?.role === 'assistant' && !lastMessage?.content && !lastMessage?.parts?.some((p: any) => p.type?.startsWith('tool-')));

                            if (!showThinking) return null;

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <TypingIndicator message="Thinking..." />
                                </motion.div>
                            );
                        })()}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>
        </div>
    );
}

// Default export for backwards compatibility
export default ChatContainer;