"use client";

import {
    ShoppingBag,
    Star,
    Cpu,
    Battery,
    Maximize2,
    Share2,
    Heart,
    Sparkles,
    X,
    ShoppingCart,
    Store,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useChatStore, useCartStore } from "@/stores";
import { formatNaira } from "@/lib/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function ProductIntelligencePanel() {
    const selectedProduct = useChatStore((state) => state.selectedProduct);
    const setSelectedProduct = useChatStore((state) => state.setSelectedProduct);
    const addItem = useCartStore((state) => state.addItem);

    if (!selectedProduct) return null;

    const handleClose = () => setSelectedProduct(null);
    const handleAddToCart = () => {
        addItem(selectedProduct);
    };

    return (
        <div className="h-full flex flex-col bg-background/50 backdrop-blur-xl border-l border-border/50 w-full md:w-[400px] min-h-0">

            {/* Header / Sticky Top */}
            <div className="p-6 pb-2 flex justify-between items-start">
                <div>
                    <Badge variant="outline" className="mb-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Top Pick
                    </Badge>
                    <h2 className="text-2xl font-black tracking-tight line-clamp-2">{selectedProduct.name}</h2>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={handleClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1 px-6">
                <div className="pb-8 space-y-8">

                    {/* Image Showcase */}
                    <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-tr from-muted/50 to-muted/20 border border-white/10 group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {selectedProduct.image ? (
                            <Image
                                src={selectedProduct.image}
                                alt={selectedProduct.name}
                                fill
                                className="object-cover p-0 transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                                <ShoppingBag className="w-24 h-24" />
                            </div>
                        )}

                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <Button variant="secondary" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background">
                                <Heart className="w-4 h-4" />
                            </Button>
                            <Button variant="secondary" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Price & Rating */}
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium mb-1">Price</p>
                            <div className="text-3xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                {formatNaira(selectedProduct.price)}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-yellow-500">{selectedProduct.rating?.toFixed(1) || "New"}</span>
                            <span className="text-xs text-yellow-500/70">({selectedProduct.reviews || selectedProduct.review_count || 0})</span>
                        </div>
                    </div>

                    <Separator className="bg-border/50" />

                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Overview</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {selectedProduct.description || "No description available for this product."}
                        </p>
                    </div>

                    {/* Vendor Info */}
                    <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <Store className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold">{selectedProduct.vendorName || "Debelu Vendor"}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Shield className="w-3 h-3 text-emerald-500" />
                                    Verified Campus Vendor
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </ScrollArea>

            {/* Bottom Actions */}
            <div className="p-6 pt-2 border-t border-border/50 bg-background/50 backdrop-blur-xl">
                <Button
                    size="lg"
                    className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                </Button>
            </div>
        </div>
    );
}
