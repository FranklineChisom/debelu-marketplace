import { Message, ChatSession } from "@/types/chat";

export interface ChatInterfaceProps {
    sessionId: string;
    initialMessages: Message[];
    onSessionChange: (id: string, messages: Message[]) => void;
}

