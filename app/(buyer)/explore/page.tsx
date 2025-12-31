"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
    ArrowUpRight,
    Sparkles,
    Search,
    Filter,
    ArrowRight,
    Star,
    Heart,
    ShoppingBag,
    Smartphone,
    Shirt,
    Pizza,
    Book,
    Home,
    Dumbbell,
    Ticket,
    Package,
    Wrench,
    Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatNaira, cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { useMarketplaceStore } from "@/stores/useMarketplaceStore";
import { Product } from "@/types/product";

// Mock Data for Bento Grid
const FEATURED_ITEMS = [
    {
        id: "1",
        name: "MacBook Air M2",
        price: 950000,
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2670&auto=format&fit=crop",
        category: "Electronics",
        span: "col-span-12 md:col-span-8 row-span-2",
        dark: true
    },
    {
        id: "2",
        name: "Nike Air Jordan",
        price: 85000,
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2670&auto=format&fit=crop",
        category: "Fashion",
        span: "col-span-6 md:col-span-4 row-span-1",
        dark: false
    },
    {
        id: "3",
        name: "Sony XM5",
        price: 350000,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=2588&auto=format&fit=crop",
        category: "Audio",
        span: "col-span-6 md:col-span-4 row-span-1",
        dark: true
    },
    {
        id: "4",
        name: "Minimalist Set",
        price: 45000,
        image: "https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?q=80&w=2670&auto=format&fit=crop",
        category: "Lifestyle",
        span: "col-span-6 md:col-span-4 row-span-2",
        dark: false
    },
    {
        id: "5",
        name: "Mechanical Keyboard",
        price: 120000,
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2671&auto=format&fit=crop",
        category: "Tech",
        span: "col-span-6 md:col-span-4 row-span-1",
        dark: true
    },
    {
        id: "6",
        name: "Skincare Bundle",
        price: 25000,
        image: "https://images.unsplash.com/photo-1556228720-1917387cc833?q=80&w=2669&auto=format&fit=crop",
        category: "Beauty",
        span: "col-span-12 md:col-span-4 row-span-1",
        dark: false
    }
];

const FILTERS = ["All", "Trending", "For You", "New Arrivals", "Deals"];

export default function ExplorePage() {
    const router = useRouter();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ container: containerRef });
    const [activeFilter, setActiveFilter] = useState("All");
    const [showAllCategories, setShowAllCategories] = useState(false);

    // Fetch products from store
    const storeProducts = useMarketplaceStore((state) => state.products);
    const fetchInitialData = useMarketplaceStore((state) => state.fetchInitialData);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            try {
                await fetchInitialData();
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setIsLoading(false);
            }
        }
        if (storeProducts.length === 0) {
            loadProducts();
        } else {
            setIsLoading(false);
        }
    }, [fetchInitialData, storeProducts.length]);

    // Map store products to bento grid format with fallback
    const bentoSpans = [
        "col-span-12 md:col-span-8 row-span-2",
        "col-span-6 md:col-span-4 row-span-1",
        "col-span-6 md:col-span-4 row-span-1",
        "col-span-6 md:col-span-4 row-span-2",
        "col-span-6 md:col-span-4 row-span-1",
        "col-span-12 md:col-span-4 row-span-1",
    ];

    const featuredItems = storeProducts.slice(0, 6).map((p, i) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.images?.[0]?.url || "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2670&auto=format&fit=crop",
        category: p.category,
        span: bentoSpans[i % bentoSpans.length],
        dark: i % 2 === 0,
    }));

    const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    // Icon mapping for categories
    const CategoryIcons: Record<string, any> = {
        electronics: Smartphone,
        fashion: Shirt,
        food: Pizza, // or Utensils
        books: Book,
        beauty: Sparkles,
        home: Home,
        sports: Dumbbell,
        services: Wrench,
        tickets: Ticket,
        other: Package
    };

    return (
        <div ref={containerRef} className="h-full overflow-y-auto bg-background scrollbar-hide relative">

            {/* Sticky Header */}
            <motion.header
                style={{ opacity: headerOpacity }}
                className="fixed top-0 inset-x-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border/40 z-40 flex items-center justify-between px-4 lg:px-8 pointer-events-none data-[visible=true]:pointer-events-auto"
            >
                <span className="font-display font-bold text-lg">Explore</span>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Search className="w-5 h-5" />
                    </Button>
                </div>
            </motion.header>

            <div className="min-h-full pb-20">

                {/* Hero Section */}
                <motion.div
                    // Removed opacity fade to prevent disappearing content
                    className="pt-20 pb-8 px-4 lg:px-12 max-w-7xl mx-auto"
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <motion.div variants={staggerContainer} initial="initial" animate="animate">
                            <motion.p variants={fadeInUp} className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                Curated for you
                            </motion.p>
                            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[0.9]">
                                Discover <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50">
                                    Extraordinary.
                                </span>
                            </motion.h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex gap-2"
                        >
                            <Button size="lg" className="rounded-full h-12 px-6 text-base" onClick={() => router.push('/search')}>
                                <Search className="w-4 h-4 mr-2" />
                                Search Market
                            </Button>
                        </motion.div>
                    </div>

                    {/* Filter Bar */}
                    <div className="mb-10">
                        <ScrollArea className="w-full whitespace-nowrap pb-4">
                            <div className="flex gap-2">
                                {FILTERS.map((filter, i) => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        className={cn(
                                            "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                                            activeFilter === filter
                                                ? "bg-foreground text-background shadow-lg scale-105"
                                                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        {filter}
                                    </button>
                                ))}
                                <div className="w-px h-6 bg-border mx-2 self-center" />
                                <button className="px-4 py-2.5 rounded-full text-sm font-medium bg-muted/30 text-muted-foreground hover:bg-muted transition-colors flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    Filter
                                </button>
                            </div>
                            <ScrollBar orientation="horizontal" className="invisible" />
                        </ScrollArea>
                    </div>

                    {/* Bento Grid */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-12 gap-4 auto-rows-[250px]">
                            {featuredItems.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className={cn(
                                        "group relative rounded-3xl overflow-hidden cursor-pointer bg-muted transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5",
                                        item.span
                                    )}
                                    onClick={() => router.push(`/product/${item.id}`)}
                                >
                                    {/* Image Background */}
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Overlay Gradient */}
                                    <div className={cn(
                                        "absolute inset-0 transition-opacity duration-300",
                                        item.dark
                                            ? "bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-70" :
                                            "bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-30 group-hover:opacity-40"
                                    )} />

                                    {/* Content */}
                                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-none">
                                                    {item.category}
                                                </Badge>
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border-none"
                                                >
                                                    <Heart className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-1 leading-tight">{item.name}</h3>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 text-white/90">
                                                <span className="font-semibold">{formatNaira(item.price)}</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Categories Strip */}
                <div className="py-12 border-t border-border/40">
                    <div className="px-4 lg:px-12 max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold tracking-tight">Browse by Category</h2>
                            <button
                                onClick={() => setShowAllCategories(!showAllCategories)}
                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                            >
                                {showAllCategories ? "Show Less" : "View All"} <ArrowRight className={cn("w-4 h-4 transition-transform", showAllCategories && "rotate-90")} />
                            </button>
                        </div>

                        <motion.div
                            layout
                            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                        >
                            {PRODUCT_CATEGORIES.slice(0, showAllCategories ? undefined : 6).map((cat, i) => {
                                const Icon = CategoryIcons[cat.id] || Sparkles;
                                return (
                                    <Link
                                        key={cat.id}
                                        href={`/search?category=${cat.id}`}
                                        className="group flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/50 hover:bg-background transition-all duration-300 hover:shadow-lg"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                            <Icon className="w-6 h-6 text-foreground/80 group-hover:text-primary transition-colors" />
                                        </div>
                                        <span className="font-medium text-sm text-center">{cat.name}</span>
                                    </Link>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>

                {/* AI Assistant CTA */}
                <div className="px-4 lg:px-12 max-w-7xl mx-auto mb-20">
                    <div className="relative rounded-3xl overflow-hidden bg-foreground text-background p-8 md:p-12 lg:p-16">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10 max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/10 text-background/80 text-xs font-medium mb-6">
                                <Sparkles className="w-3 h-3" />
                                AI Powered
                            </div>
                            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
                                Can't find exactly <br /> what you need?
                            </h2>
                            <p className="text-lg text-background/70 mb-8 max-w-md">
                                Let Debelu AI help you find the perfect item, compare prices, or track down a specific vendor on campus.
                            </p>
                            <Button
                                size="lg"
                                className="h-14 px-8 rounded-full bg-background text-foreground hover:bg-background/90 font-semibold text-lg"
                                onClick={() => router.push('/chat')}
                            >
                                Chat with AI
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
