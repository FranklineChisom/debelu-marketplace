"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    MessageSquare,
    MoreHorizontal,
    Menu,
    User,
    Search,
    Trash2,
    X,
    Sparkles,
    Clock,
    Edit3,
    Share,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChatContainer } from "@/components/chat/chat-container";
import { ChatInput } from "@/components/chat/chat-input";
import { ProductDetailPanel } from "@/components/chat/product-detail-panel";
import { ProductComparePanel } from "@/components/chat/product-compare-panel";
import { CartPanel } from "@/components/chat/panels/cart-panel";
import { CheckoutPanel } from "@/components/chat/panels/checkout-panel";
import { OrderPanel } from "@/components/chat/panels/order-panel";
import { DeliveryMap } from "@/components/chat/delivery-map";
import { useChatStore, useCartStore } from "@/stores";
import { useMarketplaceStore } from "@/stores/useMarketplaceStore";

import { useChat } from '@ai-sdk/react';

// ... other imports

export default function ChatPage() {
    const isSidebarOpen = useChatStore((state) => state.isSidebarOpen);
    const toggleSidebar = useChatStore((state) => state.toggleSidebar);
    const startNewSession = useChatStore((state) => state.startNewSession);
    const activePanel = useChatStore((state) => state.activePanel);
    const history = useChatStore((state) => state.history);

    const [searchQuery, setSearchQuery] = useState("");
    const [chatInput, setChatInput] = useState(""); // Local input state for v3 API

    // Initialize Vercel AI SDK useChat hook (v3 API)
    // Uses sendMessage instead of handleSubmit, status instead of isLoading
    const { messages, sendMessage, status, setMessages } = useChat();

    // Derive isLoading from status for component compatibility
    const isLoading = status === 'streaming' || status === 'submitted';

    // Handle input change for compatibility
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setChatInput(e.target.value);
    };

    // Handle submit using sendMessage
    const handleSubmit = async (e?: { preventDefault?: () => void }) => {
        e?.preventDefault?.();
        if (!chatInput.trim()) return;
        await sendMessage({ content: chatInput });
        setChatInput("");
    };

    const processedToolIds = useRef<Set<string>>(new Set());

    // Handle Client-Side Tool Effects
    useEffect(() => {
        if (!messages.length) return;

        const lastMessage = messages[messages.length - 1] as any;
        const toolInvocations = lastMessage.toolInvocations || lastMessage.parts?.filter((p: any) => p.type === 'tool-invocation') || [];
        if (lastMessage.role !== 'assistant' || !toolInvocations.length) return;

        toolInvocations.forEach((toolInvocation: any) => {
            if (processedToolIds.current.has(toolInvocation.toolCallId)) return;

            // Handle "addToCart"
            if (toolInvocation.toolName === 'addToCart' && 'result' in toolInvocation) {
                processedToolIds.current.add(toolInvocation.toolCallId);
                const { productId, quantity } = (toolInvocation.result as any);

                // Get product from store and add to cart
                const storeProducts = useMarketplaceStore.getState().products;
                const product = storeProducts.find(p => p.id === productId);

                if (product) {
                    // Add to cart using cart store
                    useCartStore.getState().addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        compareAtPrice: product.compareAtPrice,
                        image: product.images?.[0]?.url || "",
                        vendorName: product.vendorId,
                        rating: product.rating || 0,
                        reviewCount: product.reviewCount || 0,
                        stock: product.stock,
                        campusId: product.campusId,
                        vendorId: product.vendorId,
                    }, quantity || 1);

                    console.log("Added to cart:", product.name, quantity);
                } else {
                    console.warn("Product not found for addToCart:", productId);
                }

                // Open cart panel to show the added item
                useChatStore.getState().openPanel('cart');
            }
        });
    }, [messages]);

    const handleNewChat = () => {
        // Reload page or reset useChat (useChat doesn't have a direct reset, 
        // usually window.location.reload() or manually setMessages([]))
        // For now, we'll just reload to clear state or we can use setMessages([]) if we extract it.
        // Actually, startNewSession is for the store. 
        // We'll just reload for a fresh start with the AI for this demo.
        window.location.reload();
    };

    // Group history by date
    const groupedHistory = history.reduce((groups, item) => {
        const group = groups.find(g => g.date === item.date);
        if (group) {
            group.items.push(item);
        } else {
            groups.push({ date: item.date, items: [item] });
        }
        return groups;
    }, [] as { date: string; items: typeof history }[]);

    // Filter history based on search
    const filteredGroups = searchQuery
        ? groupedHistory.map(group => ({
            ...group,
            items: group.items.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.preview.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(group => group.items.length > 0)
        : groupedHistory;

    const SidebarContent = () => (
        <div className="flex flex-col h-full">

            {/* New Chat Button */}
            <Button
                onClick={handleNewChat}
                className="w-full justify-center gap-2 h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-medium shadow-sm mb-4"
            >
                <Plus className="w-4 h-4" />
                New Chat
            </Button>

            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 pl-9 pr-9 rounded-xl bg-muted/50 border-0 text-sm placeholder:text-muted-foreground/60"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* History List */}
            <ScrollArea className="flex-1">
                <div className="px-0 space-y-4">
                    {filteredGroups.length === 0 ? (
                        <div className="text-center py-8">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                            <p className="text-xs text-muted-foreground">
                                {searchQuery ? "No matching conversations" : "No conversations yet"}
                            </p>
                        </div>
                    ) : (
                        filteredGroups.map((group) => (
                            <div key={group.date}>
                                {/* Date Header */}
                                <div className="flex items-center gap-2 px-2 py-1.5 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
                                    <Clock className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                        {group.date}
                                    </span>
                                </div>

                                {/* Items */}
                                <div className="space-y-1 mt-1">
                                    {group.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group flex items-center justify-between gap-2 pl-4 pr-2 py-3 rounded-xl hover:bg-accent/50 transition-all duration-200 cursor-pointer"
                                        >
                                            <div className="flex-1 min-w-0 pr-2">
                                                <p className="text-[13px] font-medium truncate text-foreground/80 group-hover:text-foreground transition-colors">
                                                    {item.title}
                                                </p>
                                                <p className="text-[11px] text-muted-foreground/70 truncate group-hover:text-muted-foreground transition-colors mt-0.5">
                                                    {item.preview}
                                                </p>
                                            </div>

                                            {/* Actions Dropdown */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button
                                                        className="w-7 h-7 rounded-full hover:bg-background/80 flex items-center justify-center text-muted-foreground/0 group-hover:text-muted-foreground transition-all duration-200 flex-shrink-0"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40 p-1">
                                                    <DropdownMenuItem className="gap-2 text-xs rounded-lg py-2 cursor-pointer">
                                                        <Edit3 className="w-3.5 h-3.5 opacity-70" />
                                                        Rename
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 text-xs text-destructive focus:text-destructive rounded-lg py-2 cursor-pointer">
                                                        <Trash2 className="w-3.5 h-3.5 opacity-70" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );

    return (
        <div className="flex h-full bg-background relative overflow-hidden">
            {/* Sidebar - Desktop */}
            <motion.div
                initial={false}
                animate={{
                    width: isSidebarOpen ? 300 : 0,
                    opacity: isSidebarOpen ? 1 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(
                    "flex-shrink-0 border-r border-border/40 bg-background hidden md:flex flex-col relative",
                    "overflow-hidden"
                )}
            >
                <div className="p-4 h-full w-[300px]">
                    <SidebarContent />
                </div>
            </motion.div>

            {/* Split View Container */}
            <div className="flex-1 flex min-w-0">

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-muted/20 relative">
                    {/* Header */}
                    <div className="h-14 border-b border-border/40 flex items-center justify-between px-4 lg:px-6 bg-background/80 backdrop-blur-xl z-10 sticky top-0">
                        <div className="flex items-center gap-2">
                            {/* Mobile Sidebar Trigger */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-muted-foreground hover:text-foreground">
                                        <Menu className="w-5 h-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] p-4 pt-10">
                                    <SidebarContent />
                                </SheetContent>
                            </Sheet>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleSidebar()}
                                    className="hidden md:flex -ml-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Menu className="w-5 h-5" />
                                </Button>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <h1 className="text-sm font-semibold">Debelu Assistant</h1>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <ChatContainer
                        className="flex-1"
                        messages={messages.map(m => {
                            // Check for searchProducts tool result (cast to any for v3 API compatibility)
                            const msgAny = m as any;
                            const toolInvocations = msgAny.toolInvocations || msgAny.parts?.filter((p: any) => p.type === 'tool-invocation') || [];
                            const searchTool = toolInvocations.find(
                                (t: any) => t.toolName === 'searchProducts' && ('result' in t || t.result)
                            );

                            // Check for addToCart tool (just to set type if needed, though side-effect handles logic)
                            // const cartTool = m.toolInvocations?.find(t => t.toolName === 'addToCart');

                            // Transform for UI
                            const transformedMessage = {
                                ...m,
                                type: searchTool ? 'products' : 'text',
                                products: searchTool && 'result' in searchTool ? (searchTool.result as any).products : undefined,
                            };

                            return transformedMessage;
                        })}
                        isLoading={isLoading}
                    />

                    {/* Input Area */}
                    <div className="p-4 lg:p-6 pt-2 z-10 bg-gradient-to-t from-background via-background to-transparent">
                        <ChatInput
                            input={chatInput}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                {/* Right Side Panel (Desktop) */}
                <AnimatePresence>
                    {activePanel !== 'none' && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{
                                width: activePanel === 'compare' ? 700 : activePanel === 'cart' || activePanel === 'checkout' ? 450 : 400,
                                opacity: 1
                            }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="hidden lg:block border-l border-border/40 bg-background relative z-20 overflow-hidden"
                        >
                            <div className={cn("h-full",
                                activePanel === 'compare' ? "w-[700px]" :
                                    activePanel === 'cart' || activePanel === 'checkout' ? "w-[450px]" :
                                        "w-[400px]"
                            )}>
                                {activePanel === 'product_detail' && <ProductDetailPanel />}
                                {activePanel === 'compare' && <ProductComparePanel />}
                                {activePanel === 'cart' && <CartPanel />}
                                {activePanel === 'checkout' && <CheckoutPanel />}
                                {activePanel === 'order_detail' && <OrderPanel />}
                                {activePanel === 'tracking' && <DeliveryMap />}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Right Side Panel (Mobile Overlay) */}
                <AnimatePresence>
                    {activePanel !== 'none' && (
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed inset-0 z-50 bg-background flex flex-col"
                        >
                            {activePanel === 'product_detail' && <ProductDetailPanel />}
                            {activePanel === 'compare' && <ProductComparePanel />}
                            {activePanel === 'cart' && <CartPanel />}
                            {activePanel === 'checkout' && <CheckoutPanel />}
                            {activePanel === 'order_detail' && <OrderPanel />}
                            {activePanel === 'tracking' && <DeliveryMap />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
