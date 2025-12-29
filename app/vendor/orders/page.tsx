"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Clock,
    CheckCircle2,
    Truck,
    Package,
    XCircle,
    Search,
    Filter,
    MoreHorizontal,
    MessageSquare,
    Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatNaira, formatRelativeTime } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { ORDER_STATUSES, OrderStatus } from "@/lib/constants";

// Mock orders
const mockOrders = [
    {
        id: "1",
        orderNumber: "DBL-XYZ789",
        customerName: "Chioma Adebayo",
        customerPhone: "08012345678",
        items: [
            { name: "Dell Inspiron 15", qty: 1, price: 165000 },
            { name: "USB-C Hub", qty: 1, price: 12500 },
        ],
        total: 177500,
        status: "pending" as OrderStatus,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        deliveryAddress: "Moremi Hall, Room 234, UNILAG",
    },
    {
        id: "2",
        orderNumber: "DBL-ABC123",
        customerName: "Emeka Okonkwo",
        customerPhone: "08198765432",
        items: [{ name: "iPhone 12 Case", qty: 2, price: 9000 }],
        total: 18000,
        status: "confirmed" as OrderStatus,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        deliveryAddress: "Jaja Hall, Block A, UNILAG",
    },
    {
        id: "3",
        orderNumber: "DBL-DEF456",
        customerName: "Blessing Nwosu",
        customerPhone: "07012345678",
        items: [
            { name: "Wireless Earbuds", qty: 1, price: 25000 },
            { name: "Phone Stand", qty: 2, price: 3500 },
        ],
        total: 32000,
        status: "processing" as OrderStatus,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        deliveryAddress: "Eni Njoku Hall, UNILAG",
    },
    {
        id: "4",
        orderNumber: "DBL-GHI789",
        customerName: "Tunde Bakare",
        customerPhone: "09087654321",
        items: [{ name: "MacBook Charger", qty: 1, price: 35000 }],
        total: 35000,
        status: "delivering" as OrderStatus,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        deliveryAddress: "Faculty of Engineering, UNILAG",
    },
    {
        id: "5",
        orderNumber: "DBL-JKL012",
        customerName: "Amina Aliyu",
        customerPhone: "08156789012",
        items: [{ name: "Laptop Bag", qty: 1, price: 15000 }],
        total: 15000,
        status: "delivered" as OrderStatus,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        deliveryAddress: "Amina Hall, UNILAG",
    },
];

const statusOrder: OrderStatus[] = [
    "pending",
    "confirmed",
    "processing",
    "delivering",
    "delivered",
];

export default function OrdersPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

    const filteredOrders = mockOrders.filter((order) => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
            order.customerName.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Group orders by status for kanban view
    const ordersByStatus = statusOrder.reduce((acc, status) => {
        acc[status] = filteredOrders.filter((o) => o.status === status);
        return acc;
    }, {} as Record<OrderStatus, typeof mockOrders>);

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={fadeInUp}>
                <h2 className="text-2xl font-bold font-display tracking-tight">
                    Orders
                </h2>
                <p className="text-muted-foreground mt-1">
                    Manage and fulfill customer orders
                </p>
            </motion.div>

            {/* Filters */}
            <motion.div variants={fadeInUp}>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by order ID or customer..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                                <Button
                                    variant={statusFilter === "all" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setStatusFilter("all")}
                                >
                                    All
                                </Button>
                                {statusOrder.slice(0, 4).map((status) => (
                                    <Button
                                        key={status}
                                        variant={statusFilter === status ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setStatusFilter(status)}
                                    >
                                        {ORDER_STATUSES[status].label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Kanban Board (Desktop) */}
            <motion.div
                variants={fadeInUp}
                className="hidden lg:grid grid-cols-5 gap-4"
            >
                {statusOrder.slice(0, 5).map((status) => (
                    <div key={status} className="space-y-3">
                        <div className="flex items-center gap-2 px-2">
                            <Badge
                                variant={
                                    status === "pending"
                                        ? "warning"
                                        : status === "delivered"
                                            ? "success"
                                            : "secondary"
                                }
                                className="text-xs"
                            >
                                {ORDER_STATUSES[status].label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                ({ordersByStatus[status]?.length || 0})
                            </span>
                        </div>
                        <div className="space-y-3 min-h-[200px]">
                            {ordersByStatus[status]?.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* List View (Mobile) */}
            <motion.div variants={fadeInUp} className="lg:hidden space-y-3">
                {filteredOrders.map((order) => (
                    <OrderCard key={order.id} order={order} expanded />
                ))}

                {filteredOrders.length === 0 && (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No orders found</p>
                        </CardContent>
                    </Card>
                )}
            </motion.div>
        </motion.div>
    );
}

function OrderCard({
    order,
    expanded = false,
}: {
    order: (typeof mockOrders)[0];
    expanded?: boolean;
}) {
    const status = ORDER_STATUSES[order.status];

    return (
        <Card
            className={cn(
                "cursor-pointer hover:border-primary/30 transition-colors",
                expanded && "p-0"
            )}
        >
            <CardContent className={cn("p-3", expanded && "p-4")}>
                <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-muted-foreground">
                            #{order.orderNumber}
                        </span>
                        {!expanded && (
                            <Badge
                                variant={
                                    order.status === "pending"
                                        ? "warning"
                                        : order.status === "delivered"
                                            ? "success"
                                            : "secondary"
                                }
                                className="text-[10px]"
                            >
                                {status.label}
                            </Badge>
                        )}
                    </div>

                    {/* Customer */}
                    <div>
                        <p className="font-medium text-sm">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                            {formatRelativeTime(order.createdAt)}
                        </p>
                    </div>

                    {/* Items (expanded only) */}
                    {expanded && (
                        <div className="space-y-1">
                            {order.items.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between text-xs text-muted-foreground"
                                >
                                    <span>
                                        {item.qty}x {item.name}
                                    </span>
                                    <span>{formatNaira(item.price * item.qty)}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Total */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                            {order.items.reduce((sum, i) => sum + i.qty, 0)} items
                        </span>
                        <span className="font-semibold text-sm">
                            {formatNaira(order.total)}
                        </span>
                    </div>

                    {/* Actions (expanded only) */}
                    {expanded && (
                        <div className="flex gap-2 pt-2 border-t">
                            <Button size="sm" className="flex-1">
                                {order.status === "pending" ? "Confirm" : "Update Status"}
                            </Button>
                            <Button variant="outline" size="icon-sm">
                                <MessageSquare className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon-sm">
                                <Phone className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
