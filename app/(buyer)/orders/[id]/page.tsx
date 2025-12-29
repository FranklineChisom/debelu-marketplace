"use client";

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNaira, formatRelativeTime } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

// Mock order data
const mockOrder = {
    id: "1",
    orderNumber: "DBL-ABC123-XYZ",
    status: "delivering" as keyof typeof statusConfig,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    items: [
        { name: "Dell Inspiron 15 Laptop", qty: 1, price: 165000, image: null },
        { name: "USB-C Hub 7-in-1", qty: 1, price: 12500, image: null },
    ],
    subtotal: 177500,
    deliveryFee: 500,
    total: 178000,
    vendorName: "TechHub NG",
    vendorPhone: "08012345678",
    deliveryAddress: "Moremi Hall, Room 234, UNILAG",
    estimatedDelivery: "Today, 5:00 PM - 6:00 PM",
    statusHistory: [
        { status: "pending", time: "2:30 PM", message: "Order placed" },
        { status: "confirmed", time: "2:35 PM", message: "Order confirmed by vendor" },
        { status: "processing", time: "3:00 PM", message: "Preparing your order" },
        { status: "delivering", time: "4:15 PM", message: "Out for delivery" },
    ],
};

const statusConfig = {
    pending: { label: "Pending", icon: Clock, color: "warning" },
    confirmed: { label: "Confirmed", icon: CheckCircle, color: "info" },
    processing: { label: "Preparing", icon: Package, color: "info" },
    delivering: { label: "On the way", icon: Truck, color: "primary" },
    delivered: { label: "Delivered", icon: CheckCircle, color: "success" },
    cancelled: { label: "Cancelled", icon: Clock, color: "destructive" },
};

const statusOrder = ["pending", "confirmed", "processing", "delivering", "delivered"];

export default function OrderDetailPage() {
    const router = useRouter();
    const currentStatusIndex = statusOrder.indexOf(mockOrder.status);

    const handleCopyOrderNumber = () => {
        navigator.clipboard.writeText(mockOrder.orderNumber);
        // Could add toast here
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
                                        #{mockOrder.orderNumber}
                                    </span>
                                    <Copy className="w-3 h-3" />
                                </button>
                                <Badge
                                    variant={
                                        mockOrder.status === "delivered"
                                            ? "success"
                                            : mockOrder.status === "cancelled"
                                                ? "destructive"
                                                : "default"
                                    }
                                >
                                    {statusConfig[mockOrder.status].label}
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
                                    {statusOrder.map((status, i) => {
                                        const isActive = i <= currentStatusIndex;
                                        const isCurrent = status === mockOrder.status;
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
                                                    {statusConfig[status as keyof typeof statusConfig].label}
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
                {mockOrder.status !== "delivered" && mockOrder.status !== "cancelled" && (
                    <motion.div variants={fadeInUp}>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                            <Truck className="w-5 h-5 text-primary" />
                            <div>
                                <p className="font-medium text-sm">Estimated Delivery</p>
                                <p className="text-xs text-muted-foreground">
                                    {mockOrder.estimatedDelivery}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Items */}
                <motion.div variants={fadeInUp}>
                    <h2 className="font-display font-bold mb-3">
                        Items ({mockOrder.items.length})
                    </h2>
                    <Card>
                        <CardContent className="p-0 divide-y">
                            {mockOrder.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4">
                                    <div className="w-14 h-14 rounded-xl bg-muted flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                                        No img
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm line-clamp-1">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Qty: {item.qty}
                                        </p>
                                    </div>
                                    <span className="font-semibold text-sm">
                                        {formatNaira(item.price * item.qty)}
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
                                <p className="text-sm">{mockOrder.deliveryAddress}</p>
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
                                        {mockOrder.vendorName}
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
                                <span>{formatNaira(mockOrder.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Delivery</span>
                                <span>{formatNaira(mockOrder.deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-base pt-2 border-t">
                                <span>Total</span>
                                <span>{formatNaira(mockOrder.total)}</span>
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
                                {mockOrder.statusHistory.map((entry, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="relative flex flex-col items-center">
                                            <div
                                                className={cn(
                                                    "w-3 h-3 rounded-full",
                                                    i === mockOrder.statusHistory.length - 1
                                                        ? "bg-primary"
                                                        : "bg-muted"
                                                )}
                                            />
                                            {i < mockOrder.statusHistory.length - 1 && (
                                                <div className="w-px flex-1 bg-muted" />
                                            )}
                                        </div>
                                        <div className="pb-4">
                                            <p className="text-sm font-medium">{entry.message}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {entry.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}
