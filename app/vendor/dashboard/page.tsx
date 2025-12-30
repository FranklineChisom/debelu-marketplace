"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    DollarSign,
    ShoppingCart,
    Package,
    Star,
    TrendingUp,
    TrendingDown,
    ChevronRight,
    Plus,
    Eye,
    Megaphone,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

// Mock data
const stats = [
    {
        label: "Revenue",
        value: 485000,
        change: 12.5,
        icon: DollarSign,
        format: "currency",
        color: "text-success",
        bgColor: "bg-success/10",
        trend: "up",
    },
    {
        label: "Orders",
        value: 28,
        change: -5.3,
        icon: ShoppingCart,
        format: "number",
        color: "text-primary",
        bgColor: "bg-primary/10",
        trend: "down",
    },
    {
        label: "Products",
        value: 45,
        change: 8.2,
        icon: Package,
        format: "number",
        color: "text-info",
        bgColor: "bg-info/10",
        trend: "up",
    },
    {
        label: "Rating",
        value: 4.8,
        change: 0.2,
        icon: Star,
        format: "rating",
        color: "text-warning",
        bgColor: "bg-warning/10",
        trend: "up",
    },
];

const recentOrders = [
    { id: "ORD-2024-001", customer: "Chioma A.", amount: 25000, status: "pending", time: "2 mins ago" },
    { id: "ORD-2024-002", customer: "Tunde O.", amount: 18500, status: "processing", time: "15 mins ago" },
    { id: "ORD-2024-003", customer: "Ngozi E.", amount: 42000, status: "delivered", time: "1 hour ago" },
    { id: "ORD-2024-004", customer: "Kunle B.", amount: 12000, status: "delivered", time: "3 hours ago" },
];

const topProducts = [
    { id: "1", name: "Dell Inspiron 15 Laptop", sales: 12, revenue: 1980000 },
    { id: "2", name: "USB-C Fast Charger", sales: 45, revenue: 202500 },
    { id: "3", name: "Wireless Mouse Pro", sales: 32, revenue: 160000 },
];

const getStatusConfig = (status: string) => {
    switch (status) {
        case "pending":
            return { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Pending" };
        case "processing":
            return { icon: Package, color: "text-info", bg: "bg-info/10", label: "Processing" };
        case "delivered":
            return { icon: CheckCircle, color: "text-success", bg: "bg-success/10", label: "Delivered" };
        default:
            return { icon: AlertCircle, color: "text-muted-foreground", bg: "bg-muted", label: status };
    }
};

export default function VendorDashboardPage() {
    return (
        <div className="flex-1 overflow-y-auto scrollbar-thin pb-6">
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="p-4 md:p-6 space-y-6"
            >
                {/* Welcome Header */}
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="font-display text-2xl md:text-3xl font-bold">
                            Welcome back, <span className="text-gradient">TechHub NG</span>
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Here's what's happening with your store today
                        </p>
                    </div>
                    <Button variant="glow" className="sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card variant="premium" className="h-full">
                                <CardContent className="p-4 md:p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", stat.bgColor)}>
                                            <stat.icon className={cn("w-5 h-5", stat.color)} />
                                        </div>
                                        <div className={cn(
                                            "flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5",
                                            stat.trend === "up"
                                                ? "text-success bg-success/10"
                                                : "text-destructive bg-destructive/10"
                                        )}>
                                            {stat.trend === "up" ? (
                                                <TrendingUp className="w-3 h-3" />
                                            ) : (
                                                <TrendingDown className="w-3 h-3" />
                                            )}
                                            {Math.abs(stat.change)}%
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-2xl md:text-3xl font-bold">
                                            {stat.format === "currency"
                                                ? formatNaira(stat.value)
                                                : stat.format === "rating"
                                                    ? stat.value.toFixed(1)
                                                    : stat.value}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {stat.label}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={fadeInUp}>
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
                        <Button variant="outline" className="flex-shrink-0 gap-2 h-11">
                            <Eye className="w-4 h-4" />
                            View Store
                        </Button>
                        <Button variant="outline" className="flex-shrink-0 gap-2 h-11">
                            <Megaphone className="w-4 h-4" />
                            Promotions
                        </Button>
                        <Link href="/vendor/analytics">
                            <Button variant="outline" className="flex-shrink-0 gap-2 h-11">
                                <TrendingUp className="w-4 h-4" />
                                Analytics
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <motion.div variants={fadeInUp}>
                        <Card variant="premium">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-display">Recent Orders</CardTitle>
                                    <Link
                                        href="/vendor/orders"
                                        className="text-sm text-primary flex items-center gap-1 hover:gap-2 transition-all font-medium"
                                    >
                                        View All <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {recentOrders.map((order) => {
                                        const statusConfig = getStatusConfig(order.status);
                                        return (
                                            <Link
                                                key={order.id}
                                                href={`/vendor/orders/${order.id}`}
                                                className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", statusConfig.bg)}>
                                                        <statusConfig.icon className={cn("w-5 h-5", statusConfig.color)} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm">{order.id}</p>
                                                        <p className="text-xs text-muted-foreground">{order.customer}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">{formatNaira(order.amount)}</p>
                                                    <p className="text-xs text-muted-foreground">{order.time}</p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Top Products */}
                    <motion.div variants={fadeInUp}>
                        <Card variant="premium">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-display">Top Products</CardTitle>
                                    <Link
                                        href="/vendor/products"
                                        className="text-sm text-primary flex items-center gap-1 hover:gap-2 transition-all font-medium"
                                    >
                                        View All <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {topProducts.map((product, index) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between p-4"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center font-bold text-primary">
                                                    #{index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm line-clamp-1">{product.name}</p>
                                                    <p className="text-xs text-muted-foreground">{product.sales} sold</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-success">{formatNaira(product.revenue)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Performance Banner */}
                <motion.div variants={fadeInUp}>
                    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                        <CardContent className="p-6 relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                        <span className="font-semibold text-primary">Performance Insight</span>
                                    </div>
                                    <h3 className="font-display text-xl font-bold mb-1">
                                        Your store is doing great! 🎉
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Revenue is up 12.5% compared to last week. Keep up the good work!
                                    </p>
                                </div>
                                <Link href="/vendor/analytics">
                                    <Button variant="outline" className="gap-2">
                                        View Analytics
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}
