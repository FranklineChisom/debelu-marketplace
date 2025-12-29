"use client";

import { ReactNode, useState, useRef } from "react";
import {
    motion,
    useMotionValue,
    useTransform,
    animate,
    PanInfo,
} from "framer-motion";
import { Trash2, Heart, MoreHorizontal } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

interface SwipeAction {
    icon: typeof Trash2;
    label: string;
    color: string;
    onClick: () => void;
}

interface SwipeableRowProps {
    children: ReactNode;
    leftActions?: SwipeAction[];
    rightActions?: SwipeAction[];
    className?: string;
    threshold?: number;
    onSwipeComplete?: (direction: "left" | "right") => void;
}

export function SwipeableRow({
    children,
    leftActions = [],
    rightActions = [],
    className,
    threshold = 80,
    onSwipeComplete,
}: SwipeableRowProps) {
    const [isOpen, setIsOpen] = useState<"left" | "right" | null>(null);
    const x = useMotionValue(0);
    const hasTriggeredHaptic = useRef(false);

    const leftActionsWidth = leftActions.length * 72;
    const rightActionsWidth = rightActions.length * 72;

    const leftOpacity = useTransform(x, [0, leftActionsWidth], [0, 1]);
    const rightOpacity = useTransform(x, [-rightActionsWidth, 0], [1, 0]);

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        const velocity = info.velocity.x;
        const offset = info.offset.x;

        hasTriggeredHaptic.current = false;

        if (offset > threshold && leftActions.length > 0) {
            // Swipe right - show left actions
            animate(x, leftActionsWidth, { type: "spring", stiffness: 500, damping: 30 });
            setIsOpen("left");
            haptic("success");
            onSwipeComplete?.("right");
        } else if (offset < -threshold && rightActions.length > 0) {
            // Swipe left - show right actions
            animate(x, -rightActionsWidth, { type: "spring", stiffness: 500, damping: 30 });
            setIsOpen("right");
            haptic("success");
            onSwipeComplete?.("left");
        } else {
            // Snap back
            animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
            setIsOpen(null);
        }
    };

    const handleDrag = (_: unknown, info: PanInfo) => {
        const offset = Math.abs(info.offset.x);

        // Haptic at threshold
        if (offset >= threshold && !hasTriggeredHaptic.current) {
            haptic("medium");
            hasTriggeredHaptic.current = true;
        } else if (offset < threshold) {
            hasTriggeredHaptic.current = false;
        }
    };

    const close = () => {
        animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
        setIsOpen(null);
        haptic("light");
    };

    return (
        <div className={cn("relative overflow-hidden", className)}>
            {/* Left Actions (revealed when swiping right) */}
            {leftActions.length > 0 && (
                <motion.div
                    style={{ opacity: leftOpacity }}
                    className="absolute left-0 top-0 bottom-0 flex"
                >
                    {leftActions.map((action, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                haptic("medium");
                                action.onClick();
                                close();
                            }}
                            className={cn(
                                "w-18 flex flex-col items-center justify-center gap-1 text-white",
                                action.color
                            )}
                            style={{ width: 72 }}
                            aria-label={action.label}
                        >
                            <action.icon className="w-5 h-5" />
                            <span className="text-[10px]">{action.label}</span>
                        </button>
                    ))}
                </motion.div>
            )}

            {/* Right Actions (revealed when swiping left) */}
            {rightActions.length > 0 && (
                <motion.div
                    style={{ opacity: rightOpacity }}
                    className="absolute right-0 top-0 bottom-0 flex"
                >
                    {rightActions.map((action, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                haptic("medium");
                                action.onClick();
                                close();
                            }}
                            className={cn(
                                "w-18 flex flex-col items-center justify-center gap-1 text-white",
                                action.color
                            )}
                            style={{ width: 72 }}
                            aria-label={action.label}
                        >
                            <action.icon className="w-5 h-5" />
                            <span className="text-[10px]">{action.label}</span>
                        </button>
                    ))}
                </motion.div>
            )}

            {/* Main Content */}
            <motion.div
                style={{ x }}
                drag="x"
                dragConstraints={{
                    left: rightActions.length > 0 ? -rightActionsWidth - 20 : 0,
                    right: leftActions.length > 0 ? leftActionsWidth + 20 : 0,
                }}
                dragElastic={0.1}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                onClick={isOpen ? close : undefined}
                className="relative bg-background cursor-grab active:cursor-grabbing"
            >
                {children}
            </motion.div>
        </div>
    );
}

// Pre-configured delete action
export const deleteAction = (onDelete: () => void): SwipeAction => ({
    icon: Trash2,
    label: "Delete",
    color: "bg-destructive",
    onClick: onDelete,
});

// Pre-configured favorite action
export const favoriteAction = (onFavorite: () => void): SwipeAction => ({
    icon: Heart,
    label: "Favorite",
    color: "bg-pink-500",
    onClick: onFavorite,
});

// Pre-configured more action
export const moreAction = (onMore: () => void): SwipeAction => ({
    icon: MoreHorizontal,
    label: "More",
    color: "bg-muted-foreground",
    onClick: onMore,
});
