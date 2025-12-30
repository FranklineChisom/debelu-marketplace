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
    TrendingDown,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

// Mock wishlist items
const mockWishlist = [
    {
        id: "1",
        name: "Dell Inspiron 15 Laptop - Core i5, 8GB RAM, 512GB SSD",
        price: 165000,
        originalPrice: 195000,
        image: null,
        vendorName: "TechHub NG",
        inStock: true,
        priceAlert: true,
        addedAt: "2 days ago",
    },
    {
        id: "2",
        name: "Apple AirPods Pro 2nd Gen",
        price: 120000,
        image: null,
        vendorName: "GadgetZone",
        inStock: true,
        priceAlert: false,
        addedAt: "1 week ago",
    },
    {
        id: "3",
        name: "Samsung Galaxy Watch 5",
        price: 85000,
        image: null,
        vendorName: "TechHub NG",
        inStock: false,
        priceAlert: true,
        addedAt: "2 weeks ago",
    },
];

export default function WishlistPage() {
    const router = useRouter();
    const [items, setItems] = useState(mockWishlist);

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

    return (
        <div className="flex-1 overflow-y-auto scrollbar-thin pb-4">
            {/* Header */}
            <header className="h-14 flex items-center justify-between px-4 border-b bg-background/80 backdrop-blur-lg sticky top-0 z-30">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-accent transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="font-display text-lg font-bold">Wishlist</h1>
                <div className="w-10" />
            </header>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="p-4"
            >
                {items.length === 0 ? (
                    // Empty State
                    <motion.div variants={fadeInUp} className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
                            <Heart className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h2 className="font-display text-2xl font-bold mb-3">
                            Your wishlist is empty
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
                            Save items you love and get notified when prices drop
                        </p>
                        <Link href="/explore">
                            <Button variant="glow" size="lg">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Start Exploring
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        <motion.p variants={fadeInUp} className="text-sm text-muted-foreground">
                            {items.length} {items.length === 1 ? "item" : "items"} saved
                        </motion.p>

                        <AnimatePresence mode="popLayout">
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    variants={fadeInUp}
                                    layout
                                    exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                                >
                                    <Card variant="premium" className="overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="flex gap-4 p-4">
                                                {/* Image */}
                                                <Link href={`/product/${item.id}`}>
                                                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground overflow-hidden">
                                                        {item.image ? (
                                                            <Image
                                                                src={item.image}
                                                                alt={item.name}
                                                                width={96}
                                                                height={96}
                                                                className="rounded-2xl object-cover"
                                                            />
                                                        ) : (
                                                            "No img"
                                                        )}
                                                    </div>
                                                </Link>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <Link href={`/product/${item.id}`}>
                                                        <h3 className="font-semibold line-clamp-2 mb-1 hover:text-primary transition-colors">
                                                            {item.name}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-xs text-muted-foreground mb-2">
                                                        {item.vendorName}
                                                    </p>

                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-bold text-lg">
                                                            {formatNaira(item.price)}
                                                        </span>
                                                        {item.originalPrice && (
                                                            <>
                                                                <span className="text-sm text-muted-foreground line-through">
                                                                    {formatNaira(item.originalPrice)}
                                                                </span>
                                                                <Badge variant="destructive" className="text-[10px] font-bold">
                                                                    <TrendingDown className="w-3 h-3 mr-0.5" />
                                                                    {Math.round(
                                                                        (1 - item.price / item.originalPrice) * 100
                                                                    )}% off
                                                                </Badge>
                                                            </>
                                                        )}
                                                    </div>

                                                    {!item.inStock && (
                                                        <Badge variant="secondary" className="text-[10px] mt-2">
                                                            Out of Stock
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex border-t">
                                                <button
                                                    onClick={() => togglePriceAlert(item.id)}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm hover:bg-accent transition-colors"
                                                >
                                                    {item.priceAlert ? (
                                                        <>
                                                            <Bell className="w-4 h-4 text-primary" />
                                                            <span className="text-primary font-medium">Alert On</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <BellOff className="w-4 h-4 text-muted-foreground" />
                                                            <span className="text-muted-foreground">Alert Off</span>
                                                        </>
                                                    )}
                                                </button>
                                                <div className="w-px bg-border" />
                                                <button
                                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={!item.inStock}
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                    <span className="font-medium">Add to Cart</span>
                                                </button>
                                                <div className="w-px bg-border" />
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="font-medium">Remove</span>
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
