"use client";

import { useState, useRef, useCallback, ReactNode } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Loader2 } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: ReactNode;
    className?: string;
    threshold?: number;
    disabled?: boolean;
}

export function PullToRefresh({
    onRefresh,
    children,
    className,
    threshold = 80,
    disabled = false,
}: PullToRefreshProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const startY = useRef(0);
    const currentY = useRef(0);

    const pullDistance = useMotionValue(0);
    const opacity = useTransform(pullDistance, [0, threshold], [0, 1]);
    const scale = useTransform(pullDistance, [0, threshold], [0.5, 1]);
    const rotation = useTransform(pullDistance, [0, threshold * 2], [0, 360]);

    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => {
            if (disabled || isRefreshing) return;

            const container = containerRef.current;
            if (!container) return;

            // Only activate when scrolled to top
            if (container.scrollTop > 0) return;

            startY.current = e.touches[0].clientY;
        },
        [disabled, isRefreshing]
    );

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            if (disabled || isRefreshing) return;
            if (startY.current === 0) return;

            const container = containerRef.current;
            if (!container || container.scrollTop > 0) {
                startY.current = 0;
                pullDistance.set(0);
                return;
            }

            currentY.current = e.touches[0].clientY;
            const diff = Math.max(0, currentY.current - startY.current);

            // Apply resistance (iOS-style rubber banding)
            const resistance = 0.5;
            const resistedPull = diff * resistance;

            pullDistance.set(resistedPull);

            // Haptic feedback at threshold
            const prevValue = pullDistance.getPrevious?.() ?? 0;
            if (resistedPull >= threshold && prevValue < threshold) {
                haptic("medium");
            }
        },
        [disabled, isRefreshing, pullDistance, threshold]
    );

    const handleTouchEnd = useCallback(async () => {
        if (disabled || isRefreshing) return;

        const pull = pullDistance.get();

        if (pull >= threshold) {
            // Trigger refresh
            setIsRefreshing(true);
            haptic("success");

            // Animate to loading position
            await animate(pullDistance, 60, { type: "spring", stiffness: 400, damping: 30 });

            try {
                await onRefresh();
            } finally {
                setIsRefreshing(false);
                await animate(pullDistance, 0, { type: "spring", stiffness: 400, damping: 30 });
            }
        } else {
            // Snap back
            animate(pullDistance, 0, { type: "spring", stiffness: 400, damping: 30 });
        }

        startY.current = 0;
    }, [disabled, isRefreshing, onRefresh, pullDistance, threshold]);

    return (
        <div
            ref={containerRef}
            className={cn("relative overflow-auto", className)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Pull indicator */}
            <motion.div
                style={{ height: pullDistance, opacity }}
                className="absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden"
            >
                <motion.div style={{ scale, rotate: isRefreshing ? 0 : rotation }}>
                    <Loader2
                        className={cn(
                            "w-6 h-6 text-primary",
                            isRefreshing && "animate-spin"
                        )}
                    />
                </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div style={{ y: pullDistance }}>
                {children}
            </motion.div>
        </div>
    );
}
