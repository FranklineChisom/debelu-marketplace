"use client";

import { motion } from "framer-motion";
import {
    ArrowLeft,
    Phone,
    MessageSquare,
    MapPin,
    Package,
    CheckCircle,
    Truck,
    Store,
    Copy,
    Clock,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useChatStore } from "@/stores";

// Mock orders data - In a real app, fetch using orderId
const mockOrders = [
    {
        id: "ord_123",
        orderNumber: "DBL-XYZ789",
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        subtotal: 332500,
        deliveryFee: 500,
        total: 333000,
        vendorName: "Gadget Hub UNILAG",
        vendorPhone: "08012345678",
        deliveryAddress: "Moremi Hall, Room 234",
        estimatedDelivery: "Tomorrow, 2:00 PM",
        items: [
            { name: "Dell Inspiron 15", qty: 1, price: 320000 },
            { name: "USB-C Hub", qty: 1, price: 12500 },
        ],
        statusHistory: [
            { status: "pending", time: "Just now", message: "Order placed" },
        ],
    },
];

const statusConfig = {
    pending: { label: "Pending", icon: Clock, color: "warning" },
    confirmed: { label: "Confirmed", icon: CheckCircle, color: "info" },
    processing: { label: "Preparing", icon: Package, color: "info" },
    delivering: { label: "On the way", icon: Truck, color: "primary" },
    delivered: { label: "Delivered", icon: CheckCircle, color: "success" },
    cancelled: { label: "Cancelled", icon: Clock, color: "destructive" },
};

const statusOrder = ["pending", "confirmed", "processing", "delivering", "delivered"];

export function OrderPanel() {
    const activePanelData = useChatStore((state) => state.activePanelData);
    const closePanel = useChatStore((state) => state.closePanel);

    // In a real app, use activePanelData.orderId to fetch order
    const order = mockOrders[0];
    const currentStatusIndex = statusOrder.indexOf(order.status);

    const handleCopyOrderNumber = () => {
        navigator.clipboard.writeText(order.orderNumber);
    };

    return (
        <div className="flex flex-col h-full bg-background relative z-20">
            {/* Header */}
            <header className="h-14 flex items-center justify-between px-4 border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => closePanel()} className="h-8 w-8 -ml-2">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="font-display font-semibold text-lg">Order Details</h1>
                </div>
                <Button variant="ghost" size="icon" onClick={() => closePanel()} className="h-8 w-8">
                    <X className="w-4 h-4" />
                </Button>
            </header>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4 pb-20"
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
                                    <span className="font-mono text-xs font-medium">#{order.orderNumber}</span>
                                    <Copy className="w-3 h-3" />
                                </button>
                                <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-50">
                                    {statusConfig.pending.label}
                                </Badge>
                            </div>

                            {/* Status Progress */}
                            <div className="relative pt-4 px-1">
                                <div className="absolute top-4 left-3 right-3 h-0.5 bg-muted" />
                                <div
                                    className="absolute top-4 left-3 h-0.5 bg-primary transition-all"
                                    style={{
                                        width: `${(currentStatusIndex / (statusOrder.length - 1)) * 100}%`,
                                    }}
                                />
                                <div className="relative flex justify-between">
                                    {statusOrder.slice(0, 3).map((status, i) => { // Show fewer steps for sidebar width
                                        const isActive = i <= currentStatusIndex;
                                        return (
                                            <div key={status} className="flex flex-col items-center">
                                                <div
                                                    className={cn(
                                                        "w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors",
                                                        isActive
                                                            ? "bg-primary border-primary text-primary-foreground"
                                                            : "bg-background border-muted text-muted-foreground"
                                                    )}
                                                >
                                                    {isActive && <CheckCircle className="w-2.5 h-2.5" />}
                                                </div>
                                                <span className="text-[10px] mt-1 text-muted-foreground">
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
                <motion.div variants={fadeInUp}>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                        <Truck className="w-4 h-4 text-primary" />
                        <div className="flex-1">
                            <p className="font-medium text-sm">Estimated Delivery</p>
                            <p className="text-xs text-muted-foreground">{order.estimatedDelivery}</p>
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => useChatStore.getState().openPanel('tracking')}
                        >
                            <MapPin className="w-3 h-3 mr-1" />
                            Map
                        </Button>
                    </div>
                </motion.div>

                {/* Items */}
                <motion.div variants={fadeInUp}>
                    <h3 className="text-sm font-semibold mb-2">Items</h3>
                    <Card>
                        <CardContent className="p-0 divide-y">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3">
                                    <div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center text-[10px] text-muted-foreground">
                                        No img
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                                    </div>
                                    <span className="font-medium text-sm">{formatNaira(item.price * item.qty)}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Payment Summary */}
                <motion.div variants={fadeInUp}>
                    <h3 className="text-sm font-semibold mb-2">Summary</h3>
                    <Card>
                        <CardContent className="p-3 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatNaira(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Delivery</span>
                                <span>{formatNaira(order.deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-sm pt-2 border-t">
                                <span>Total</span>
                                <span>{formatNaira(order.total)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}
