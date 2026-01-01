"use client";

import Image from "next/image";
import { Star, ShoppingCart, Eye, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatNaira } from "@/lib/utils";
import { useChatStore, useCartStore } from "@/stores";
import type { ProductSummary } from "@/types";

interface ProductCardChatProps {
    product: ProductSummary | any; // Allow any for AI SDK response compatibility
    expanded?: boolean;
    className?: string;
}

export function ProductCardChat({ product, expanded = false, className }: ProductCardChatProps) {
    const setActivePanel = useChatStore((state) => state.setActivePanel);
    const setPanelData = useChatStore((state) => state.setPanelData);
    const addItem = useCartStore((state) => state.addItem);

    // Safe image handling - handle both 'image' (single) and 'images' (array)
    const imageUrl = product.image
        || (product.images && product.images.length > 0
            ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url)
            : '/placeholder-image.png');

    // Calculate discount percentage if compare price exists
    const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0;

    const handleViewDetails = () => {
        // Transform to ProductSummary format if coming from API
        const productSummary: ProductSummary = {
            id: product.id,
            name: product.name,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            vendorId: product.vendorId || product.vendor_id,
            vendorName: product.vendorName || product.vendor_name || "Campus Vendor",
            rating: product.rating || 0,
            reviewCount: product.reviewCount || product.review_count || 0,
            image: imageUrl,
            stock: product.stock || 10,
            category: product.category,
            campusId: product.campusId || product.campus_id,
            attributes: product.attributes || {},
        };
        setActivePanel('product-detail');
        setPanelData({ type: 'product-detail', product: productSummary });
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            image: imageUrl,
            vendorName: product.vendorName || product.vendor_name || "Campus Vendor",
            rating: product.rating || 0,
            reviewCount: product.reviewCount || 0,
            stock: product.stock || 10,
            campusId: product.campusId || product.campus_id,
            vendorId: product.vendorId || product.vendor_id,
        }, 1);
    };

    // Expanded card for product-detail message type
    if (expanded) {
        return (
            <Card className="overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300" onClick={handleViewDetails}>
                <div className="flex gap-4 p-4">
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
                        <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="128px"
                        />
                        {hasDiscount && (
                            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px]">
                                -{discountPercent}%
                            </Badge>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {product.name}
                        </h4>
                        {product.vendorName && (
                            <p className="text-xs text-muted-foreground mt-1">
                                by {product.vendorName}
                            </p>
                        )}
                        {product.rating > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
                                <span className="text-xs text-muted-foreground">
                                    ({product.reviewCount || 0})
                                </span>
                            </div>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                            <span className="font-bold text-primary">{formatNaira(product.price)}</span>
                            {hasDiscount && (
                                <span className="text-xs text-muted-foreground line-through">
                                    {formatNaira(product.compareAtPrice)}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="secondary" className="text-xs h-8" onClick={handleAddToCart}>
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                Add
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs h-8">
                                <Eye className="w-3 h-3 mr-1" />
                                Details
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    // Compact card for products carousel
    return (
        <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className={cn("h-full", className)}
        >
            <Card
                className="h-full overflow-hidden cursor-pointer group hover:shadow-md transition-all duration-300 border-border/50"
                onClick={handleViewDetails}
            >
                <div className="relative aspect-square w-full bg-muted">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 200px"
                    />
                    {hasDiscount && (
                        <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] px-1.5">
                            <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                            {discountPercent}%
                        </Badge>
                    )}
                </div>
                <CardContent className="p-3">
                    <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                    </h4>
                    {product.vendorName && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                            {product.vendorName}
                        </p>
                    )}
                    {product.rating > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            <span className="text-[10px] font-medium">{product.rating.toFixed(1)}</span>
                        </div>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-primary">{formatNaira(product.price)}</span>
                            {hasDiscount && (
                                <span className="text-[10px] text-muted-foreground line-through">
                                    {formatNaira(product.compareAtPrice)}
                                </span>
                            )}
                        </div>
                    </div>
                    <Button
                        size="sm"
                        className="w-full text-xs h-7 mt-2"
                        variant="secondary"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Add
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}

// Default export for backwards compatibility
export default ProductCardChat;