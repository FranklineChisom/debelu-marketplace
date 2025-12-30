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
    ArrowUpRight,
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
    { id: "3", name: "MacBook Air M2 Case", price: 8500, vendorName: "TechHub NG" },
    { id: "4", name: "Study Lamp LED", price: 12000, vendorName: "HomeGoods" },
    { id: "5", name: "Portable Speaker", price: 15000, vendorName: "SoundWave" },
    { id: "6", name: "USB Hub 4-Port", price: 5500, vendorName: "Gadgets NG" },
];

const topRated = [
    { id: "1", name: "Dell Inspiron 15", price: 165000, rating: 4.9, reviews: 45 },
    { id: "6", name: "JBL Flip 5", price: 35000, rating: 4.8, reviews: 32 },
    { id: "7", name: "Anker PowerBank 20K", price: 22000, rating: 4.8, reviews: 28 },
];

export default function ExplorePage() {
    const router = useRouter();

    return (
        <div className="flex-1 overflow-y-auto scrollbar-thin">
            {/* Header */}
            <header className="h-14 lg:h-16 flex items-center justify-between px-6 lg:px-12 border-b border-foreground/10 sticky top-0 z-30 bg-background">
                <button
                    onClick={() => router.back()}
                    className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg lg:text-xl font-black tracking-tight">EXPLORE</h1>
                <div className="w-10 lg:w-0" />
            </header>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="px-6 lg:px-12 xl:px-20 py-12 lg:py-24 space-y-24 lg:space-y-32"
            >
                {/* Categories - Desktop Grid */}
                <motion.section variants={fadeInUp}>
                    <div className="flex items-end justify-between mb-6 lg:mb-8">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Browse</p>
                            <h2 className="text-2xl lg:text-4xl font-black tracking-tight">Categories</h2>
                        </div>
                        <Link href="/search" className="hidden lg:flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all">
                            View All <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Desktop: Large Grid */}
                    <div className="hidden lg:grid lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {PRODUCT_CATEGORIES.slice(0, 12).map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={`/search?category=${category.id}`}
                                    className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-foreground/10 hover:border-foreground/30 hover:bg-foreground/5 transition-all"
                                >
                                    <span className="text-4xl group-hover:scale-110 transition-transform">
                                        {category.emoji}
                                    </span>
                                    <span className="text-sm font-medium text-center">
                                        {category.name}
                                    </span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mobile: Horizontal Scroll */}
                    <div className="lg:hidden flex gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-2">
                        {PRODUCT_CATEGORIES.slice(0, 10).map((category) => (
                            <Link
                                key={category.id}
                                href={`/search?category=${category.id}`}
                                className="flex-shrink-0 flex flex-col items-center gap-2 p-4 w-20 rounded-xl hover:bg-foreground/5 transition-colors"
                            >
                                <span className="text-2xl">{category.emoji}</span>
                                <span className="text-[10px] text-center font-medium text-muted-foreground line-clamp-1">
                                    {category.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </motion.section>

                {/* Flash Deals */}
                <motion.section variants={fadeInUp}>
                    <div className="flex items-end justify-between mb-6 lg:mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Flame className="w-5 h-5 text-orange-500" />
                                <span className="text-xs uppercase tracking-[0.2em] text-orange-500 font-bold">Hot</span>
                            </div>
                            <h2 className="text-2xl lg:text-4xl font-black tracking-tight">Flash Deals</h2>
                        </div>
                        <Badge className="bg-orange-500 text-white border-0 animate-pulse">
                            <Zap className="w-3 h-3 mr-1" />
                            Limited
                        </Badge>
                    </div>

                    {/* Desktop: Large Cards Grid */}
                    <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:gap-10">
                        {flashDeals.map((deal, index) => (
                            <motion.div
                                key={deal.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/product/${deal.id}`}>
                                    <Card className="group overflow-hidden border-foreground/10 hover:border-foreground/30 transition-all">
                                        <CardContent className="p-0">
                                            <div className="aspect-[4/3] bg-foreground/5 flex items-center justify-center relative">
                                                <span className="text-sm text-muted-foreground">No image</span>
                                                <span className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                                                    -{deal.discount}%
                                                </span>
                                            </div>
                                            <div className="p-5">
                                                <p className="font-bold text-lg mb-2 group-hover:text-emerald-400 transition-colors">
                                                    {deal.name}
                                                </p>
                                                <div className="flex items-baseline gap-3 mb-3">
                                                    <span className="text-2xl font-black">{formatNaira(deal.price)}</span>
                                                    <span className="text-sm text-muted-foreground line-through">
                                                        {formatNaira(deal.originalPrice)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
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

                    {/* Mobile: Horizontal Scroll */}
                    <div className="lg:hidden flex gap-4 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-2">
                        {flashDeals.map((deal) => (
                            <Link key={deal.id} href={`/product/${deal.id}`}>
                                <Card className="w-44 flex-shrink-0 border-foreground/10">
                                    <CardContent className="p-0">
                                        <div className="aspect-square bg-foreground/5 flex items-center justify-center relative">
                                            <span className="text-xs text-muted-foreground">No img</span>
                                            <span className="absolute top-2 left-2 px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full">
                                                -{deal.discount}%
                                            </span>
                                        </div>
                                        <div className="p-3">
                                            <p className="text-sm font-bold line-clamp-1">{deal.name}</p>
                                            <div className="flex items-baseline gap-2 mt-1">
                                                <span className="font-black">{formatNaira(deal.price)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </motion.section>

                {/* Top Rated - Minimal List */}
                <motion.section variants={fadeInUp}>
                    <div className="flex items-end justify-between mb-6 lg:mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Best</span>
                            </div>
                            <h2 className="text-2xl lg:text-4xl font-black tracking-tight">Top Rated</h2>
                        </div>
                        <Link href="/search?sort=rating" className="hidden lg:flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all">
                            View All <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-2">
                        {topRated.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/product/${product.id}`}>
                                    <div className="group flex items-center gap-4 lg:gap-6 p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-foreground/10 hover:border-foreground/30 hover:bg-foreground/5 transition-all">
                                        {/* Rank */}
                                        <span className="text-4xl lg:text-6xl font-black text-foreground/10 group-hover:text-emerald-400/30 transition-colors w-12 lg:w-16">
                                            {index + 1}
                                        </span>

                                        {/* Image */}
                                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-foreground/5 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs text-muted-foreground">No img</span>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-lg lg:text-xl line-clamp-1 group-hover:text-emerald-400 transition-colors">
                                                {product.name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-bold">{product.rating}</span>
                                                <span className="text-sm text-muted-foreground">({product.reviews})</span>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <span className="text-xl lg:text-2xl font-black hidden sm:block">
                                            {formatNaira(product.price)}
                                        </span>

                                        <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:rotate-45 transition-all" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* AI CTA */}
                <motion.section variants={fadeInUp}>
                    <Link href="/chat">
                        <div className="relative p-8 lg:p-12 xl:p-16 rounded-2xl lg:rounded-3xl bg-foreground text-background overflow-hidden group cursor-pointer">
                            {/* Gradient accent */}
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-400/20 to-transparent" />

                            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-background/50 mb-3">AI Powered</p>
                                    <h3 className="text-2xl lg:text-4xl font-black tracking-tight mb-2">
                                        Can't find what you need?
                                    </h3>
                                    <p className="text-background/60 lg:text-lg">
                                        Just tell our AI what you're looking for
                                    </p>
                                </div>
                                <Button size="xl" className="bg-background text-foreground hover:bg-background/90 rounded-full px-8 group-hover:scale-105 transition-transform">
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Chat with AI
                                </Button>
                            </div>
                        </div>
                    </Link>
                </motion.section>
            </motion.div>
        </div>
    );
}
