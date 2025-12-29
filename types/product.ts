/**
 * Product types for the marketplace
 */

import type { CategoryId } from "@/lib/constants";

export interface ProductImage {
    id: string;
    url: string;
    alt: string;
    order: number;
}

export interface ProductVariant {
    id: string;
    name: string;
    options: string[];
}

export interface ProductVariantCombination {
    id: string;
    combination: Record<string, string>; // e.g., { color: "Black", size: "M" }
    price: number;
    stock: number;
    sku?: string;
}

export interface Product {
    id: string;
    vendorId: string;
    campusId: string;

    // Basic info
    name: string;
    description: string;
    category: CategoryId;
    tags: string[];

    // Pricing
    price: number;
    compareAtPrice?: number; // Original price for discounts

    // Images
    images: ProductImage[];

    // Inventory
    stock: number;
    trackInventory: boolean;
    lowStockThreshold?: number;

    // Variants
    hasVariants: boolean;
    variants?: ProductVariant[];
    variantCombinations?: ProductVariantCombination[];

    // Status
    status: "draft" | "active" | "archived";
    isFeatured: boolean;

    // Metrics
    views: number;
    sales: number;
    rating: number;
    reviewCount: number;

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

export interface ProductReview {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    images?: string[];
    isVerifiedPurchase: boolean;
    helpfulCount: number;
    createdAt: string;
}

export interface ProductQuestion {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    question: string;
    answer?: string;
    answeredBy?: "vendor" | "buyer";
    answeredAt?: string;
    createdAt: string;
}

// Simplified product for lists/cards
export interface ProductSummary {
    id: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    image: string;
    vendorName: string;
    rating: number;
    reviewCount: number;
    stock: number;
    campusId: string;
}
