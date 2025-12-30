"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useMarketplaceStore } from "@/stores/useMarketplaceStore";
import { formatNaira } from "@/lib/utils";
import { RevenueChart } from "@/components/admin/RevenueChart";

export default function AdminDashboard() {
    const orders = useMarketplaceStore((state) => state.orders);
    const vendors = useMarketplaceStore((state) => state.vendors);

    // Calculate Stats
    const totalRevenue = vendors.reduce((acc, vendor) => acc + vendor.totalRevenue, 0);
    const activeOrders = orders.filter(o => ["pending", "processing", "delivering"].includes(o.status)).length;
    const activeVendors = vendors.filter(v => v.isVerified).length;
    const pendingApprovals = vendors.filter(v => v.verificationStatus === "pending").length;

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
                    <p className="text-muted-foreground mt-1">Platform performance and alerts.</p>
                </div>
            </header>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
                <motion.div variants={fadeInUp} className="p-6 rounded-2xl border bg-card">
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <h3 className="text-2xl font-bold mt-2">{formatNaira(totalRevenue)}</h3>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-6 rounded-2xl border bg-card">
                    <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
                    <h3 className="text-2xl font-bold mt-2">{activeOrders}</h3>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-6 rounded-2xl border bg-card">
                    <p className="text-sm font-medium text-muted-foreground">Active Vendors</p>
                    <h3 className="text-2xl font-bold mt-2">{activeVendors}</h3>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-6 rounded-2xl border bg-card">
                    <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                    <h3 className={`text-2xl font-bold mt-2 ${pendingApprovals > 0 ? "text-amber-500" : ""}`}>
                        {pendingApprovals}
                    </h3>
                </motion.div>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-7">
                <motion.div variants={fadeInUp} className="md:col-span-4 rounded-2xl border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
                    <RevenueChart />
                </motion.div>
                <div className="md:col-span-3 space-y-6">
                    {/* Placeholder for Recent Activity or Notifications */}
                    <div className="rounded-2xl border bg-card p-6 h-full">
                        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {orders.slice(0, 3).map(order => (
                                <div key={order.id} className="flex items-center justify-between text-sm">
                                    <div>
                                        <p className="font-medium">New order #{order.orderNumber}</p>
                                        <p className="text-muted-foreground">{order.buyerName}</p>
                                    </div>
                                    <span className="text-muted-foreground">{formatNaira(order.total)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
