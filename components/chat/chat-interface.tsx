"use client";

import { useState } from "react";
import { useChatStream } from "@/components/chat/use-chat-stream";
import { useChatStore } from "@/stores";
import { ChatContainer } from "@/components/chat/chat-container";
import type { Message } from "@/types/chat";

interface ChatInterfaceProps {
    sessionId: string;
    initialMessages: Message[];
}

/**
 * Apple-Standard Chat Interface
 * 
 * Main chat component using the custom stream hook
 * for robust tool handling.
 */
export function ChatInterface({ sessionId, initialMessages }: ChatInterfaceProps) {
    const [lastError, setLastError] = useState<string | null>(null);

    // Custom Robust Hook
    const {
        messages,
        append,
        isLoading
    } = useChatStream({
        sessionId,
        initialMessages: initialMessages as Parameters<typeof useChatStream>[0]['initialMessages'],
        onFinish: (message) => {
            console.log("Stream finished:", message.id);
        }
    });

    const handleSend = async (content: string) => {
        if (!content.trim()) return;

        try {
            await append({
                role: 'user',
                content,
                id: crypto.randomUUID()
            });
        } catch (e: unknown) {
            const errorMsg = e instanceof Error ? e.message : "Failed to send message.";
            console.error("Failed to append message:", errorMsg);
            setLastError(errorMsg);
        }
    };

    // Cast messages to Message[] for ChatContainer compatibility
    const displayMessages = messages.map(m => ({
        ...m,
        timestamp: m.timestamp || m.createdAt || new Date()
    })) as Message[];

    return (
        <div className="flex-1 w-full h-full flex flex-col relative">
            <ChatContainer
                messages={displayMessages}
                isLoading={isLoading}
                onSend={handleSend}
            />

            {/* Error Toast */}
            {lastError && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-destructive/90 text-white px-4 py-2 rounded-full text-sm shadow-lg backdrop-blur-sm z-50 animate-in fade-in slide-in-from-top-2">
                    {lastError}
                    <button onClick={() => setLastError(null)} className="ml-2 hover:opacity-80">✕</button>
                </div>
            )}
        </div>
    );
}

