/**
 * iOS-style Haptic Feedback Utility
 * Uses Vibration API with patterns that mimic iOS haptic engine
 */

type HapticType =
    | "light"
    | "medium"
    | "heavy"
    | "selection"
    | "success"
    | "warning"
    | "error";

// Vibration patterns (in ms) that approximate iOS haptic feedback
const hapticPatterns: Record<HapticType, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 30,
    selection: 5,
    success: [10, 50, 20],
    warning: [20, 50, 20, 50, 20],
    error: [30, 100, 30],
};

/**
 * Trigger haptic feedback (iOS-style)
 * Falls back gracefully when not supported
 */
export function haptic(type: HapticType = "light"): void {
    // Check if reduced motion is preferred
    if (typeof window !== "undefined") {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReducedMotion) return;
    }

    // Check if Vibration API is supported
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
            navigator.vibrate(hapticPatterns[type]);
        } catch {
            // Silently fail on unsupported devices
        }
    }
}

/**
 * React hook for haptic feedback
 */
export function useHaptic() {
    return {
        light: () => haptic("light"),
        medium: () => haptic("medium"),
        heavy: () => haptic("heavy"),
        selection: () => haptic("selection"),
        success: () => haptic("success"),
        warning: () => haptic("warning"),
        error: () => haptic("error"),
    };
}

/**
 * Higher-order function to add haptic feedback to any handler
 */
export function withHaptic<T extends (...args: unknown[]) => unknown>(
    handler: T,
    type: HapticType = "light"
): T {
    return ((...args: Parameters<T>) => {
        haptic(type);
        return handler(...args);
    }) as T;
}
