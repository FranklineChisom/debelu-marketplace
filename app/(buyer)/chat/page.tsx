"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageSquare, History, MoreHorizontal, Menu, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ChatContainer } from "@/components/chat/chat-container";
import { ChatInput } from "@/components/chat/chat-input";
import { ProductDetailPanel } from "@/components/chat/product-detail-panel";
import { ProductComparePanel } from "@/components/chat/product-compare-panel";
import { CartPanel } from "@/components/chat/panels/cart-panel";
import { CheckoutPanel } from "@/components/chat/panels/checkout-panel";
import { OrderPanel } from "@/components/chat/panels/order-panel";
import { DeliveryMap } from "@/components/chat/delivery-map";
import { useChatStore } from "@/stores";

export default function ChatPage() {
    const isSidebarOpen = useChatStore((state) => state.isSidebarOpen);
    const toggleSidebar = useChatStore((state) => state.toggleSidebar);
    const startNewSession = useChatStore((state) => state.startNewSession);
    const activePanel = useChatStore((state) => state.activePanel);
    const history = useChatStore((state) => state.history);

    const handleNewChat = () => {
        startNewSession();
    };

    const SidebarContent = () => (
        <div className="flex flex-col gap-4 h-full">
            {/* New Chat Button */}
            <div className="flex gap-2">
                <Button
                    onClick={handleNewChat}
                    className="flex-1 justify-start gap-2 shadow-sm bg-background hover:bg-muted/50 text-foreground border border-border/50"
                    variant="outline"
                    size="lg"
                >
                    <Plus className="w-5 h-5 text-primary" />
                    <span className="font-medium">New Chat</span>
                </Button>
                <Link href="/profile" passHref>
                    <Button
                        className="w-12 px-0 shadow-sm bg-background hover:bg-muted/50 text-foreground border border-border/50"
                        variant="outline"
                        size="lg"
                    >
                        <User className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </Link>
            </div>

            <Separator className="bg-border/40" />

            {/* History List */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <History className="w-3.5 h-3.5" />
                    Recent
                </div>
                <ScrollArea className="flex-1 -mx-2 px-2">
                    <div className="space-y-1 py-1">
                        {history.map((item) => (
                            <button
                                key={item.id}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors text-left group"
                            >
                                <MessageSquare className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="flex-1 overflow-hidden">
                                    <div className="truncate font-medium text-foreground/90">{item.title}</div>
                                    <div className="truncate text-xs text-muted-foreground opacity-70">{item.preview}</div>
                                </div>
                                <span className="text-[10px] text-muted-foreground/50 whitespace-nowrap ml-1">{item.date}</span>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );

    return (
        <div className="flex h-full bg-background relative overflow-hidden">
            {/* Sidebar - Desktop */}
            <motion.div
                initial={false}
                animate={{
                    width: isSidebarOpen ? 280 : 0,
                    opacity: isSidebarOpen ? 1 : 0
                }}
                className={cn(
                    "flex-shrink-0 border-r border-border/40 bg-muted/20 hidden md:flex flex-col relative",
                    "overflow-hidden whitespace-nowrap"
                )}
            >
                <div className="p-4 h-full">
                    <SidebarContent />
                </div>
            </motion.div>

            {/* Split View Container */}
            <div className="flex-1 flex min-w-0">

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-background/50 relative">
                    {/* Header */}
                    <div className="h-14 border-b border-border/40 flex items-center justify-between px-4 lg:px-6 bg-background/80 backdrop-blur-sm z-10 sticky top-0">
                        <div className="flex items-center gap-2">
                            {/* Mobile Sidebar Trigger */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-muted-foreground hover:text-foreground">
                                        <Menu className="w-5 h-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[280px] p-4 pt-10">
                                    <SidebarContent />
                                </SheetContent>
                            </Sheet>

                            <div className="flex flex-col">
                                <h1 className="text-sm font-semibold flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Debelu Assistant
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => toggleSidebar()} className="hidden md:flex text-muted-foreground hover:text-foreground">
                                <Menu className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages */}
                    <ChatContainer className="flex-1" />

                    {/* Input Area */}
                    <div className="p-4 lg:p-6 pt-2 z-10 bg-gradient-to-t from-background via-background to-transparent">
                        <ChatInput />
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
