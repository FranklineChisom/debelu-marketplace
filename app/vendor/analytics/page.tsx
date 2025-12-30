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

const categoryData = [
    { name: "Electronics", value: 45, color: "#8b5cf6" },
    { name: "Fashion", value: 30, color: "#ec4899" },
    { name: "Accessories", value: 15, color: "#06b6d4" },
    { name: "Others", value: 10, color: "#94a3b8" },
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
                    title="Total Revenue"
                    value={formatNaira(periodStats.revenue.value)}
                    change={periodStats.revenue.change}
                    isPositive={periodStats.revenue.isPositive}
                    icon={DollarSign}
                    chartData={revenueData}
                    chartColor="#8b5cf6"
                />
                <StatCard
                    title="Total Orders"
                    value={periodStats.orders.value.toString()}
                    change={periodStats.orders.change}
                    isPositive={periodStats.orders.isPositive}
                    icon={ShoppingCart}
                    chartData={revenueData} // Using same mock data for visual consistency in demo
                    chartColor="#ec4899"
                />
                <StatCard
                    title="New Customers"
                    value={periodStats.customers.value.toString()}
                    change={periodStats.customers.change}
                    isPositive={periodStats.customers.isPositive}
                    icon={Users}
                    chartData={revenueData}
                    chartColor="#06b6d4"
                />
                <StatCard
                    title="Product Views"
                    value={periodStats.views.value.toLocaleString()}
                    change={periodStats.views.change}
                    isPositive={periodStats.views.isPositive}
                    icon={Eye}
                    chartData={revenueData}
                    chartColor="#f59e0b"
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
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
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
                                            stroke="#8b5cf6"
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

function StatCard({
    title,
    value,
    change,
    isPositive,
    icon: Icon,
    chartData,
    chartColor
}: {
    title: string;
    value: string;
    change: number;
    isPositive: boolean;
    icon: any;
    chartData: any[];
    chartColor: string;
}) {
    return (
        <Card className="border-border/50 overflow-hidden relative">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-primary/5 rounded-xl text-primary">
                        <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant={isPositive ? "success" : "destructive"} className={isPositive ? "bg-emerald-500/10 text-emerald-500 border-0" : "bg-red-500/10 text-red-500 border-0"}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {Math.abs(change)}%
                    </Badge>
                </div>

                <div className="space-y-1 z-10 relative">
                    <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
                    <p className="text-xs text-muted-foreground">{title}</p>
                </div>

                {/* Mini background chart */}
                <div className="absolute bottom-0 right-0 w-[120px] h-[60px] opacity-20">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke={chartColor}
                                strokeWidth={2}
                                fill={chartColor}
                                fillOpacity={0.2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
