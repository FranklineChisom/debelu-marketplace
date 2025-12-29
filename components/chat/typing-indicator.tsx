"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

interface TypingIndicatorProps {
    message?: string;
}

export function TypingIndicator({ message }: TypingIndicatorProps) {
    return (
        <div className="flex gap-3">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-primary-foreground" />
            </div>

            {/* Typing bubble */}
            <div className="chat-bubble chat-bubble-ai inline-flex flex-col gap-2">
                {message && (
                    <span className="text-xs text-muted-foreground">{message}</span>
                )}
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-muted-foreground/50"
                            animate={{
                                y: [0, -4, 0],
                                opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
