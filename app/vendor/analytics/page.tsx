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
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { StatCard } from "@/components/vendor/StatCard";

// Mock data
const revenueData = [
    { name: "Mon", total: 150000 },
    { name: "Tue", total: 230000 },
    { name: "Wed", total: 180000 },
    { name: "Thu", total: 290000 },
    { name: "Fri", total: 340000 },
    { name: "Sat", total: 410000 },
    { name: "Sun", total: 470000 },
];

// Chart Colors Configuration
const CHART_COLORS = {
    revenue: "hsl(var(--primary))",
    orders: "#ec4899", // Pink 500
    customers: "#06b6d4", // Cyan 500
    views: "#f59e0b", // Amber 500
    others: "#94a3b8", // Slate 400
};

const categoryData = [
    { name: "Electronics", value: 45, color: CHART_COLORS.revenue },
    { name: "Fashion", value: 30, color: CHART_COLORS.orders },
    { name: "Accessories", value: 15, color: CHART_COLORS.customers },
    { name: "Others", value: 10, color: CHART_COLORS.others },
];

const periodStats = {
    revenue: { value: 2450000, change: 18, isPositive: true },
    orders: { value: 156, change: 12, isPositive: true },
    customers: { value: 89, change: 24, isPositive: true },
    views: { value: 4520, change: -3, isPositive: false },
};

const recentActivity = [
    { type: "order", message: "New order #DBL-XYZ789 received", time: "5 mins ago", amount: 165000 },
    { type: "review", message: "5-star review on Dell Laptop", time: "1 hour ago", rating: 5 },
    { type: "stock", message: "USB-C Hub running low (5 left)", time: "2 hours ago", priority: "high" },
    { type: "order", message: "Order #DBL-ABC123 delivered", time: "3 hours ago", amount: 18000 },
];

export default function AnalyticsPage() {
    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
        >
            {/* Header */}
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black font-display tracking-tight text-foreground">
                        Analytics Overview
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Comprehensive insights into your store's performance.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Tabs defaultValue="week" className="w-[300px]">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="week">Week</TabsTrigger>
                            <TabsTrigger value="month">Month</TabsTrigger>
                            <TabsTrigger value="year">Year</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Button variant="outline" size="icon" className="shrink-0">
                        <Calendar className="h-4 w-4" />
                    </Button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={fadeInUp}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <StatCard
                    label="Total Revenue"
                    value={periodStats.revenue.value}
                    formatter="currency"
                    change={periodStats.revenue.change}
                    trend={periodStats.revenue.isPositive ? "up" : "down"}
                    icon={DollarSign}
                    chartData={revenueData}
                    chartColor={CHART_COLORS.revenue}
                    variant="analytics"
                />
                <StatCard
                    label="Total Orders"
                    value={periodStats.orders.value}
                    formatter="number"
                    change={periodStats.orders.change}
                    trend={periodStats.orders.isPositive ? "up" : "down"}
                    icon={ShoppingCart}
                    chartData={revenueData}
                    chartColor={CHART_COLORS.orders}
                    variant="analytics"
                />
                <StatCard
                    label="New Customers"
                    value={periodStats.customers.value}
                    formatter="number"
                    change={periodStats.customers.change}
                    trend={periodStats.customers.isPositive ? "up" : "down"}
                    icon={Users}
                    chartData={revenueData}
                    chartColor={CHART_COLORS.customers}
                    variant="analytics"
                />
                <StatCard
                    label="Product Views"
                    value={periodStats.views.value}
                    formatter="number"
                    change={periodStats.views.change}
                    trend={periodStats.views.isPositive ? "up" : "down"}
                    icon={Eye}
                    chartData={revenueData}
                    chartColor={CHART_COLORS.views}
                    variant="analytics"
                />
            </motion.div>

            {/* Main Charts Area */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <motion.div variants={fadeInUp} className="lg:col-span-2">
                    <Card className="h-full border-border/50">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Revenue Analysis</CardTitle>
                                    <CardDescription>Income trends over the selected period</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="gap-2 text-xs">
                                    <Filter className="h-3 w-3" />
                                    Filter
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={CHART_COLORS.revenue} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={CHART_COLORS.revenue} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `₦${value / 1000}k`}
                                            dx={-10}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                backdropFilter: 'blur(8px)',
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }}
                                            formatter={(value) => formatNaira(value as number)}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            stroke={CHART_COLORS.revenue}
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Sales by Category */}
                <motion.div variants={fadeInUp} className="lg:col-span-1">
                    <Card className="h-full border-border/50">
                        <CardHeader>
                            <CardTitle>Sales by Category</CardTitle>
                            <CardDescription>Distribution of revenue across categories</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                backdropFilter: 'blur(8px)',
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-bold">100%</span>
                                    <span className="text-xs text-muted-foreground">Total Sales</span>
                                </div>
                            </div>
                            <div className="mt-8 space-y-3">
                                {categoryData.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span>{item.name}</span>
                                        </div>
                                        <span className="font-semibold">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Activity Section */}
            <motion.div variants={fadeInUp}>
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest events and transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {recentActivity.map((activity, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2 rounded-full mt-1 ${activity.type === 'order' ? 'bg-primary/10 text-primary' :
                                            activity.type === 'review' ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-red-500/10 text-red-500'
                                            }`}>
                                            {activity.type === 'order' && <ShoppingCart className="w-4 h-4" />}
                                            {activity.type === 'review' && <TrendingUp className="w-4 h-4" />}
                                            {activity.type === 'stock' && <Package className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{activity.message}</p>
                                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                                        </div>
                                    </div>
                                    {activity.amount && (
                                        <div className="text-sm font-bold">{formatNaira(activity.amount)}</div>
                                    )}
                                    {activity.rating && (
                                        <Badge variant="secondary" className="gap-1 bg-yellow-500/10 text-yellow-600 border-0">
                                            {activity.rating} <span className="text-[10px]">★</span>
                                        </Badge>
                                    )}
                                    {activity.priority && (
                                        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-0">
                                            {activity.priority}
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
