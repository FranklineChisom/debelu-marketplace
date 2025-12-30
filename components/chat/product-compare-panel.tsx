"use client";

import {
    Check,
    X,
    Star,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores";
import { formatNaira } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area"; // We can reuse ScrollArea or the div fix, let's use div for consistency

export function ProductComparePanel() {
    const comparingProducts = useChatStore((state) => state.comparingProducts);
    const setComparingProducts = useChatStore((state) => state.setComparingProducts);

    if (!comparingProducts || comparingProducts.length < 2) return null;

    const handleClose = () => setComparingProducts(null);

    // Dynamic attributes extraction
    const allAttributes = Array.from(
        new Set(comparingProducts.flatMap(p => p.attributes ? Object.keys(p.attributes) : []))
    );

    const features = [
        { label: "Price", render: (p: any) => <span className="font-bold text-primary">{formatNaira(p.price)}</span> },
        { label: "Rating", render: (p: any) => <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {p.rating}</span> },
        { label: "Review Count", render: (p: any) => <span className="text-muted-foreground">{p.reviewCount} reviews</span> },
        ...allAttributes.map(attr => ({
            label: attr,
            render: (p: any) => <span className="text-sm">{p.attributes?.[attr] || "-"}</span>
        }))
    ];

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
                <h2 className="font-semibold text-sm text-foreground">Compare Products</h2>
                <Button variant="ghost" size="icon" onClick={handleClose} className="text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive">
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Comparison Content */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <div className="h-full flex flex-col min-w-[400px]"> {/* Ensure min width for horizontal scroll if needed */}
                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-4 bg-muted/20 sticky top-0 z-10 min-w-[100px]"></th>
                                    {comparingProducts.map(product => (
                                        <th key={product.id} className="p-4 bg-muted/20 sticky top-0 z-10 w-[150px] min-w-[150px] align-top">
                                            <div className="relative aspect-square rounded-lg overflow-hidden bg-background mb-2 border border-border/50">
                                                {product.image && (
                                                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                                                )}
                                            </div>
                                            <p className="text-xs font-medium line-clamp-2 h-8 leading-tight">{product.name}</p>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {features.map((feature, idx) => (
                                    <tr key={idx} className="group hover:bg-muted/10 transition-colors">
                                        <td className="p-3 text-xs font-semibold text-muted-foreground bg-muted/5 sticky left-0 z-10">{feature.label}</td>
                                        {comparingProducts.map(product => (
                                            <td key={product.id} className="p-3 text-sm border-l border-border/20">
                                                {feature.render(product)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
