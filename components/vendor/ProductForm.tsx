"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    Trash2,
    AlertTriangle,
    List,
    ShieldCheck,
    MinusCircle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from "@/lib/constants";

interface ProductFormProps {
    initialData?: any;
    isEditing?: boolean;
}

interface Spec {
    key: string;
    value: string;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [selectedCategory, setSelectedCategory] = useState(initialData?.category || "");
    const [selectedCondition, setSelectedCondition] = useState(initialData?.condition || "");
    const [warranty, setWarranty] = useState(initialData?.warranty || "");
    const [hasVariants, setHasVariants] = useState(initialData?.hasVariants || false);
    const [specs, setSpecs] = useState<Spec[]>(initialData?.specs || [{ key: "", value: "" }]);

    const handleAddSpec = () => {
        setSpecs([...specs, { key: "", value: "" }]);
    };

    const handleRemoveSpec = (index: number) => {
        setSpecs(specs.filter((_, i) => i !== index));
    };

    const handleSpecChange = (index: number, field: "key" | "value", value: string) => {
        const newSpecs = [...specs];
        newSpecs[index][field] = value;
        setSpecs(newSpecs);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
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
                        {isEditing ? "Edit Product" : "Add Product"}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        {isEditing ? `Updating "${initialData?.name}"` : "Create a new product listing"}
                    </p>
                </div>
                {isEditing && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="destructive" size="icon" className="mr-2">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Product?</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete <strong>{initialData?.name}</strong>? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="ghost">Cancel</Button>
                                <Button variant="destructive" onClick={() => router.push("/vendor/products")}>
                                    Confirm Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
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
                                        <Input defaultValue={initialData?.name} placeholder="e.g., Dell Inspiron 15 Laptop" required />
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Category</label>
                                            <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PRODUCT_CATEGORIES.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id}>
                                                            <span className="mr-2">{cat.emoji}</span>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Condition</label>
                                            <Select value={selectedCondition} onValueChange={setSelectedCondition} required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Condition" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PRODUCT_CONDITIONS.map((cond) => (
                                                        <SelectItem key={cond.id} value={cond.id}>
                                                            {cond.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <textarea
                                            className="flex min-h-32 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                            placeholder="Describe your product in detail..."
                                            defaultValue={initialData?.description}
                                            required
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Specs & Details */}
                        <motion.div variants={fadeInUp}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <List className="w-4 h-4" />
                                        Specifications & Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                                            Warranty Information
                                        </label>
                                        <Input
                                            value={warranty}
                                            onChange={(e) => setWarranty(e.target.value)}
                                            placeholder="e.g., 1 Year Official Warranty"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-medium">Key Specifications</label>
                                        <div className="space-y-3">
                                            {specs.map((spec, index) => (
                                                <div key={index} className="flex gap-2 items-start">
                                                    <Input
                                                        placeholder="Feature (e.g. RAM)"
                                                        value={spec.key}
                                                        onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                                                        className="flex-1"
                                                    />
                                                    <Input
                                                        placeholder="Value (e.g. 16GB)"
                                                        value={spec.value}
                                                        onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                                                        className="flex-1"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveSpec(index)}
                                                        className="text-muted-foreground hover:text-destructive shrink-0"
                                                    >
                                                        <MinusCircle className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleAddSpec}
                                                className="w-full border-dashed"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Specification
                                            </Button>
                                        </div>
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
                                        {images.map((img: string, i: number) => (
                                            <div
                                                key={i}
                                                className="aspect-square rounded-xl bg-muted relative group overflow-hidden border"
                                            >
                                                {/* In real app, use Next/Image here */}
                                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setImages(images.filter((_, idx) => idx !== i))
                                                    }
                                                    className="absolute top-1 right-1 w-6 h-6 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-sm"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                                {i === 0 && (
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-1">Cover</div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Add Image Button */}
                                        {images.length < 8 && (
                                            <button
                                                type="button"
                                                onClick={() => setImages([...images, "https://github.com/shadcn.png"])}
                                                className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-colors hover:bg-muted/30"
                                            >
                                                <Plus className="w-6 h-6 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">
                                                    Add Image
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3">
                                        Tips: Upload high-quality images. First image is the cover.
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
                                            <Input type="number" defaultValue={initialData?.price} placeholder="0" required min="0" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Compare at Price (₦){" "}
                                            </label>
                                            <Input type="number" defaultValue={initialData?.oldPrice} placeholder="0" min="0" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Inventory & Variants */}
                        <motion.div variants={fadeInUp}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        Inventory & Variants
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {!hasVariants && (
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Stock Quantity</label>
                                                <Input type="number" defaultValue={initialData?.stock} placeholder="0" required min="0" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">
                                                    Low Stock Alert
                                                </label>
                                                <Input type="number" placeholder="5" min="0" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/10">
                                        <input
                                            type="checkbox"
                                            id="variants"
                                            checked={hasVariants}
                                            onChange={(e) => setHasVariants(e.target.checked)}
                                            className="w-4 h-4 accent-primary"
                                        />
                                        <div>
                                            <label htmlFor="variants" className="font-medium text-sm block">
                                                This product has variants
                                            </label>
                                            <p className="text-xs text-muted-foreground">
                                                e.g., different sizes, colors, or options
                                            </p>
                                        </div>
                                    </div>

                                    {hasVariants && (
                                        <div className="space-y-4 border-l-2 border-primary/20 pl-4 py-2">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-sm">Options</h4>
                                                <Button variant="outline" size="sm" type="button">Edit Options</Button>
                                            </div>

                                            {/* Mock Variant Table */}
                                            <div className="border rounded-lg overflow-hidden">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-muted/50">
                                                        <tr>
                                                            <th className="p-3 text-left font-medium">Variant</th>
                                                            <th className="p-3 text-right font-medium">Price</th>
                                                            <th className="p-3 text-center font-medium">Stock</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y">
                                                        <tr>
                                                            <td className="p-3">Red / Large</td>
                                                            <td className="p-3 text-right">
                                                                <Input className="h-8 w-24 ml-auto text-right" defaultValue="15000" />
                                                            </td>
                                                            <td className="p-3 text-center">
                                                                <Input className="h-8 w-16 mx-auto text-center" defaultValue="5" />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="p-3">Blue / Medium</td>
                                                            <td className="p-3 text-right">
                                                                <Input className="h-8 w-24 ml-auto text-right" defaultValue="15000" />
                                                            </td>
                                                            <td className="p-3 text-center">
                                                                <Input className="h-8 w-16 mx-auto text-center" defaultValue="12" />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Card and Category Card from previous implementation can go here if needed... */}
                        <motion.div variants={fadeInUp} className="sticky top-20">
                            <Card>
                                <CardContent className="p-4 space-y-3">
                                    <Button
                                        type="submit"
                                        className="w-full font-bold shadow-lg shadow-primary/20"
                                        disabled={isLoading}
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {isLoading ? "Saving..." : "Save Product"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => router.back()}
                                    >
                                        Discard Changes
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
