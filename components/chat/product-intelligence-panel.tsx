"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
    ShoppingBag,
    Star,
    ShieldCheck,
    Cpu,
    Battery,
    Maximize2,
    ArrowRight,
    Share2,
    Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Mock Product Data (In a real app, this would come from a selectedProduct state)
const MOCK_PRODUCT = {
    id: "prod_1",
    name: "MacBook Pro 16 M3 Max",
    price: "₦3,850,000",
    rating: 4.9,
    reviews: 128,
    image: "/images/products/laptop-1.png", // Ensure this path exists or use a placeholder
    description: "The most powerful MacBook Pro ever. Blazing fast M3 Max chip, stunning Liquid Retina XDR display, and all-day battery life.",
    specs: [
        { icon: Cpu, label: "Processor", value: "M3 Max (16-core)" },
        { icon: Battery, label: "Battery", value: "22 Hours" },
        { icon: Maximize2, label: "Screen", value: "16.2\" XDR" },
    ],
    verified: true,
    vendor: "Official Apple Store"
};

export function ProductIntelligencePanel() {
    return (
        <div className="h-full flex flex-col bg-background/50 backdrop-blur-xl border-l border-border/50">

            {/* Header / Sticky Top */}
            <div className="p-6 pb-2 flex justify-between items-start">
                <div>
                    <Badge variant="outline" className="mb-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1">
                        <SparklesIcon className="w-3 h-3 mr-1" />
                        Top Pick
                    </Badge>
                    <h2 className="text-2xl font-black tracking-tight">{MOCK_PRODUCT.name}</h2>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Heart className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Share2 className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1 px-6">
                <div className="pb-8 space-y-8">

                    {/* Image Showcase */}
                    <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-tr from-muted/50 to-muted/20 border border-white/10 group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        {/* Placeholder for product image - using a generic div if image fails, but ideally Next/Image */}
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                            <ShoppingBag className="w-24 h-24" />
                        </div>
                        {/* If you have the image, uncomment below
                 <Image 
                    src={MOCK_PRODUCT.image} 
                    alt={MOCK_PRODUCT.name} 
                    fill 
                    className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                 />
                 */}
                    </div>

                    {/* Price & Rating */}
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium mb-1">Price</p>
                            <div className="text-3xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                {MOCK_PRODUCT.price}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-yellow-500">{MOCK_PRODUCT.rating}</span>
                            <span className="text-xs text-yellow-500/70">({MOCK_PRODUCT.reviews})</span>
                        </div>
                    </div>

                    <Separator className="bg-border/50" />

                    {/* AI Insights / Specs */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            Intelligence Specs
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {MOCK_PRODUCT.specs.map((spec) => (
                                <div key={spec.label} className="p-3 rounded-2xl bg-muted/50 border border-white/5 flex flex-col items-center text-center gap-2 hover:bg-muted/80 transition-colors">
                                    <spec.icon className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-[10px] uppercase text-muted-foreground font-semibold">{spec.label}</p>
                                        <p className="text-xs font-bold">{spec.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Vendor Info */}
                    <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs text-blue-500/70 font-medium">Sold by</p>
                            <p className="font-bold text-blue-500">{MOCK_PRODUCT.vendor}</p>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {MOCK_PRODUCT.description}
                    </p>

                </div>
            </ScrollArea>

            {/* Sticky Bottom Actions */}
            <div className="p-6 pt-4 border-t border-border/50 bg-background/80 backdrop-blur-md">
                <Button size="lg" className="w-full text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
                    Buy Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>

        </div>
    );
}

function SparklesIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
    )
}
