"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Heart,
    Trash2,
    ShoppingCart,
    Bell,
    BellOff,
    Sparkles,
    MoreHorizontal,
    Share2,
    ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatNaira } from "@/lib/utils";
import { useCartStore } from "@/stores";

// Mock wishlist items with real images
const mockWishlist = [
    {
        id: "1",
        name: "Dell Inspiron 15 Laptop",
        description: "Core i5, 8GB RAM, 512GB SSD",
        price: 165000,
        originalPrice: 195000,
        image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=400&auto=format&fit=crop",
        vendorName: "TechHub NG",
        inStock: true,
        priceAlert: true,
        addedAt: "2 days ago",
    },
    {
        id: "2",
        name: "Apple AirPods Pro",
        description: "2nd Generation with MagSafe",
        price: 120000,
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=400&auto=format&fit=crop",
        vendorName: "GadgetZone",
        inStock: true,
        priceAlert: false,
        addedAt: "1 week ago",
    },
    {
        id: "3",
        name: "Samsung Galaxy Watch 5",
        description: "44mm, Bluetooth, Graphite",
        price: 85000,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=400&auto=format&fit=crop",
        vendorName: "TechHub NG",
        inStock: false,
        priceAlert: true,
        addedAt: "2 weeks ago",
    },
    {
        id: "4",
        name: "Sony WH-1000XM5",
        description: "Wireless Noise Cancelling Headphones",
        price: 185000,
        originalPrice: 220000,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=400&auto=format&fit=crop",
        vendorName: "AudioWorld",
        inStock: true,
        priceAlert: false,
        addedAt: "3 days ago",
    },
];

export default function WishlistPage() {
    const router = useRouter();
    const [items, setItems] = useState(mockWishlist);
    const addItem = useCartStore((state) => state.addItem);

    const togglePriceAlert = (id: string) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, priceAlert: !item.priceAlert } : item
            )
        );
    };

    const removeItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const handleAddToCart = (item: typeof mockWishlist[0]) => {
        addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            vendorName: item.vendorName,
            rating: 4.5,
            reviewCount: 100,
            stock: 10,
            campusId: "unilag",
            vendorId: "v1",
        });
    };

    return (
        <div className="flex-1 overflow-y-auto bg-background">
            {/* Minimal Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border/40">
                <div className="flex items-center justify-between px-4 h-16 max-w-3xl mx-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="-ml-2 rounded-full hover:bg-muted"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="font-semibold text-base">Wishlist</h1>
                    <div className="w-10" />
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 py-6 pb-20">
                {items.length === 0 ? (
                    // Empty State - Premium Feel
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-24"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                            className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 flex items-center justify-center"
                        >
                            <Heart className="w-12 h-12 text-rose-400" />
                        </motion.div>
                        <h2 className="text-2xl font-bold tracking-tight mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
                            Save items you love and we'll notify you when prices drop
                        </p>
                        <Link href="/explore">
                            <Button className="h-12 px-8 rounded-2xl bg-foreground text-background hover:bg-foreground/90">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Start Exploring
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {/* Header Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between"
                        >
                            <p className="text-sm text-muted-foreground">
                                {items.length} {items.length === 1 ? "item" : "items"} saved
                            </p>
                            <Button variant="link" className="text-sm font-medium h-auto p-0">
                                Share All
                            </Button>
                        </motion.div>

                        {/* Wishlist Grid */}
                        <AnimatePresence mode="popLayout">
                            <div className="grid gap-4 sm:grid-cols-2">
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                        layout
                                        className="group relative bg-card border border-border/50 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
                                    >
                                        {/* Image Container */}
                                        <Link href={`/product/${item.id}`}>
                                            <div className="relative aspect-square bg-muted overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />

                                                {/* Discount Badge */}
                                                {item.originalPrice && (
                                                    <div className="absolute top-3 left-3">
                                                        <Badge className="bg-rose-500 text-white border-0 font-semibold">
                                                            {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                                                        </Badge>
                                                    </div>
                                                )}

                                                {/* Out of Stock Overlay */}
                                                {!item.inStock && (
                                                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                                                        <span className="text-sm font-medium text-muted-foreground">Out of Stock</span>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>

                                        {/* Quick Actions - Top Right */}
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    togglePriceAlert(item.id);
                                                }}
                                                className={cn(
                                                    "w-9 h-9 rounded-full backdrop-blur-xl transition-all",
                                                    item.priceAlert
                                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                                        : "bg-background/80 text-muted-foreground hover:bg-background"
                                                )}
                                            >
                                                {item.priceAlert ? (
                                                    <Bell className="w-4 h-4" />
                                                ) : (
                                                    <BellOff className="w-4 h-4" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    removeItem(item.id);
                                                }}
                                                className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 space-y-3">
                                            <div>
                                                <Link href={`/product/${item.id}`}>
                                                    <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors">
                                                        {item.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {item.description}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-lg font-bold">{formatNaira(item.price)}</span>
                                                    {item.originalPrice && (
                                                        <span className="text-sm text-muted-foreground line-through ml-2">
                                                            {formatNaira(item.originalPrice)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-1">
                                                <span className="text-xs text-muted-foreground">
                                                    {item.vendorName} • {item.addedAt}
                                                </span>
                                            </div>

                                            {/* Add to Cart Button */}
                                            <Button
                                                onClick={() => handleAddToCart(item)}
                                                disabled={!item.inStock}
                                                className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-medium"
                                            >
                                                <ShoppingCart className="w-4 h-4 mr-2" />
                                                {item.inStock ? "Add to Cart" : "Out of Stock"}
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </AnimatePresence>

                        {/* Price Alert Info */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-muted/50 rounded-2xl p-4 flex items-start gap-3"
                        >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Bell className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-medium text-sm mb-1">Price Alerts</h4>
                                <p className="text-xs text-muted-foreground">
                                    Enable price alerts on items to get notified when prices drop.
                                    We'll send you a notification so you never miss a deal.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
