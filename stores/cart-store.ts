/**
 * Cart store using Zustand
 * Persists to localStorage
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ProductSummary } from "@/types";

export interface CartItem {
    product: ProductSummary;
    quantity: number;
    variant?: Record<string, string>;
    addedAt: string;
}

interface CartStore {
    // State
    items: CartItem[];

    // Computed (via selectors)

    // Actions
    addItem: (product: ProductSummary, quantity?: number, variant?: Record<string, string>) => void;
    removeItem: (productId: string, variant?: Record<string, string>) => void;
    updateQuantity: (productId: string, quantity: number, variant?: Record<string, string>) => void;
    clearCart: () => void;

    // Helpers
    getItemCount: () => number;
    getSubtotal: () => number;
    isInCart: (productId: string, variant?: Record<string, string>) => boolean;
}

const getItemKey = (productId: string, variant?: Record<string, string>) => {
    if (!variant) return productId;
    return `${productId}-${Object.entries(variant).sort().map(([k, v]) => `${k}:${v}`).join("-")}`;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product, quantity = 1, variant) => {
                set((state) => {
                    const existingIndex = state.items.findIndex(
                        (item) =>
                            item.product.id === product.id &&
                            JSON.stringify(item.variant) === JSON.stringify(variant)
                    );

                    if (existingIndex >= 0) {
                        // Update quantity
                        const newItems = [...state.items];
                        newItems[existingIndex] = {
                            ...newItems[existingIndex],
                            quantity: newItems[existingIndex].quantity + quantity,
                        };
                        return { items: newItems };
                    }

                    // Add new item
                    return {
                        items: [
                            ...state.items,
                            {
                                product,
                                quantity,
                                variant,
                                addedAt: new Date().toISOString(),
                            },
                        ],
                    };
                });
            },

            removeItem: (productId, variant) => {
                set((state) => ({
                    items: state.items.filter(
                        (item) =>
                            !(item.product.id === productId &&
                                JSON.stringify(item.variant) === JSON.stringify(variant))
                    ),
                }));
            },

            updateQuantity: (productId, quantity, variant) => {
                if (quantity <= 0) {
                    get().removeItem(productId, variant);
                    return;
                }

                set((state) => ({
                    items: state.items.map((item) =>
                        item.product.id === productId &&
                            JSON.stringify(item.variant) === JSON.stringify(variant)
                            ? { ...item, quantity }
                            : item
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),

            getItemCount: () => {
                return get().items.reduce((sum, item) => sum + item.quantity, 0);
            },

            getSubtotal: () => {
                return get().items.reduce(
                    (sum, item) => sum + item.product.price * item.quantity,
                    0
                );
            },

            isInCart: (productId, variant) => {
                return get().items.some(
                    (item) =>
                        item.product.id === productId &&
                        JSON.stringify(item.variant) === JSON.stringify(variant)
                );
            },
        }),
        {
            name: "debelu-cart",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Selectors for derived state
export const selectCartItemCount = (state: CartStore) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartSubtotal = (state: CartStore) =>
    state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
