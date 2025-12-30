import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Address, PaymentMethod, UserProfile, Vendor, PlatformSettings } from '@/types/user';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, mockUser, INITIAL_VENDORS, INITIAL_USERS } from '@/lib/mock-db';

interface MarketplaceState {
    // Data
    products: Product[];
    orders: Order[];
    user: User | null;
    vendors: Vendor[];
    users: User[];
    platformSettings: PlatformSettings;

    // Actions
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;

    placeOrder: (order: Order) => void;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;

    // User Actions
    updateProfile: (profile: Partial<UserProfile>) => void;
    addAddress: (address: Address) => void;
    updateAddress: (address: Address) => void;
    deleteAddress: (id: string) => void;
    setDefaultAddress: (id: string) => void;
    addPaymentMethod: (method: PaymentMethod) => void;
    deletePaymentMethod: (id: string) => void;
    setDefaultPaymentMethod: (id: string) => void;

    // Admin Actions
    verifyVendor: (vendorId: string, status: 'approved' | 'rejected') => void;
    suspendVendor: (vendorId: string) => void;
    banUser: (userId: string) => void;
    updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;

    // Reset (for testing)
    resetStore: () => void;
}

export const useMarketplaceStore = create<MarketplaceState>()(
    persist(
        (set) => ({
            products: INITIAL_PRODUCTS,
            orders: INITIAL_ORDERS,
            user: mockUser,
            vendors: INITIAL_VENDORS,
            users: INITIAL_USERS,
            platformSettings: {
                commissionRate: 5,
                withdrawalFee: 50,
                minWithdrawal: 1000,
                maintenanceMode: false,
                allowNewRegistrations: true
            },

            addProduct: (product) => set((state) => ({
                products: [product, ...state.products]
            })),

            updateProduct: (id, updates) => set((state) => ({
                products: state.products.map((p) =>
                    p.id === id ? { ...p, ...updates } : p
                ),
            })),

            deleteProduct: (id) => set((state) => ({
                products: state.products.filter((p) => p.id !== id),
            })),

            placeOrder: (order) => set((state) => ({
                orders: [order, ...state.orders],
            })),

            updateOrderStatus: (orderId, status) => set((state) => ({
                orders: state.orders.map((o) =>
                    o.id === orderId ? { ...o, status } : o
                ),
            })),

            updateProfile: (profile) => set((state) => ({
                user: state.user ? { ...state.user, profile: { ...state.user.profile, ...profile } } : null
            })),

            addAddress: (address) => set((state) => ({
                user: state.user ? {
                    ...state.user,
                    addresses: [...state.user.addresses, address]
                } : null
            })),

            updateAddress: (address) => set((state) => ({
                user: state.user ? {
                    ...state.user,
                    addresses: state.user.addresses.map(a => a.id === address.id ? address : a)
                } : null
            })),

            deleteAddress: (id) => set((state) => ({
                user: state.user ? {
                    ...state.user,
                    addresses: state.user.addresses.filter(a => a.id !== id)
                } : null
            })),

            setDefaultAddress: (id) => set((state) => ({
                user: state.user ? {
                    ...state.user,
                    addresses: state.user.addresses.map(a => ({
                        ...a,
                        isDefault: a.id === id
                    }))
                } : null
            })),

            addPaymentMethod: (method) => set((state) => ({
                user: state.user ? {
                    ...state.user,
                    paymentMethods: [...state.user.paymentMethods, method]
                } : null
            })),

            deletePaymentMethod: (id) => set((state) => ({
                user: state.user ? {
                    ...state.user,
                    paymentMethods: state.user.paymentMethods.filter(p => p.id !== id)
                } : null
            })),

            setDefaultPaymentMethod: (id) => set((state) => ({
                user: state.user ? {
                    ...state.user,
                    paymentMethods: state.user.paymentMethods.map(p => ({
                        ...p,
                        isDefault: p.id === id
                    }))
                } : null
            })),

            verifyVendor: (vendorId, status) => set((state) => ({
                vendors: state.vendors.map(v =>
                    v.id === vendorId
                        ? { ...v, verificationStatus: status, isVerified: status === 'approved', approvedAt: status === 'approved' ? new Date().toISOString() : undefined }
                        : v
                )
            })),

            suspendVendor: (vendorId) => set((state) => ({
                vendors: state.vendors.map(v =>
                    v.id === vendorId
                        ? { ...v, isVerified: false, verificationStatus: 'rejected' } // distinct suspend status? for now reject/unverify
                        : v
                )
            })),

            banUser: (userId) => set((state) => ({
                users: state.users.filter(u => u.id !== userId) // For now, delete. Ideally toggle 'isBanned' flag if User model supports it.
            })),

            updatePlatformSettings: (settings) => set((state) => ({
                platformSettings: { ...state.platformSettings, ...settings }
            })),

            resetStore: () => set({
                products: INITIAL_PRODUCTS,
                orders: INITIAL_ORDERS,
                user: mockUser,
                vendors: INITIAL_VENDORS,
                users: INITIAL_USERS
            }),
        }),
        {
            name: 'debelu-marketplace-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
