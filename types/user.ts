/**
 * User and vendor types
 */

import type { CampusId } from "@/lib/constants";
import type { DeliveryAddress } from "./order";

// Consolidated User Types

export interface Address {
    id: string;
    type: "Home" | "Work" | "Other";
    label: string;
    fullAddress: string; // Renamed from description to match DeliveryAddress
    phone: string;
    isDefault: boolean;
}

export interface PaymentMethod {
    id: string;
    type: "Visa" | "Mastercard" | "Verve";
    last4: string;
    expiry: string;
    cardHolder: string;
    isDefault: boolean;
    gradient?: string;
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string;
    avatar: string;
    bio: string;
    campusId: CampusId;
}

// User role definition
export type UserRole = "buyer" | "vendor" | "admin";

export interface User {
    id: string;
    profile: UserProfile;

    // Data
    addresses: Address[];
    paymentMethods: PaymentMethod[];

    // Preferences & Stats
    role: UserRole;
    preferences: UserPreferences;

    // Stats
    orderCount: number;
    totalSpent: number;
    points: number;
    badges: string[];
    streak: number;

    // Timestamps
    createdAt: string;
    lastActiveAt: string;
}

export interface UserPreferences {
    notifications: {
        push: boolean;
        email: boolean;
        whatsapp: boolean;
        orderUpdates: boolean;
        promotions: boolean;
        priceDrops: boolean;
    };
    theme: "light" | "dark" | "system";
    language: "en" | "pidgin" | "yoruba" | "hausa" | "igbo";
}

export interface Vendor {
    id: string;
    userId: string;

    // Business info
    businessName: string;
    description: string;
    logo?: string;
    banner?: string;

    // Campus
    campusId: CampusId;

    // Contact
    phone: string;
    whatsapp?: string;
    email?: string;

    // Location
    location?: string;

    // Verification
    isVerified: boolean;
    verificationStatus: "pending" | "approved" | "rejected";
    verificationDocs?: string[];

    // Bank details (for payouts)
    bankDetails?: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };

    // Settings
    settings: VendorSettings;

    // Stats
    rating: number;
    reviewCount: number;
    totalSales: number;
    totalRevenue: number;
    productCount: number;
    responseRate: number; // percentage
    responseTime: number; // average minutes

    // Timestamps
    createdAt: string;
    approvedAt?: string;
}

export interface VendorSettings {
    // Store
    isOpen: boolean;
    autoAcceptOrders: boolean;

    // Delivery
    deliveryZones: DeliveryZone[];
    freeDeliveryThreshold?: number;

    // Policies
    returnPolicy?: string;
    warrantyPolicy?: string;

    // Business hours
    businessHours: BusinessHours[];
}

export interface DeliveryZone {
    id: string;
    name: string; // e.g., "Within campus", "Off campus (nearby)"
    fee: number;
    estimatedTime: string; // e.g., "30 mins - 1 hour"
}

export interface BusinessHours {
    day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    isOpen: boolean;
    openTime?: string;
    closeTime?: string;
}

// For vendor lists
export interface VendorSummary {
    id: string;
    businessName: string;
    logo?: string;
    rating: number;
    reviewCount: number;
    productCount: number;
    isVerified: boolean;
    campusId: CampusId;
}

export interface PlatformSettings {
    commissionRate: number; // Percentage (e.g., 5 for 5%)
    withdrawalFee: number; // Fixed amount
    minWithdrawal: number;
    maintenanceMode: boolean;
    allowNewRegistrations: boolean;
}
