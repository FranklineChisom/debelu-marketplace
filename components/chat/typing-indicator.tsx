"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

interface TypingIndicatorProps {
    message?: string;
}

export function TypingIndicator({ message }: TypingIndicatorProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex w-full gap-4"
        >
            {/* Consistent Avatar */}
            <div className="w-9 h-9 rounded-full bg-card border shadow-sm flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-primary/40" />
            </div>

            {/* Bubble */}
            <div className="relative px-4 py-3 bg-card border border-border/40 rounded-[22px] rounded-tl-none shadow-sm flex items-center min-h-[46px]">
                {message && (
                    <span className="text-xs text-muted-foreground mr-3 font-medium animate-pulse">{message}</span>
                )}
                <div className="flex gap-1.5 h-full items-center">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-foreground/40"
                            animate={{
                                y: [0, -3, 0],
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
