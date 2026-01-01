"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Brain, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThinkingIndicatorProps {
    thought: string;
    isFinished?: boolean;
}

export const ThinkingIndicator = ({ thought, isFinished = true }: ThinkingIndicatorProps) => {
    const [isExpanded, setIsExpanded] = useState(true);

    if (!thought && isFinished) return null;

    return (
        <div className="w-full mb-2">
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "flex items-center gap-2 cursor-pointer transition-all duration-200 select-none w-fit",
                    "text-xs font-medium text-muted-foreground/80 hover:text-foreground"
                )}
            >
                <DivWrapper isFinished={isFinished} />
                <span>
                    {isFinished ? "Thought Process" : "Thinking..."}
                </span>
                <ChevronDown
                    className={cn(
                        "w-3 h-3 transition-transform duration-200",
                        isExpanded ? "transform rotate-180" : ""
                    )}
                />
            </div>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pl-2 ml-1.5 border-l-2 border-border/60 mt-2 text-xs text-muted-foreground/90 leading-relaxed whitespace-pre-wrap max-w-[90%] font-mono">
                            {thought}
                            {!isFinished && (
                                <span className="inline-block w-1.5 h-3 ml-1 bg-primary/60 animate-pulse align-middle" />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const DivWrapper = ({ isFinished }: { isFinished: boolean }) => {
    if (isFinished) {
        return <Brain className="w-3.5 h-3.5" />;
    }
    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </motion.div>
    );
};
