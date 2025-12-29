"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    Menu,
    X,
    Bell,
    LogOut,
    ChevronLeft,
    Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navItems = [
    { href: "/vendor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/vendor/products", icon: Package, label: "Products" },
    { href: "/vendor/orders", icon: ShoppingCart, label: "Orders", badge: "3" },
    { href: "/vendor/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/vendor/settings", icon: Settings, label: "Settings" },
];

export default function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-[100dvh] bg-background">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r transition-all duration-300",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    isSidebarCollapsed ? "lg:w-20" : "lg:w-64",
                    "w-64"
                )}
            >
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b">
                    {!isSidebarCollapsed && (
                        <Link
                            href="/vendor/dashboard"
                            className="font-display text-xl font-bold tracking-tight"
                        >
                            Debelu.
                        </Link>
                    )}
                    {isSidebarCollapsed && (
                        <Link
                            href="/vendor/dashboard"
                            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mx-auto"
                        >
                            <Store className="w-5 h-5 text-primary-foreground" />
                        </Link>
                    )}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors"
                    >
                        <ChevronLeft
                            className={cn(
                                "w-4 h-4 transition-transform",
                                isSidebarCollapsed && "rotate-180"
                            )}
                        />
                    </button>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors touch-target",
                                    isActive
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {!isSidebarCollapsed && (
                                    <>
                                        <span className="flex-1 font-medium text-sm">
                                            {item.label}
                                        </span>
                                        {item.badge && (
                                            <Badge variant="secondary" className="text-xs">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="px-3 py-4 border-t">
                    {!isSidebarCollapsed ? (
                        <div className="flex items-center gap-3 px-3 py-2">
                            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-primary-foreground">
                                    T
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">TechHub NG</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    UNILAG Campus
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-sm font-bold text-primary-foreground">
                                    T
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-4 border-b bg-background/80 backdrop-blur-lg sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="font-display text-lg font-bold tracking-tight">
                            {navItems.find((item) => item.href === pathname)?.label ||
                                "Dashboard"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 lg:p-6">{children}</div>
                </main>
            </div>
        </div>
    );
}
