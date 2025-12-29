"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Upload,
    Plus,
    X,
    Save,
    Eye,
    DollarSign,
    Package,
    Tag,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { PRODUCT_CATEGORIES } from "@/lib/constants";

export default function NewProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [hasVariants, setHasVariants] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 1500));
        router.push("/vendor/products");
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={fadeInUp} className="flex items-center gap-4">
                <Link href="/vendor/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold font-display tracking-tight">
                        Add Product
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Create a new product listing
                    </p>
                </div>
                <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                </Button>
            </motion.div>

            <form onSubmit={handleSubmit}>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <motion.div variants={fadeInUp}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Product Name</label>
                                        <Input placeholder="e.g., Dell Inspiron 15 Laptop" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <textarea
                                            className="flex min-h-32 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                            placeholder="Describe your product in detail..."
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Tip: Include key features, specifications, and what makes it special
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Images */}
                        <motion.div variants={fadeInUp}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Upload className="w-4 h-4" />
                                        Images
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-4 gap-3">
                                        {/* Uploaded Images */}
                                        {images.map((img, i) => (
                                            <div
                                                key={i}
                                                className="aspect-square rounded-xl bg-muted relative group"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setImages(images.filter((_, idx) => idx !== i))
                                                    }
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3 mx-auto" />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Add Image Button */}
                                        {images.length < 8 && (
                                            <button
                                                type="button"
                                                onClick={() => setImages([...images, ""])}
                                                className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-colors"
                                            >
                                                <Plus className="w-6 h-6 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">
                                                    Add Image
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3">
                                        Add up to 8 images. First image will be the cover.
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Pricing */}
                        <motion.div variants={fadeInUp}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        Pricing
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Price (₦)</label>
                                            <Input type="number" placeholder="0" required min="0" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Compare at Price (₦){" "}
                                                <span className="text-muted-foreground font-normal">
                                                    optional
                                                </span>
                                            </label>
                                            <Input type="number" placeholder="0" min="0" />
                                            <p className="text-xs text-muted-foreground">
                                                Show a discount by setting this higher than price
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Inventory */}
                        <motion.div variants={fadeInUp}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        Inventory
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Stock Quantity</label>
                                            <Input type="number" placeholder="0" required min="0" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Low Stock Alert{" "}
                                                <span className="text-muted-foreground font-normal">
                                                    optional
                                                </span>
                                            </label>
                                            <Input type="number" placeholder="5" min="0" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 rounded-xl border">
                                        <input
                                            type="checkbox"
                                            id="variants"
                                            checked={hasVariants}
                                            onChange={(e) => setHasVariants(e.target.checked)}
                                            className="w-4 h-4"
                                        />
                                        <div>
                                            <label htmlFor="variants" className="font-medium text-sm">
                                                This product has variants
                                            </label>
                                            <p className="text-xs text-muted-foreground">
                                                e.g., different sizes, colors, or options
                                            </p>
                                        </div>
                                    </div>

                                    {hasVariants && (
                                        <div className="p-4 rounded-xl bg-muted/50 text-center">
                                            <p className="text-sm text-muted-foreground">
                                                Variant management coming soon
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Category */}
                        <motion.div variants={fadeInUp}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Tag className="w-4 h-4" />
                                        Category
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {PRODUCT_CATEGORIES.map((category) => (
                                            <Badge
                                                key={category.id}
                                                variant={
                                                    selectedCategory === category.id
                                                        ? "default"
                                                        : "secondary"
                                                }
                                                className="cursor-pointer"
                                                onClick={() => setSelectedCategory(category.id)}
                                            >
                                                {category.emoji} {category.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Status */}
                        <motion.div variants={fadeInUp}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="active"
                                            defaultChecked
                                            className="w-4 h-4"
                                        />
                                        <div>
                                            <span className="font-medium text-sm">Active</span>
                                            <p className="text-xs text-muted-foreground">
                                                Visible to customers
                                            </p>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="draft"
                                            className="w-4 h-4"
                                        />
                                        <div>
                                            <span className="font-medium text-sm">Draft</span>
                                            <p className="text-xs text-muted-foreground">
                                                Save for later
                                            </p>
                                        </div>
                                    </label>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Actions */}
                        <motion.div variants={fadeInUp} className="sticky top-20">
                            <Card>
                                <CardContent className="p-4 space-y-3">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        isLoading={isLoading}
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Product
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => router.back()}
                                    >
                                        Cancel
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </form>
        </motion.div>
    );
}
