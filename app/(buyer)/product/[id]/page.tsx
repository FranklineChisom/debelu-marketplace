"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useCartStore } from "@/stores";

// Mock product data
const mockProduct = {
    id: "1",
    name: "Dell Inspiron 15 Laptop - Core i5, 8GB RAM, 512GB SSD",
    description: `Perfect for students who need a reliable laptop for coding, design work, and everyday use.

Features:
• 11th Gen Intel Core i5-1135G7 processor
• 15.6" Full HD Anti-Glare display
• 8GB DDR4 RAM (expandable to 16GB)
• 512GB NVMe SSD
• Intel Iris Xe Graphics
• Windows 11 Home
• Up to 7 hours battery life

Comes with 1-year warranty. Original charger included.`,
    price: 165000,
    compareAtPrice: 195000,
    images: ["/placeholder1.jpg", "/placeholder2.jpg", "/placeholder3.jpg"],
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
            },
            quantity
        );
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 bg-background/80 backdrop-blur-lg border-b safe-top">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
                    >
                        <Heart
                            className={cn(
                                "w-5 h-5 transition-colors",
                                isWishlisted && "fill-destructive text-destructive"
                            )}
                        />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="pt-14"
            >
                {/* Image Gallery */}
                <motion.div variants={fadeInUp} className="relative">
                    <div className="aspect-square bg-muted">
                        {mockProduct.images[selectedImage] ? (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                Product Image {selectedImage + 1}
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No image
                            </div>
                        )}
                    </div>

                    {/* Discount Badge */}
                    {discountPercent > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute top-4 left-4 text-sm"
                        >
                            -{discountPercent}%
                        </Badge>
                    )}

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {mockProduct.images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(i)}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all",
                                    i === selectedImage ? "bg-primary w-4" : "bg-white/50"
                                )}
                            />
                        ))}
                    </div>
                </motion.div>

                <div className="p-4 space-y-6">
                    {/* Title & Price */}
                    <motion.div variants={fadeInUp}>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <Badge variant="secondary" className="text-xs">
                                {mockProduct.category}
                            </Badge>
                            {mockProduct.stock <= 5 && mockProduct.stock > 0 && (
                                <Badge variant="warning" className="text-xs">
                                    Only {mockProduct.stock} left
                                </Badge>
                            )}
                        </div>
                        <h1 className="font-display text-xl font-bold leading-tight">
                            {mockProduct.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center">
                                <Star className="w-4 h-4 fill-warning text-warning" />
                                <span className="text-sm font-medium ml-1">
                                    {mockProduct.rating}
                                </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                ({mockProduct.reviewCount} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mt-3">
                            <span className="text-2xl font-bold">
                                {formatNaira(mockProduct.price)}
                            </span>
                            {mockProduct.compareAtPrice && (
                                <span className="text-base text-muted-foreground line-through">
                                    {formatNaira(mockProduct.compareAtPrice)}
                                </span>
                            )}
                        </div>
                    </motion.div>

                    {/* Vendor Info */}
                    <motion.div variants={fadeInUp}>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                            <Store className="w-5 h-5 text-primary-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">
                                                {mockProduct.vendorName}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span className="flex items-center">
                                                    <Star className="w-3 h-3 fill-warning text-warning mr-1" />
                                                    {mockProduct.vendorRating}
                                                </span>
                                                <span>•</span>
                                                <span>{mockProduct.vendorSales} sales</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Chat
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Delivery */}
                    <motion.div variants={fadeInUp}>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-success/10 border border-success/20">
                            <CheckCircle className="w-5 h-5 text-success" />
                            <div>
                                <p className="font-medium text-sm">Delivery</p>
                                <p className="text-xs text-muted-foreground">
                                    {mockProduct.deliveryTime}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Description */}
                    <motion.div variants={fadeInUp}>
                        <h2 className="font-display font-bold mb-2">Description</h2>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {mockProduct.description}
                        </p>
                    </motion.div>

                    {/* Reviews */}
                    <motion.div variants={fadeInUp}>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-display font-bold">Reviews</h2>
                            <button className="text-sm text-primary flex items-center">
                                See all <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {mockReviews.map((review) => (
                                <Card key={review.id}>
                                    <CardContent className="p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">
                                                    {review.userName}
                                                </span>
                                                {review.verified && (
                                                    <Badge variant="secondary" className="text-[10px]">
                                                        Verified
                                                    </Badge>
                                                )}
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {review.date}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-0.5 mb-2">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={cn(
                                                        "w-3 h-3",
                                                        i < review.rating
                                                            ? "fill-warning text-warning"
                                                            : "text-muted"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {review.comment}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t safe-bottom">
                <div className="flex items-center gap-3">
                    {/* Quantity */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                            disabled={quantity <= 1}
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{quantity}</span>
                        <button
                            onClick={() =>
                                setQuantity(Math.min(mockProduct.stock, quantity + 1))
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                            disabled={quantity >= mockProduct.stock}
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Add to Cart */}
                    <Button
                        className="flex-1"
                        size="lg"
                        onClick={handleAddToCart}
                        disabled={isInCart || mockProduct.stock === 0}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {isInCart
                            ? "In Cart"
                            : mockProduct.stock === 0
                                ? "Out of Stock"
                                : `Add to Cart • ${formatNaira(mockProduct.price * quantity)}`}
                    </Button>
                </div>
            </div>
        </div>
    );
}
