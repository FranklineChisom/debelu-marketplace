"use client";

import { ChatContainer, ChatInput } from "@/components/chat";

export default function ChatPage() {
    return (
        <>
            <ChatContainer className="flex-1" />
            <ChatInput />
        </>
    );
}
