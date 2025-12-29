"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
    AlertTriangle,
    WifiOff,
    ServerOff,
    RefreshCw,
    Home,
    MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorType = "generic" | "network" | "server" | "notFound" | "forbidden";

interface ErrorStateProps {
    type?: ErrorType;
    title?: string;
    message?: string;
    onRetry?: () => void;
    showHomeButton?: boolean;
    showSupportButton?: boolean;
    className?: string;
    children?: ReactNode;
}

const errorConfig: Record<
    ErrorType,
    { icon: typeof AlertTriangle; title: string; message: string }
> = {
    generic: {
        icon: AlertTriangle,
        title: "Something went wrong",
        message: "We're sorry, an unexpected error occurred. Please try again.",
    },
    network: {
        icon: WifiOff,
        title: "No Internet Connection",
        message:
            "Please check your internet connection and try again. Your data is saved locally.",
    },
    server: {
        icon: ServerOff,
        title: "Server Error",
        message:
            "Our servers are having trouble. We're working on it. Please try again in a few minutes.",
    },
    notFound: {
        icon: AlertTriangle,
        title: "Not Found",
        message: "The page or item you're looking for doesn't exist or was moved.",
    },
    forbidden: {
        icon: AlertTriangle,
        title: "Access Denied",
        message: "You don't have permission to access this page or resource.",
    },
};

export function ErrorState({
    type = "generic",
    title,
    message,
    onRetry,
    showHomeButton = true,
    showSupportButton = false,
    className,
    children,
}: ErrorStateProps) {
    const config = errorConfig[type];
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
                className="w-16 h-16 mb-6 rounded-2xl bg-destructive/10 flex items-center justify-center"
            >
                <Icon className="w-8 h-8 text-destructive" />
            </motion.div>

            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <h2 className="font-display text-xl font-bold mb-2">
                    {title || config.title}
                </h2>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
                    {message || config.message}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {onRetry && (
                        <Button onClick={onRetry}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                    )}

                    {showHomeButton && (
                        <Link href="/">
                            <Button variant={onRetry ? "outline" : "default"}>
                                <Home className="w-4 h-4 mr-2" />
                                Go Home
                            </Button>
                        </Link>
                    )}

                    {showSupportButton && (
                        <Link href="/chat">
                            <Button variant="outline">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Contact Support
                            </Button>
                        </Link>
                    )}
                </div>

                {children}
            </motion.div>
        </div>
    );
}

// Inline error for forms/inputs
interface InlineErrorProps {
    message: string;
    className?: string;
}

export function InlineError({ message, className }: InlineErrorProps) {
    return (
        <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={cn("text-sm text-destructive mt-1", className)}
        >
            {message}
        </motion.p>
    );
}

// Toast-style error
interface ToastErrorProps {
    message: string;
    onDismiss?: () => void;
    className?: string;
}

export function ToastError({ message, onDismiss, className }: ToastErrorProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={cn(
                "fixed bottom-20 left-4 right-4 z-50 p-4 rounded-xl bg-destructive text-destructive-foreground shadow-lg",
                className
            )}
        >
            <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="flex-1 text-sm">{message}</p>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-xs underline hover:no-underline"
                    >
                        Dismiss
                    </button>
                )}
            </div>
        </motion.div>
    );
}
