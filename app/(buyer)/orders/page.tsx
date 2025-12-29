"use client";

import { motion } from "framer-motion";
import { Package, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatNaira, formatRelativeTime } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { ORDER_STATUSES } from "@/lib/constants";

// Mock orders data
const mockOrders = [
    {
        id: "1",
        orderNumber: "DBL-ABC123",
        status: "delivered" as const,
        total: 177500,
        itemCount: 2,
        firstItemName: "Dell Inspiron 15",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "2",
        orderNumber: "DBL-XYZ789",
        status: "delivering" as const,
        total: 45000,
        itemCount: 1,
        firstItemName: "iPhone 12 Case Bundle",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "3",
        orderNumber: "DBL-DEF456",
        status: "pending" as const,
        total: 12500,
        itemCount: 3,
        firstItemName: "USB-C Hub",
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
];

export default function OrdersPage() {
    const hasOrders = mockOrders.length > 0;

    return (
        <div className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="max-w-2xl mx-auto p-4">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-4"
                >
                    {/* Header */}
                    <motion.div variants={fadeInUp} className="mb-6">
                        <h1 className="font-display text-2xl font-bold">Your Orders</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Track and manage your purchases
                        </p>
                    </motion.div>

                    {!hasOrders ? (
                        // Empty State
                        <motion.div variants={fadeInUp} className="text-center py-16">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                                <Package className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h2 className="font-display text-lg font-semibold mb-2">
                                No orders yet
                            </h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                Start shopping to see your orders here
                            </p>
                            <Link
                                href="/chat"
                                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                            >
                                Start Shopping
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </motion.div>
                    ) : (
                        // Orders List
                        <div className="space-y-3">
                            {mockOrders.map((order) => {
                                const status = ORDER_STATUSES[order.status];
                                return (
                                    <motion.div
                                        key={order.id}
                                        variants={fadeInUp}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <Link
                                            href={`/orders/${order.id}`}
                                            className="block bg-card border rounded-2xl p-4 hover:border-primary/30 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-mono text-xs text-muted-foreground">
                                                            #{order.orderNumber}
                                                        </span>
                                                        <Badge
                                                            variant={
                                                                order.status === "delivered"
                                                                    ? "success"
                                                                    : order.status === "pending"
                                                                        ? "warning"
                                                                        : "info"
                                                            }
                                                            className="text-[10px]"
                                                        >
                                                            {status.label}
                                                        </Badge>
                                                    </div>
                                                    <h3 className="font-medium text-sm truncate">
                                                        {order.firstItemName}
                                                        {order.itemCount > 1 && (
                                                            <span className="text-muted-foreground">
                                                                {" "}
                                                                +{order.itemCount - 1} more
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {formatRelativeTime(order.createdAt)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-semibold text-sm">
                                                        {formatNaira(order.total)}
                                                    </span>
                                                    <ChevronRight className="w-4 h-4 text-muted-foreground mt-2 ml-auto" />
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
