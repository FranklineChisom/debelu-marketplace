/**
 * Framer Motion animation presets for Debelu
 * Apple/Google-standard micro-interactions
 */

import type { Variants, Transition } from "framer-motion";

// ─────────────────────────────────────────
// TRANSITIONS
// ─────────────────────────────────────────

export const spring: Transition = {
    type: "spring",
    stiffness: 400,
    damping: 30,
};

export const springBouncy: Transition = {
    type: "spring",
    stiffness: 300,
    damping: 20,
};

export const easeOut: Transition = {
    type: "tween",
    ease: [0.25, 0.46, 0.45, 0.94],
    duration: 0.3,
};

export const easeInOut: Transition = {
    type: "tween",
    ease: [0.4, 0, 0.2, 1],
    duration: 0.3,
};

// ─────────────────────────────────────────
// ENTRANCE ANIMATIONS
// ─────────────────────────────────────────

export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

export const fadeInDown: Variants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
};

export const fadeInLeft: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
};

export const fadeInRight: Variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
};

export const scaleIn: Variants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
};

export const popIn: Variants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: springBouncy,
    },
    exit: { opacity: 0, scale: 0.8 },
};

// ─────────────────────────────────────────
// SLIDE ANIMATIONS
// ─────────────────────────────────────────

export const slideInFromBottom: Variants = {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
};

export const slideInFromRight: Variants = {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
};

export const slideInFromLeft: Variants = {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
};

// ─────────────────────────────────────────
// STAGGER CONTAINERS
// ─────────────────────────────────────────

export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
    exit: {
        transition: {
            staggerChildren: 0.03,
            staggerDirection: -1,
        },
    },
};

export const staggerContainerSlow: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

// ─────────────────────────────────────────
// INTERACTIVE STATES
// ─────────────────────────────────────────

export const tapScale = {
    scale: 0.97,
    transition: { duration: 0.1 },
};

export const tapScaleSmall = {
    scale: 0.99,
    transition: { duration: 0.1 },
};

export const hoverLift = {
    y: -4,
    transition: { duration: 0.2 },
};

export const hoverScale = {
    scale: 1.02,
    transition: { duration: 0.2 },
};

export const hoverGlow = {
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 },
};

// ─────────────────────────────────────────
// CHAT ANIMATIONS
// ─────────────────────────────────────────

export const chatMessageIn: Variants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.95
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
        },
    },
};

export const chatMessageUser: Variants = {
    initial: {
        opacity: 0,
        x: 20,
        scale: 0.95,
    },
    animate: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: spring,
    },
};

export const chatMessageAI: Variants = {
    initial: {
        opacity: 0,
        x: -20,
        scale: 0.95,
    },
    animate: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: spring,
    },
};

export const typingDots: Variants = {
    initial: { opacity: 0.4 },
    animate: {
        opacity: 1,
        transition: {
            repeat: Infinity,
            repeatType: "reverse",
            duration: 0.4,
        },
    },
};

// ─────────────────────────────────────────
// PRODUCT CARD ANIMATIONS
// ─────────────────────────────────────────

export const productCardHover = {
    y: -8,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

export const productImageZoom = {
    scale: 1.05,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
};

// ─────────────────────────────────────────
// SUCCESS / FEEDBACK ANIMATIONS
// ─────────────────────────────────────────

export const successCheck: Variants = {
    initial: {
        pathLength: 0,
        opacity: 0,
    },
    animate: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { duration: 0.4, ease: "easeOut" },
            opacity: { duration: 0.1 },
        },
    },
};

export const cartBadgePulse: Variants = {
    initial: { scale: 1 },
    animate: {
        scale: [1, 1.2, 1],
        transition: {
            duration: 0.3,
            times: [0, 0.5, 1],
        },
    },
};

// ─────────────────────────────────────────
// PAGE TRANSITIONS
// ─────────────────────────────────────────

export const pageTransition: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: easeOut,
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: 0.2 },
    },
};

export const pageSlideRight: Variants = {
    initial: {
        opacity: 0,
        x: 20,
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: easeOut,
    },
    exit: {
        opacity: 0,
        x: -20,
        transition: { duration: 0.2 },
    },
};
