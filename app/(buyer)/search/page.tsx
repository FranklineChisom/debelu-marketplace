"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Search,
    X,
    ArrowLeft,
    Clock,
    TrendingUp,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { PRODUCT_CATEGORIES, CHAT_SUGGESTIONS } from "@/lib/constants";

// Mock recent searches
const recentSearches = ["laptop", "airpods", "textbooks", "snacks"];

// Mock trending products
const trendingProducts = [
    { id: "1", name: "Dell Inspiron 15 Laptop", price: 165000, category: "Electronics" },
    { id: "2", name: "iPhone 12 Case Bundle", price: 9000, category: "Accessories" },
    { id: "3", name: "USB-C Hub 7-in-1", price: 12500, category: "Electronics" },
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
    },
    {
        id: "2",
        name: "HP Pavilion 14 Laptop",
        price: 145000,
        image: null,
        vendorName: "CompStation",
        rating: 4.5,
        reviewCount: 12,
    },
    {
        id: "3",
        name: "Lenovo IdeaPad 3",
        price: 135000,
        image: null,
        vendorName: "TechHub NG",
        rating: 4.6,
        reviewCount: 18,
    },
];

export default function SearchPage() {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<typeof mockSearchResults>([]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (query.length > 2) {
            setIsSearching(true);
            // Simulate search delay
            const timer = setTimeout(() => {
                setResults(mockSearchResults);
                setIsSearching(false);
            }, 300);
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

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Search Header */}
            <header className="sticky top-0 z-50 bg-background border-b safe-top">
                <div className="flex items-center gap-3 p-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors flex-shrink-0"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            ref={inputRef}
                            placeholder="Search products, vendors..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-10 pr-10"
                        />
                        {query && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="p-4"
            >
                <AnimatePresence mode="wait">
                    {query.length === 0 ? (
                        // Empty state: show recent & trending
                        <motion.div
                            key="empty"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                                <motion.div variants={fadeInUp}>
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="font-display font-bold flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Recent Searches
                                        </h2>
                                        <button className="text-xs text-muted-foreground">
                                            Clear
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((search) => (
                                            <Badge
                                                key={search}
                                                variant="secondary"
                                                className="cursor-pointer hover:bg-secondary/80"
                                                onClick={() => handleSearch(search)}
                                            >
                                                {search}
                                            </Badge>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Popular Searches */}
                            <motion.div variants={fadeInUp}>
                                <h2 className="font-display font-bold flex items-center gap-2 mb-3">
                                    <TrendingUp className="w-4 h-4" />
                                    Popular Right Now
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {CHAT_SUGGESTIONS.map((suggestion) => (
                                        <Badge
                                            key={suggestion}
                                            variant="outline"
                                            className="cursor-pointer hover:bg-muted"
                                            onClick={() => handleSearch(suggestion)}
                                        >
                                            {suggestion}
                                        </Badge>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Categories */}
                            <motion.div variants={fadeInUp}>
                                <h2 className="font-display font-bold flex items-center gap-2 mb-3">
                                    <Sparkles className="w-4 h-4" />
                                    Browse Categories
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {PRODUCT_CATEGORIES.slice(0, 6).map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/search?category=${category.id}`}
                                        >
                                            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                                                <CardContent className="p-4 text-center">
                                                    <span className="text-2xl mb-2 block">
                                                        {category.emoji}
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        {category.name}
                                                    </span>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Trending Products */}
                            <motion.div variants={fadeInUp}>
                                <h2 className="font-display font-bold mb-3">
                                    Trending Products
                                </h2>
                                <div className="space-y-3">
                                    {trendingProducts.map((product, i) => (
                                        <Link key={product.id} href={`/product/${product.id}`}>
                                            <Card className="hover:border-primary/50 transition-colors">
                                                <CardContent className="p-3 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold text-sm text-muted-foreground">
                                                        {i + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {product.category}
                                                        </p>
                                                    </div>
                                                    <span className="font-semibold text-sm">
                                                        {formatNaira(product.price)}
                                                    </span>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        // Search results
                        <motion.div
                            key="results"
                            variants={staggerContainer}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            {isSearching ? (
                                <div className="py-8 text-center text-muted-foreground">
                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                    <p className="text-sm">Searching...</p>
                                </div>
                            ) : results.length > 0 ? (
                                <>
                                    <p className="text-sm text-muted-foreground">
                                        {results.length} results for "{query}"
                                    </p>
                                    <div className="space-y-3">
                                        {results.map((product) => (
                                            <Link key={product.id} href={`/product/${product.id}`}>
                                                <Card className="hover:border-primary/50 transition-colors">
                                                    <CardContent className="p-4 flex gap-4">
                                                        <div className="w-20 h-20 rounded-xl bg-muted flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                                                            No img
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm line-clamp-2 mb-1">
                                                                {product.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mb-2">
                                                                {product.vendorName} • ⭐ {product.rating}
                                                            </p>
                                                            <div className="flex items-baseline gap-2">
                                                                <span className="font-bold">
                                                                    {formatNaira(product.price)}
                                                                </span>
                                                                {product.compareAtPrice && (
                                                                    <span className="text-xs text-muted-foreground line-through">
                                                                        {formatNaira(product.compareAtPrice)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            ) : query.length > 2 ? (
                                <div className="py-8 text-center">
                                    <Search className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                                    <p className="font-medium">No results found</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Try a different search term
                                    </p>
                                </div>
                            ) : (
                                <div className="py-8 text-center text-muted-foreground">
                                    <p className="text-sm">Type at least 3 characters to search</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
