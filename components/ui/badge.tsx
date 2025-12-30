import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                outline:
                    "border-2 text-foreground hover:bg-accent hover:text-accent-foreground",
                success:
                    "border-transparent bg-success text-success-foreground shadow-sm hover:bg-success/90",
                warning:
                    "border-transparent bg-warning text-warning-foreground shadow-sm hover:bg-warning/90",
                info:
                    "border-transparent bg-info text-info-foreground shadow-sm hover:bg-info/90",
                // Premium variants
                gradient:
                    "border-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md",
                "gradient-gold":
                    "border-0 badge-gold shadow-md",
                pulse:
                    "border-transparent bg-primary text-primary-foreground animate-pulse",
                glow:
                    "border-transparent bg-primary text-primary-foreground shadow-md animate-glow-pulse",
                glass:
                    "border-white/20 bg-white/10 backdrop-blur-md text-foreground",
                // Status badges with dots
                "status-success":
                    "border-transparent bg-success/15 text-success pl-2",
                "status-warning":
                    "border-transparent bg-warning/15 text-warning pl-2",
                "status-destructive":
                    "border-transparent bg-destructive/15 text-destructive pl-2",
                "status-info":
                    "border-transparent bg-info/15 text-info pl-2",
            },
            size: {
                default: "px-2.5 py-0.5 text-xs",
                sm: "px-2 py-0 text-[10px]",
                lg: "px-3 py-1 text-sm",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
    const isStatus = variant?.toString().startsWith("status-");

    return (
        <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
            {(dot || isStatus) && (
                <span
                    className={cn(
                        "w-1.5 h-1.5 rounded-full mr-1.5",
                        variant === "status-success" && "bg-success",
                        variant === "status-warning" && "bg-warning",
                        variant === "status-destructive" && "bg-destructive",
                        variant === "status-info" && "bg-info",
                        !isStatus && "bg-current",
                    )}
                />
            )}
            {children}
        </div>
    );
}

export { Badge, badgeVariants };
