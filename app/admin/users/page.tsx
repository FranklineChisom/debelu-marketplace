"use client";

import { useState } from "react";
import {
    Search,
    MoreVertical,
    User as UserIcon,
    Shield,
    Ban,
    UserCheck
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

export default function UsersPage() {
    const users = useMarketplaceStore((state) => state.users);
    const banUser = useMarketplaceStore((state) => state.banUser);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState<"all" | "buyer" | "vendor">("all");

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.profile.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.profile.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === "all" || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleBan = (id: string, name: string) => {
        if (confirm(`Are you sure you want to ban ${name}? This action cannot be undone.`)) {
            banUser(id);
            toast.error(`User ${name} has been banned.`);
        }
    };

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground mt-1">Manage buyer and vendor accounts.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={filterRole === "all" ? "default" : "outline"}
                        onClick={() => setFilterRole("all")}
                        className="rounded-full"
                    >
                        All Users
                    </Button>
                    <Button
                        variant={filterRole === "buyer" ? "default" : "outline"}
                        onClick={() => setFilterRole("buyer")}
                        className="rounded-full"
                    >
                        Buyers
                    </Button>
                    <Button
                        variant={filterRole === "vendor" ? "default" : "outline"}
                        onClick={() => setFilterRole("vendor")}
                        className="rounded-full"
                    >
                        Vendors
                    </Button>
                </div>
            </header>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by username or email..."
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
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Usage</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No users found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-10 h-10 rounded-full">
                                                    <AvatarImage src={user.profile.avatar} />
                                                    <AvatarFallback>{user.profile.firstName?.[0]}{user.profile.lastName?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-foreground">{user.profile.firstName} {user.profile.lastName}</p>
                                                    <p className="text-xs text-muted-foreground">{user.profile.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 capitalize">
                                            {user.role === "vendor" ? (
                                                <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">Vendor</Badge>
                                            ) : (
                                                <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">Buyer</Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-200">
                                                <UserCheck className="w-3 h-3 mr-1" /> Active
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs space-y-1">
                                                <p><span className="text-muted-foreground">Spent:</span> {formatNaira(user.totalSpent)}</p>
                                                <p><span className="text-muted-foreground">Orders:</span> {user.orderCount}</p>
                                            </div>
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
                                                        <UserIcon className="w-4 h-4 mr-2" /> View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleBan(user.id, user.profile.username)} className="text-destructive focus:text-destructive">
                                                        <Ban className="w-4 h-4 mr-2" /> Ban User
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
