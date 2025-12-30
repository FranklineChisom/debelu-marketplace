"use client";

import { useState } from "react";
import {
    Search,
    MoreVertical,
    Filter,
    ArrowUpRight,
    Ban
} from "lucide-react";
import { useMarketplaceStore } from "@/stores/useMarketplaceStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { formatNaira, cn } from "@/lib/utils";
import { OrderStatus } from "@/lib/constants";

// Map status to colors (consistent with buyer/vendor views)
const STATUS_STYLES: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-600 border-amber-200",
    confirmed: "bg-blue-500/15 text-blue-600 border-blue-200",
    processing: "bg-purple-500/15 text-purple-600 border-purple-200",
    ready: "bg-indigo-500/15 text-indigo-600 border-indigo-200",
    delivering: "bg-pink-500/15 text-pink-600 border-pink-200",
    delivered: "bg-emerald-500/15 text-emerald-600 border-emerald-200",
    cancelled: "bg-red-500/15 text-red-600 border-red-200",
    disputed: "bg-orange-500/15 text-orange-600 border-orange-200",
};

export default function AdminOrdersPage() {
    const orders = useMarketplaceStore((state) => state.orders);
    const updateOrderStatus = useMarketplaceStore((state) => state.updateOrderStatus);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleCancelOrder = (id: string, orderNumber: string) => {
        if (confirm(`Are you sure you want to FORCE CANCEL order ${orderNumber}?`)) {
            updateOrderStatus(id, "cancelled");
            toast.error(`Order ${orderNumber} cancelled by Admin.`);
        }
    };

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Global Orders</h1>
                    <p className="text-muted-foreground mt-1">Monitor and manage all marketplace transactions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <ArrowUpRight className="w-4 h-4 mr-2" />
                        Export Log
                    </Button>
                </div>
            </header>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search ID, Buyer, or Vendor..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-12 rounded-xl bg-muted/50 border-0"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-12 px-4 rounded-xl border-dashed">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter Status: <span className="ml-1 font-semibold capitalize">{statusFilter}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {Object.keys(STATUS_STYLES).map((status) => (
                            <DropdownMenuItem key={status} onClick={() => setStatusFilter(status as OrderStatus)} className="capitalize">
                                {status}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Table */}
            <div className="border rounded-2xl overflow-hidden bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Vendor</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-medium font-mono text-xs">
                                            #{order.orderNumber}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-foreground">{order.buyerName}</p>
                                            <p className="text-xs text-muted-foreground">{order.buyerPhone}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-foreground">{order.vendorName}</p>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {formatNaira(order.total)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={cn("capitalize border", STATUS_STYLES[order.status] || "bg-gray-100 text-gray-800")}>
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleCancelOrder(order.id, order.orderNumber)}
                                                        disabled={["delivered", "cancelled"].includes(order.status)}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Ban className="w-4 h-4 mr-2" /> Force Cancel
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
