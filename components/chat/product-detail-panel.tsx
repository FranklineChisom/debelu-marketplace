"use client";

import { X, Star, ShoppingCart, Truck, MapPin, Store, Share2, HelpCircle, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useChatStore } from "@/stores";
import { formatNaira } from "@/lib/utils";
import { useCartStore } from "@/stores";

export function ProductDetailPanel() {
    const selectedProduct = useChatStore((state) => state.selectedProduct);
    const setSelectedProduct = useChatStore((state) => state.setSelectedProduct);
    const addUserMessage = useChatStore((state) => state.addUserMessage);
    const addItem = useCartStore((state) => state.addItem);

    if (!selectedProduct) return null;

    const handleClose = () => setSelectedProduct(null);
    const handleAddToCart = () => {
        addItem(selectedProduct);
        // You might want to show a toast here
    };

    const handleChatAction = (message: string) => {
        addUserMessage(message);
        handleClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full h-full bg-background border-l border-border/40 shadow-xl lg:shadow-none flex flex-col"
        >
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-border/40 bg-background/80 backdrop-blur-sm z-10 sticky top-0">
                <h2 className="font-semibold text-sm text-foreground">Product Details</h2>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { }} className="text-muted-foreground hover:text-foreground">
                        <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleClose} className="text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive">
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-0 pb-10">
                    {/* Hero Image */}
                    <div className="relative aspect-video w-full bg-muted">
                        {selectedProduct.image ? (
                            <Image
                                src={selectedProduct.image}
                                alt={selectedProduct.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                No Image
                            </div>
                        )}
                        {selectedProduct.compareAtPrice && selectedProduct.compareAtPrice > selectedProduct.price && (
                            <Badge className="absolute bottom-4 left-4 bg-red-500 hover:bg-red-600 border-none text-white font-bold">
                                -{Math.round((1 - selectedProduct.price / selectedProduct.compareAtPrice) * 100)}% OFF
                            </Badge>
                        )}
                    </div>

                    {/* Product Header */}
                    <div className="p-6 space-y-4">
                        <div>
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <h1 className="text-xl font-bold font-display leading-tight">{selectedProduct.name}</h1>
                                <div className="flex flex-col items-end">
                                    <span className="text-xl font-bold text-primary">{formatNaira(selectedProduct.price)}</span>
                                    {selectedProduct.compareAtPrice && (
                                        <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/50">
                                            {formatNaira(selectedProduct.compareAtPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Vendor Info */}
                            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border/50">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Store className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">{selectedProduct.vendorName}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            Unilag
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1 text-orange-500">
                                            <Star className="w-3 h-3 fill-orange-500" />
                                            {selectedProduct.rating.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="h-8 rounded-full text-xs">
                                    Visit
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        {/* Specs / Attributes */}
                        {selectedProduct.attributes && (
                            <div className="space-y-3">
                                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Specifications</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(selectedProduct.attributes).map(([key, value]) => (
                                        <div key={key} className="bg-muted/20 p-3 rounded-lg border border-border/40">
                                            <p className="text-xs text-muted-foreground mb-1">{key}</p>
                                            <p className="text-sm font-medium">{String(value)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Separator />

                        {/* Delivery Info */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Delivery</h3>
                            <div className="flex gap-4">
                                <div className="flex-1 bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl flex flex-col items-center text-center gap-2">
                                    <Truck className="w-6 h-6 text-emerald-600" />
                                    <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Same Day Delivery</span>
                                    <span className="text-xs text-muted-foreground">Within campus</span>
                                </div>
                                <div className="flex-1 bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl flex flex-col items-center text-center gap-2">
                                    <HelpCircle className="w-6 h-6 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Buyer Protection</span>
                                    <span className="text-xs text-muted-foreground">Money back guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* Bottom Actions */}
            <div className="p-4 border-t border-border/40 bg-background/95 backdrop-blur-sm z-20">
                <Button
                    size="lg"
                    className="w-full rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart • {formatNaira(selectedProduct.price)}
                </Button>
            </div>
        </motion.div>
    );
}
