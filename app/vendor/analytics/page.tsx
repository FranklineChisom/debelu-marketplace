"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Eye,
    Package,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

// Mock analytics data
const periodStats = {
    revenue: { value: 2450000, change: 18 },
    orders: { value: 156, change: 12 },
    customers: { value: 89, change: 24 },
    views: { value: 4520, change: -3 },
};

const topCategories = [
    { name: "Electronics", revenue: 1850000, percentage: 75 },
    { name: "Accessories", revenue: 380000, percentage: 16 },
    { name: "Fashion", revenue: 220000, percentage: 9 },
];

const recentActivity = [
    { type: "order", message: "New order #DBL-XYZ789 received", time: "5 mins ago" },
    { type: "review", message: "5-star review on Dell Laptop", time: "1 hour ago" },
    { type: "stock", message: "USB-C Hub running low (5 left)", time: "2 hours ago" },
    { type: "order", message: "Order #DBL-ABC123 delivered", time: "3 hours ago" },
];

export default function AnalyticsPage() {
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
                    Analytics
                </h2>
                <p className="text-muted-foreground mt-1">
                    Track your store performance
                </p>
            </motion.div>

            {/* Period Selector */}
            <motion.div variants={fadeInUp}>
                <div className="flex gap-2">
                    {["Today", "7 Days", "30 Days", "All Time"].map((period, i) => (
                        <Badge
                            key={period}
                            variant={i === 2 ? "default" : "secondary"}
                            className="cursor-pointer"
                        >
                            {period}
                        </Badge>
                    ))}
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={fadeInUp}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <StatCard
                    title="Revenue"
                    value={formatNaira(periodStats.revenue.value)}
                    change={periodStats.revenue.change}
                    icon={DollarSign}
                />
                <StatCard
                    title="Orders"
                    value={periodStats.orders.value.toString()}
                    change={periodStats.orders.change}
                    icon={ShoppingCart}
                />
                <StatCard
                    title="Customers"
                    value={periodStats.customers.value.toString()}
                    change={periodStats.customers.change}
                    icon={Users}
                />
                <StatCard
                    title="Product Views"
                    value={periodStats.views.value.toLocaleString()}
                    change={periodStats.views.change}
                    icon={Eye}
                />
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Revenue Chart Placeholder */}
                <motion.div variants={fadeInUp}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Revenue Over Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-48 flex items-center justify-center bg-muted/50 rounded-xl">
                                <div className="text-center text-muted-foreground">
                                    <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Chart coming soon</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Top Categories */}
                <motion.div variants={fadeInUp}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Top Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {topCategories.map((category) => (
                                <div key={category.name} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{category.name}</span>
                                        <span className="text-muted-foreground">
                                            {formatNaira(category.revenue)}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all"
                                            style={{ width: `${category.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div variants={fadeInUp}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentActivity.map((activity, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                            >
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${activity.type === "order"
                                            ? "bg-primary/10"
                                            : activity.type === "review"
                                                ? "bg-warning/10"
                                                : "bg-destructive/10"
                                        }`}
                                >
                                    {activity.type === "order" ? (
                                        <ShoppingCart className="w-4 h-4" />
                                    ) : activity.type === "review" ? (
                                        <TrendingUp className="w-4 h-4" />
                                    ) : (
                                        <Package className="w-4 h-4" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm">{activity.message}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}

function StatCard({
    title,
    value,
    change,
    icon: Icon,
}: {
    title: string;
    value: string;
    change: number;
    icon: React.ComponentType<{ className?: string }>;
}) {
    const isPositive = change >= 0;

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                    </div>
                    <div
                        className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-success" : "text-destructive"
                            }`}
                    >
                        {isPositive ? (
                            <TrendingUp className="w-3 h-3" />
                        ) : (
                            <TrendingDown className="w-3 h-3" />
                        )}
                        {Math.abs(change)}%
                    </div>
                </div>
                <p className="text-2xl font-bold font-display">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{title}</p>
            </CardContent>
        </Card>
    );
}
