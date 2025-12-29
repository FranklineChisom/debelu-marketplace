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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

// Mock products
const mockProducts = [
    {
        id: "1",
        name: "Dell Inspiron 15 Laptop",
        price: 165000,
        stock: 5,
        status: "active" as const,
        image: null,
        sales: 12,
        views: 450,
        category: "Electronics",
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
    },
];

type ProductStatus = "active" | "draft" | "archived";

const statusConfig: Record<ProductStatus, { label: string; variant: "success" | "secondary" | "outline" }> = {
    active: { label: "Active", variant: "success" },
    draft: { label: "Draft", variant: "secondary" },
    archived: { label: "Archived", variant: "outline" },
};

export default function ProductsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");

    const filteredProducts = mockProducts.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || product.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h2 className="text-2xl font-bold font-display tracking-tight">
                        Products
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Manage your product catalog
                    </p>
                </div>
                <Link href="/vendor/products/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </motion.div>

            {/* Filters */}
            <motion.div variants={fadeInUp}>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="flex gap-2">
                                {(["all", "active", "draft", "archived"] as const).map((status) => (
                                    <Button
                                        key={status}
                                        variant={statusFilter === status ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setStatusFilter(status)}
                                        className="capitalize"
                                    >
                                        {status}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Products List */}
            <motion.div variants={fadeInUp}>
                <Card>
                    {/* Desktop Table Header */}
                    <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-3 border-b text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <div className="col-span-5">Product</div>
                        <div className="col-span-2 text-right">Price</div>
                        <div className="col-span-1 text-center">Stock</div>
                        <div className="col-span-1 text-center">Sales</div>
                        <div className="col-span-1 text-center">Views</div>
                        <div className="col-span-1 text-center">Status</div>
                        <div className="col-span-1"></div>
                    </div>

                    <CardContent className="p-0 divide-y">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="p-4 hover:bg-muted/50 transition-colors"
                            >
                                {/* Mobile Layout */}
                                <div className="lg:hidden space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                            {product.image ? (
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    width={64}
                                                    height={64}
                                                    className="rounded-lg object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    No image
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-sm truncate">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                {product.category}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="font-semibold text-sm">
                                                    {formatNaira(product.price)}
                                                </span>
                                                <Badge
                                                    variant={statusConfig[product.status].variant}
                                                    className="text-[10px]"
                                                >
                                                    {statusConfig[product.status].label}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span
                                            className={cn(
                                                product.stock === 0 && "text-destructive font-medium"
                                            )}
                                        >
                                            {product.stock === 0
                                                ? "Out of stock"
                                                : `${product.stock} in stock`}
                                        </span>
                                        <span>{product.sales} sales</span>
                                        <span>{product.views} views</span>
                                    </div>
                                </div>

                                {/* Desktop Layout */}
                                <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-5 flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                            {product.image ? (
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-lg object-cover"
                                                />
                                            ) : (
                                                <span className="text-[10px] text-muted-foreground">
                                                    No img
                                                </span>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-medium text-sm truncate">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                {product.category}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-right font-semibold text-sm">
                                        {formatNaira(product.price)}
                                    </div>
                                    <div
                                        className={cn(
                                            "col-span-1 text-center text-sm",
                                            product.stock === 0 && "text-destructive font-medium"
                                        )}
                                    >
                                        {product.stock === 0 ? "Out" : product.stock}
                                    </div>
                                    <div className="col-span-1 text-center text-sm text-muted-foreground">
                                        {product.sales}
                                    </div>
                                    <div className="col-span-1 text-center text-sm text-muted-foreground">
                                        {product.views}
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <Badge
                                            variant={statusConfig[product.status].variant}
                                            className="text-[10px]"
                                        >
                                            {statusConfig[product.status].label}
                                        </Badge>
                                    </div>
                                    <div className="col-span-1 flex justify-end">
                                        <Button variant="ghost" size="icon-sm">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredProducts.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">
                                <p>No products found</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
