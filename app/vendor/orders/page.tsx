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
    Calendar,
    ArrowUpRight,
    MapPin,
    Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn, formatNaira, formatRelativeTime } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { ORDER_STATUSES, OrderStatus } from "@/lib/constants";

import { useMarketplaceStore } from "@/stores/useMarketplaceStore";



const statusOrder: OrderStatus[] = [
    "pending",
    "confirmed",
    "processing",
    "delivering",
    "delivered",
];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        case 'confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'processing': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
        case 'delivering': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
        case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
        default: return 'bg-muted text-muted-foreground';
    }
}

export default function OrdersPage() {
    const orders = useMarketplaceStore((state) => state.orders);
    const [search, setSearch] = useState("");
    const [view, setView] = useState<"kanban" | "list">("kanban");

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
            order.buyerName.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
    });

    // Group orders by status for kanban view
    const ordersByStatus = statusOrder.reduce((acc, status) => {
        acc[status] = filteredOrders.filter((o) => o.status === status);
        return acc;
    }, {} as Record<OrderStatus, typeof orders>);

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
                        Order Management
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Track, process, and fulfill customer orders in real-time.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border border-border/50">
                    <Button
                        variant={view === "kanban" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setView("kanban")}
                        className="rounded-md"
                    >
                        Board
                    </Button>
                    <Button
                        variant={view === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setView("list")}
                        className="rounded-md"
                    >
                        List
                    </Button>
                </div>
            </motion.div>

            {/* Filter Bar */}
            <motion.div variants={fadeInUp}>
                <div className="flex items-center gap-4 bg-card border border-border/50 p-4 rounded-xl shadow-sm">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by Order ID, Customer Name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-background/50 border-border/50"
                        />
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <Button variant="outline" size="sm" className="hidden sm:flex border-border/50">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                        <Button variant="outline" size="sm" className="hidden sm:flex border-border/50">
                            <Calendar className="w-4 h-4 mr-2" />
                            Date Range
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Content View */}
            {view === "kanban" ? (
                /* Kanban Board */
                <motion.div
                    variants={fadeInUp}
                    className="flex pb-4 gap-6 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted"
                >
                    {statusOrder.map((status) => (
                        <div key={status} className="min-w-[300px] w-[300px] flex-shrink-0 space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <span className={cn("w-2 h-2 rounded-full",
                                        status === 'pending' ? 'bg-amber-500' :
                                            status === 'confirmed' ? 'bg-blue-500' :
                                                status === 'processing' ? 'bg-purple-500' :
                                                    status === 'delivering' ? 'bg-indigo-500' :
                                                        'bg-emerald-500'
                                    )} />
                                    <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                                        {ORDER_STATUSES[status].label}
                                    </h3>
                                </div>
                                <Badge variant="secondary" className="rounded-lg bg-muted font-mono">
                                    {ordersByStatus[status]?.length || 0}
                                </Badge>
                            </div>

                            <div className="space-y-3 min-h-[500px]">
                                {ordersByStatus[status]?.map((order) => (
                                    <KanbanCard key={order.id} order={order} />
                                ))}
                                {ordersByStatus[status]?.length === 0 && (
                                    <div className="h-32 rounded-xl border-2 border-dashed border-muted flex items-center justify-center">
                                        <p className="text-xs text-muted-foreground">No orders</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </motion.div>
            ) : (
                /* List View */
                <motion.div variants={fadeInUp} className="space-y-4">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="group bg-card hover:bg-muted/30 border border-border/50 rounded-xl p-4 transition-all flex flex-col md:flex-row md:items-center gap-4">
                            <div className="md:w-64">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono text-xs font-bold text-primary">{order.orderNumber}</span>
                                    <Badge variant="outline" className={cn("text-[10px] uppercase border-0", getStatusColor(order.status))}>
                                        {ORDER_STATUSES[order.status].label}
                                    </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatRelativeTime(order.createdAt)} • {order.paymentMethod}
                                </div>
                            </div>

                            <div className="flex-1 flex items-center gap-3">
                                <Avatar className="w-8 h-8 h-9 w-9 border border-border/50">
                                    <AvatarFallback className="text-xs bg-primary/5 text-primary font-bold">
                                        {order.buyerName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-sm">{order.buyerName}</p>
                                    <p className="text-xs text-muted-foreground">{order.items.length} items • {formatNaira(order.total)}</p>
                                </div>
                            </div>

                            <div className="md:w-64">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {order.deliveryAddress.label} {/* Updated for DeliveryAddress object */}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 md:justify-end md:w-48">
                                <Button size="sm" variant="outline" className="h-8">Details</Button>
                                <Button size="sm" className="h-8 bg-primary/10 text-primary hover:bg-primary/20 border-0">Update</Button>
                            </div>
                        </div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}

import { Order } from "@/types/order";

function KanbanCard({
    order,
}: {
    order: Order;
}) {
    return (
        <Card className="hover:shadow-md transition-all cursor-pointer border-border/50 group bg-card">
            <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <Badge variant="outline" className="font-mono text-[10px] bg-background">
                        {order.orderNumber}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(order.createdAt)}
                    </span>
                </div>

                <div className="space-y-1">
                    <p className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{order.buyerName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{order.deliveryAddress.label}</span>
                    </p>
                </div>

                <div className="bg-muted/30 p-2 rounded-lg space-y-1">
                    {order.items.slice(0, 2).map((item, i) => (
                        <div key={i} className="flex justify-between text-xs">
                            <span className="text-muted-foreground truncate max-w-[140px]">{item.quantity}x {item.product.name}</span>
                        </div>
                    ))}
                    {order.items.length > 2 && (
                        <div className="text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                            + {order.items.length - 2} more items
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <p className="font-black text-sm">{formatNaira(order.total)}</p>
                    <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">
                            <MessageSquare className="w-3 h-3" />
                        </div>
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">
                            <Smartphone className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
