"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Edit,
    Trash2,
    Copy,
    Eye,
    EyeOff,
    ArrowUpDown,
    Download,
    SlidersHorizontal,
    Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

// Mock products
const mockProducts = [
    {
        id: "1",
        name: "Dell Inspiron 15 Laptop 3620",
        price: 165000,
        stock: 5,
        status: "active" as const,
        image: null,
        sales: 12,
        views: 450,
        category: "Electronics",
        lastUpdated: "2 hours ago"
    },
    {
        id: "2",
        name: "iPhone 12 Case Bundle (5 colors)",
        price: 9000,
        stock: 45,
        status: "active" as const,
        image: null,
        sales: 28,
        views: 890,
        category: "Accessories",
        lastUpdated: "1 day ago"
    },
    {
        id: "3",
        name: "USB-C Hub 7-in-1",
        price: 12500,
        stock: 0,
        status: "active" as const,
        image: null,
        sales: 45,
        views: 1200,
        category: "Electronics",
        lastUpdated: "3 days ago"
    },
    {
        id: "4",
        name: "Wireless Earbuds Pro",
        price: 25000,
        stock: 15,
        status: "draft" as const,
        image: null,
        sales: 0,
        views: 0,
        category: "Electronics",
        lastUpdated: "1 week ago"
    },
];

type ProductStatus = "active" | "draft" | "archived";

const statusConfig: Record<ProductStatus, { label: string; variant: "success" | "secondary" | "outline" | "default" | "destructive" | "warning" }> = {
    active: { label: "Active", variant: "success" },
    draft: { label: "Draft", variant: "secondary" },
    archived: { label: "Archived", variant: "outline" },
};

export default function ProductsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

    const filteredProducts = mockProducts.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || product.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const toggleSelectAll = () => {
        if (selectedProducts.length === filteredProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(filteredProducts.map(p => p.id));
        }
    };

    const toggleSelectProduct = (id: string) => {
        if (selectedProducts.includes(id)) {
            setSelectedProducts(selectedProducts.filter(pId => pId !== id));
        } else {
            setSelectedProducts([...selectedProducts, id]);
        }
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
        >
            {/* Header */}
            <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h2 className="text-3xl font-black font-display tracking-tight text-foreground">
                        Inventory
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Manage your products, prices, and stock levels.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Link href="/vendor/products/new">
                        <Button className="font-bold shadow-lg shadow-primary/20">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Products", value: "45", icon: Box, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Active", value: "32", icon: Checkbox, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "Low Stock", value: "3", icon: ArrowUpDown, color: "text-amber-500", bg: "bg-amber-500/10" },
                    { label: "Total Views", value: "12.5k", icon: Eye, color: "text-purple-500", bg: "bg-purple-500/10" },
                ].map((stat, i) => (
                    <Card key={i} className="border-border/50 shadow-sm bg-card/50">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-black">{stat.value}</p>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>

            {/* Main Content Area */}
            <motion.div variants={fadeInUp} className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/20">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products by name or SKU..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-background border-border/50"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto scrollbar-hide">
                        <div className="flex items-center gap-1 bg-background border border-border/50 rounded-lg p-1">
                            {(["all", "active", "draft", "archived"] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize",
                                        statusFilter === status ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <Button variant="outline" size="icon" className="shrink-0 border-border/50 bg-background ml-auto">
                            <SlidersHorizontal className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[50px]">
                                    <Checkbox
                                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[80px]">Image</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Price</th>
                                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Stock</th>
                                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Sales</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0 text-sm">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted group">
                                    <td className="p-4">
                                        <Checkbox
                                            checked={selectedProducts.includes(product.id)}
                                            onCheckedChange={() => toggleSelectProduct(product.id)}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border/50">
                                            {product.image ? (
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    width={48}
                                                    height={48}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <Box className="w-5 h-5 text-muted-foreground/50" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold truncate max-w-[200px]">{product.name}</span>
                                            <span className="text-[10px] text-muted-foreground">Updated {product.lastUpdated}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-muted-foreground">{product.category}</td>
                                    <td className="p-4">
                                        <Badge
                                            variant={statusConfig[product.status].variant}
                                            className="uppercase text-[10px] font-bold tracking-wider"
                                        >
                                            {statusConfig[product.status].label}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right font-medium">{formatNaira(product.price)}</td>
                                    <td className="p-4 text-center">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium",
                                            product.stock === 0 ? "bg-red-500/10 text-red-600" : "bg-muted text-foreground"
                                        )}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center text-muted-foreground">{product.sales}</td>
                                    <td className="p-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px]">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Copy className="w-4 h-4 mr-2" /> Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="h-24 text-center">
                                        <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                                            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                                                <Search className="w-8 h-8 opacity-50" />
                                            </div>
                                            <p className="text-lg font-medium text-foreground">No products found</p>
                                            <p className="text-sm">Try adjusting your filters or search query.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Mock) */}
                <div className="border-t border-border/50 p-4 flex items-center justify-between text-xs text-muted-foreground">
                    <div>
                        Showing <strong>1-{filteredProducts.length}</strong> of <strong>{mockProducts.length}</strong> products
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm" disabled>Next</Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
