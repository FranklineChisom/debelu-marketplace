"use client";

import { motion } from "framer-motion";
import { Package, ChevronRight, Clock, CheckCircle, Truck, AlertCircle, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatNaira, formatRelativeTime } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { ORDER_STATUSES } from "@/lib/constants";

// Mock orders data with more detail for the timeline
const mockOrders = [
    {
        id: "1",
        orderNumber: "DBL-ABC123",
        status: "delivered" as const,
        total: 177500,
        itemCount: 2,
        firstItemName: "Dell Inspiron 15",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        timeline: [
            { status: "placed", date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
            { status: "processing", date: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString() },
            { status: "shipped", date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
            { status: "delivered", date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        ]
    },
    {
        id: "2",
        orderNumber: "DBL-XYZ789",
        status: "delivering" as const,
        total: 45000,
        itemCount: 1,
        firstItemName: "iPhone 12 Case Bundle",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        timeline: [
            { status: "placed", date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
            { status: "processing", date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
            { status: "shipped", date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() }
        ]
    },
    {
        id: "3",
        orderNumber: "DBL-DEF456",
        status: "pending" as const,
        total: 12500,
        itemCount: 3,
        firstItemName: "USB-C Hub",
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        timeline: [
            { status: "placed", date: new Date(Date.now() - 30 * 60 * 1000).toISOString() }
        ]
    },
];

const getStatusIcon = (status: string) => {
    switch (status) {
        case "delivered": return <CheckCircle className="w-4 h-4 text-emerald-500" />;
        case "delivering": return <Truck className="w-4 h-4 text-blue-500" />;
        case "processing": return <Package className="w-4 h-4 text-orange-500" />;
        case "pending": return <Clock className="w-4 h-4 text-yellow-500" />;
        case "cancelled": return <AlertCircle className="w-4 h-4 text-red-500" />;
        default: return <Clock className="w-4 h-4" />;
    }
}

export default function OrdersPage() {
    const hasOrders = mockOrders.length > 0;

    return (
        <div className="flex-1 overflow-y-auto scrollbar-thin bg-background/50">
            <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-8">

                {/* Header Section */}
                <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-black tracking-tight text-foreground">
                            Your Orders
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Track the status of your recent purchases
                        </p>
                    </div>
                    {/* Search/Filter (Visual Only) */}
                    <div className="flex items-center gap-2">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search order ID..."
                                className="pl-9 w-full md:w-64 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all rounded-xl"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="rounded-xl border-border/50">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-4"
                >
                    {!hasOrders ? (
                        // Premium Empty State
                        <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-tr from-muted to-muted/30 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
                                <Package className="w-10 h-10 text-muted-foreground group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <h2 className="font-display text-xl font-bold mb-2">No orders placed yet</h2>
                            <p className="text-muted-foreground mb-6 max-w-sm">
                                Looks like you haven't bought anything yet. Explore our collections to find something you'll love.
                            </p>
                            <Link href="/explore">
                                <Button size="lg" className="rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40">
                                    Start Exploring
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        // Premium Orders List
                        <div className="grid gap-4">
                            {mockOrders.map((order) => {
                                const status = ORDER_STATUSES[order.status];
                                const isDelivered = order.status === "delivered";

                                return (
                                    <motion.div
                                        key={order.id}
                                        variants={fadeInUp}
                                        whileHover={{ y: -2 }}
                                        className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
                                    >
                                        {/* Gradient Hover Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                        <Link href={`/orders/${order.id}`} className="relative z-10 block space-y-6">

                                            {/* Top Row: Order ID & Status */}
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 rounded-2xl bg-background border border-border/50 shadow-sm">
                                                        <Package className="w-6 h-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-bold text-lg tracking-tight">#{order.orderNumber}</h3>
                                                            <Badge
                                                                className={`rounded-full px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider border-0 ${isDelivered ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                                                                    }`}
                                                            >
                                                                {status.label}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                                                            Placed {formatRelativeTime(order.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground font-medium mb-1">Total Amount</p>
                                                    <p className="text-xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                                        {formatNaira(order.total)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Middle Row: Items Preview & Timeline Visual */}
                                            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between py-4 border-t border-border/50 border-b border-border/50 border-dashed">
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {order.firstItemName}
                                                    </p>
                                                    {order.itemCount > 1 && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            + {order.itemCount - 1} other items
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Mini Timeline (Visual Indicator) */}
                                                <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-full border border-border/50">
                                                    {getStatusIcon(order.status)}
                                                    <div className="h-1 w-12 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${isDelivered ? 'bg-emerald-500 w-full' : 'bg-blue-500 w-2/3 animate-pulse'}`}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-muted-foreground uppercase">
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Bottom Row: Actions */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex -space-x-2">
                                                    {/* Avatar pile for items if we had images */}
                                                    <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold">
                                                        {order.firstItemName[0]}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                                                    View Details
                                                    <ChevronRight className="w-4 h-4" />
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
