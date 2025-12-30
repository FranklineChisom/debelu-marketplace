"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, MessageSquare, History, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChatContainer } from "@/components/chat/chat-container";
import { ChatInput } from "@/components/chat/chat-input";
import { useChatStore } from "@/stores";

export default function ChatPage() {
    const [isSidebarOpen] = useState(true);
    const startNewSession = useChatStore((state) => state.startNewSession);


    // Mock history for now since store doesn't persist multiple sessions yet
    const history = [
        { id: "1", title: "Product Inquiry: Nike Air Max", date: "Today" },
        { id: "2", title: "Shipping to Lagos", date: "Yesterday" },
        { id: "3", title: "Bulk Order Questions", date: "Last Week" },
    ];

    const handleNewChat = () => {
        startNewSession();
    };

    return (
        <div className="flex h-full bg-background relative overflow-hidden">
            {/* Sidebar - Desktop & Tablet */}
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
                <div className="p-4 flex flex-col gap-4 h-full">
                    {/* New Chat Button */}
                    <Button
                        onClick={handleNewChat}
                        className="w-full justify-start gap-2 shadow-sm bg-background hover:bg-muted/50 text-foreground border border-border/50"
                        variant="outline"
                        size="lg"
                    >
                        <Plus className="w-5 h-5 text-primary" />
                        <span className="font-medium">New Chat</span>
                    </Button>

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
                                        <span className="truncate flex-1">{item.title}</span>
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* User Profile / Settings stub could go here */}
                </div>
            </motion.div>

            {/* Toggle Sidebar Button (Desktop) */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20 hidden md:block">
                {/* This could be a floating toggle, but for clean UI, let's put it in the header or just handle contextually */}
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-background/50 relative">
                {/* Header */}
                <div className="h-14 border-b border-border/40 flex items-center justify-between px-4 lg:px-6 bg-background/80 backdrop-blur-sm z-10 sticky top-0">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden -ml-2 text-muted-foreground"
                            onClick={() => {/* Drawer logic for mobile history would go here */ }}
                        >
                            <History className="w-5 h-5" />
                        </Button>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Debelu Assistant
                            </h1>
                        </div>
                    </div>

                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-5 h-5" />
                    </Button>
                </div>

                {/* Messages */}
                <ChatContainer className="flex-1" />

                {/* Input Area */}
                <div className="p-4 lg:p-6 pt-2 z-10 bg-gradient-to-t from-background via-background to-transparent">
                    <ChatInput />
                </div>
            </div>
        </div>
    );
}
