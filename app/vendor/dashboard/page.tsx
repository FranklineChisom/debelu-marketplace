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
import { StatCard } from "@/components/vendor/StatCard";

// Mock data
const stats = [
    { label: "Revenue", value: 485000, change: 12.5, format: "currency", trend: "up" },
    { label: "Orders", value: 28, change: -5.3, format: "number", trend: "down" },
    { label: "Products", value: 45, change: 8.2, format: "number", trend: "up" },
    { label: "Rating", value: 4.8, change: 0.2, format: "rating", trend: "up" },
];



import { useMarketplaceStore } from "@/stores/useMarketplaceStore";
import { formatRelativeTime } from "@/lib/utils";

export default function VendorDashboardPage() {
    const orders = useMarketplaceStore((state) => state.orders);
    const products = useMarketplaceStore((state) => state.products);

    // Calculate Stats
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
    const orderCount = orders.length;
    const productCount = products.length;

    // Mock rating for now as we don't have reviews store yet
    const averageRating = 4.8;

    // Calculate Top Products dynamically
    const productSales = orders.flatMap(o => o.items).reduce((acc, item) => {
        if (!acc[item.productId]) {
            acc[item.productId] = {
                id: item.productId,
                name: item.productName,
                sales: 0,
                revenue: 0
            };
        }
        acc[item.productId].sales += item.quantity;
        acc[item.productId].revenue += (item.price * item.quantity);
        return acc;
    }, {} as Record<string, { id: string, name: string, sales: number, revenue: number }>);

    const topProducts = (Object.values(productSales) as { id: string, name: string, sales: number, revenue: number }[])
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 3);

    const stats = [
        { label: "Revenue", value: totalRevenue, change: 12.5, format: "currency", trend: "up" },
        { label: "Orders", value: orderCount, change: -5.3, format: "number", trend: "down" },
        { label: "Products", value: productCount, change: 8.2, format: "number", trend: "up" },
        { label: "Rating", value: averageRating, change: 0.2, format: "rating", trend: "up" },
    ];

    const recentOrdersList = orders.slice(0, 5).map(order => ({
        id: order.orderNumber,
        customer: order.buyerName,
        amount: order.total,
        status: order.status,
        time: formatRelativeTime(order.createdAt)
    }));

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
                            <StatCard
                                label={stat.label}
                                value={stat.value}
                                change={stat.change}
                                trend={stat.trend as "up" | "down" | "neutral"}
                                formatter={stat.format as any}
                            />
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
                            {recentOrdersList.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">No recent orders</div>
                            ) : recentOrdersList.map((order) => (
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
                                        <p className="text-xs sm:text-sm text-muted-foreground">{product.sales} sold</p>
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
