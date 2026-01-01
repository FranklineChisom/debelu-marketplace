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
import { ProductIntelligencePanel } from "@/components/chat/product-intelligence-panel";
import { ProductComparePanel } from "@/components/chat/product-compare-panel";
import { CartPanel } from "@/components/chat/panels/cart-panel";
import { CheckoutPanel } from "@/components/chat/panels/checkout-panel";
import { OrderPanel } from "@/components/chat/panels/order-panel";
import { DeliveryMap } from "@/components/chat/delivery-map";
import { useChatStore, useCartStore } from "@/stores";
import { useMarketplaceStore } from "@/stores/useMarketplaceStore";
import { ChatInterface } from "@/components/chat/chat-interface";
import { useChat } from '@ai-sdk/react';

// ... other imports

// ... imports

export default function ChatPage() {
    const sessions = useChatStore((state) => state.sessions);
    const currentSessionId = useChatStore((state) => state.currentSessionId);
    const setCurrentSession = useChatStore((state) => state.setCurrentSession);

    // Local UI state
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleNewChat = () => {
        const newId = crypto.randomUUID();
        setCurrentSession(newId);
    };

    // Ensure we always have a session ID
    useEffect(() => {
        if (!currentSessionId) {
            handleNewChat();
        }
    }, [currentSessionId]);

    // Derived active session
    const activeSession = sessions.find(s => s.id === currentSessionId);

    // Sanitize messages for useChat (Strict whitelist to prevent hook crashes)
    const initialMessages = (activeSession?.messages || []).map(m => ({
        id: m.id || crypto.randomUUID(),
        role: (m.role === 'user' || m.role === 'assistant' || m.role === 'system' ? m.role : 'user') as any,
        content: m.content || '',
        createdAt: m.timestamp ? new Date(m.timestamp) : new Date(),
        // Only include toolInvocations if valid Array
        toolInvocations: Array.isArray((m as any).toolInvocations) ? (m as any).toolInvocations : undefined
    }));

    // --- HISTORY LOGIC ---
    const historyItems = sessions.map(s => ({
        id: s.id,
        title: s.title || "New Chat",
        date: s.updatedAt ? new Date(s.updatedAt).toLocaleDateString() : "Just now",
        preview: (s.messages[s.messages.length - 1]?.content || "").substring(0, 40) || "No messages",
        originalDate: s.updatedAt || new Date()
    })).sort((a, b) => new Date(b.originalDate).getTime() - new Date(a.originalDate).getTime());

    const groupedHistory = historyItems.reduce((groups, item) => {
        const group = groups.find(g => g.date === item.date);
        if (group) {
            group.items.push(item);
        } else {
            groups.push({ date: item.date, items: [item] });
        }
        return groups;
    }, [] as { date: string; items: typeof historyItems }[]);

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
            <Button onClick={handleNewChat} className="w-full mb-4">
                <Plus className="w-4 h-4 mr-2" /> New Chat
            </Button>
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 pl-9 pr-9 rounded-xl bg-muted/50 border-0 text-sm placeholder:text-muted-foreground/60"
                />
            </div>

            <ScrollArea className="flex-1">
                {filteredGroups.map(group => (
                    <div key={group.date}>
                        <h4 className="px-2 py-1 text-xs font-semibold text-muted-foreground">{group.date}</h4>
                        {group.items.map(item => (
                            <div
                                key={item.id}
                                onClick={() => setCurrentSession(item.id)}
                                className={cn(
                                    "p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors",
                                    currentSessionId === item.id && "bg-muted font-medium"
                                )}
                            >
                                <div className="text-sm truncate">{item.title}</div>
                                <div className="text-xs text-muted-foreground truncate">{item.preview}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </ScrollArea>
        </div>
    );

    return (
        <div className="flex h-full bg-background relative overflow-hidden">
            <motion.div
                initial={false}
                animate={{ width: isSidebarOpen ? 300 : 0, opacity: isSidebarOpen ? 1 : 0 }}
                className="hidden md:flex flex-col border-r bg-background overflow-hidden"
            >
                <div className="w-[300px] h-full p-4">
                    <SidebarContent />
                </div>
            </motion.div>

            <div className="flex-1 flex flex-col min-w-0">
                <div className="h-14 border-b flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
                            <Menu className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hidden md:flex" onClick={toggleSidebar}>
                            <Menu className="w-5 h-5" />
                        </Button>
                        <span className="font-semibold">Debelu Assistant</span>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative flex flex-col">
                    {/* 
                      KEY ARCHITECTURAL DECISION:
                      We use the Session ID as a 'key'. This forces React to complete destroy and recreate 
                      the ChatInterface when switching sessions. This ensures:
                      1. No state bleeding between chats
                      2. useChat hook is always initialized with the correct 'initialMessages'
                      3. Zero race conditions
                    */}
                    {currentSessionId && (
                        <ChatInterface
                            key={currentSessionId}
                            sessionId={currentSessionId}
                            initialMessages={initialMessages as any} // Cast if types slightly mismatch (Message vs CoreMessage)
                        />
                    )}
                </div>
            </div>

            {/* Mobile Sidebar */}
            <Sheet open={isSidebarOpen && typeof window !== 'undefined' && window.innerWidth < 768} onOpenChange={setIsSidebarOpen}>
                <SheetContent side="left" className="p-0 w-[300px]">
                    <div className="h-full p-4">
                        <SidebarContent />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
