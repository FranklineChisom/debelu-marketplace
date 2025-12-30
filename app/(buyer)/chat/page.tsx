"use client";

import { useState } from "react";
import { ChatContainer, ChatInput, ProductIntelligencePanel } from "@/components/chat";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Info, PanelRightOpen, Sparkles } from "lucide-react";

export default function ChatPage() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    return (
        // Main Container - Full Height minus header/nav adjustments
        <div className="flex flex-1 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] overflow-hidden">

            {/* Left Panel - Chat Interface (60% on Desktop, 100% on Mobile) */}
            <div className="flex-1 flex flex-col relative border-r border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-300 ease-in-out lg:w-[60%] lg:flex-none w-full">

                {/* Mobile Header Overlay for Actions */}
                <div className="lg:hidden absolute top-4 right-4 z-50">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button size="sm" variant="outline" className="h-9 gap-2 rounded-full shadow-lg bg-background/80 backdrop-blur-md border-emerald-500/20 text-xs font-semibold">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                                View Context
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-[2rem] border-t-0">
                            <ProductIntelligencePanel />
                        </SheetContent>
                    </Sheet>
                </div>

                <ChatContainer className="flex-1" />
                <ChatInput />
            </div>

            {/* Right Panel - Product Intelligence (40% on Desktop, Hidden on Mobile) */}
            <div className="hidden lg:block w-[40%] h-full relative z-10 shadow-[-10px_0_40px_-15px_rgba(0,0,0,0.1)]">
                <ProductIntelligencePanel />
            </div>

        </div>
    );
}
