"use client";

import Link from "next/link";
import { ShoppingCart, User, MessageSquare, Package, Compass, Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useCartStore, useUIStore } from "@/stores";
import { usePathname } from "next/navigation";
import { CAMPUSES } from "@/lib/constants";
import { useState, useEffect } from "react";

export default function BuyerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const cartItemCount = useCartStore((state) => state.getItemCount());
    const selectedCampus = useUIStore((state) => state.selectedCampus);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const campus = CAMPUSES.find((c) => c.id === selectedCampus);


    const navItems = [
        { href: "/chat", icon: MessageSquare, label: "Chat" },
        { href: "/explore", icon: Compass, label: "Explore" },
        { href: "/orders", icon: Package, label: "Orders" },
        { href: "/profile", icon: User, label: "Profile" },
    ];

    return (
        <div className="flex flex-col h-[100dvh] bg-background text-foreground">
            {/* Header - Minimal & Bold */}
            <header className="flex-shrink-0 border-b border-foreground/10 safe-top">
                <div className="h-16 lg:h-20 px-4 lg:px-8 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/chat" className="font-black text-lg lg:text-xl tracking-tighter">
                        DEBELU
                    </Link>

                    {/* Campus & Actions */}
                    <div className="flex items-center gap-2 lg:gap-4">
                        {/* Campus Badge - Desktop */}
                        {campus && (
                            <span className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs uppercase tracking-wider text-muted-foreground border border-foreground/10 rounded-full">
                                📍 {campus.shortName}
                            </span>
                        )}

                        {/* Search */}
                        <Link
                            href="/search"
                            className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </Link>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="relative w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <AnimatePresence>
                                {mounted && cartItemCount > 0 && (
                                    <motion.span
                                        key={cartItemCount}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-emerald-400 text-black text-[10px] font-black rounded-full flex items-center justify-center"
                                    >
                                        {cartItemCount > 9 ? "9+" : cartItemCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                        </Link>
                    </div>
                </div>
            </header>

            {/* Desktop Sidebar + Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Desktop Sidebar Navigation */}
                <aside className="hidden lg:flex flex-col w-20 border-r border-foreground/10 py-6">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 py-4 relative group",
                                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {/* Active Indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebarActive"
                                        className="absolute left-0 w-1 h-8 bg-emerald-400 rounded-r-full"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <item.icon className="w-5 h-5" />
                                <span className="text-[10px] font-medium uppercase tracking-wider">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden flex-shrink-0 border-t border-foreground/10 safe-bottom bg-background">
                <div className="h-16 flex items-center justify-around px-2 relative">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-2xl transition-all",
                                    isActive ? "text-foreground" : "text-muted-foreground"
                                )}
                            >
                                {/* Active Dot */}
                                {isActive && (
                                    <motion.div
                                        layoutId="mobileNavActive"
                                        className="absolute -top-1 w-1 h-1 bg-emerald-400 rounded-full"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <item.icon className={cn("w-5 h-5", isActive && "scale-110")} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
