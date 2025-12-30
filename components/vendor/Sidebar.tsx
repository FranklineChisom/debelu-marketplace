"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Store,
    X,
    LogOut,
    User,
    Settings,
    HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { vendorNavItems, vendorBottomNavItems } from "./navigation";

interface VendorSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

export function VendorSidebar({
    isOpen,
    setIsOpen,
    isCollapsed,
    setIsCollapsed
}: VendorSidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 280 }}
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl border-r shadow-2xl lg:shadow-none transition-all duration-300",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    "w-[280px]" // Default width for mobile
                )}
            >
                {/* Sidebar Header */}
                <div className="h-16 flex items-center px-4 lg:px-6 border-b border-border/50">
                    <div className="flex items-center gap-3 w-full">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/20">
                            <Store className="w-5 h-5 text-white" />
                        </div>

                        <div className={cn("flex-1 overflow-hidden transition-all duration-300", isCollapsed && "w-0 opacity-0 lg:hidden")}>
                            <h1 className="font-display font-bold text-lg tracking-tight leading-none">Debelu.</h1>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Seller Hub</p>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden ml-auto rounded-full hover:bg-muted"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Nav Items */}
                <div className="flex-1 flex flex-col gap-6 p-4 overflow-y-auto scrollbar-thin">
                    <nav className="space-y-1">
                        {!isCollapsed && (
                            <p className="px-4 text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">Main Menu</p>
                        )}
                        {vendorNavItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 outline-none",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 font-semibold"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground hover:pl-4"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-primary-foreground" : "group-hover:text-foreground")} />

                                    {!isCollapsed && (
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
                        {!isCollapsed && (
                            <p className="px-4 text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">System</p>
                        )}
                        {vendorBottomNavItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 outline-none",
                                        isActive
                                            ? "bg-muted text-foreground font-semibold"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    {!isCollapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                        <button
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-muted-foreground hover:bg-red-500/10 hover:text-red-600 text-left"
                            )}
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span>Sign Out</span>}
                        </button>
                    </nav>
                </div>

                {/* Sidebar Footer / User Profile */}
                <div className="p-4 border-t border-border/50">
                    <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "")}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="p-0 h-auto hover:bg-transparent outline-none">
                                    <Avatar className="w-10 h-10 border-2 border-background shadow-sm cursor-pointer hover:scale-105 transition-transform">
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>TH</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">TechHub NG</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            connector@debelu.ng
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/vendor/settings/store">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Store Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/vendor/settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/vendor/help">
                                        <HelpCircle className="mr-2 h-4 w-4" />
                                        <span>Help & Support</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}
