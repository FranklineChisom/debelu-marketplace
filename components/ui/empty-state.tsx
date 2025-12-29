"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
    ShoppingBag,
    Heart,
    Package,
    Search,
    MessageSquare,
    Store,
    Plus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyType = "cart" | "wishlist" | "orders" | "search" | "products" | "messages";

interface EmptyStateProps {
    type?: EmptyType;
    title?: string;
    message?: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
    className?: string;
    children?: ReactNode;
}

const emptyConfig: Record<
    EmptyType,
    { icon: typeof ShoppingBag; title: string; message: string; action: string; href: string }
> = {
    cart: {
        icon: ShoppingBag,
        title: "Your cart is empty",
        message: "Start shopping to add items to your cart",
        action: "Start Shopping",
        href: "/chat",
    },
    wishlist: {
        icon: Heart,
        title: "No saved items",
        message: "Save items you love and get notified when prices drop",
        action: "Explore Products",
        href: "/explore",
    },
    orders: {
        icon: Package,
        title: "No orders yet",
        message: "When you make a purchase, your orders will appear here",
        action: "Start Shopping",
        href: "/chat",
    },
    search: {
        icon: Search,
        title: "No results found",
        message: "Try a different search term or browse categories",
        action: "Browse Categories",
        href: "/explore",
    },
    products: {
        icon: Store,
        title: "No products yet",
        message: "Add your first product to start selling",
        action: "Add Product",
        href: "/vendor/products/new",
    },
    messages: {
        icon: MessageSquare,
        title: "No messages",
        message: "Start a conversation to get product recommendations",
        action: "Start Chat",
        href: "/chat",
    },
};

export function EmptyState({
    type = "cart",
    title,
    message,
    actionLabel,
    actionHref,
    onAction,
    className,
    children,
}: EmptyStateProps) {
    const config = emptyConfig[type];
    const Icon = config.icon;

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center text-center p-8",
                className
            )}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 mb-6 rounded-2xl bg-muted flex items-center justify-center"
            >
                <Icon className="w-8 h-8 text-muted-foreground" />
            </motion.div>

            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <h2 className="font-display text-lg font-bold mb-2">
                    {title || config.title}
                </h2>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
                    {message || config.message}
                </p>

                {(actionHref || onAction) && (
                    onAction ? (
                        <Button onClick={onAction}>
                            {actionLabel || config.action}
                        </Button>
                    ) : (
                        <Link href={actionHref || config.href}>
                            <Button>{actionLabel || config.action}</Button>
                        </Link>
                    )
                )}

                {children}
            </motion.div>
        </div>
    );
}
