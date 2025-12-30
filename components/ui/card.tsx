import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        variant?: "default" | "glass" | "interactive" | "premium" | "gradient" | "frosted";
    }
>(({ className, variant = "default", ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-2xl border bg-card text-card-foreground",
            variant === "default" && "shadow-sm hover:shadow-md transition-shadow duration-300",
            variant === "glass" && "glass-card",
            variant === "interactive" &&
            "shadow-elevation-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevation-3 cursor-pointer hover:border-primary/20",
            variant === "premium" &&
            "card-premium",
            variant === "gradient" &&
            "border-0 bg-gradient-to-br from-card via-card to-accent/10 shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300",
            variant === "frosted" &&
            "card-frosted",
            className
        )}
        {...props}
    />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-5", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "font-display text-xl font-bold leading-none tracking-tight",
            className
        )}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-5 pt-0", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
