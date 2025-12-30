import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: "default" | "premium" | "ghost";
    error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, variant = "default", error, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    // Base styles
                    "flex w-full rounded-xl text-base transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    // Default variant
                    variant === "default" && [
                        "h-12 px-4 py-3",
                        "bg-background border-2 border-input",
                        "hover:border-primary/40",
                        "focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10",
                        "shadow-sm hover:shadow-md focus:shadow-md",
                    ],
                    // Premium variant with enhanced focus
                    variant === "premium" && [
                        "h-14 px-5 py-4",
                        "bg-card border-2 border-border",
                        "hover:border-primary/50 hover:bg-accent/30",
                        "focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15",
                        "shadow-elevation-1 hover:shadow-elevation-2 focus:shadow-elevation-2",
                        "placeholder:text-muted-foreground/70",
                    ],
                    // Ghost variant (minimal)
                    variant === "ghost" && [
                        "h-12 px-4 py-3",
                        "bg-transparent border-0 border-b-2 border-input rounded-none",
                        "hover:border-primary/50",
                        "focus:outline-none focus:border-primary",
                    ],
                    // Error state
                    error && [
                        "border-destructive",
                        "focus:border-destructive focus:ring-destructive/20",
                        "hover:border-destructive/70",
                    ],
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

// Enhanced Textarea with same styling
export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    variant?: "default" | "premium";
    error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, variant = "default", error, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    // Base styles
                    "flex w-full rounded-xl text-base transition-all duration-200 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none",
                    // Default variant
                    variant === "default" && [
                        "min-h-[120px] px-4 py-3",
                        "bg-background border-2 border-input",
                        "hover:border-primary/40",
                        "focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10",
                        "shadow-sm hover:shadow-md focus:shadow-md",
                    ],
                    // Premium variant
                    variant === "premium" && [
                        "min-h-[140px] px-5 py-4",
                        "bg-card border-2 border-border",
                        "hover:border-primary/50 hover:bg-accent/30",
                        "focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15",
                        "shadow-elevation-1 hover:shadow-elevation-2 focus:shadow-elevation-2",
                    ],
                    // Error state
                    error && [
                        "border-destructive",
                        "focus:border-destructive focus:ring-destructive/20",
                    ],
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Textarea.displayName = "Textarea";

export { Input, Textarea };
