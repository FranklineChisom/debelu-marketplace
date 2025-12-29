/**
 * Application constants
 */

// Campus list (Nigerian universities - expandable)
export const CAMPUSES = [
    { id: "unilag", name: "University of Lagos", shortName: "UNILAG", state: "Lagos" },
    { id: "unn", name: "University of Nigeria, Nsukka", shortName: "UNN", state: "Enugu" },
    { id: "ui", name: "University of Ibadan", shortName: "UI", state: "Oyo" },
    { id: "abu", name: "Ahmadu Bello University", shortName: "ABU", state: "Kaduna" },
    { id: "oau", name: "Obafemi Awolowo University", shortName: "OAU", state: "Osun" },
    { id: "uniben", name: "University of Benin", shortName: "UNIBEN", state: "Edo" },
    { id: "unilorin", name: "University of Ilorin", shortName: "UNILORIN", state: "Kwara" },
    { id: "unijos", name: "University of Jos", shortName: "UNIJOS", state: "Plateau" },
    { id: "futa", name: "Federal University of Technology, Akure", shortName: "FUTA", state: "Ondo" },
    { id: "lasu", name: "Lagos State University", shortName: "LASU", state: "Lagos" },
    { id: "covenant", name: "Covenant University", shortName: "CU", state: "Ogun" },
    { id: "babcock", name: "Babcock University", shortName: "BU", state: "Ogun" },
    { id: "pau", name: "Pan-Atlantic University", shortName: "PAU", state: "Lagos" },
    { id: "aun", name: "American University of Nigeria", shortName: "AUN", state: "Adamawa" },
    { id: "lbs", name: "Lagos Business School", shortName: "LBS", state: "Lagos" },
] as const;

export type CampusId = typeof CAMPUSES[number]["id"];

// Product categories
export const PRODUCT_CATEGORIES = [
    { id: "electronics", name: "Electronics", icon: "📱", emoji: "📱" },
    { id: "fashion", name: "Fashion", icon: "👗", emoji: "👗" },
    { id: "food", name: "Food & Snacks", icon: "🍔", emoji: "🍔" },
    { id: "books", name: "Books & Stationery", icon: "📚", emoji: "📚" },
    { id: "beauty", name: "Beauty & Health", icon: "💄", emoji: "💄" },
    { id: "home", name: "Home & Living", icon: "🏠", emoji: "🏠" },
    { id: "sports", name: "Sports & Fitness", icon: "⚽", emoji: "⚽" },
    { id: "services", name: "Services", icon: "🛠️", emoji: "🛠️" },
    { id: "tickets", name: "Events & Tickets", icon: "🎫", emoji: "🎫" },
    { id: "other", name: "Other", icon: "📦", emoji: "📦" },
] as const;

export type CategoryId = typeof PRODUCT_CATEGORIES[number]["id"];

// Order statuses
export const ORDER_STATUSES = {
    pending: { label: "Pending", color: "warning", description: "Waiting for vendor confirmation" },
    confirmed: { label: "Confirmed", color: "info", description: "Vendor has accepted the order" },
    processing: { label: "Processing", color: "info", description: "Order is being prepared" },
    ready: { label: "Ready", color: "info", description: "Ready for pickup/delivery" },
    delivering: { label: "Out for Delivery", color: "info", description: "On the way to you" },
    delivered: { label: "Delivered", color: "success", description: "Order completed" },
    cancelled: { label: "Cancelled", color: "destructive", description: "Order was cancelled" },
    disputed: { label: "Disputed", color: "destructive", description: "Under review" },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUSES;

// Payment methods
export const PAYMENT_METHODS = [
    { id: "paystack", name: "Pay with Card", description: "Visa, Mastercard, Verve", icon: "💳" },
    { id: "bank_transfer", name: "Bank Transfer", description: "Pay via bank transfer", icon: "🏦" },
    { id: "ussd", name: "USSD", description: "Pay with USSD code", icon: "📱" },
    { id: "pod", name: "Pay on Delivery", description: "+₦500 fee", icon: "💰", extraFee: 500 },
] as const;

export type PaymentMethodId = typeof PAYMENT_METHODS[number]["id"];

// App metadata
export const APP_NAME = "Debelu.";
export const APP_TAGLINE = "Shop your campus, chat-style.";
export const APP_DESCRIPTION = "The marketplace for Nigerian students. Discover, chat, and buy from vendors on your campus.";

// API endpoints (placeholder for Supabase)
export const API_ENDPOINTS = {
    products: "/api/products",
    orders: "/api/orders",
    vendors: "/api/vendors",
    chat: "/api/chat",
    auth: "/api/auth",
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
} as const;

// Animation durations
export const DURATIONS = {
    fast: 150,
    normal: 300,
    slow: 500,
} as const;

// Chat suggestions for new users
export const CHAT_SUGGESTIONS = [
    "Laptop under 150k",
    "Cheap textbooks",
    "Thrift clothes",
    "Snacks and drinks",
    "Phone accessories",
    "Hair products",
    "Room essentials",
    "Party tickets",
] as const;

// Vendor dashboard stats
export const VENDOR_STATS_PERIODS = [
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "all", label: "All Time" },
] as const;
