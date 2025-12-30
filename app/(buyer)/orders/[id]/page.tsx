"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Phone,
    MessageSquare,
    MapPin,
    Package,
    CheckCircle,
    Clock,
    Truck,
    Store,
    Copy,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

// Mock orders data - Expanded for detail view
const mockOrders = [
    {
        id: "1",
        orderNumber: "DBL-ABC123",
        status: "delivered" as const,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        subtotal: 177500,
        deliveryFee: 500,
        total: 178000,
        vendorName: "Campus Tech Hub",
        vendorPhone: "08012345678",
        deliveryAddress: "Moremi Hall, Room 234, UNILAG",
        estimatedDelivery: "Delivered on Dec 28, 2025",
        items: [
            { name: "Dell Inspiron 15 Laptop", qty: 1, price: 165000 },
            { name: "USB-C Hub 7-in-1", qty: 1, price: 12500 },
        ],
        statusHistory: [
            { status: "pending", time: "2:30 PM, Dec 26", message: "Order placed" },
            { status: "confirmed", time: "2:35 PM, Dec 26", message: "Order confirmed by vendor" },
            { status: "processing", time: "3:00 PM, Dec 26", message: "Preparing your order" },
            { status: "delivering", time: "4:15 PM, Dec 27", message: "Out for delivery" },
            { status: "delivered", time: "10:00 AM, Dec 28", message: "Delivered to Moremi Hall" },
        ],
    },
    {
        id: "2",
        orderNumber: "DBL-XYZ789",
        status: "delivering" as const,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        subtotal: 45000,
        deliveryFee: 500,
        total: 45500,
        vendorName: "Gadget World",
        vendorPhone: "08098765432",
        deliveryAddress: "Faculty of Engineering, UNILAG",
        estimatedDelivery: "Today, 5:00 PM - 6:00 PM",
        items: [
            { name: "iPhone 12 Case Bundle", qty: 1, price: 45000 },
        ],
        statusHistory: [
            { status: "pending", time: "10:30 AM", message: "Order placed" },
            { status: "confirmed", time: "10:45 AM", message: "Vendor confirmed" },
            { status: "processing", time: "11:00 AM", message: "Packed and ready" },
            { status: "delivering", time: "1:15 PM", message: "Rider picked up order" },
        ],
    },
    {
        id: "3",
        orderNumber: "DBL-DEF456",
        status: "pending" as const,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        subtotal: 12500,
        deliveryFee: 500,
        total: 13000,
        vendorName: "Techno Accessories",
        vendorPhone: "08123456789",
        deliveryAddress: "Jaja Hall, Room A12, UNILAG",
        estimatedDelivery: "Tomorrow, 10:00 AM",
        items: [
            { name: "USB-C Hub", qty: 1, price: 12500 },
        ],
        statusHistory: [
            { status: "pending", time: "Just now", message: "Order placed" },
        ],
    },
    {
        id: "4",
        orderNumber: "DBL-CAN999",
        status: "cancelled" as const,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        subtotal: 5500,
        deliveryFee: 0,
        total: 5500,
        vendorName: "Gadget World",
        vendorPhone: "08098765432",
        deliveryAddress: "Faculty of Arts, UNILAG",
        estimatedDelivery: "Cancelled",
        items: [
            { name: "Screen Protector", qty: 2, price: 2750 },
        ],
        statusHistory: [
            { status: "pending", time: "9:00 AM, Dec 20", message: "Order placed" },
            { status: "cancelled", time: "9:30 AM, Dec 20", message: "Order cancelled by user" },
        ],
    },
];

import { useMarketplaceStore } from "@/stores/useMarketplaceStore";
import { OrderStatus } from "@/lib/constants";

const STATUS_ORDER: OrderStatus[] = ["pending", "confirmed", "processing", "delivering", "delivered"];

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
    pending: { label: "Pending", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    confirmed: { label: "Confirmed", icon: CheckCircle, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    processing: { label: "Processing", icon: Package, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    ready: { label: "Ready", icon: Package, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" }, // Added ready
    delivering: { label: "On the way", icon: Truck, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    delivered: { label: "Delivered", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    cancelled: { label: "Cancelled", icon: Clock, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
    disputed: { label: "Disputed", icon: Shield, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" }, // Added disputed
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const orders = useMarketplaceStore((state) => state.orders);
    const order = orders.find((o) => o.id === id);

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold">Order not found</h2>
                    <Button onClick={() => router.push('/orders')} className="mt-4">
                        Back to Orders
                    </Button>
                </div>
            </div>
        );
    }

    const currentStatusIndex = STATUS_ORDER.indexOf(order.status as OrderStatus);
    // Use the status config for the current status or fallback to pending
    const statusInfo = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;

    const handleCopyOrderNumber = () => {
        navigator.clipboard.writeText(order.orderNumber);
    };

    return (
        <div className="min-h-screen bg-background pb-8">
            {/* Header */}
            <header className="h-14 flex items-center justify-between px-4 border-b bg-background sticky top-0 z-30">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="font-display text-lg font-bold">Order Details</h1>
                <div className="w-10" />
            </header>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="p-4 space-y-6"
            >
                {/* Order Number & Status */}
                <motion.div variants={fadeInUp}>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <button
                                    onClick={handleCopyOrderNumber}
                                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <span className="font-mono text-sm">
                                        #{order.orderNumber}
                                    </span>
                                    <Copy className="w-3 h-3" />
                                </button>
                                <Badge
                                    variant={
                                        order.status === "delivered"
                                            ? "success"
                                            : order.status === "cancelled"
                                                ? "destructive"
                                                : "default"
                                    }
                                >
                                    {statusInfo.label}
                                </Badge>
                            </div>

                            {/* Status Progress */}
                            <div className="relative pt-4">
                                <div className="absolute top-4 left-3 right-3 h-0.5 bg-muted" />
                                <div
                                    className="absolute top-4 left-3 h-0.5 bg-primary transition-all"
                                    style={{
                                        width: `${(currentStatusIndex / (statusOrder.length - 1)) * 100}%`,
                                    }}
                                />
                                <div className="relative flex justify-between">
                                    {STATUS_ORDER.map((status, i) => {
                                        const isActive = i <= currentStatusIndex;
                                        const isCurrent = status === order.status;
                                        const config = STATUS_CONFIG[status];
                                        return (
                                            <div key={status} className="flex flex-col items-center">
                                                <div
                                                    className={cn(
                                                        "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors",
                                                        isActive
                                                            ? "bg-primary border-primary text-primary-foreground"
                                                            : "bg-background border-muted text-muted-foreground"
                                                    )}
                                                >
                                                    {isActive && <CheckCircle className="w-3 h-3" />}
                                                </div>
                                                <span
                                                    className={cn(
                                                        "text-[10px] mt-1",
                                                        isCurrent
                                                            ? "font-medium"
                                                            : "text-muted-foreground"
                                                    )}
                                                >
                                                    {config.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Estimated Delivery */}
                {order.status !== "delivered" && order.status !== "cancelled" && (
                    <motion.div variants={fadeInUp}>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                            <Truck className="w-5 h-5 text-primary" />
                            <div>
                                <p className="font-medium text-sm">Estimated Delivery</p>
                                <p className="text-xs text-muted-foreground">
                                    {order.deliverySlot?.label ? `Arriving: ${order.deliverySlot.label}` : "Estimated Delivery"}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Items */}
                <motion.div variants={fadeInUp}>
                    <h2 className="font-display font-bold mb-3">
                        Items ({order.items.length})
                    </h2>
                    <Card>
                        <CardContent className="p-0 divide-y">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4">
                                    <div className="w-14 h-14 rounded-xl bg-muted flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground overflow-hidden relative">
                                        {/* Fallback image if needed, or use proper Image component */}
                                        {item.image ? (
                                            <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                                        ) : "No img"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm line-clamp-1">
                                            {item.productName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <span className="font-semibold text-sm">
                                        {formatNaira(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Delivery Address */}
                <motion.div variants={fadeInUp}>
                    <h2 className="font-display font-bold mb-3">Delivery Address</h2>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                <p className="text-sm">{order.deliveryAddress?.fullAddress || "No address"}</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Vendor Info */}
                <motion.div variants={fadeInUp}>
                    <h2 className="font-display font-bold mb-3">Vendor</h2>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                        <Store className="w-5 h-5 text-primary-foreground" />
                                    </div>
                                    <span className="font-medium text-sm">
                                        {order.vendorName}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon-sm">
                                        <MessageSquare className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon-sm">
                                        <Phone className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Payment Summary */}
                <motion.div variants={fadeInUp}>
                    <h2 className="font-display font-bold mb-3">Payment Summary</h2>
                    <Card>
                        <CardContent className="p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatNaira(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Delivery</span>
                                <span>{formatNaira(order.deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-base pt-2 border-t">
                                <span>Total</span>
                                <span>{formatNaira(order.total)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Status History */}
                <motion.div variants={fadeInUp}>
                    <h2 className="font-display font-bold mb-3">Activity</h2>
                    <Card>
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                {order.statusHistory?.map((entry, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="relative flex flex-col items-center">
                                            <div
                                                className={cn(
                                                    "w-3 h-3 rounded-full",
                                                    i === order.statusHistory.length - 1
                                                        ? "bg-primary"
                                                        : "bg-muted"
                                                )}
                                            />
                                            {i < order.statusHistory.length - 1 && (
                                                <div className="w-px flex-1 bg-muted" />
                                            )}
                                        </div>
                                        <div className="pb-4">
                                            <p className="text-sm font-medium">{entry.note || entry.status}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(entry.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {(!order.statusHistory || order.statusHistory.length === 0) && (
                                    <p className="text-sm text-muted-foreground">No history available.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}
