"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    Package,
    ShoppingCart,
    DollarSign,
    Star,
    ArrowRight,
    Eye,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNaira, formatRelativeTime } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { ORDER_STATUSES } from "@/lib/constants";

// Mock data
const stats = [
    {
        title: "Today's Revenue",
        value: 125000,
        change: 12,
        trend: "up" as const,
        icon: DollarSign,
        format: "currency",
    },
    {
        title: "Total Orders",
        value: 24,
        change: 8,
        trend: "up" as const,
        icon: ShoppingCart,
        format: "number",
    },
    {
        title: "Products",
        value: 45,
        change: 2,
        trend: "up" as const,
        icon: Package,
        format: "number",
    },
    {
        title: "Rating",
        value: 4.8,
        change: 0.1,
        trend: "up" as const,
        icon: Star,
        format: "rating",
    },
];

const recentOrders = [
    {
        id: "1",
        orderNumber: "DBL-XYZ789",
        customerName: "Chioma A.",
        total: 45000,
        status: "pending" as const,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        itemCount: 2,
    },
    {
        id: "2",
        orderNumber: "DBL-ABC123",
        customerName: "Emeka O.",
        total: 18500,
        status: "confirmed" as const,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        itemCount: 1,
    },
    {
        id: "3",
        orderNumber: "DBL-DEF456",
        customerName: "Blessing N.",
        total: 67000,
        status: "delivered" as const,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        itemCount: 3,
    },
];

const topProducts = [
    {
        id: "1",
        name: "Dell Inspiron 15 Laptop",
        sales: 12,
        revenue: 1980000,
        views: 450,
    },
    {
        id: "2",
        name: "iPhone 12 Case Bundle",
        sales: 28,
        revenue: 252000,
        views: 890,
    },
    {
        id: "3",
        name: "USB-C Hub 7-in-1",
        sales: 45,
        revenue: 562500,
        views: 1200,
    },
];

export default function VendorDashboard() {
    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
        >
            {/* Welcome */}
            <motion.div variants={fadeInUp}>
                <h2 className="text-2xl font-bold font-display tracking-tight">
                    Welcome back, TechHub! 👋
                </h2>
                <p className="text-muted-foreground mt-1">
                    Here's what's happening with your store today.
                </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={fadeInUp}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {stats.map((stat) => (
                    <Card key={stat.title} className="relative overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div
                                    className={`flex items-center gap-1 text-xs font-medium ${stat.trend === "up" ? "text-success" : "text-destructive"
                                        }`}
                                >
                                    {stat.trend === "up" ? (
                                        <TrendingUp className="w-3 h-3" />
                                    ) : (
                                        <TrendingDown className="w-3 h-3" />
                                    )}
                                    {stat.change}%
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold font-display">
                                    {stat.format === "currency"
                                        ? formatNaira(stat.value)
                                        : stat.format === "rating"
                                            ? stat.value.toFixed(1)
                                            : stat.value}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.title}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <motion.div variants={fadeInUp}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base font-semibold">
                                Recent Orders
                            </CardTitle>
                            <Link href="/vendor/orders">
                                <Button variant="ghost" size="sm">
                                    View All
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentOrders.map((order) => {
                                const status = ORDER_STATUSES[order.status];
                                return (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-3 rounded-xl border hover:border-primary/30 transition-colors cursor-pointer"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    #{order.orderNumber}
                                                </span>
                                                <Badge
                                                    variant={
                                                        order.status === "pending"
                                                            ? "warning"
                                                            : order.status === "delivered"
                                                                ? "success"
                                                                : "info"
                                                    }
                                                    className="text-[10px]"
                                                >
                                                    {status.label}
                                                </Badge>
                                            </div>
                                            <p className="font-medium text-sm mt-1">
                                                {order.customerName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {order.itemCount} items •{" "}
                                                {formatRelativeTime(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-semibold text-sm">
                                                {formatNaira(order.total)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            {recentOrders.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No orders yet</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Top Products */}
                <motion.div variants={fadeInUp}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base font-semibold">
                                Top Products
                            </CardTitle>
                            <Link href="/vendor/products">
                                <Button variant="ghost" size="sm">
                                    View All
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {topProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="flex items-center gap-3 p-3 rounded-xl border hover:border-primary/30 transition-colors cursor-pointer"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold text-sm text-muted-foreground">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">
                                            {product.name}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                            <span>{product.sales} sales</span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {product.views}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-semibold text-sm">
                                            {formatNaira(product.revenue)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div variants={fadeInUp}>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-3">
                            <Link href="/vendor/products/new">
                                <Button>
                                    <Package className="w-4 h-4 mr-2" />
                                    Add Product
                                </Button>
                            </Link>
                            <Link href="/vendor/orders">
                                <Button variant="outline">
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    View Orders
                                </Button>
                            </Link>
                            <Link href="/vendor/analytics">
                                <Button variant="outline">
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    Analytics
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
