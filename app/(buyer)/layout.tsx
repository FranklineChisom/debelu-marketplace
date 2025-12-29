"use client";

import Link from "next/link";
import { ShoppingCart, User, Home, MessageSquare, Package } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useCartStore, useUIStore } from "@/stores";
import { usePathname } from "next/navigation";
import { CAMPUSES } from "@/lib/constants";

export default function BuyerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const cartItemCount = useCartStore((state) => state.getItemCount());
    const selectedCampus = useUIStore((state) => state.selectedCampus);

    const campus = CAMPUSES.find((c) => c.id === selectedCampus);

    const navItems = [
        { href: "/chat", icon: MessageSquare, label: "Shop" },
        { href: "/orders", icon: Package, label: "Orders" },
        { href: "/profile", icon: User, label: "Profile" },
    ];

    return (
        <div className="flex flex-col h-[100dvh] bg-background">
            {/* Header */}
            <header className="flex-shrink-0 border-b bg-background/80 backdrop-blur-lg safe-top">
                <div className="h-14 px-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/chat"
                        className="font-display text-lg font-bold tracking-tight"
                    >
                        Debelu.
                    </Link>

                    {/* Campus Badge */}
                    {campus && (
                        <Badge variant="secondary" className="text-xs">
                            {campus.shortName}
                        </Badge>
                    )}

                    {/* Cart */}
                    <button className="relative p-2 -mr-2">
                        <ShoppingCart className="w-5 h-5" />
                        {cartItemCount > 0 && (
                            <motion.span
                                key={cartItemCount}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center"
                            >
                                {cartItemCount > 99 ? "99+" : cartItemCount}
                            </motion.span>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="flex-shrink-0 border-t bg-background safe-bottom">
                <div className="h-16 flex items-center justify-around px-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-colors touch-target",
                                    isActive
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
