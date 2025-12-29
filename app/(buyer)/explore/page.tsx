"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft,
    TrendingUp,
    Flame,
    Clock,
    Star,
    ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { PRODUCT_CATEGORIES } from "@/lib/constants";

// Mock trending data
const flashDeals = [
    { id: "1", name: "Wireless Earbuds Pro", price: 18000, originalPrice: 25000, discount: 28, endsIn: "2h 15m" },
    { id: "2", name: "USB-C Fast Charger", price: 4500, originalPrice: 6000, discount: 25, endsIn: "5h 30m" },
];

const newArrivals = [
    { id: "3", name: "MacBook Air M2 Case", price: 8500, vendorName: "TechHub NG", image: null },
    { id: "4", name: "Study Lamp LED", price: 12000, vendorName: "HomeGoods", image: null },
    { id: "5", name: "Portable Speaker", price: 15000, vendorName: "SoundWave", image: null },
];

const topRated = [
    { id: "1", name: "Dell Inspiron 15", price: 165000, rating: 4.9, reviews: 45 },
    { id: "6", name: "JBL Flip 5", price: 35000, rating: 4.8, reviews: 32 },
    { id: "7", name: "Anker PowerBank 20K", price: 22000, rating: 4.8, reviews: 28 },
];

export default function ExplorePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="h-14 flex items-center justify-between px-4 border-b bg-background sticky top-0 z-30">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="font-display text-lg font-bold">Explore</h1>
                <div className="w-10" />
            </header>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="p-4 space-y-6"
            >
                {/* Categories Grid */}
                <motion.div variants={fadeInUp}>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-display font-bold">Categories</h2>
                        <Link href="/search" className="text-sm text-primary flex items-center">
                            See All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {PRODUCT_CATEGORIES.slice(0, 10).map((category) => (
                            <Link
                                key={category.id}
                                href={`/search?category=${category.id}`}
                                className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-muted transition-colors"
                            >
                                <span className="text-2xl">{category.emoji}</span>
                                <span className="text-[10px] text-center line-clamp-1">
                                    {category.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Flash Deals */}
                <motion.div variants={fadeInUp}>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-display font-bold flex items-center gap-2">
                            <Flame className="w-4 h-4 text-destructive" />
                            Flash Deals
                        </h2>
                        <Badge variant="destructive" className="text-xs">
                            Limited Time
                        </Badge>
                    </div>
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
                        {flashDeals.map((deal) => (
                            <Link key={deal.id} href={`/product/${deal.id}`}>
                                <Card className="w-40 flex-shrink-0 hover:border-primary/50 transition-colors">
                                    <CardContent className="p-3">
                                        <div className="aspect-square rounded-lg bg-muted mb-2 flex items-center justify-center text-xs text-muted-foreground">
                                            No img
                                        </div>
                                        <p className="text-sm font-medium line-clamp-1 mb-1">
                                            {deal.name}
                                        </p>
                                        <div className="flex items-baseline gap-1 mb-1">
                                            <span className="font-bold text-sm">
                                                {formatNaira(deal.price)}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground line-through">
                                                {formatNaira(deal.originalPrice)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Badge variant="destructive" className="text-[10px]">
                                                -{deal.discount}%
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {deal.endsIn}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* New Arrivals */}
                <motion.div variants={fadeInUp}>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-display font-bold flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            New Arrivals
                        </h2>
                        <Link href="/search?sort=newest" className="text-sm text-primary flex items-center">
                            See All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
                        {newArrivals.map((product) => (
                            <Link key={product.id} href={`/product/${product.id}`}>
                                <Card className="w-36 flex-shrink-0 hover:border-primary/50 transition-colors">
                                    <CardContent className="p-3">
                                        <div className="aspect-square rounded-lg bg-muted mb-2 flex items-center justify-center text-xs text-muted-foreground">
                                            No img
                                        </div>
                                        <p className="text-xs font-medium line-clamp-2 mb-1">
                                            {product.name}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground mb-1">
                                            {product.vendorName}
                                        </p>
                                        <span className="font-bold text-sm">
                                            {formatNaira(product.price)}
                                        </span>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Top Rated */}
                <motion.div variants={fadeInUp}>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-display font-bold flex items-center gap-2">
                            <Star className="w-4 h-4 fill-warning text-warning" />
                            Top Rated
                        </h2>
                        <Link href="/search?sort=rating" className="text-sm text-primary flex items-center">
                            See All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {topRated.map((product, i) => (
                            <Link key={product.id} href={`/product/${product.id}`}>
                                <Card className="hover:border-primary/50 transition-colors">
                                    <CardContent className="p-3 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center font-bold text-sm text-warning">
                                            {i + 1}
                                        </div>
                                        <div className="w-14 h-14 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center text-[10px] text-muted-foreground">
                                            No img
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm line-clamp-1">
                                                {product.name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="flex items-center text-xs">
                                                    <Star className="w-3 h-3 fill-warning text-warning mr-0.5" />
                                                    {product.rating}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({product.reviews} reviews)
                                                </span>
                                            </div>
                                        </div>
                                        <span className="font-bold text-sm">
                                            {formatNaira(product.price)}
                                        </span>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={fadeInUp}>
                    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                        <CardContent className="p-4 text-center">
                            <h3 className="font-display font-bold mb-2">
                                Can't find what you need?
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Our AI assistant can help you discover products
                            </p>
                            <Link href="/chat">
                                <Button>Chat with AI</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}
