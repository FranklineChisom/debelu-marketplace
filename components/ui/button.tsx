import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] touch-target relative overflow-hidden",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/90 hover:-translate-y-0.5",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-md hover:shadow-lg hover:bg-destructive/90 hover:-translate-y-0.5",
                outline:
                    "border-2 border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover:shadow-md",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md",
                ghost:
                    "hover:bg-accent hover:text-accent-foreground",
                link:
                    "text-primary underline-offset-4 hover:underline",
                success:
                    "bg-success text-success-foreground shadow-md hover:shadow-success hover:bg-success/90 hover:-translate-y-0.5",
                warning:
                    "bg-warning text-warning-foreground shadow-md hover:shadow-warning hover:bg-warning/90 hover:-translate-y-0.5",
                // Premium gradient button
                gradient:
                    "bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-1 animate-gradient bg-[length:200%_100%]",
                // Premium luxury button with glow
                luxury:
                    "bg-primary text-primary-foreground rounded-full shadow-xl px-8 hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300",
                // Glass button
                glass:
                    "bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 shadow-lg",
                // Glow button for CTAs
                glow:
                    "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5",
            },
            size: {
                default: "h-12 px-5 py-3",
                sm: "h-10 rounded-lg px-4 text-xs",
                lg: "h-14 rounded-xl px-8 text-base",
                xl: "h-16 rounded-2xl px-10 text-lg font-bold",
                icon: "h-12 w-12",
                "icon-sm": "h-10 w-10 rounded-lg",
                "icon-lg": "h-14 w-14",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, isLoading, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        // Add ripple effect
        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (props.onClick) {
                props.onClick(e);
            }

            const button = e.currentTarget;
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement("span");
            ripple.className = "ripple";
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;

            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        };

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }), "ripple-container")}
                ref={ref}
                disabled={disabled || isLoading}
                onClick={!asChild ? handleClick : undefined}
                {...props}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        <span>Loading...</span>
                    </span>
                ) : (
                    children
                )}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
