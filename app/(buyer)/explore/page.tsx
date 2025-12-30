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
    Sparkles,
    Zap,
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
    { id: "3", name: "Phone Stand Holder", price: 3500, originalPrice: 5000, discount: 30, endsIn: "8h 45m" },
];

const newArrivals = [
    { id: "3", name: "MacBook Air M2 Case", price: 8500, vendorName: "TechHub NG", image: null },
    { id: "4", name: "Study Lamp LED", price: 12000, vendorName: "HomeGoods", image: null },
    { id: "5", name: "Portable Speaker", price: 15000, vendorName: "SoundWave", image: null },
    { id: "6", name: "USB Hub 4-Port", price: 5500, vendorName: "Gadgets NG", image: null },
];

const topRated = [
    { id: "1", name: "Dell Inspiron 15", price: 165000, rating: 4.9, reviews: 45 },
    { id: "6", name: "JBL Flip 5", price: 35000, rating: 4.8, reviews: 32 },
    { id: "7", name: "Anker PowerBank 20K", price: 22000, rating: 4.8, reviews: 28 },
];

export default function ExplorePage() {
    const router = useRouter();

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
                <h1 className="font-display text-lg font-bold">Explore</h1>
                <div className="w-10" />
            </header>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="p-4 space-y-8"
            >
                {/* Categories Grid */}
                <motion.section variants={fadeInUp}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display text-lg font-bold">Categories</h2>
                        <Link href="/search" className="text-sm text-primary flex items-center gap-1 hover:gap-2 transition-all">
                            See All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                        {PRODUCT_CATEGORIES.slice(0, 10).map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={`/search?category=${category.id}`}
                                    className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-accent/80 transition-all duration-200 group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm">
                                        {category.emoji}
                                    </div>
                                    <span className="text-[10px] text-center font-medium line-clamp-1 text-muted-foreground group-hover:text-foreground transition-colors">
                                        {category.name}
                                    </span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Flash Deals */}
                <motion.section variants={fadeInUp}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                                <Flame className="w-4 h-4 text-destructive" />
                            </div>
                            <h2 className="font-display text-lg font-bold">Flash Deals</h2>
                        </div>
                        <Badge variant="destructive" className="animate-pulse text-xs px-3 py-1">
                            <Zap className="w-3 h-3 mr-1" />
                            Limited Time
                        </Badge>
                    </div>
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
                        {flashDeals.map((deal, index) => (
                            <motion.div
                                key={deal.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/product/${deal.id}`}>
                                    <Card variant="interactive" className="w-44 flex-shrink-0 overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-muted-foreground relative">
                                                <span className="text-xs">No img</span>
                                                <Badge
                                                    variant="destructive"
                                                    className="absolute top-2 left-2 text-[10px] font-bold"
                                                >
                                                    -{deal.discount}%
                                                </Badge>
                                            </div>
                                            <div className="p-3 space-y-2">
                                                <p className="text-sm font-semibold line-clamp-1">
                                                    {deal.name}
                                                </p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-bold text-base">
                                                        {formatNaira(deal.price)}
                                                    </span>
                                                    <span className="text-[11px] text-muted-foreground line-through">
                                                        {formatNaira(deal.originalPrice)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                    <Clock className="w-3 h-3" />
                                                    Ends in {deal.endsIn}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* New Arrivals */}
                <motion.section variants={fadeInUp}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-primary" />
                            </div>
                            <h2 className="font-display text-lg font-bold">New Arrivals</h2>
                        </div>
                        <Link href="/search?sort=newest" className="text-sm text-primary flex items-center gap-1 hover:gap-2 transition-all">
                            See All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
                        {newArrivals.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/product/${product.id}`}>
                                    <Card variant="interactive" className="w-40 flex-shrink-0">
                                        <CardContent className="p-0">
                                            <div className="aspect-square rounded-t-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-muted-foreground">
                                                <span className="text-xs">No img</span>
                                            </div>
                                            <div className="p-3 space-y-1">
                                                <p className="text-xs font-semibold line-clamp-2">
                                                    {product.name}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    {product.vendorName}
                                                </p>
                                                <span className="font-bold text-sm block pt-1">
                                                    {formatNaira(product.price)}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Top Rated */}
                <motion.section variants={fadeInUp}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                                <Star className="w-4 h-4 fill-warning text-warning" />
                            </div>
                            <h2 className="font-display text-lg font-bold">Top Rated</h2>
                        </div>
                        <Link href="/search?sort=rating" className="text-sm text-primary flex items-center gap-1 hover:gap-2 transition-all">
                            See All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {topRated.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/product/${product.id}`}>
                                    <Card variant="interactive" className="overflow-hidden">
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning/20 to-warning/10 flex items-center justify-center font-bold text-warning shadow-sm">
                                                #{index + 1}
                                            </div>
                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex-shrink-0 flex items-center justify-center text-[10px] text-muted-foreground">
                                                No img
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold line-clamp-1">
                                                    {product.name}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="flex items-center text-sm font-medium">
                                                        <Star className="w-4 h-4 fill-warning text-warning mr-1" />
                                                        {product.rating}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        ({product.reviews} reviews)
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="font-bold text-lg">
                                                {formatNaira(product.price)}
                                            </span>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* AI Chat CTA */}
                <motion.section variants={fadeInUp}>
                    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                        <CardContent className="p-6 text-center relative z-10">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center">
                                <Sparkles className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="font-display text-xl font-bold mb-2">
                                Can't find what you need?
                            </h3>
                            <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">
                                Our AI assistant can help you discover the perfect products
                            </p>
                            <Link href="/chat">
                                <Button variant="glow" size="lg">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Chat with AI
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.section>
            </motion.div>
        </div>
    );
}
