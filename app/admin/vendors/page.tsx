"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Search,
    MoreVertical,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    ShieldCheck,
    Ban
} from "lucide-react";
import { useMarketplaceStore } from "@/stores/useMarketplaceStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { formatNaira } from "@/lib/utils";

export default function VendorsPage() {
    const vendors = useMarketplaceStore((state) => state.vendors);
    const verifyVendor = useMarketplaceStore((state) => state.verifyVendor);
    const suspendVendor = useMarketplaceStore((state) => state.suspendVendor);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");

    const filteredVendors = vendors.filter(vendor => {
        const matchesSearch = vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vendor.phone.includes(searchQuery);
        const matchesStatus = filterStatus === "all" || vendor.verificationStatus === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleVerify = (id: string, status: "approved" | "rejected") => {
        verifyVendor(id, status);
        toast.success(`Vendor ${status === "approved" ? "approved" : "rejected"} successfully`);
    };

    const handleSuspend = (id: string) => {
        suspendVendor(id);
        toast.warning("Vendor suspended");
    };

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
                    <p className="text-muted-foreground mt-1">Manage vendor accounts and verification requests.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={filterStatus === "all" ? "default" : "outline"}
                        onClick={() => setFilterStatus("all")}
                        className="rounded-full"
                    >
                        All
                    </Button>
                    <Button
                        variant={filterStatus === "pending" ? "default" : "outline"}
                        onClick={() => setFilterStatus("pending")}
                        className="rounded-full"
                    >
                        Pending
                        {vendors.filter(v => v.verificationStatus === "pending").length > 0 && (
                            <Badge variant="secondary" className="ml-2 bg-background/20 text-current">
                                {vendors.filter(v => v.verificationStatus === "pending").length}
                            </Badge>
                        )}
                    </Button>
                    <Button
                        variant={filterStatus === "approved" ? "default" : "outline"}
                        onClick={() => setFilterStatus("approved")}
                        className="rounded-full"
                    >
                        Active
                    </Button>
                </div>
            </header>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search vendors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-12 rounded-xl bg-muted/50 border-0"
                />
            </div>

            {/* Table */}
            <div className="border rounded-2xl overflow-hidden bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                            <tr>
                                <th className="px-6 py-4">Business</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Revenue</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredVendors.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No vendors found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredVendors.map((vendor) => (
                                    <tr key={vendor.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-10 h-10 rounded-lg">
                                                    <AvatarFallback className="rounded-lg">{vendor.businessName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-foreground">{vendor.businessName}</p>
                                                    <p className="text-xs text-muted-foreground capitalize">{vendor.campusId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-foreground">{vendor.email}</p>
                                            <p className="text-xs text-muted-foreground">{vendor.phone}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {vendor.verificationStatus === "approved" && (
                                                <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-200">
                                                    <CheckCircle className="w-3 h-3 mr-1" /> Active
                                                </Badge>
                                            )}
                                            {vendor.verificationStatus === "pending" && (
                                                <Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 border-amber-200">
                                                    <AlertCircle className="w-3 h-3 mr-1" /> Pending
                                                </Badge>
                                            )}
                                            {vendor.verificationStatus === "rejected" && (
                                                <Badge className="bg-red-500/15 text-red-600 hover:bg-red-500/25 border-red-200">
                                                    <XCircle className="w-3 h-3 mr-1" /> Rejected
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {formatNaira(vendor.totalRevenue)}
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
                                                    <DropdownMenuItem>
                                                        <Eye className="w-4 h-4 mr-2" /> View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {vendor.verificationStatus === "pending" && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleVerify(vendor.id, "approved")}>
                                                                <ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" /> Approve
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleVerify(vendor.id, "rejected")}>
                                                                <XCircle className="w-4 h-4 mr-2 text-red-500" /> Reject
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {vendor.verificationStatus === "approved" && (
                                                        <DropdownMenuItem onClick={() => handleSuspend(vendor.id)} className="text-destructive focus:text-destructive">
                                                            <Ban className="w-4 h-4 mr-2" /> Suspend
                                                        </DropdownMenuItem>
                                                    )}
                                                    {vendor.verificationStatus === "rejected" && (
                                                        <DropdownMenuItem onClick={() => handleVerify(vendor.id, "approved")}>
                                                            <ShieldCheck className="w-4 h-4 mr-2" /> Re-activate
                                                        </DropdownMenuItem>
                                                    )}
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
