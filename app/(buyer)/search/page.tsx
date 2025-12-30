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
    ShoppingBag,
    ChevronDown,
    Star,
    Check,
    SlidersHorizontal
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { PRODUCT_CATEGORIES } from "@/lib/constants";

// --- Mock Data ---

const MOCK_RESULTS = [
    {
        id: "1",
        name: "Dell Inspiron 15 Laptop - Core i5, 8GB RAM",
        price: 165000,
        compareAtPrice: 195000,
        image: "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?q=80&w=800&auto=format&fit=crop",
        vendorName: "TechHub NG",
        rating: 4.8,
        reviewCount: 24,
        category: "electronics"
    },
    {
        id: "2",
        name: "HP Pavilion 14 Laptop",
        price: 145000,
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop",
        vendorName: "CompStation",
        rating: 4.5,
        reviewCount: 12,
        category: "electronics"
    },
    {
        id: "3",
        name: "Logitech MX Master 3S",
        price: 85000,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop",
        vendorName: "GadgetWorld",
        rating: 4.9,
        reviewCount: 156,
        category: "accessories"
    },
    {
        id: "4",
        name: "Nike Air Jordan 1 High",
        price: 75000,
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop",
        vendorName: "Campus Kicks",
        rating: 4.7,
        reviewCount: 45,
        category: "fashion"
    },
    {
        id: "5",
        name: "Calculus: Early Transcendentals",
        price: 25000,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
        vendorName: "Book Worms",
        rating: 4.9,
        reviewCount: 8,
        category: "books"
    },
    {
        id: "6",
        name: "Apple AirPods Pro 2nd Gen",
        price: 120000,
        compareAtPrice: 140000,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop",
        vendorName: "GadgetWorld",
        rating: 4.9,
        reviewCount: 234,
        category: "electronics"
    },
    {
        id: "7",
        name: "Samsung Galaxy Watch 5",
        price: 95000,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
        vendorName: "TechHub NG",
        rating: 4.6,
        reviewCount: 67,
        category: "electronics"
    },
    {
        id: "8",
        name: "Vintage Band Tee - Nirvana",
        price: 8500,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop",
        vendorName: "Thrift Kings",
        rating: 4.4,
        reviewCount: 19,
        category: "fashion"
    },
    {
        id: "9",
        name: "LED Desk Lamp - Wireless Charging",
        price: 18000,
        compareAtPrice: 22000,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop",
        vendorName: "DeskSetup",
        rating: 4.7,
        reviewCount: 89,
        category: "home"
    },
    {
        id: "10",
        name: "Anker PowerCore 20000mAh",
        price: 15000,
        image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=800&auto=format&fit=crop",
        vendorName: "GadgetWorld",
        rating: 4.8,
        reviewCount: 312,
        category: "accessories"
    },
    {
        id: "11",
        name: "Hostel Single Mattress - Memory Foam",
        price: 35000,
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop",
        vendorName: "Campus Living",
        rating: 4.3,
        reviewCount: 28,
        category: "home"
    },
    {
        id: "12",
        name: "Backpack - 40L Travel Bag",
        price: 22000,
        compareAtPrice: 28000,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
        vendorName: "CampusBags",
        rating: 4.6,
        reviewCount: 156,
        category: "fashion"
    },
];


const RECENT_SEARCHES = ["MacBook Pro", "Anime Hoodie", "Calculus Textbook", "Gaming Mouse"];
const TRENDING_SEARCHES = ["iPhone 15", "Sneakers", "Hostel Bed", "Power Bank"];

// --- Components ---

function FilterSidebar({ className }: { className?: string }) {
    return (
        <div className={cn("space-y-8", className)}>
            <div>
                <h3 className="font-display font-bold text-lg mb-4">Categories</h3>
                <div className="space-y-3">
                    {PRODUCT_CATEGORIES.slice(0, 6).map((cat) => (
                        <div key={cat.id} className="flex items-center space-x-3">
                            <Checkbox id={cat.id} />
                            <label
                                htmlFor={cat.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                                {cat.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="font-display font-bold text-lg mb-4">Price Range</h3>
                <Slider defaultValue={[5000]} max={500000} step={1000} className="mb-4" />
                <div className="flex items-center justify-between">
                    <div className="border border-border rounded-lg px-3 py-1.5 text-sm font-medium w-24 text-center">
                        ₦5,000
                    </div>
                    <span className="text-muted-foreground">-</span>
                    <div className="border border-border rounded-lg px-3 py-1.5 text-sm font-medium w-24 text-center">
                        ₦500k+
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="font-display font-bold text-lg mb-4">Rating</h3>
                <div className="space-y-3">
                    {[4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-3">
                            <Checkbox id={`rating-${rating}`} />
                            <label
                                htmlFor={`rating-${rating}`}
                                className="text-sm font-medium leading-none flex items-center gap-1 cursor-pointer text-muted-foreground hover:text-foreground"
                            >
                                <div className="flex text-amber-400">
                                    {Array(5).fill(null).map((_, i) => (
                                        <Star key={i} className={cn("w-3.5 h-3.5 fill-current", i >= rating && "text-muted/30")} />
                                    ))}
                                </div>
                                <span className="ml-1">& Up</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

import { ProductCard } from "@/components/shared/ProductCard";

function ProductGrid({ results, viewMode }: { results: typeof MOCK_RESULTS, viewMode: "grid" | "list" }) {
    return (
        <motion.div
            layout
            className={cn(
                "grid gap-4",
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" : "grid-cols-1"
            )}
        >
            {results.map((product) => (
                <motion.div
                    key={product.id}
                    layout
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    whileHover={{ y: -4 }}
                >
                    <ProductCard product={product} viewMode={viewMode} />
                </motion.div>
            ))}
        </motion.div>
    );
}

function SearchPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState(initialQuery ? MOCK_RESULTS : []);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState<"relevance" | "price-low" | "price-high" | "rating" | "newest">("relevance");

    const sortOptions = [
        { value: "relevance", label: "Most Relevant" },
        { value: "price-low", label: "Price: Low to High" },
        { value: "price-high", label: "Price: High to Low" },
        { value: "rating", label: "Highest Rated" },
        { value: "newest", label: "Newest First" },
    ];

    const sortedResults = [...results].sort((a, b) => {
        switch (sortBy) {
            case "price-low": return a.price - b.price;
            case "price-high": return b.price - a.price;
            case "rating": return b.rating - a.rating;
            default: return 0;
        }
    });

    const isSearching = query.length > 0;


    return (
        <div className="flex-1 overflow-y-auto bg-background">


            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full -ml-2">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    <div className="flex-1 relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setResults(e.target.value ? MOCK_RESULTS : []);
                            }}
                            placeholder="What are you looking for?"
                            className="w-full pl-10 h-11 rounded-full bg-muted/50 border-transparent focus:border-primary/50 focus:bg-background transition-all"
                        />
                        {query && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setQuery("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Desktop Sidebar (Filters) */}
                    <aside className="hidden lg:block w-64 shrink-0 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto pb-10 scrollbar-hide">
                        <FilterSidebar />
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1">

                        {!isSearching ? (
                            // Empty State / Discovery
                            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-12 max-w-2xl mx-auto pt-8">
                                <div className="text-center space-y-2">
                                    <Badge variant="outline" className="rounded-full py-1.5 px-4 mb-4 border-dashed">
                                        <Sparkles className="w-3.5 h-3.5 mr-2 text-amber-500" />
                                        Discover Something New
                                    </Badge>
                                    <h2 className="text-3xl font-display font-bold">Suggestions for you</h2>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-1">Recent Searches</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {RECENT_SEARCHES.map(term => (
                                            <Button
                                                key={term}
                                                variant="secondary"
                                                className="rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors h-9"
                                                onClick={() => setQuery(term)}
                                            >
                                                <Clock className="w-3.5 h-3.5 mr-2 opacity-50" />
                                                {term}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-1">Trending Now</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {TRENDING_SEARCHES.map(term => (
                                            <div
                                                key={term}
                                                onClick={() => setQuery(term)}
                                                className="group cursor-pointer p-4 rounded-2xl border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all flex items-center justify-between bg-card"
                                            >
                                                <span className="font-medium group-hover:text-primary transition-colors">{term}</span>
                                                <TrendingUp className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
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

                                {/* Recommended Grid (Visible when not searching) */}
                                <motion.div variants={fadeInUp} className="space-y-4 pt-4">
                                    <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                        <ShoppingBag className="w-4 h-4" />
                                        Recommended for you
                                    </h2>
                                    <ProductGrid results={MOCK_RESULTS} viewMode={viewMode} />
                                </motion.div>
                            </motion.div>
                        ) : (
                            // Results State
                            <div className="space-y-6">
                                {/* Mobile Filter & Sort Bar */}
                                <div className="flex items-center justify-between bg-background sticky top-20 z-30 py-2 lg:static">
                                    <div className="text-sm text-muted-foreground">
                                        Showing <span className="font-bold text-foreground">{results.length}</span> results
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Mobile Filter Sheet */}
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button variant="outline" size="sm" className="lg:hidden rounded-full">
                                                    <Filter className="w-3.5 h-3.5 mr-2" />
                                                    Filters
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                                <SheetHeader className="mb-6">
                                                    <SheetTitle className="font-display text-2xl">Filters</SheetTitle>
                                                </SheetHeader>
                                                <ScrollArea className="h-full pb-20">
                                                    <FilterSidebar />
                                                </ScrollArea>
                                            </SheetContent>
                                        </Sheet>

                                        {/* Sort Dropdown */}
                                        <div className="relative group">
                                            <Button variant="outline" size="sm" className="rounded-full gap-1">
                                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                                <span className="hidden sm:inline">
                                                    {sortOptions.find(o => o.value === sortBy)?.label || "Sort"}
                                                </span>
                                                <ChevronDown className="w-3 h-3" />
                                            </Button>
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-xl shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                                {sortOptions.map((option) => (
                                                    <Button
                                                        key={option.value}
                                                        variant="ghost"
                                                        onClick={() => setSortBy(option.value as typeof sortBy)}
                                                        className={cn(
                                                            "w-full px-4 py-2 justify-between font-normal hover:bg-muted h-auto rounded-none",
                                                            sortBy === option.value && "text-primary font-medium bg-muted/50"
                                                        )}
                                                    >
                                                        {option.label}
                                                        {sortBy === option.value && <Check className="w-4 h-4 ml-2" />}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* View Toggle */}
                                        <div className="flex items-center border border-border rounded-lg p-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setViewMode("grid")}
                                                className={cn("h-7 w-7 rounded-md", viewMode === "grid" && "bg-muted shadow-sm")}
                                            >
                                                <LayoutGrid className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setViewMode("list")}
                                                className={cn("h-7 w-7 rounded-md", viewMode === "list" && "bg-muted shadow-sm")}
                                            >
                                                <List className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Results Grid */}
                                {sortedResults.length > 0 ? (
                                    <ProductGrid results={sortedResults} viewMode={viewMode} />
                                ) : (
                                    <div className="py-20 text-center">
                                        <div className="w-20 h-20 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Search className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="font-display font-bold text-xl mb-2">No matches found</h3>
                                        <p className="text-muted-foreground mb-6">Try adjusting your search or filters to find what you're looking for.</p>
                                        <Button onClick={() => setQuery("")} variant="outline" className="rounded-full">
                                            Clear Filters
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
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
