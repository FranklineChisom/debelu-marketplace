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
    ArrowUpRight,
    Plus,
    Eye,
    Clock,
    CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

// Mock data
const stats = [
    { label: "Revenue", value: 485000, change: 12.5, format: "currency", trend: "up" },
    { label: "Orders", value: 28, change: -5.3, format: "number", trend: "down" },
    { label: "Products", value: 45, change: 8.2, format: "number", trend: "up" },
    { label: "Rating", value: 4.8, change: 0.2, format: "rating", trend: "up" },
];

const recentOrders = [
    { id: "ORD-001", customer: "Chioma A.", amount: 25000, status: "pending", time: "2 mins ago" },
    { id: "ORD-002", customer: "Tunde O.", amount: 18500, status: "processing", time: "15 mins ago" },
    { id: "ORD-003", customer: "Ngozi E.", amount: 42000, status: "delivered", time: "1 hour ago" },
    { id: "ORD-004", customer: "Kunle B.", amount: 12000, status: "delivered", time: "3 hours ago" },
];

const topProducts = [
    { id: "1", name: "Dell Inspiron 15 Laptop", sales: 12, revenue: 1980000 },
    { id: "2", name: "USB-C Fast Charger", sales: 45, revenue: 202500 },
    { id: "3", name: "Wireless Mouse Pro", sales: 32, revenue: 160000 },
];

export default function VendorDashboardPage() {
    return (
        <div className="flex-1 overflow-y-auto scrollbar-thin">
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="px-6 lg:px-12 xl:px-16 py-8 lg:py-12 space-y-10 lg:space-y-16"
            >
                {/* Welcome Header - Asymmetric */}
                <motion.div variants={fadeInUp} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Dashboard</p>
                        <h1 className="text-3xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-tight">
                            Welcome back,
                            <br />
                            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                TechHub NG
                            </span>
                        </h1>
                    </div>
                    <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 lg:px-8">
                        <Plus className="w-5 h-5 mr-2" />
                        Add Product
                    </Button>
                </motion.div>

                {/* Stats - Large Cards */}
                <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="border-foreground/10 hover:border-foreground/30 transition-colors">
                                <CardContent className="p-5 lg:p-6 xl:p-8">
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                                            {stat.label}
                                        </span>
                                        <span className={cn(
                                            "text-xs font-bold",
                                            stat.trend === "up" ? "text-emerald-400" : "text-red-400"
                                        )}>
                                            {stat.trend === "up" ? "+" : ""}{stat.change}%
                                        </span>
                                    </div>
                                    <p className="text-3xl lg:text-4xl xl:text-5xl font-black">
                                        {stat.format === "currency"
                                            ? formatNaira(stat.value)
                                            : stat.format === "rating"
                                                ? stat.value.toFixed(1)
                                                : stat.value}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={fadeInUp} className="flex gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0">
                    <Button variant="outline" className="flex-shrink-0 rounded-full px-6 border-foreground/20 hover:bg-foreground/5">
                        <Eye className="w-4 h-4 mr-2" />
                        View Store
                    </Button>
                    <Link href="/vendor/analytics">
                        <Button variant="outline" className="flex-shrink-0 rounded-full px-6 border-foreground/20 hover:bg-foreground/5">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Analytics
                        </Button>
                    </Link>
                    <Link href="/vendor/products/new">
                        <Button variant="outline" className="flex-shrink-0 rounded-full px-6 border-foreground/20 hover:bg-foreground/5">
                            <Plus className="w-4 h-4 mr-2" />
                            New Product
                        </Button>
                    </Link>
                </motion.div>

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Recent Orders */}
                    <motion.section variants={fadeInUp}>
                        <div className="flex items-end justify-between mb-6">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Activity</p>
                                <h2 className="text-xl lg:text-2xl font-black">Recent Orders</h2>
                            </div>
                            <Link href="/vendor/orders" className="flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all">
                                View All <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="border border-foreground/10 rounded-2xl divide-y divide-foreground/10">
                            {recentOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/vendor/orders/${order.id}`}
                                    className="flex items-center justify-between p-4 lg:p-5 hover:bg-foreground/5 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center",
                                            order.status === "pending" && "bg-yellow-400/10 text-yellow-500",
                                            order.status === "processing" && "bg-blue-400/10 text-blue-500",
                                            order.status === "delivered" && "bg-emerald-400/10 text-emerald-400"
                                        )}>
                                            {order.status === "pending" && <Clock className="w-4 h-4" />}
                                            {order.status === "processing" && <Package className="w-4 h-4" />}
                                            {order.status === "delivered" && <CheckCircle className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{order.id}</p>
                                            <p className="text-xs text-muted-foreground">{order.customer}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black">{formatNaira(order.amount)}</p>
                                        <p className="text-xs text-muted-foreground">{order.time}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.section>

                    {/* Top Products */}
                    <motion.section variants={fadeInUp}>
                        <div className="flex items-end justify-between mb-6">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Best Sellers</p>
                                <h2 className="text-xl lg:text-2xl font-black">Top Products</h2>
                            </div>
                            <Link href="/vendor/products" className="flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all">
                                View All <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {topProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="flex items-center gap-4 lg:gap-6 p-4 lg:p-5 border border-foreground/10 rounded-xl hover:border-foreground/30 transition-colors"
                                >
                                    <span className="text-4xl lg:text-5xl font-black text-foreground/10 w-12">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold line-clamp-1">{product.name}</p>
                                        <p className="text-sm text-muted-foreground">{product.sales} sold</p>
                                    </div>
                                    <span className="font-black text-emerald-400">
                                        {formatNaira(product.revenue)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                </div>

                {/* Performance Banner */}
                <motion.section variants={fadeInUp}>
                    <div className="relative p-8 lg:p-12 rounded-2xl lg:rounded-3xl border border-foreground/10 bg-gradient-to-br from-emerald-400/5 via-transparent to-cyan-400/5 overflow-hidden">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                    <span className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-bold">Insight</span>
                                </div>
                                <h3 className="text-2xl lg:text-3xl font-black mb-2">
                                    Your store is doing great! 🎉
                                </h3>
                                <p className="text-muted-foreground lg:text-lg">
                                    Revenue is up 12.5% compared to last week
                                </p>
                            </div>
                            <Link href="/vendor/analytics">
                                <Button variant="outline" className="rounded-full px-8 border-foreground/20 hover:bg-foreground/5">
                                    View Analytics
                                    <ArrowUpRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.section>
            </motion.div>
        </div>
    );
}
