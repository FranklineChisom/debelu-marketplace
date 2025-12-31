"use client";

import { motion } from "framer-motion";
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    ChevronRight,
    Search,
    ShoppingBag,
    XCircle,
    MapPin,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNaira, cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

import { useMarketplaceStore } from "@/stores/useMarketplaceStore";


const STATUS_CONFIG = {
    pending: { label: "Pending", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    processing: { label: "Processing", icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    shipping: { label: "On the way", icon: Truck, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    delivered: { label: "Delivered", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
};

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const orders = useMarketplaceStore((state) => state.orders);
    const user = useMarketplaceStore((state) => state.user);

    const filteredOrders = orders.filter(order => {
        // Filter by authenticated user ID
        if (!user || order.buyerId !== user.id) return false;

        const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.vendorName.toLowerCase().includes(searchQuery.toLowerCase());

        if (activeTab === "all") return matchesSearch;
        if (activeTab === "active") return matchesSearch && ["pending", "confirmed", "processing", "delivering"].includes(order.status);
        if (activeTab === "completed") return matchesSearch && order.status === "delivered";
        if (activeTab === "cancelled") return matchesSearch && order.status === "cancelled";
        return matchesSearch;
    });

    return (
        <div className="flex-1 overflow-y-auto bg-background/50">
            <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 lg:py-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-display font-bold tracking-tight mb-2">My Orders</h1>
                        <p className="text-muted-foreground">Track and manage your purchases</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by Order ID or Vendor..."
                            className="pl-10 h-11 bg-background border-border/60 focus:border-primary/50 transition-colors rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tabs & Content */}
                <Tabs defaultValue="all" className="space-y-8" onValueChange={setActiveTab}>
                    <TabsList className="bg-muted/50 p-1 rounded-full inline-flex md:w-auto overflow-x-auto max-w-full">
                        <TabsTrigger value="all" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">All</TabsTrigger>
                        <TabsTrigger value="active" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Active</TabsTrigger>
                        <TabsTrigger value="completed" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Completed</TabsTrigger>
                        <TabsTrigger value="cancelled" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Cancelled</TabsTrigger>
                    </TabsList>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="space-y-4"
                    >
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => {
                                const status = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
                                const StatusIcon = status.icon;

                                return (
                                    <motion.div
                                        key={order.id}
                                        variants={fadeInUp}
                                        className="group bg-background border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                                    >
                                        <Link href={`/orders/${order.id}`} className="block">
                                            <div className="p-5 md:p-6">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", status?.bg || "bg-gray-100")}>
                                                            <StatusIcon className={cn("w-5 h-5", status?.color || "text-gray-500")} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <h3 className="font-semibold">{order.vendorName}</h3>
                                                                <span className="text-xs text-muted-foreground">• {new Date(order.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", status?.bg, status?.color, status?.border)}>
                                                                {status?.label || order.status}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="block font-bold text-lg">{formatNaira(order.total)}</span>
                                                        <span className="text-xs text-muted-foreground font-medium">{order.items.length} items</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 py-4 border-t border-border/40">
                                                    <div className="flex -space-x-3 overflow-hidden">
                                                        {order.items.slice(0, 3).map((item, i) => (
                                                            <div key={i} className="relative w-12 h-12 rounded-lg border-2 border-background overflow-hidden bg-muted">
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.productName}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        ))}
                                                        {order.items.length > 3 && (
                                                            <div className="w-12 h-12 rounded-lg border-2 border-background bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                                                                +{order.items.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium line-clamp-1">{order.items[0].productName}</p>
                                                        {order.items.length > 1 && (
                                                            <p className="text-xs text-muted-foreground">and {order.items.length - 1} other item(s)</p>
                                                        )}
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                </div>

                                                {/* Delivery Footnote for Active Orders */}
                                                {["processing", "delivering"].includes(order.status) && (
                                                    <div className="mt-2 bg-muted/30 -mx-6 -mb-6 px-6 py-3 flex items-center gap-2 text-xs font-medium text-foreground/80">
                                                        <Truck className="w-3.5 h-3.5 text-primary" />
                                                        {order.deliverySlot?.label ? `Delivery: ${order.deliverySlot.label}` : "In transit"}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <motion.div
                                variants={fadeInUp}
                                className="text-center py-20"
                            >
                                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No orders found</h3>
                                <p className="text-muted-foreground mb-8">
                                    {activeTab === 'all'
                                        ? "You haven't placed any orders yet."
                                        : `You don't have any ${activeTab} orders.`}
                                </p>
                                <Button size="lg" className="rounded-full" asChild>
                                    <Link href="/explore">Start Shopping</Link>
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                </Tabs>
            </div>
        </div>
    );
}
