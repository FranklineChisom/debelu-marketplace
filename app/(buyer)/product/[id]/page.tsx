"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Heart,
    Share2,
    Star,
    Minus,
    Plus,
    ShoppingCart,
    MessageSquare,
    ChevronRight,
    CheckCircle,
    Store,
    ShieldCheck,
    Truck,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn, formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useCartStore } from "@/stores";

// Mock product data
const mockProduct = {
    id: "1",
    name: "Dell Inspiron 15 Laptop - Core i5, 8GB RAM, 512GB SSD",
    description: `Perfect for students who need a reliable laptop for coding, design work, and everyday use. The Dell Inspiron 15 combines powerful performance with a sleek design, making it the ideal companion for campus life and beyond.

Features:
• 11th Gen Intel Core i5-1135G7 processor for speed and efficiency
• 15.6" Full HD Anti-Glare display for comfortable viewing
• 8GB DDR4 RAM (expandable to 16GB) for multitasking
• 512GB NVMe SSD for fast boot-up and storage
• Intel Iris Xe Graphics for casual gaming and design
• Windows 11 Home pre-installed
• Up to 7 hours battery life to last through classes

Condition: Brand New (Sealed)
Warranty: 1 Year Official Warranty`,
    price: 165000,
    compareAtPrice: 195000,
    images: ["/placeholder1.jpg", "/placeholder2.jpg", "/placeholder3.jpg", "/placeholder4.jpg"],
    category: "Electronics",
    stock: 5,
    rating: 4.8,
    reviewCount: 24,
    vendorName: "TechHub NG",
    vendorId: "vendor1",
    vendorRating: 4.9,
    vendorSales: 156,
    deliveryTime: "Same day (within UNILAG)",
    campusId: "unilag",
    specs: [
        { label: "Processor", value: "Intel Core i5" },
        { label: "RAM", value: "8GB DDR4" },
        { label: "Storage", value: "512GB SSD" },
        { label: "Screen", value: "15.6\" FHD" },
    ]
};

const mockReviews = [
    {
        id: "1",
        userName: "Chioma A.",
        rating: 5,
        comment: "Excellent laptop! Fast and works great for my design work.",
        date: "2 weeks ago",
        verified: true,
    },
    {
        id: "2",
        userName: "Emeka O.",
        rating: 4,
        comment: "Good value for money. Battery could be better but overall satisfied.",
        date: "1 month ago",
        verified: true,
    },
];

export default function ProductDetailPage() {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const isInCart = useCartStore((state) => state.isInCart(mockProduct.id));

    const discountPercent = mockProduct.compareAtPrice
        ? Math.round((1 - mockProduct.price / mockProduct.compareAtPrice) * 100)
        : 0;

    const handleAddToCart = () => {
        addItem(
            {
                id: mockProduct.id,
                name: mockProduct.name,
                price: mockProduct.price,
                compareAtPrice: mockProduct.compareAtPrice,
                image: mockProduct.images[0],
                vendorName: mockProduct.vendorName,
                rating: mockProduct.rating,
                reviewCount: mockProduct.reviewCount,
                stock: mockProduct.stock,
                campusId: mockProduct.campusId,
                vendorId: mockProduct.vendorId,
            },
            quantity
        );
    };

    return (
        <div className="min-h-screen bg-background pb-32 md:pb-20">
            {/* Transparent Floating Header for Mobile / Sticky for Desktop */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 safe-top transition-all">
                <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full hover:bg-muted"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className="rounded-full hover:bg-muted"
                        >
                            <Heart className={cn("w-5 h-5 transition-colors", isWishlisted && "fill-red-500 text-red-500")} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-muted"
                        >
                            <Share2 className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                    {/* Left Column: Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="aspect-[4/3] w-full rounded-3xl bg-muted relative overflow-hidden group">
                            {/* Main Image */}
                            <div className="absolute inset-0 flex items-center justify-center bg-secondary/20">
                                {/* Placeholder for real image */}
                                <div className="text-muted-foreground/30 font-bold text-4xl select-none">
                                    Image {selectedImage + 1}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {discountPercent > 0 && (
                                <Badge variant="destructive" className="absolute top-4 left-4 text-sm font-bold px-3 py-1 shadow-lg">
                                    -{discountPercent}% OFF
                                </Badge>
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-2">
                            {mockProduct.images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={cn(
                                        "w-20 h-20 rounded-xl bg-muted flex-shrink-0 border-2 transition-all p-1",
                                        selectedImage === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                                    )}
                                >
                                    <div className="w-full h-full rounded-lg bg-secondary/50" />
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column: Product Details */}
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="space-y-8"
                    >
                        {/* Header Info */}
                        <motion.div variants={fadeInUp} className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                    {mockProduct.category}
                                </Badge>
                                <div className="flex items-center text-sm font-medium text-amber-500">
                                    <Star className="w-4 h-4 fill-current mr-1" />
                                    {mockProduct.rating}
                                    <span className="text-muted-foreground ml-1">({mockProduct.reviewCount} reviews)</span>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black font-display leading-tight">
                                {mockProduct.name}
                            </h1>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold text-primary">
                                        {formatNaira(mockProduct.price)}
                                    </span>
                                    {mockProduct.compareAtPrice && (
                                        <span className="text-lg text-muted-foreground line-through decoration-2 decoration-destructive/30">
                                            {formatNaira(mockProduct.compareAtPrice)}
                                        </span>
                                    )}
                                </div>
                                {mockProduct.stock <= 5 && (
                                    <p className="text-sm text-red-500 font-medium animate-pulse">
                                        Only {mockProduct.stock} units left in stock!
                                    </p>
                                )}
                            </div>
                        </motion.div>

                        <Separator />

                        {/* Key Specs Grid */}
                        <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
                            {mockProduct.specs.map((spec, i) => (
                                <div key={i} className="p-3 rounded-xl bg-secondary/30 border border-border/50">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{spec.label}</p>
                                    <p className="font-semibold text-sm line-clamp-1" title={spec.value}>{spec.value}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* Vendor Card */}
                        <motion.div variants={fadeInUp}>
                            <Card className="hover:border-primary/30 transition-colors group cursor-pointer bg-card/50">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Store className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold">{mockProduct.vendorName}</h3>
                                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-green-500/30 text-green-600 bg-green-500/5">Verified</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {mockProduct.vendorSales} Sales • {mockProduct.vendorRating} Rating
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Description */}
                        <motion.div variants={fadeInUp} className="space-y-3">
                            <h3 className="font-bold text-lg">About this item</h3>
                            <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base bg-secondary/10 p-4 rounded-2xl border border-border/50">
                                {mockProduct.description}
                            </div>
                        </motion.div>

                        {/* Assurance Badges */}
                        <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                                <ShieldCheck className="w-5 h-5 text-green-600" />
                                <div className="text-xs">
                                    <p className="font-bold text-foreground">Buyer Protection</p>
                                    <p className="text-muted-foreground">Guaranteed refund</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                <Truck className="w-5 h-5 text-blue-600" />
                                <div className="text-xs">
                                    <p className="font-bold text-foreground">Fast Delivery</p>
                                    <p className="text-muted-foreground">Within campus</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                                <Clock className="w-5 h-5 text-purple-600" />
                                <div className="text-xs">
                                    <p className="font-bold text-foreground">24/7 Support</p>
                                    <p className="text-muted-foreground">Always here</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Reviews Preview (Simple) */}
                        <motion.div variants={fadeInUp} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg">Ratings & Reviews</h3>
                                <Button variant="link" className="text-primary p-0 h-auto font-semibold">View All</Button>
                            </div>

                            {/* Mock Review Breakdown */}
                            <div className="flex items-center gap-6 p-6 rounded-3xl bg-secondary/20">
                                <div className="text-center">
                                    <p className="text-5xl font-black text-foreground">{mockProduct.rating}</p>
                                    <div className="flex gap-0.5 justify-center my-1">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} className="w-3 h-3 fill-amber-500 text-amber-500" />
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{mockProduct.reviewCount} Reviews</p>
                                </div>
                                <div className="flex-1 space-y-1">
                                    {[5, 4, 3, 2, 1].map((star, i) => (
                                        <div key={star} className="flex items-center gap-2 text-xs">
                                            <span className="w-2 font-medium">{star}</span>
                                            <Progress value={[80, 15, 5, 0, 0][i]} className="h-1.5" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {mockReviews.map((review) => (
                                    <div key={review.id} className="p-4 rounded-xl border border-border/50 bg-card">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                    {review.userName.charAt(0)}
                                                </div>
                                                <p className="font-bold text-sm">{review.userName}</p>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">{review.date}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </main>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-xl border-t safe-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    {/* Mobile Quantity (Hidden on Desktop usually, but here unified) */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-secondary/50 rounded-xl border border-border/50">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background transition-colors disabled:opacity-50"
                            disabled={quantity <= 1}
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-4 text-center font-bold text-lg">{quantity}</span>
                        <button
                            onClick={() => setQuantity(Math.min(mockProduct.stock, quantity + 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background transition-colors disabled:opacity-50"
                            disabled={quantity >= mockProduct.stock}
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <Button
                        size="lg"
                        className="flex-1 rounded-xl text-base font-bold shadow-lg shadow-primary/20"
                        onClick={handleAddToCart}
                        disabled={isInCart || mockProduct.stock === 0}
                    >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        {isInCart ? "Already in Cart" : mockProduct.stock === 0 ? "Out of Stock" : `Add to Cart - ${formatNaira(mockProduct.price * quantity)}`}
                    </Button>
                </div>
            </div>
        </div>
    );
}
