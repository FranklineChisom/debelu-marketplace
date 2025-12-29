"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Mic, Paperclip, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores";

interface ChatInputProps {
    onSend?: (message: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function ChatInput({
    onSend,
    placeholder = "What are you looking for?",
    disabled = false,
}: ChatInputProps) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const addUserMessage = useChatStore((state) => state.addUserMessage);
    const setTyping = useChatStore((state) => state.setTyping);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(
                textareaRef.current.scrollHeight,
                120
            )}px`;
        }
    }, [message]);

    const handleSubmit = () => {
        const trimmed = message.trim();
        if (!trimmed || disabled) return;

        // Add user message
        addUserMessage(trimmed);
        setMessage("");

        // Simulate AI response (in real app, this would call API)
        setTyping(true, "Searching for products...");

        // Simulate delay then stop typing
        setTimeout(() => {
            setTyping(false);
            // Mock AI response would be added here
        }, 2000);

        // Callback
        onSend?.(trimmed);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="border-t bg-background safe-bottom">
            <div className="max-w-2xl mx-auto p-4">
                <div className="relative flex items-end gap-2">
                    {/* Input Container */}
                    <div className="flex-1 relative">
                        <div className="flex items-end bg-muted rounded-2xl border shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                            {/* Attachment Button */}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="flex-shrink-0 h-12 w-12 rounded-full"
                                disabled={disabled}
                            >
                                <Paperclip className="w-5 h-5 text-muted-foreground" />
                            </Button>

                            {/* Textarea */}
                            <textarea
                                ref={textareaRef}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={placeholder}
                                disabled={disabled}
                                rows={1}
                                className={cn(
                                    "flex-1 bg-transparent resize-none py-3 pr-3 text-base",
                                    "placeholder:text-muted-foreground",
                                    "focus:outline-none",
                                    "disabled:opacity-50 disabled:cursor-not-allowed",
                                    "max-h-32"
                                )}
                            />

                            {/* Voice Button */}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="flex-shrink-0 h-12 w-12 rounded-full"
                                disabled={disabled}
                            >
                                <Mic className="w-5 h-5 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>

                    {/* Send Button */}
                    <motion.div
                        animate={{
                            scale: message.trim() ? 1 : 0.9,
                            opacity: message.trim() ? 1 : 0.5,
                        }}
                        transition={{ duration: 0.15 }}
                    >
                        <Button
                            type="submit"
                            size="icon"
                            className="h-12 w-12 rounded-full shadow-lg"
                            onClick={handleSubmit}
                            disabled={!message.trim() || disabled}
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </motion.div>
                </div>

                {/* AI hint */}
                <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-muted-foreground">
                    <Sparkles className="w-3 h-3" />
                    <span>Powered by Debelu AI</span>
                </div>
            </div>
        </div>
    );
}
