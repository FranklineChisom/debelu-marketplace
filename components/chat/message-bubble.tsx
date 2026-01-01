"use client";

import React, { useState } from "react";
import { Message } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Volume2, Check } from "lucide-react";
import { DeliveryMap } from "./delivery-map";
import { ToolRenderer } from "./tool-renderer";
import { haptics } from "@/lib/haptics";
import type { ToolInvocation } from "@/lib/chat/tools";
import { ThinkingIndicator } from "./thinking-indicator";

interface MessageBubbleProps {
    message: Message;
    isLast?: boolean;
}

/**
 * Apple-Standard Message Bubble
 * 
 * Clean, minimal message component that delegates
 * all tool rendering to the unified ToolRenderer.
 */
export const MessageBubble = ({ message, isLast }: MessageBubbleProps) => {
    const isAssistant = message.role === "assistant";
    const [isCopied, setIsCopied] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setIsCopied(true);
        haptics.notification('success');
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleSpeak = () => {
        if (!('speechSynthesis' in window)) return;
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            const u = new SpeechSynthesisUtterance(message.content);
            u.onend = () => setIsSpeaking(false);
            setIsSpeaking(true);
            window.speechSynthesis.speak(u);
        }
    };

    // Cast toolInvocations to proper type
    const toolInvocations = (message.toolInvocations || []) as ToolInvocation[];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                type: "spring",
                damping: 25,
                stiffness: 300
            }}
            className={cn("flex w-full gap-4 group", !isAssistant && "flex-row-reverse")}
            role="article"
            aria-label={`${isAssistant ? 'Assistant' : 'You'} said`}
        >
            {/* Avatar */}
            <Avatar className="w-9 h-9 border border-border/50 shadow-sm shrink-0">
                <AvatarImage src={isAssistant ? "/images/bot-avatar.png" : "/images/user-avatar.png"} />
                <AvatarFallback className="text-[10px] font-medium bg-muted text-muted-foreground">
                    {isAssistant ? "DB" : "ME"}
                </AvatarFallback>
            </Avatar>

            <div className={cn("flex flex-col max-w-[85%] lg:max-w-[70%] gap-2", !isAssistant && "items-end")}>
                {/* Main Text Bubble */}
                {/* Reasoning Indicator - ABOVE content if present */}
                {message.thought && isAssistant && (
                    <ThinkingIndicator
                        thought={message.thought}
                        isFinished={!!message.content} // If content exists, reasoning is likely done
                    />
                )}

                {message.content && (
                    <div className={cn(
                        "relative px-5 py-3.5 rounded-[22px] text-[15px] leading-relaxed shadow-sm transition-all",
                        isAssistant
                            ? "bg-card border border-border/40 text-card-foreground rounded-tl-none"
                            : "bg-primary text-primary-foreground rounded-tr-none shadow-primary/20"
                    )}>
                        <div className="whitespace-pre-wrap">{message.content}</div>

                        {/* Assistant Quick Actions */}
                        {isAssistant && (
                            <div
                                className="absolute -bottom-8 left-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                role="toolbar"
                                aria-label="Message actions"
                            >
                                <button
                                    onClick={handleCopy}
                                    className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors"
                                    aria-label={isCopied ? "Copied!" : "Copy message"}
                                >
                                    {isCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                    onClick={handleSpeak}
                                    className={cn("p-1.5 hover:bg-muted rounded-md transition-colors", isSpeaking ? "text-primary" : "text-muted-foreground")}
                                    aria-label={isSpeaking ? "Stop speaking" : "Read aloud"}
                                >
                                    <Volume2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Tool Results - Unified Renderer */}
                <AnimatePresence>
                    {toolInvocations.map(invocation => (
                        <ToolRenderer
                            key={invocation.toolCallId}
                            invocation={invocation}
                        />
                    ))}
                </AnimatePresence>

                {/* Delivery Map (Special Case) */}
                <AnimatePresence>
                    {message.content?.includes("ORDER_MAP") && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full mt-2"
                        >
                            <DeliveryMap className="rounded-2xl border shadow-sm overflow-hidden" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Timestamp */}
                <span className="text-[10px] opacity-30 px-2 font-medium">
                    {new Date(message.timestamp || ('createdAt' in message ? (message as { createdAt?: Date }).createdAt : undefined) || new Date()).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
            </div>
        </motion.div>
    );
};