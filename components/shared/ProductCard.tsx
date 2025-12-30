"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatNaira } from "@/lib/utils";
import { ProductSummary as Product } from "@/types/product";

interface ProductCardProps {
    product: Product;
    viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
    return (
        <Link href={`/product/${product.id}`} className="block h-full">
            <Card className={cn(
                "group h-full overflow-hidden border-border/50 bg-card/60 hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5",
                viewMode === "list" && "flex flex-row"
            )}>
                {/* Image Container */}
                <div className={cn(
                    "relative overflow-hidden bg-muted",
                    viewMode === "grid" ? "aspect-[4/3] w-full" : "w-48 aspect-square shrink-0"
                )}>
                    <Image
                        src={product.image || ""}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.compareAtPrice && (
                        <Badge variant="destructive" className="absolute top-3 left-3 font-bold">
                            Sale
                        </Badge>
                    )}
                    <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-3 right-3 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-background/80 backdrop-blur-md hover:bg-background"
                    >
                        <ShoppingBag className="w-4 h-4" />
                    </Button>
                </div>

                {/* Content */}
                <CardContent className="p-4 flex flex-col justify-between flex-1">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{product.category}</span>
                            <div className="flex items-center text-amber-500 text-xs font-bold gap-1">
                                <Star className="w-3 h-3 fill-current" />
                                {product.rating}
                            </div>
                        </div>
                        <h3 className="font-bold text-foreground line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-3">
                            by <span className="text-foreground font-medium">{product.vendorName}</span>
                        </p>
                    </div>

                    <div className="mt-auto pt-3 border-t border-border/40 flex items-center justify-between">
                        <div>
                            <span className="block text-lg font-black text-primary">
                                {formatNaira(product.price)}
                            </span>
                            {product.compareAtPrice && (
                                <span className="text-xs text-muted-foreground line-through">
                                    {formatNaira(product.compareAtPrice)}
                                </span>
                            )}
                        </div>
                        {viewMode === "list" && (
                            <Button size="sm" className="rounded-full">View Details</Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
