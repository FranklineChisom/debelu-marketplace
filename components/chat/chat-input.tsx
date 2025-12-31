"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores";
import { toast } from "sonner";

interface ChatInputProps {
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    placeholder?: string;
    disabled?: boolean;
}

export function ChatInput({
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    placeholder = "What are you looking for?",
    disabled = false,
}: ChatInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const selectedProduct = useChatStore((state) => state.selectedProduct);
    const setSelectedProduct = useChatStore((state) => state.setSelectedProduct);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(
                textareaRef.current.scrollHeight,
                120
            )}px`;
        }
    }, [input]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    return (
        <div className="bg-transparent safe-bottom">
            <div className="max-w-3xl mx-auto">
                {/* Context Banner */}
                <AnimatePresence>
                    {selectedProduct && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mb-2 px-4 py-2 bg-primary/10 backdrop-blur-md rounded-2xl border border-primary/20 flex items-center justify-between mr-2"
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="text-sm text-primary font-medium truncate">
                                    Replying about <span className="font-bold">{selectedProduct.name}</span>
                                </span>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 -mr-1 hover:bg-primary/20 text-primary"
                                onClick={() => setSelectedProduct(null)}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative flex items-end gap-2">
                    {/* Input Container */}
                    <div className="flex-1 relative group">
                        <div className={cn(
                            "flex items-end rounded-[1.5rem] bg-muted/40 backdrop-blur-md border border-white/10 shadow-sm transition-all duration-300",
                            "focus-within:bg-background focus-within:ring-1 focus-within:ring-primary/20 focus-within:shadow-lg hover:bg-muted/60",
                            selectedProduct && "ring-1 ring-primary/30 bg-primary/5"
                        )}>

                            {/* Textarea */}
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder={selectedProduct ? `Ask about ${selectedProduct.name}...` : placeholder}
                                disabled={disabled || isLoading}
                                rows={1}
                                className={cn(
                                    "flex-1 bg-transparent resize-none py-3.5 px-5 text-base leading-relaxed font-medium",
                                    "placeholder:text-muted-foreground/70",
                                    "focus:outline-none",
                                    "disabled:opacity-50 disabled:cursor-not-allowed",
                                    "max-h-32 min-h-[3rem]"
                                )}
                            />

                            {/* Voice Button */}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="flex-shrink-0 h-12 w-12 rounded-full text-muted-foreground hover:text-foreground hover:bg-transparent"
                                disabled={disabled || isLoading}
                                onClick={() => toast.info("Voice chat coming soon!")}
                            >
                                <Mic className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Send Button */}
                    <motion.div
                        animate={{
                            scale: input.trim() ? 1 : 0.9,
                            opacity: input.trim() ? 1 : 0.5,
                        }}
                        transition={{ duration: 0.15 }}
                    >
                        <Button
                            type="submit"
                            size="icon"
                            className={cn(
                                "h-12 w-12 rounded-full shadow-lg transition-all active:scale-95",
                                selectedProduct ? "bg-primary hover:bg-primary/90" : "bg-primary hover:bg-primary/90",
                                "text-primary-foreground"
                            )}
                            onClick={(e) => handleSubmit(e as any)}
                            disabled={!input.trim() || disabled || isLoading}
                        >
                            <Send className="w-5 h-5 ml-0.5" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
