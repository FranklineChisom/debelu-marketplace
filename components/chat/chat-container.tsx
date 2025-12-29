"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores";
import { chatMessageUser, chatMessageAI, staggerContainer } from "@/lib/animations";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { WelcomeState } from "./welcome-state";

interface ChatContainerProps {
    className?: string;
}

export function ChatContainer({ className }: ChatContainerProps) {
    const messages = useChatStore((state) => state.messages);
    const isTyping = useChatStore((state) => state.isTyping);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, isTyping.isTyping]);

    const hasMessages = messages.length > 0;

    return (
        <div
            ref={scrollRef}
            className={cn(
                "flex-1 overflow-y-auto scrollbar-thin",
                "px-4 py-6",
                className
            )}
        >
            <div className="max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                    {!hasMessages ? (
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <WelcomeState />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="messages"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="space-y-4"
                        >
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    variants={message.role === "user" ? chatMessageUser : chatMessageAI}
                                    className={cn(
                                        "flex",
                                        message.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <MessageBubble message={message} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Typing Indicator */}
                <AnimatePresence>
                    {isTyping.isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-4"
                        >
                            <TypingIndicator message={isTyping.message} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
