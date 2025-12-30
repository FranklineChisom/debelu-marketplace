"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu,
    Search,
    Bell,
    User,
    Settings,
    HelpCircle,
    LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { vendorNavItems } from "./navigation";

interface VendorHeaderProps {
    setIsOpen: (isOpen: boolean) => void;
}

export function VendorHeader({ setIsOpen }: VendorHeaderProps) {
    const pathname = usePathname();
    const currentNavItem = vendorNavItems.find((item) => pathname.startsWith(item.href));
    const pageTitle = currentNavItem?.label || "Dashboard";

    return (
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b bg-background/50 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-4 lg:hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(true)}
                    className="rounded-xl hover:bg-muted"
                >
                    <Menu className="w-5 h-5" />
                </Button>
                <span className="font-bold text-lg">
                    {pageTitle}
                </span>
            </div>

            {/* Desktop Breadcrumbs / Title */}
            <div className="hidden lg:flex items-center gap-2">
                <h2 className="font-bold text-lg tracking-tight">
                    {pageTitle === "Dashboard" ? "Seller Dashboard" : pageTitle}
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

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent rounded-full lg:hidden">
                            <Avatar className="w-8 h-8">
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
        </header>
    );
}
