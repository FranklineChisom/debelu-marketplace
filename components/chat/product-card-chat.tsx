"use client";

import Image from "next/image";
import { Star, Plus, MessageCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProductSummary } from "@/types";
import { useCartStore } from "@/stores";

interface ProductCardChatProps {
    product: ProductSummary;
    expanded?: boolean;
}

export function ProductCardChat({ product, expanded = false }: ProductCardChatProps) {
    const addItem = useCartStore((state) => state.addItem);
    const isInCart = useCartStore((state) => state.isInCart(product.id));

    const handleAddToCart = () => {
        addItem(product);
    };

    const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
        : 0;

    if (expanded) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-background border rounded-2xl overflow-hidden max-w-sm"
            >
                {/* Image */}
                <div className="relative aspect-square bg-muted">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No image
                        </div>
                    )}
                    {hasDiscount && (
                        <Badge variant="destructive" className="absolute top-3 left-3">
                            -{discountPercent}%
                        </Badge>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    <div>
                        <h3 className="font-semibold text-base line-clamp-2">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.vendorName}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center">
                            <Star className="w-4 h-4 fill-warning text-warning" />
                            <span className="text-sm font-medium ml-1">{product.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            ({product.reviewCount} reviews)
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <span className="price price-lg">{formatNaira(product.price)}</span>
                        {hasDiscount && (
                            <span className="text-sm text-muted-foreground line-through">
                                {formatNaira(product.compareAtPrice!)}
                            </span>
                        )}
                    </div>

                    {/* Stock */}
                    {product.stock <= 5 && product.stock > 0 && (
                        <Badge variant="warning">Only {product.stock} left</Badge>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            className="flex-1"
                            onClick={handleAddToCart}
                            disabled={isInCart || product.stock === 0}
                        >
                            {isInCart ? (
                                "In Cart"
                            ) : product.stock === 0 ? (
                                "Out of Stock"
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Add to Cart
                                </>
                            )}
                        </Button>
                        <Button variant="outline" size="icon">
                            <MessageCircle className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Compact card for carousel
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-shrink-0 w-36 bg-background border rounded-xl p-3 cursor-pointer"
        >
            {/* Image */}
            <div className="relative aspect-square bg-muted rounded-lg mb-2 overflow-hidden">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No image
                    </div>
                )}
                {hasDiscount && (
                    <Badge variant="destructive" className="absolute top-1 left-1 text-[10px] px-1.5 py-0">
                        -{discountPercent}%
                    </Badge>
                )}
            </div>

            {/* Content */}
            <h4 className="font-medium text-xs line-clamp-2 mb-1">{product.name}</h4>
            <p className="text-[10px] text-muted-foreground mb-1">{product.vendorName}</p>

            {/* Price */}
            <div className="flex items-baseline gap-1">
                <span className="font-bold text-sm">{formatNaira(product.price)}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-warning text-warning" />
                <span className="text-[10px] text-muted-foreground">
                    {product.rating.toFixed(1)}
                </span>
            </div>
        </motion.div>
    );
}
