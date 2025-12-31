import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Address, PaymentMethod, UserProfile, Vendor, PlatformSettings } from '@/types/user';
import { Product } from '@/types/product';
import { Order } from '@/types/order';
import { OrderStatus } from '@/lib/constants';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

interface MarketplaceState {
    // Data
    products: Product[];
    orders: Order[];
    user: User | null;
    vendors: Vendor[];
    users: User[];
    platformSettings: PlatformSettings;
    isLoading: boolean;

    // Actions
    fetchInitialData: () => Promise<void>;

    addProduct: (product: Product) => Promise<void>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;

    placeOrder: (order: Order) => Promise<void>;
    updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
    updateOrderPaymentStatus: (orderId: string, paymentStatus: 'pending' | 'paid' | 'failed') => Promise<void>;
    getOrderById: (orderId: string) => Promise<Order | null>;

    // User Actions
    updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
    addAddress: (address: Address) => Promise<void>;
    updateAddress: (address: Address) => Promise<void>;
    deleteAddress: (id: string) => Promise<void>;
    setDefaultAddress: (id: string) => Promise<void>;
    addPaymentMethod: (method: PaymentMethod) => Promise<void>;
    deletePaymentMethod: (id: string) => Promise<void>;
    setDefaultPaymentMethod: (id: string) => Promise<void>;

    // Admin Actions
    verifyVendor: (vendorId: string, status: 'approved' | 'rejected') => Promise<void>;
    suspendVendor: (vendorId: string) => Promise<void>;
    banUser: (userId: string) => Promise<void>;
    updatePlatformSettings: (settings: Partial<PlatformSettings>) => Promise<void>;

    // Helper
    setUser: (user: User | null) => void;
}

export const useMarketplaceStore = create<MarketplaceState>()(
    persist(
        (set, get) => ({
            products: [],
            orders: [],
            user: null,
            vendors: [],
            users: [],
            platformSettings: {
                commissionRate: 5,
                withdrawalFee: 50,
                minWithdrawal: 1000,
                maintenanceMode: false,
                allowNewRegistrations: true
            },
            isLoading: false,

            fetchInitialData: async () => {
                const supabase = createClient();
                set({ isLoading: true });
                try {
                    // Fetch Products
                    const { data: products } = await supabase.from('products').select('*');
                    // Fetch Vendors
                    const { data: vendors } = await supabase.from('vendors').select('*');
                    // Fetch current user details if logged in
                    const { data: { user } } = await supabase.auth.getUser();

                    let userData = null;
                    let userOrders: Order[] = [];

                    if (user) {
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('*, addresses(*), payment_methods(*)')
                            .eq('id', user.id)
                            .single();

                        if (profile) {
                            userData = {
                                id: profile.id,
                                role: profile.role,
                                profile: {
                                    ...profile,
                                    email: user.email // Ensure email is present
                                },
                                addresses: profile.addresses || [],
                                paymentMethods: profile.payment_methods || [],
                                // Map other fields...
                                ...profile
                            } as User;
                        }

                        // Fetch Orders for User
                        const { data: orders } = await supabase
                            .from('orders')
                            .select('*')
                            .or(`buyer_id.eq.${user.id},vendor_id.in.(select id from vendors where user_id=eq.${user.id})`)
                            .order('created_at', { ascending: false });

                        userOrders = orders as Order[] || [];
                    }

                    set({
                        products: (products as Product[]) || [],
                        vendors: (vendors as Vendor[]) || [],
                        user: userData,
                        orders: userOrders
                    });

                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    set({ isLoading: false });
                }
            },

            addProduct: async (product) => {
                const supabase = createClient();
                // Omit ID to let DB generate it, or use the one provided if UUID
                const { error } = await supabase.from('products').insert(product);
                if (error) {
                    toast.error("Failed to add product");
                    return;
                }
                set((state) => ({ products: [product, ...state.products] }));
                toast.success("Product added");
            },

            updateProduct: async (id, updates) => {
                const supabase = createClient();
                const { error } = await supabase.from('products').update(updates).eq('id', id);
                if (error) {
                    toast.error("Failed to update product");
                    return;
                }
                set((state) => ({
                    products: state.products.map((p) => p.id === id ? { ...p, ...updates } : p),
                }));
            },

            deleteProduct: async (id) => {
                const supabase = createClient();
                const { error } = await supabase.from('products').delete().eq('id', id);
                if (error) {
                    toast.error("Failed to delete product");
                    return;
                }
                set((state) => ({
                    products: state.products.filter((p) => p.id !== id),
                }));
            },

            placeOrder: async (order) => {
                const supabase = createClient();
                const { error } = await supabase.from('orders').insert({
                    ...order,
                    // Ensure naming matches DB columns (snake_case vs camelCase mapping needed?)
                    // The types/order.ts likely uses camelCase.
                    // Supabase JS client auto-maps if set up, but usually we need manual mapping 
                    // or usage of camelCase columns in DB (I used snake_case in schema).
                    // For now, assuming exact match or I need to map.
                    // My schema used snake_case (buyer_id, etc).
                    // I should map here.
                    buyer_id: order.buyerId,
                    vendor_id: order.vendorId,
                    campus_id: order.campusId,
                    delivery_address: order.deliveryAddress,
                    delivery_slot: order.deliverySlot,
                    order_number: order.orderNumber,
                    payment_method: order.paymentMethod,
                    payment_status: order.paymentStatus
                    // ... other fields
                });

                if (error) {
                    console.error(error);
                    toast.error("Failed to place order");
                    return;
                }

                set((state) => ({ orders: [order, ...state.orders] }));
                toast.success("Order placed successfully");
            },

            updateOrderStatus: async (orderId, status) => {
                const supabase = createClient();
                const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
                if (error) {
                    toast.error("Failed to update status");
                    return;
                }
                set((state) => ({
                    orders: state.orders.map((o) => o.id === orderId ? { ...o, status } : o),
                }));
            },

            updateOrderPaymentStatus: async (orderId, paymentStatus) => {
                const supabase = createClient();
                const { error } = await supabase.from('orders').update({
                    payment_status: paymentStatus,
                    updated_at: new Date().toISOString()
                }).eq('id', orderId);
                if (error) {
                    console.error(error);
                    toast.error("Failed to update payment status");
                    return;
                }
                set((state) => ({
                    orders: state.orders.map((o) => o.id === orderId ? { ...o, paymentStatus } : o),
                }));
            },

            getOrderById: async (orderId) => {
                const supabase = createClient();
                const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).single();
                if (error || !data) {
                    return null;
                }
                // Map snake_case to camelCase
                return {
                    id: data.id,
                    orderNumber: data.order_number,
                    buyerId: data.buyer_id,
                    buyerName: data.buyer_name,
                    buyerPhone: data.buyer_phone,
                    vendorId: data.vendor_id,
                    vendorName: data.vendor_name,
                    campusId: data.campus_id,
                    items: data.items || [],
                    subtotal: data.subtotal,
                    deliveryFee: data.delivery_fee,
                    discount: data.discount,
                    total: data.total,
                    deliveryAddress: data.delivery_address,
                    deliverySlot: data.delivery_slot,
                    paymentMethod: data.payment_method,
                    paymentStatus: data.payment_status,
                    status: data.status,
                    statusHistory: data.status_history || [],
                    createdAt: data.created_at,
                    updatedAt: data.updated_at,
                } as Order;
            },

            // --- User Actions ---
            updateProfile: async (profile) => {
                const state = get();
                if (!state.user) return;

                const supabase = createClient();
                const { error } = await supabase.from('profiles').update(profile).eq('id', state.user.id);

                if (error) {
                    toast.error("Failed to update profile");
                    return;
                }

                set((state) => ({
                    user: state.user ? { ...state.user, profile: { ...state.user.profile, ...profile } } : null
                }));
            },

            addAddress: async (address) => {
                const state = get();
                if (!state.user) return;

                const supabase = createClient();
                const { data, error } = await supabase.from('addresses').insert({
                    ...address,
                    user_id: state.user.id,
                    // Map schema snake_case
                    full_address: address.fullAddress,
                    is_default: address.isDefault
                }).select().single();

                if (error) {
                    toast.error("Failed to add address");
                    return;
                }

                set((state) => ({
                    user: state.user ? { ...state.user, addresses: [...state.user.addresses, { ...address, id: data.id }] } : null
                }));
            },

            updateAddress: async (address) => {
                const supabase = createClient();
                const { error } = await supabase.from('addresses').update({
                    ...address,
                    full_address: address.fullAddress,
                    is_default: address.isDefault
                }).eq('id', address.id);

                if (error) {
                    toast.error("Failed to update address");
                    return;
                }
                set((state) => ({
                    user: state.user ? {
                        ...state.user,
                        addresses: state.user.addresses.map(a => a.id === address.id ? address : a)
                    } : null
                }));
            },

            deleteAddress: async (id) => {
                const supabase = createClient();
                const { error } = await supabase.from('addresses').delete().eq('id', id);
                if (error) {
                    toast.error("Failed to delete address");
                    return;
                }
                set((state) => ({
                    user: state.user ? {
                        ...state.user,
                        addresses: state.user.addresses.filter(a => a.id !== id)
                    } : null
                }));
            },

            setDefaultAddress: async (id) => {
                const state = get();
                if (!state.user) return;
                const supabase = createClient();

                // Batch update: unset all, set one? Or rely on DB trigger (better).
                // Implementation: simple update locally + DB
                await supabase.from('addresses').update({ is_default: false }).eq('user_id', state.user.id);
                await supabase.from('addresses').update({ is_default: true }).eq('id', id);

                set((state) => ({
                    user: state.user ? {
                        ...state.user,
                        addresses: state.user.addresses.map(a => ({ ...a, isDefault: a.id === id }))
                    } : null
                }));
            },

            // Stub implementations for others to maintain interface
            addPaymentMethod: async (method) => { console.log('add payment', method) },
            deletePaymentMethod: async (id) => { console.log('delete payment', id) },
            setDefaultPaymentMethod: async (id) => { console.log('default payment', id) },

            // Admin Actions
            verifyVendor: async (vendorId, status) => {
                const supabase = createClient();
                await supabase.from('vendors').update({
                    verification_status: status,
                    is_verified: status === 'approved'
                }).eq('id', vendorId);

                set((state) => ({
                    vendors: state.vendors.map(v => v.id === vendorId ? { ...v, verificationStatus: status, isVerified: status === 'approved' } : v)
                }));
            },
            suspendVendor: async (vendorId) => { console.log('suspend', vendorId) },
            banUser: async (userId) => { console.log('ban', userId) },
            updatePlatformSettings: async (settings) => { console.log('settings', settings) },

            setUser: (user) => set({ user }),
            resetStore: () => set({ products: [], orders: [] })
        }),
        {
            name: 'debelu-marketplace-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
