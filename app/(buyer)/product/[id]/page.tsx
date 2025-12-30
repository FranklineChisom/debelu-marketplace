"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    ArrowLeft,
    Heart,
    Share2,
    Star,
    Minus,
    Plus,
    ShoppingCart,
    MessageSquare,
    ChevronRight,
    CheckCircle,
    Store,
    ShieldCheck,
    Truck,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn, formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useCartStore } from "@/stores";

// Mock product data with variants
const mockProduct = {
    id: "1",
    name: "Dell Inspiron 15 Laptop - Core i5, 8GB RAM, 512GB SSD",
    description: `Perfect for students who need a reliable laptop for coding, design work, and everyday use. The Dell Inspiron 15 combines powerful performance with a sleek design, making it the ideal companion for campus life and beyond.

Features:
• 11th Gen Intel Core i5-1135G7 processor for speed and efficiency
• 15.6" Full HD Anti-Glare display for comfortable viewing
• 8GB DDR4 RAM (expandable to 16GB) for multitasking
• 512GB NVMe SSD for fast boot-up and storage
• Intel Iris Xe Graphics for casual gaming and design
• Windows 11 Home pre-installed
• Up to 7 hours battery life to last through classes

Condition: Brand New (Sealed)
Warranty: 1 Year Official Warranty`,
    price: 165000,
    compareAtPrice: 195000,
    images: [
        "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop"
    ],
    category: "Electronics",
    stock: 5,
    rating: 4.8,
    reviewCount: 24,
    vendorName: "TechHub NG",
    vendorId: "vendor1",
    vendorRating: 4.9,
    vendorSales: 156,
    deliveryTime: "Same day (within UNILAG)",
    campusId: "unilag",
    specs: [
        { label: "Processor", value: "Intel Core i5" },
        { label: "RAM", value: "8GB DDR4" },
        { label: "Storage", value: "512GB SSD" },
        { label: "Screen", value: "15.6\" FHD" },
    ],
    variants: {
        colors: [
            { id: "silver", name: "Platinum Silver", hex: "#C0C0C0" },
            { id: "black", name: "Carbon Black", hex: "#1a1a1a" },
            { id: "blue", name: "Ice Blue", hex: "#4F8FBB" },
        ],
        ram: [
            { id: "8gb", name: "8GB RAM", priceAdd: 0 },
            { id: "16gb", name: "16GB RAM", priceAdd: 25000 },
        ]
    }
};

const relatedProducts = [
    {
        id: "2",
        name: "HP Pavilion 14 Laptop",
        price: 145000,
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=400&auto=format&fit=crop",
        vendorName: "CompStation",
        rating: 4.5,
    },
    {
        id: "3",
        name: "Logitech MX Master 3S Mouse",
        price: 85000,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=400&auto=format&fit=crop",
        vendorName: "GadgetWorld",
        rating: 4.9,
    },
    {
        id: "4",
        name: "Samsung 27\" Curved Monitor",
        price: 120000,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=400&auto=format&fit=crop",
        vendorName: "TechHub NG",
        rating: 4.7,
    },
    {
        id: "5",
        name: "Laptop Stand - Aluminum",
        price: 15000,
        image: "https://images.unsplash.com/photo-1527443195645-1133f7f28990?q=80&w=400&auto=format&fit=crop",
        vendorName: "DeskSetup",
        rating: 4.6,
    },
];


const mockReviews = [
    {
        id: "1",
        userName: "Chioma A.",
        rating: 5,
        comment: "Excellent laptop! Fast and works great for my design work.",
        date: "2 weeks ago",
        verified: true,
    },
    {
        id: "2",
        userName: "Emeka O.",
        rating: 4,
        comment: "Good value for money. Battery could be better but overall satisfied.",
        date: "1 month ago",
        verified: true,
    },
];

export default function ProductDetailPage() {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [selectedColor, setSelectedColor] = useState(mockProduct.variants.colors[0].id);
    const [selectedRam, setSelectedRam] = useState(mockProduct.variants.ram[0].id);
    const addItem = useCartStore((state) => state.addItem);
    const isInCart = useCartStore((state) => state.isInCart(mockProduct.id));

    const selectedRamOption = mockProduct.variants.ram.find(r => r.id === selectedRam);
    const finalPrice = mockProduct.price + (selectedRamOption?.priceAdd || 0);


    const discountPercent = mockProduct.compareAtPrice
        ? Math.round((1 - mockProduct.price / mockProduct.compareAtPrice) * 100)
        : 0;

    const handleAddToCart = () => {
        addItem(
            {
                id: mockProduct.id,
                name: mockProduct.name,
                price: mockProduct.price,
                compareAtPrice: mockProduct.compareAtPrice,
                image: mockProduct.images[0],
                vendorName: mockProduct.vendorName,
                rating: mockProduct.rating,
                reviewCount: mockProduct.reviewCount,
                stock: mockProduct.stock,
                campusId: mockProduct.campusId,
                vendorId: mockProduct.vendorId,
            },
            quantity
        );
    };

    return (
        <div className="flex-1 overflow-y-auto bg-background pb-32 md:pb-20">

            {/* Transparent Floating Header for Mobile / Sticky for Desktop */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 safe-top transition-all">
                <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full hover:bg-muted"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className="rounded-full hover:bg-muted"
                        >
                            <Heart className={cn("w-5 h-5 transition-colors", isWishlisted && "fill-red-500 text-red-500")} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-muted"
                        >
                            <Share2 className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                    {/* Left Column: Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="aspect-[4/3] w-full rounded-3xl bg-muted relative overflow-hidden group">
                            {/* Main Image */}
                            <div className="absolute inset-0 flex items-center justify-center bg-secondary/20">
                                {/* Placeholder for real image */}
                                <div className="text-muted-foreground/30 font-bold text-4xl select-none">
                                    Image {selectedImage + 1}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {discountPercent > 0 && (
                                <Badge variant="destructive" className="absolute top-4 left-4 text-sm font-bold px-3 py-1 shadow-lg">
                                    -{discountPercent}% OFF
                                </Badge>
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-2">
                            {mockProduct.images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={cn(
                                        "w-20 h-20 rounded-xl bg-muted flex-shrink-0 border-2 transition-all p-1",
                                        selectedImage === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                                    )}
                                >
                                    <div className="w-full h-full rounded-lg bg-secondary/50" />
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column: Product Details */}
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="space-y-8"
                    >
                        {/* Header Info */}
                        <motion.div variants={fadeInUp} className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                    {mockProduct.category}
                                </Badge>
                                <div className="flex items-center text-sm font-medium text-amber-500">
                                    <Star className="w-4 h-4 fill-current mr-1" />
                                    {mockProduct.rating}
                                    <span className="text-muted-foreground ml-1">({mockProduct.reviewCount} reviews)</span>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black font-display leading-tight">
                                {mockProduct.name}
                            </h1>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold text-primary">
                                        {formatNaira(mockProduct.price)}
                                    </span>
                                    {mockProduct.compareAtPrice && (
                                        <span className="text-lg text-muted-foreground line-through decoration-2 decoration-destructive/30">
                                            {formatNaira(mockProduct.compareAtPrice)}
                                        </span>
                                    )}
                                </div>
                                {mockProduct.stock <= 5 && (
                                    <p className="text-sm text-red-500 font-medium animate-pulse">
                                        Only {mockProduct.stock} units left in stock!
                                    </p>
                                )}
                            </div>
                        </motion.div>

                        <Separator />

                        {/* Variant Selection */}
                        <motion.div variants={fadeInUp} className="space-y-6">
                            {/* Color Selection */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Color</h3>
                                    <span className="text-sm font-medium">{mockProduct.variants.colors.find(c => c.id === selectedColor)?.name}</span>
                                </div>
                                <div className="flex gap-3">
                                    {mockProduct.variants.colors.map((color) => (
                                        <button
                                            key={color.id}
                                            onClick={() => setSelectedColor(color.id)}
                                            className={cn(
                                                "w-12 h-12 rounded-full border-2 transition-all duration-200 relative",
                                                selectedColor === color.id
                                                    ? "border-primary ring-2 ring-primary/30 scale-110"
                                                    : "border-border/50 hover:border-primary/50 hover:scale-105"
                                            )}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        >
                                            {selectedColor === color.id && (
                                                <CheckCircle className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-lg" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* RAM Selection */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Configuration</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {mockProduct.variants.ram.map((ram) => (
                                        <button
                                            key={ram.id}
                                            onClick={() => setSelectedRam(ram.id)}
                                            className={cn(
                                                "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                                                selectedRam === ram.id
                                                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                                    : "border-border/50 hover:border-primary/30 bg-secondary/20"
                                            )}
                                        >
                                            <p className="font-bold text-sm">{ram.name}</p>
                                            {ram.priceAdd > 0 ? (
                                                <p className="text-xs text-primary font-medium mt-1">+{formatNaira(ram.priceAdd)}</p>
                                            ) : (
                                                <p className="text-xs text-muted-foreground mt-1">Base price</p>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Key Specs Grid */}

                        <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
                            {mockProduct.specs.map((spec, i) => (
                                <div key={i} className="p-3 rounded-xl bg-secondary/30 border border-border/50">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{spec.label}</p>
                                    <p className="font-semibold text-sm line-clamp-1" title={spec.value}>{spec.value}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* Vendor Card */}
                        <motion.div variants={fadeInUp}>
                            <Card className="hover:border-primary/30 transition-colors group cursor-pointer bg-card/50">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Store className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold">{mockProduct.vendorName}</h3>
                                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-green-500/30 text-green-600 bg-green-500/5">Verified</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {mockProduct.vendorSales} Sales • {mockProduct.vendorRating} Rating
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Description */}
                        <motion.div variants={fadeInUp} className="space-y-3">
                            <h3 className="font-bold text-lg">About this item</h3>
                            <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base bg-secondary/10 p-4 rounded-2xl border border-border/50">
                                {mockProduct.description}
                            </div>
                        </motion.div>

                        {/* Assurance Badges */}
                        <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                                <ShieldCheck className="w-5 h-5 text-green-600" />
                                <div className="text-xs">
                                    <p className="font-bold text-foreground">Buyer Protection</p>
                                    <p className="text-muted-foreground">Guaranteed refund</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                <Truck className="w-5 h-5 text-blue-600" />
                                <div className="text-xs">
                                    <p className="font-bold text-foreground">Fast Delivery</p>
                                    <p className="text-muted-foreground">Within campus</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                                <Clock className="w-5 h-5 text-purple-600" />
                                <div className="text-xs">
                                    <p className="font-bold text-foreground">24/7 Support</p>
                                    <p className="text-muted-foreground">Always here</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Reviews Preview (Simple) */}
                        <motion.div variants={fadeInUp} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg">Ratings & Reviews</h3>
                                <Button variant="link" className="text-primary p-0 h-auto font-semibold">View All</Button>
                            </div>

                            {/* Mock Review Breakdown */}
                            <div className="flex items-center gap-6 p-6 rounded-3xl bg-secondary/20">
                                <div className="text-center">
                                    <p className="text-5xl font-black text-foreground">{mockProduct.rating}</p>
                                    <div className="flex gap-0.5 justify-center my-1">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} className="w-3 h-3 fill-amber-500 text-amber-500" />
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{mockProduct.reviewCount} Reviews</p>
                                </div>
                                <div className="flex-1 space-y-1">
                                    {[5, 4, 3, 2, 1].map((star, i) => (
                                        <div key={star} className="flex items-center gap-2 text-xs">
                                            <span className="w-2 font-medium">{star}</span>
                                            <Progress value={[80, 15, 5, 0, 0][i]} className="h-1.5" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {mockReviews.map((review) => (
                                    <div key={review.id} className="p-4 rounded-xl border border-border/50 bg-card">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                    {review.userName.charAt(0)}
                                                </div>
                                                <p className="font-bold text-sm">{review.userName}</p>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">{review.date}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Related Products */}
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    className="mt-16 space-y-6"
                >
                    <h2 className="text-2xl font-display font-bold">You Might Also Like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {relatedProducts.map((product) => (
                            <Link key={product.id} href={`/product/${product.id}`}>
                                <Card className="overflow-hidden group hover:shadow-lg transition-all hover:border-primary/30">
                                    <div className="aspect-square bg-muted relative overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <CardContent className="p-3">
                                        <p className="text-xs text-muted-foreground mb-1">{product.vendorName}</p>
                                        <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-primary">{formatNaira(product.price)}</span>
                                            <div className="flex items-center text-amber-500 text-xs">
                                                <Star className="w-3 h-3 fill-current mr-0.5" />
                                                {product.rating}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </main>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-xl border-t safe-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    {/* Mobile Quantity (Hidden on Desktop usually, but here unified) */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-secondary/50 rounded-xl border border-border/50">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background transition-colors disabled:opacity-50"
                            disabled={quantity <= 1}
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-4 text-center font-bold text-lg">{quantity}</span>
                        <button
                            onClick={() => setQuantity(Math.min(mockProduct.stock, quantity + 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background transition-colors disabled:opacity-50"
                            disabled={quantity >= mockProduct.stock}
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <Button
                        size="lg"
                        className="flex-1 rounded-xl text-base font-bold shadow-lg shadow-primary/20"
                        onClick={handleAddToCart}
                        disabled={isInCart || mockProduct.stock === 0}
                    >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        {isInCart ? "Already in Cart" : mockProduct.stock === 0 ? "Out of Stock" : `Add to Cart - ${formatNaira(finalPrice * quantity)}`}
                    </Button>
                </div>
            </div>
        </div>
    );
}
