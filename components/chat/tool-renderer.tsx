"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import {
    ToolInvocation,
    isProductArray,
    isLoading as isToolLoading
} from "@/lib/chat/tools";
import { ProductCardChat } from "./product-card-chat";

interface ToolRendererProps {
    invocation: ToolInvocation;
}

/**
 * Apple-Standard Tool Result Renderer
 * 
 * Unified component for rendering all tool results with:
 * - Loading states (skeleton)
 * - Success states (product cards, etc.)
 * - Smooth spring animations
 * - Accessibility support
 */
export function ToolRenderer({ invocation }: ToolRendererProps) {
    const isLoading = isToolLoading(invocation);

    // Dispatch to appropriate renderer
    switch (invocation.toolName) {
        case 'search_marketplace':
            return (
                <ProductResultRenderer
                    result={invocation.result}
                    isLoading={isLoading}
                    label="Search Results"
                />
            );

        case 'compare_products':
            return (
                <ProductResultRenderer
                    result={invocation.result}
                    isLoading={isLoading}
                    label="Products to Compare"
                />
            );

        case 'open_ui_panel':
            // Side effect only - no inline UI needed
            return null;

        default:
            return null;
    }
}

interface ProductResultRendererProps {
    result: unknown;
    isLoading: boolean;
    label: string;
}

/**
 * Product Carousel/Grid Renderer
 * 
 * Displays product cards in a horizontal scrollable carousel
 * with Apple-style animations and loading states.
 */
function ProductResultRenderer({ result, isLoading, label }: ProductResultRendererProps) {
    const products = isProductArray(result) ? result : [];

    // Don't render if no products and not loading
    if (products.length === 0 && !isLoading) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                delay: 0.1
            }}
            className="mt-3 space-y-2 w-full"
            role="region"
            aria-label={label}
        >
            {/* Header */}
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-50 px-1">
                {isLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin text-primary" />
                ) : (
                    <Sparkles className="w-3 h-3 text-blue-500" />
                )}
                <span>{isLoading ? "Finding products..." : label}</span>
            </div>

            {/* Product Carousel */}
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <LoadingCarousel key="loading" />
                ) : (
                    <motion.div
                        key="products"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 overflow-x-auto pb-4 no-scrollbar px-1 snap-x snap-mandatory"
                        role="list"
                        aria-label={`${products.length} products found`}
                    >
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    type: "spring",
                                    damping: 25,
                                    stiffness: 300,
                                    delay: index * 0.05 // Stagger effect
                                }}
                                className="min-w-[200px] max-w-[200px] snap-start"
                                role="listitem"
                            >
                                <ProductCardChat product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/**
 * Loading State Carousel
 * 
 * Shows skeleton cards while tool is executing.
 */
function LoadingCarousel() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-3 overflow-x-auto pb-4 no-scrollbar px-1"
        >
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="min-w-[200px] max-w-[200px] rounded-xl border border-border/50 overflow-hidden bg-card"
                >
                    {/* Image skeleton */}
                    <div className="aspect-square bg-muted animate-pulse" />

                    {/* Content skeleton */}
                    <div className="p-3 space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                        <div className="h-5 bg-muted rounded animate-pulse w-1/3 mt-2" />
                        <div className="h-7 bg-muted rounded animate-pulse w-full mt-2" />
                    </div>
                </div>
            ))}
        </motion.div>
    );
}

export default ToolRenderer;
