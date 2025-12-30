"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    MoreHorizontal,
    Phone,
    Video,
    Info,
    Send,
    Paperclip,
    Mic,
    CheckCheck,
    ArrowLeft,
    Plus,
    MessageSquare
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock Conversations
const CONVERSATIONS = [
    {
        id: "1",
        customer: "Chisom Doe",
        avatar: "https://i.pravatar.cc/150?u=1",
        lastMessage: "Is this still available?",
        time: "10:30 AM",
        unread: 2,
        online: true,
        product: {
            name: "MacBook Pro M1",
            price: "₦450,000",
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=100&q=80"
        }
    },
    {
        id: "2",
        customer: "Frank Smith",
        avatar: "https://i.pravatar.cc/150?u=2",
        lastMessage: "Can we meet at the SU building?",
        time: "Yesterday",
        unread: 0,
        online: false,
        product: {
            name: "iPhone 13",
            price: "₦380,000",
            image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=100&q=80"
        }
    },
    {
        id: "3",
        customer: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/150?u=3",
        lastMessage: "Thanks for the delivery!",
        time: "Yesterday",
        unread: 0,
        online: true,
        product: null
    }
];

// Mock Messages
const MESSAGES = [
    { id: 1, sender: "customer", text: "Hi, I'm interested in the MacBook Pro.", time: "10:15 AM" },
    { id: 2, sender: "me", text: "Hello! Yes, it is still available.", time: "10:18 AM" },
    { id: 3, sender: "customer", text: "What represents the condition? pictures aren't very clear.", time: "10:20 AM" },
    { id: 4, sender: "me", text: "It's barely used. Only 10 cycles on the battery. I can send more photos.", time: "10:22 AM" },
    { id: 5, sender: "customer", text: "Please do, thanks.", time: "10:25 AM" },
    { id: 6, sender: "customer", text: "Is the price negotiable?", time: "10:30 AM" },
];

export default function VendorChatPage() {
    const [selectedChat, setSelectedChat] = useState<typeof CONVERSATIONS[0] | null>(CONVERSATIONS[0]);
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState(MESSAGES);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            sender: "me",
            text: messageInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setMessageInput("");
    };

    return (
        <div className="flex bg-background h-[calc(100vh-80px)] overflow-hidden rounded-xl border border-border/50 shadow-sm m-4 lg:m-6">
            {/* Conversations List */}
            <div className={cn(
                "w-full md:w-80 lg:w-96 border-r flex flex-col bg-muted/10",
                selectedChat ? "hidden md:flex" : "flex"
            )}>
                <div className="p-4 border-b space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold font-display">Messages</h1>
                        <Badge variant="secondary">{CONVERSATIONS.filter(c => c.unread > 0).length} New</Badge>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search messages..." className="pl-9 bg-background" />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="flex flex-col">
                        {CONVERSATIONS.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={cn(
                                    "flex items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50 border-b border-border/40",
                                    selectedChat?.id === chat.id && "bg-muted/50"
                                )}
                            >
                                <div className="relative">
                                    <Avatar>
                                        <AvatarImage src={chat.avatar} />
                                        <AvatarFallback>{chat.customer.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    {chat.online && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className={cn("font-medium truncate", chat.unread > 0 && "font-bold text-foreground")}>
                                            {chat.customer}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground shrink-0">{chat.time}</span>
                                    </div>
                                    <p className={cn("text-xs truncate", chat.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>
                                        {chat.lastMessage}
                                    </p>
                                    {chat.product && (
                                        <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground bg-background rounded-full py-1 px-2 w-fit border border-border/50">
                                            <div className="w-3 h-3 rounded-full bg-primary/10" />
                                            Concerning: {chat.product.name}
                                        </div>
                                    )}
                                </div>
                                {chat.unread > 0 && (
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                                )}
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col bg-background h-full",
                !selectedChat ? "hidden md:flex" : "flex"
            )}>
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 border-b flex items-center justify-between px-4 lg:px-6 bg-background/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="md:hidden -ml-2" onClick={() => setSelectedChat(null)}>
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={selectedChat.avatar} />
                                    <AvatarFallback>{selectedChat.customer.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-sm">{selectedChat.customer}</h3>
                                    <p className="text-xs text-muted-foreground">
                                        {selectedChat.online ? "Online" : "Offline"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Video className="w-4 h-4 text-muted-foreground" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Info className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>

                        {/* Product Context Banner (Optional) */}
                        {selectedChat.product && (
                            <div className="bg-muted/20 px-4 py-2 flex items-center justify-between border-b">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-muted overflow-hidden relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={selectedChat.product.image} alt="" className="object-cover w-full h-full" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium">{selectedChat.product.name}</p>
                                        <p className="text-[10px] text-muted-foreground">{selectedChat.product.price}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="h-7 text-xs">View Order</Button>
                            </div>
                        )}

                        {/* Messages List */}
                        <ScrollArea className="flex-1 p-4 lg:p-6 bg-muted/5">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex gap-3 max-w-[80%]",
                                            msg.sender === "me" ? "ml-auto flex-row-reverse" : ""
                                        )}
                                    >
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarImage src={msg.sender === "me" ? "https://github.com/shadcn.png" : selectedChat.avatar} />
                                            <AvatarFallback>ME</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className={cn(
                                                "p-3 rounded-2xl text-sm",
                                                msg.sender === "me"
                                                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                                                    : "bg-white border border-border/50 shadow-sm rounded-tl-sm"
                                            )}>
                                                {msg.text}
                                            </div>
                                            <div className={cn(
                                                "flex items-center gap-1 mt-1 text-[10px] text-muted-foreground",
                                                msg.sender === "me" && "justify-end"
                                            )}>
                                                {msg.time}
                                                {msg.sender === "me" && <CheckCheck className="w-3 h-3 text-primary" />}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Input */}
                        <div className="p-4 bg-background border-t">
                            <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                                <Button variant="outline" size="icon" type="button" className="shrink-0 rounded-full">
                                    <Plus className="w-5 h-5 text-muted-foreground" />
                                </Button>
                                <div className="flex-1 bg-muted/30 rounded-2xl border border-input focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all flex items-center px-3 py-2">
                                    <Input
                                        placeholder="Type a message..."
                                        className="border-0 bg-transparent p-0 focus-visible:ring-0 placeholder:text-muted-foreground min-h-[24px] max-h-32 resize-none"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                    />
                                    <div className="flex items-center gap-1 ml-2">
                                        <button type="button" className="p-1.5 hover:bg-muted rounded-full text-muted-foreground transition-colors">
                                            <Paperclip className="w-4 h-4" />
                                        </button>
                                        <button type="button" className="p-1.5 hover:bg-muted rounded-full text-muted-foreground transition-colors">
                                            <Mic className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <Button type="submit" size="icon" className="shrink-0 rounded-full" disabled={!messageInput.trim()}>
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">Your Messages</h3>
                        <p className="max-w-xs">Select a conversation from the list to start chatting with your customers.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
