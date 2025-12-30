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
    Search,
    User,
    HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const navItems = [
    { href: "/vendor/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/vendor/products", icon: Package, label: "Products" },
    { href: "/vendor/orders", icon: ShoppingCart, label: "Orders", badge: "3" },
    { href: "/vendor/analytics", icon: BarChart3, label: "Analytics" },
];

const bottomNavItems = [
    { href: "/vendor/settings", icon: Settings, label: "Settings" },
    { href: "/vendor/help", icon: HelpCircle, label: "Help & Support" },
]

export default function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-muted/20 overflow-hidden">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarCollapsed ? 80 : 280 }}
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl border-r shadow-2xl lg:shadow-none transition-all duration-300",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    "w-[280px]" // Default width for mobile
                )}
            >
                {/* Sidebar Header */}
                <div className="h-16 flex items-center px-4 lg:px-6 border-b border-border/50">
                    <div className="flex items-center gap-3 w-full">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/20">
                            <Store className="w-5 h-5 text-white" />
                        </div>

                        <div className={cn("flex-1 overflow-hidden transition-all duration-300", isSidebarCollapsed && "w-0 opacity-0 lg:hidden")}>
                            <h1 className="font-display font-bold text-lg tracking-tight leading-none">Debelu.</h1>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Seller Hub</p>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden ml-auto rounded-full hover:bg-muted"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Nav Items */}
                <div className="flex-1 flex flex-col gap-6 p-4 overflow-y-auto scrollbar-thin">
                    <nav className="space-y-1">
                        {!isSidebarCollapsed && (
                            <p className="px-4 text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">Main Menu</p>
                        )}
                        {navItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={cn(
                                        "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 outline-none",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 font-semibold"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground hover:pl-4"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-primary-foreground" : "group-hover:text-foreground")} />

                                    {!isSidebarCollapsed && (
                                        <div className="flex-1 flex items-center justify-between overflow-hidden">
                                            <span className="truncate">{item.label}</span>
                                            {item.badge && (
                                                <Badge variant="secondary" className="h-5 px-1.5 min-w-[1.25rem] text-[10px] bg-background/20 text-current backdrop-blur-sm border-0">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <nav className="mt-auto space-y-1">
                        {!isSidebarCollapsed && (
                            <p className="px-4 text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">System</p>
                        )}
                        {bottomNavItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={cn(
                                        "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 outline-none",
                                        isActive
                                            ? "bg-muted text-foreground font-semibold"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    {!isSidebarCollapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                        <button
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-muted-foreground hover:bg-red-500/10 hover:text-red-600 text-left"
                            )}
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            {!isSidebarCollapsed && <span>Sign Out</span>}
                        </button>
                    </nav>
                </div>

                {/* Sidebar Footer / User Profile */}
                <div className="p-4 border-t border-border/50">
                    <div className={cn("flex items-center gap-3", isSidebarCollapsed ? "justify-center" : "")}>
                        <Avatar className="w-10 h-10 border-2 border-background shadow-sm cursor-pointer hover:scale-105 transition-transform">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>TH</AvatarFallback>
                        </Avatar>

                        {!isSidebarCollapsed && (
                            <div className="flex-1 overflow-hidden">
                                <p className="font-bold text-sm truncate">TechHub NG</p>
                                <p className="text-xs text-muted-foreground truncate">connector@debelu.ng</p>
                            </div>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden lg:flex w-8 h-8 rounded-lg ml-auto text-muted-foreground hover:text-foreground"
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        >
                            <ChevronLeft className={cn("w-4 h-4 transition-transform", isSidebarCollapsed && "rotate-180")} />
                        </Button>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top Navbar */}
                <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b bg-background/50 backdrop-blur-xl sticky top-0 z-30">
                    <div className="flex items-center gap-4 lg:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(true)}
                            className="rounded-xl hover:bg-muted"
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                        <span className="font-bold text-lg">
                            {navItems.find((item) => pathname.startsWith(item.href))?.label || "Dashboard"}
                        </span>
                    </div>

                    {/* Desktop Breadcrumbs / Title */}
                    <div className="hidden lg:flex items-center gap-2">
                        <h2 className="font-bold text-lg tracking-tight">
                            {navItems.find((item) => pathname.startsWith(item.href))?.label || "Seller Dashboard"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4">
                        {/* Search Bar */}
                        <div className="hidden md:flex items-center relative w-64 bg-muted/50 rounded-full px-3 py-1.5 focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-transparent focus-within:border-primary/50">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <input
                                className="bg-transparent border-none outline-none text-sm ml-2 w-full placeholder:text-muted-foreground/70"
                                placeholder="Search inventory..."
                            />
                        </div>

                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full ring-2 ring-background" />
                        </Button>

                        <Avatar className="w-8 h-8 lg:hidden">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>TH</AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto scrollbar-thin p-4 lg:p-8 bg-muted/10">
                    {children}
                </main>
            </div>
        </div>
    );
}
