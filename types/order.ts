/**
 * Order types
 */

import type { OrderStatus, PaymentMethodId } from "@/lib/constants";
import type { ProductSummary } from "./product";

export interface OrderItem {
    id: string;
    product: ProductSummary;
    quantity: number;
    price: number;
    variant?: Record<string, string>; // e.g., { color: "Black", size: "M" }
    note?: string;
}

export interface DeliveryAddress {
    id: string;
    label: string; // e.g., "Moremi Hall, Room 234"
    fullAddress: string;
    landmark?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    isDefault: boolean;
}

export interface DeliverySlot {
    id: string;
    label: string; // e.g., "Today 2-4pm"
    date: string;
    startTime: string;
    endTime: string;
    fee: number;
}

export interface Order {
    id: string;
    orderNumber: string; // e.g., "DBL-ABC123-XYZ"

    // Parties
    buyerId: string;
    buyerName: string;
    buyerPhone: string;
    vendorId: string;
    vendorName: string;
    campusId: string;

    // Items
    items: OrderItem[];

    // Pricing
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;

    // Delivery
    deliveryAddress: DeliveryAddress;
    deliverySlot: DeliverySlot;
    deliveryNote?: string;

    // Payment
    paymentMethod: PaymentMethodId;
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    paymentReference?: string;

    // Status
    status: OrderStatus;
    statusHistory: OrderStatusUpdate[];

    // Communication
    buyerNote?: string;
    vendorNote?: string;

    // Timestamps
    createdAt: string;
    updatedAt: string;
    confirmedAt?: string;
    deliveredAt?: string;
}

export interface OrderStatusUpdate {
    status: OrderStatus;
    timestamp: string;
    note?: string;
    updatedBy: "buyer" | "vendor" | "system";
}

// For order list views
export interface OrderSummary {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    total: number;
    itemCount: number;
    firstItemImage: string;
    firstItemName: string;
    createdAt: string;
    buyerName?: string; // For vendor view
    vendorName?: string; // For buyer view
}
