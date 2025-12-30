"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Search,
    X,
    ArrowLeft,
    Clock,
    TrendingUp,
    Sparkles,
    Mic,
    Filter,
    LayoutGrid,
    List,
    ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { PRODUCT_CATEGORIES, CHAT_SUGGESTIONS } from "@/lib/constants";

// Mock recent searches
const recentSearches = ["MacBook Pro", "Anime Hoodie", "Calculus Textbook", "Gaming Mouse"];

// Mock trending products
const trendingProducts = [
    { id: "1", name: "Dell Inspiron 15 Laptop", price: 165000, category: "Electronics", image: null },
    { id: "2", name: "iPhone 12 Case Bundle", price: 9000, category: "Accessories", image: null },
    { id: "3", name: "USB-C Hub 7-in-1", price: 12500, category: "Electronics", image: null },
];

// Mock search results
const mockSearchResults = [
    {
        id: "1",
        name: "Dell Inspiron 15 Laptop - Core i5, 8GB RAM",
        price: 165000,
        compareAtPrice: 195000,
        image: null,
        vendorName: "TechHub NG",
        rating: 4.8,
        reviewCount: 24,
        category: "Electronics"
    },
    {
        id: "2",
        name: "HP Pavilion 14 Laptop",
        price: 145000,
        image: null,
        vendorName: "CompStation",
        rating: 4.5,
        reviewCount: 12,
        category: "Electronics"
    },
    {
        id: "3",
        name: "Lenovo IdeaPad 3",
        price: 135000,
        image: null,
        vendorName: "TechHub NG",
        rating: 4.6,
        reviewCount: 18,
        category: "Electronics"
    },
    {
        id: "4",
        name: "Logitech MX Master 3S",
        price: 85000,
        image: null,
        vendorName: "GadgetWorld",
        rating: 4.9,
        reviewCount: 156,
        category: "Accessories"
    },
];

const filters = ["All", "Electronics", "Fashion", "Books", "Food", "Services"];

function SearchPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";

    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState(initialQuery);
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<typeof mockSearchResults>([]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        if (!initialQuery) {
            inputRef.current?.focus();
        }
    }, [initialQuery]);

    useEffect(() => {
        if (query.length > 2) {
            setIsSearching(true);
            // Simulate search delay
            const timer = setTimeout(() => {
                setResults(mockSearchResults); // In real app, filter based on query
                setIsSearching(false);
            }, 600);
            return () => clearTimeout(timer);
        } else {
            setResults([]);
        }
    }, [query]);

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
    };

    const clearSearch = () => {
        setQuery("");
        inputRef.current?.focus();
    };

    const startVoiceSearch = () => {
        setIsListening(true);
        setTimeout(() => setIsListening(false), 2000); // Simulate listening
    };

    return (
        <div className="min-h-screen bg-background pb-20 flex flex-col">
            {/* Premium Sticky Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 safe-top">
                <div className="p-4 space-y-4">
                    {/* Search Bar Row */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="rounded-full hover:bg-muted/50 flex-shrink-0"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="relative flex-1 group">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                            <div className="relative flex items-center bg-muted/50 border border-border/50 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-background transition-all">
                                <Search className="w-5 h-5 text-muted-foreground ml-3" />
                                <Input
                                    ref={inputRef}
                                    placeholder="Search for anything..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="border-0 bg-transparent focus-visible:ring-0 shadow-none h-12 text-base px-3"
                                />
                                {query ? (
                                    <button
                                        onClick={clearSearch}
                                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={startVoiceSearch}
                                        className={`p-2 transition-colors ${isListening ? 'text-primary animate-pulse' : 'text-muted-foreground hover:text-primary'}`}
                                    >
                                        <Mic className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Filter Chips - Horizontal Scroll */}
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 mask-fade-sides">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-dashed border-muted-foreground/30 flex-shrink-0"
                        >
                            <Filter className="w-3.5 h-3.5 mr-2" />
                            Filters
                        </Button>
                        <Separator orientation="vertical" className="h-6" />
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 border",
                                    activeFilter === filter
                                        ? "bg-foreground text-background border-foreground shadow-lg shadow-foreground/20"
                                        : "bg-background text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground"
                                )}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="p-4 max-w-4xl mx-auto min-h-full">
                    <AnimatePresence mode="wait">
                        {query.length === 0 ? (
                            // Empty state: Discovery Mode
                            <motion.div
                                key="discovery"
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                                exit={{ opacity: 0 }}
                                className="space-y-8 py-4"
                            >
                                {/* Recent Searches */}
                                {recentSearches.length > 0 && (
                                    <motion.div variants={fadeInUp} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                Recent
                                            </h2>
                                            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-primary">
                                                Clear All
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {recentSearches.map((search) => (
                                                <div
                                                    key={search}
                                                    onClick={() => handleSearch(search)}
                                                    className="group cursor-pointer px-4 py-2 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-95 flex items-center gap-2"
                                                >
                                                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{search}</span>
                                                    <ArrowLeft className="w-3 h-3 text-muted-foreground/50 rotate-180 group-hover:text-primary/50 group-hover:translate-x-0.5 transition-all" />
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Popular / Trending */}
                                <motion.div variants={fadeInUp} className="space-y-4">
                                    <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        Trending Now
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {trendingProducts.map((product, i) => (
                                            <div
                                                key={product.id}
                                                className="flex items-center gap-4 p-3 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all cursor-pointer group"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-muted flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                                                    <ShoppingBag className="w-5 h-5 text-muted-foreground group-hover:scale-110 transition-transform" />
                                                    <div className="absolute top-0 left-0 bg-primary/10 text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg text-primary">#{i + 1}</div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{product.name}</p>
                                                    <p className="text-xs text-muted-foreground">{product.category}</p>
                                                </div>
                                                <TrendingUp className="w-4 h-4 text-emerald-500/50" />
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Categories Grid */}
                                <motion.div variants={fadeInUp} className="space-y-4">
                                    <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        Explore Categories
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {PRODUCT_CATEGORIES.slice(0, 8).map((category) => (
                                            <Link
                                                key={category.id}
                                                href={`/search?category=${category.id}`}
                                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-3xl bg-muted/20 border border-border/50 hover:bg-background hover:shadow-md hover:border-primary/20 transition-all group aspect-square"
                                            >
                                                <span className="text-3xl group-hover:scale-110 transition-transform duration-300 filter group-hover:drop-shadow-lg">
                                                    {category.emoji}
                                                </span>
                                                <span className="text-xs font-semibold text-center group-hover:text-primary transition-colors">
                                                    {category.name}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ) : (
                            // Search Results
                            <motion.div
                                key="results"
                                variants={staggerContainer}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {/* Results Actions */}
                                {results.length > 0 && !isSearching && (
                                    <div className="flex items-center justify-between pb-2 border-b border-border/40">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Found <span className="text-foreground font-bold">{results.length}</span> results
                                        </p>
                                        <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
                                            <button
                                                onClick={() => setViewMode("grid")}
                                                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                            >
                                                <LayoutGrid className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setViewMode("list")}
                                                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                            >
                                                <List className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {isSearching ? (
                                    <div className="py-24 flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
                                        <p className="font-medium text-lg animate-pulse">Searching Debelu...</p>
                                    </div>
                                ) : results.length > 0 ? (
                                    <div className={cn(
                                        "grid gap-4",
                                        viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"
                                    )}>
                                        {results.map((product) => (
                                            <Link key={product.id} href={`/product/${product.id}`} className="group">
                                                <Card className={cn(
                                                    "overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 h-full",
                                                    viewMode === 'list' && "flex flex-row"
                                                )}>
                                                    <div className={cn(
                                                        "bg-muted flex items-center justify-center text-xs text-muted-foreground relative overflow-hidden",
                                                        viewMode === "grid" ? "aspect-square w-full" : "w-32 aspect-square flex-shrink-0"
                                                    )}>
                                                        <div className="w-full h-full bg-muted group-hover:scale-105 transition-transform duration-500" />
                                                        <span className="absolute inset-0 flex items-center justify-center">No Image</span>
                                                        {product.compareAtPrice && (
                                                            <Badge variant="destructive" className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5">Sale</Badge>
                                                        )}
                                                    </div>
                                                    <CardContent className={cn("p-4 flex flex-col justify-between flex-1", viewMode === 'list' && "py-3")}>
                                                        <div>
                                                            <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                                                            <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                                                            {product.rating && (
                                                                <div className="flex items-center gap-1 mb-2">
                                                                    <span className="text-[10px] bg-yellow-400/20 text-yellow-600 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                                                                        ⭐ {product.rating}
                                                                    </span>
                                                                    <span className="text-[10px] text-muted-foreground">({product.reviewCount})</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="mt-2">
                                                            <p className="font-bold text-lg text-primary">{formatNaira(product.price)}</p>
                                                            {product.compareAtPrice && (
                                                                <p className="text-xs text-muted-foreground line-through">{formatNaira(product.compareAtPrice)}</p>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 text-center">
                                        <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Search className="w-10 h-10 text-muted-foreground/50" />
                                        </div>
                                        <h3 className="font-display font-bold text-xl mb-2">No matches found</h3>
                                        <p className="text-muted-foreground max-w-xs mx-auto mb-6">
                                            We couldn't find any products matching "{query}". Try checking your spelling or use more general terms.
                                        </p>
                                        <Button variant="outline" onClick={clearSearch}>
                                            Clear Search
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <SearchPageContent />
        </Suspense>
    );
}
