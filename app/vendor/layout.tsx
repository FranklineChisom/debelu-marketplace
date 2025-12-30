"use client";

import { useState } from "react";
import { VendorSidebar } from "@/components/vendor/Sidebar";
import { VendorHeader } from "@/components/vendor/Header";

export default function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-muted/20 overflow-hidden">
            <VendorSidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <VendorHeader setIsOpen={setIsSidebarOpen} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto scrollbar-thin p-4 lg:p-8 bg-muted/10">
                    {children}
                </main>
            </div>
        </div>
    );
}

