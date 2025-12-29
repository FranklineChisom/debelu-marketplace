"use client";

import { motion } from "framer-motion";
import { MessageSquare, Sparkles } from "lucide-react";
import { useChatStore, useUIStore } from "@/stores";
import { CHAT_SUGGESTIONS, PRODUCT_CATEGORIES } from "@/lib/constants";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function WelcomeState() {
    const addUserMessage = useChatStore((state) => state.addUserMessage);
    const selectedCampus = useUIStore((state) => state.selectedCampus);

    const handleSuggestionClick = (suggestion: string) => {
        addUserMessage(suggestion);
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center py-8"
        >
            {/* Welcome Icon */}
            <motion.div
                variants={fadeInUp}
                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"
            >
                <MessageSquare className="w-8 h-8 text-primary" />
            </motion.div>

            {/* Welcome Text */}
            <motion.div variants={fadeInUp} className="mb-8">
                <h2 className="font-display text-2xl font-bold mb-2">
                    Hey! 👋
                </h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    I'm Debi, your shopping assistant. Tell me what you're looking for
                    and I'll find it on your campus.
                </p>
            </motion.div>

            {/* Try These */}
            <motion.div variants={fadeInUp} className="mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Try asking for:</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                    {CHAT_SUGGESTIONS.slice(0, 6).map((suggestion, i) => (
                        <motion.button
                            key={suggestion}
                            variants={fadeInUp}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-full text-sm font-medium transition-colors"
                        >
                            {suggestion}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Or Browse Categories */}
            <motion.div variants={fadeInUp}>
                <span className="text-sm text-muted-foreground mb-3 block">
                    Or browse by category:
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                    {PRODUCT_CATEGORIES.slice(0, 5).map((category) => (
                        <motion.button
                            key={category.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSuggestionClick(category.name)}
                            className="flex items-center gap-2 px-4 py-2 bg-background border rounded-full text-sm hover:border-primary/50 transition-colors"
                        >
                            <span>{category.emoji}</span>
                            <span>{category.name}</span>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
