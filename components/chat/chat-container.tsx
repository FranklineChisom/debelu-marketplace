"use client";

import React, { useEffect, useRef } from "react";
import { useChatStore } from "@/stores/chat-store";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { TypingIndicator } from "./typing-indicator";
import { WelcomeState } from "./welcome-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductDetailPanel } from "./product-detail-panel";
import { ProductComparePanel } from "./product-compare-panel";
import { CartPanel } from "./panels/cart-panel";
import { CheckoutPanel } from "./panels/checkout-panel";
import { OrderPanel } from "./panels/order-panel";
import { ProductIntelligencePanel } from "./product-intelligence-panel";
import { Message } from "@/types/chat";
import { AnimatePresence, motion } from "framer-motion";

interface ChatContainerProps {
    messages?: Message[];
    onSend?: (message: string) => void;
    isLoading?: boolean;
}

export const ChatContainer = (props: ChatContainerProps) => {
    const sessions = useChatStore((state) => state.sessions);
    const currentSessionId = useChatStore((state) => state.currentSessionId);
    const isTypingStore = useChatStore((state) => state.isTyping);
    const activePanel = useChatStore((state) => state.activePanel);
    const setActivePanel = useChatStore((state) => state.setActivePanel);
    const getProductDetailData = useChatStore((state) => state.getProductDetailData);
    const getCompareData = useChatStore((state) => state.getCompareData);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Combine loading states
    const isTyping = props.isLoading || isTypingStore;

    // Determine which messages to show: detailed props (streaming) or store session (history)
    const sessionMessages = currentSessionId ? sessions.find((s) => s.id === currentSessionId)?.messages : [];
    const displayMessages = props.messages || sessionMessages || [];

    // Smooth Apple-style scrolling
    useEffect(() => {
        if (scrollRef.current) {
            const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
            }
        }
    }, [displayMessages, isTyping]);

    // Note: Tool side-effects (panel opening) are now handled directly in useChatStream hook
    // This keeps the component focused on rendering only

    const handleSendMessage = async (content: string) => {
        if (!content.trim()) return;

        if (props.onSend) {
            props.onSend(content);
        } else {
            console.warn("ChatContainer used without onSend prop - streaming disabled.");
        }
    };

    return (
        <div className="flex h-full w-full overflow-hidden bg-background">
            <div className={`flex flex-col flex-1 min-w-0 transition-all duration-500 ease-in-out ${activePanel !== 'none' ? 'hidden md:flex' : 'flex'}`}>
                <ScrollArea ref={scrollRef} className="flex-1 px-4 lg:px-8">
                    {displayMessages.length === 0 ? (
                        <WelcomeState onAction={handleSendMessage} />
                    ) : (
                        <div className="space-y-8 max-w-4xl mx-auto py-10 pb-32">
                            {displayMessages.map((msg) => (
                                <MessageBubble key={msg.id} message={msg} />
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="p-6 border-t bg-background/80 backdrop-blur-xl sticky bottom-0">
                    <ChatInput onSend={handleSendMessage} disabled={isTyping} />
                </div>
            </div>

            <AnimatePresence>
                {activePanel !== 'none' && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="w-full md:w-[450px] lg:w-[550px] border-l bg-card shadow-2xl z-50 overflow-y-auto"
                    >
                        <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-card/80 backdrop-blur-md z-10">
                            <h3 className="font-bold capitalize">{activePanel.replace('-', ' ')}</h3>
                            <button onClick={() => setActivePanel('none')} className="p-2 hover:bg-muted rounded-full">✕</button>
                        </div>
                        {activePanel === 'product-detail' && <ProductDetailPanel product={getProductDetailData()?.product} onClose={() => setActivePanel('none')} />}
                        {activePanel === 'compare' && <ProductComparePanel products={getCompareData()?.products || []} onClose={() => setActivePanel('none')} />}
                        {activePanel === 'intelligence' && <ProductIntelligencePanel />}
                        {activePanel === 'cart' && <CartPanel />}
                        {activePanel === 'checkout' && <CheckoutPanel />}
                        {activePanel === 'orders' && <OrderPanel />}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};