/**
 * UI store for app-wide UI state
 */

import { create } from "zustand";
import type { CampusId } from "@/lib/constants";

interface UIStore {
    // Campus selection
    selectedCampus: CampusId | null;
    setSelectedCampus: (campus: CampusId) => void;

    // Modals/Sheets
    isCampusSelectorOpen: boolean;
    setIsCampusSelectorOpen: (isOpen: boolean) => void;

    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;

    isSearchOpen: boolean;
    setIsSearchOpen: (isOpen: boolean) => void;

    // Mobile navigation
    isMobileNavOpen: boolean;
    setIsMobileNavOpen: (isOpen: boolean) => void;

    // Vendor sidebar
    isVendorSidebarCollapsed: boolean;
    setIsVendorSidebarCollapsed: (isCollapsed: boolean) => void;
    toggleVendorSidebar: () => void;

    // Loading states
    isPageLoading: boolean;
    setIsPageLoading: (isLoading: boolean) => void;

    // Toast queue (for custom toasts)
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;

    // Verification flow
    verificationValues: { email: string; phone: string } | null;
    setVerificationValues: (values: { email: string; phone: string } | null) => void;
}

interface Toast {
    id: string;
    type: "success" | "error" | "warning" | "info";
    title: string;
    description?: string;
    duration?: number;
}

export const useUIStore = create<UIStore>((set, get) => ({
    // Campus
    selectedCampus: null,
    setSelectedCampus: (campus) => {
        set({ selectedCampus: campus });
        // Also save to localStorage for persistence
        if (typeof window !== "undefined") {
            localStorage.setItem("debelu-campus", campus);
        }
    },

    // Modals
    isCampusSelectorOpen: false,
    setIsCampusSelectorOpen: (isOpen) => set({ isCampusSelectorOpen: isOpen }),

    isCartOpen: false,
    setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

    isSearchOpen: false,
    setIsSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),

    // Mobile nav
    isMobileNavOpen: false,
    setIsMobileNavOpen: (isOpen) => set({ isMobileNavOpen: isOpen }),

    // Vendor sidebar
    isVendorSidebarCollapsed: false,
    setIsVendorSidebarCollapsed: (isCollapsed) => set({ isVendorSidebarCollapsed: isCollapsed }),
    toggleVendorSidebar: () => set((state) => ({ isVendorSidebarCollapsed: !state.isVendorSidebarCollapsed })),

    // Loading
    isPageLoading: false,
    setIsPageLoading: (isLoading) => set({ isPageLoading: isLoading }),

    // Toasts
    toasts: [],
    addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
            toasts: [...state.toasts, { ...toast, id }],
        }));

        // Auto-remove after duration
        const duration = toast.duration ?? 5000;
        setTimeout(() => {
            get().removeToast(id);
        }, duration);
    },
    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        }));
    },

    // Verification
    verificationValues: null,
    setVerificationValues: (values) => set({ verificationValues: values }),
}));

// Initialize campus from localStorage on client
if (typeof window !== "undefined") {
    const savedCampus = localStorage.getItem("debelu-campus") as CampusId | null;
    if (savedCampus) {
        useUIStore.getState().setSelectedCampus(savedCampus);
    }
}
