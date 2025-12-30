"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Minus, Plus, ShoppingBag, ArrowRight, Sparkles, Star, Tag, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn, formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useCartStore } from "@/stores";

// Mock recommendations
const recommendations = [
    {
        id: "rec1",
        name: "USB-C Hub 7-in-1",
        price: 15000,
        image: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?q=80&w=400&auto=format&fit=crop",
        vendorName: "TechHub NG",
        rating: 4.7,
    },
    {
        id: "rec2",
        name: "Laptop Sleeve 15\"",
        price: 8500,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop",
        vendorName: "CampusBags",
        rating: 4.5,
    },
    {
        id: "rec3",
        name: "Wireless Earbuds Pro",
        price: 25000,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&auto=format&fit=crop",
        vendorName: "GadgetWorld",
        rating: 4.8,
    },
    {
        id: "rec4",
        name: "Phone Stand Adjustable",
        price: 5000,
        image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?q=80&w=400&auto=format&fit=crop",
        vendorName: "DeskSetup",
        rating: 4.6,
    },
];

// Mock saved for later items
const savedForLater = [
    {
        id: "saved1",
        name: "Mechanical Keyboard RGB",
        price: 45000,
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=400&auto=format&fit=crop",
        vendorName: "TechHub NG",
    },
];

// Mock initial cart items for testing
const mockInitialCartItems = [
    {
        product: {
            id: "mock1",
            name: "Dell Inspiron 15 Laptop - Core i5, 8GB RAM",
            price: 165000,
            compareAtPrice: 195000,
            image: "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?q=80&w=400&auto=format&fit=crop",
            vendorName: "TechHub NG",
            rating: 4.8,
            reviewCount: 24,
            stock: 5,
            campusId: "unilag",
            vendorId: "v1",
        },
        quantity: 1,
    },
    {
        product: {
            id: "mock2",
            name: "Logitech MX Master 3S Mouse",
            price: 85000,
            image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=400&auto=format&fit=crop",
            vendorName: "GadgetWorld",
            rating: 4.9,
            reviewCount: 156,
            stock: 10,
            campusId: "unilag",
            vendorId: "v2",
        },
        quantity: 2,
    },
];

export default function CartPage() {
    const router = useRouter();
    const items = useCartStore((state) => state.items);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);
    const getSubtotal = useCartStore((state) => state.getSubtotal);
    const clearCart = useCartStore((state) => state.clearCart);
    const addItem = useCartStore((state) => state.addItem);

    const [promoCode, setPromoCode] = useState("");
    const [promoApplied, setPromoApplied] = useState(false);

    // Add mock items on first load if cart is empty
    useEffect(() => {
        if (items.length === 0) {
            mockInitialCartItems.forEach(({ product, quantity }) => {
                addItem(product, quantity);
            });
        }
    }, []);

    const subtotal = getSubtotal();
    const discount = promoApplied ? subtotal * 0.1 : 0;
    const deliveryFee = items.length > 0 ? 500 : 0;
    const total = subtotal - discount + deliveryFee;
    const hasItems = items.length > 0;

    const handleApplyPromo = () => {
        if (promoCode.toUpperCase() === "DEBELU10") {
            setPromoApplied(true);
        }
    };


    return (
        <div className="flex-1 overflow-y-auto scrollbar-thin">
            {/* Header */}
            <header className="h-14 lg:h-16 flex items-center justify-between px-6 lg:px-12 border-b border-foreground/10 sticky top-0 z-30 bg-background">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="lg:hidden rounded-full hover:bg-foreground/5"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-lg lg:text-xl font-black tracking-tight">
                    CART {hasItems && <span className="text-muted-foreground">({items.length})</span>}
                </h1>
                {hasItems ? (
                    <Button variant="ghost" onClick={clearCart} className="text-sm text-muted-foreground hover:text-foreground">
                        Clear
                    </Button>
                ) : (
                    <div className="w-10" />
                )}
            </header>

            <div className="px-6 lg:px-12 xl:px-16 py-8 lg:py-12">
                {!hasItems ? (
                    // Empty State
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        className="text-center py-20 lg:py-32"
                    >
                        <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-8 rounded-full border-2 border-foreground/10 flex items-center justify-center">
                            <ShoppingBag className="w-10 h-10 lg:w-12 lg:h-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl lg:text-4xl font-black mb-4">Your cart is empty</h2>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                            Start shopping to add items to your cart
                        </p>
                        <Link href="/chat">
                            <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-8">
                                <Sparkles className="w-5 h-5 mr-2" />
                                Start Shopping
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Cart Items */}
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="lg:col-span-2 space-y-4"
                        >
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div
                                        key={`${item.product.id}-${JSON.stringify(item.variant)}`}
                                        variants={fadeInUp}
                                        layout
                                        exit={{ opacity: 0, x: -100 }}
                                    >
                                        <div className="flex gap-4 lg:gap-6 p-4 lg:p-6 border border-foreground/10 rounded-xl lg:rounded-2xl hover:border-foreground/30 transition-colors">
                                            {/* Image */}
                                            <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-xl bg-foreground/5 flex-shrink-0 flex items-center justify-center">
                                                {item.product.image ? (
                                                    <Image
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        width={112}
                                                        height={112}
                                                        className="rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">No img</span>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0 flex flex-col">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="font-bold lg:text-lg line-clamp-2">{item.product.name}</h3>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeItem(item.product.id, item.variant)}
                                                        className="h-8 w-8 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-foreground"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">{item.product.vendorName}</p>

                                                <div className="mt-auto pt-4 flex items-center justify-between">
                                                    {/* Quantity */}
                                                    <div className="flex items-center gap-1 border border-foreground/10 rounded-full">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant)}
                                                            className="w-9 h-9 rounded-full hover:bg-foreground/5 disabled:opacity-50"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </Button>
                                                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant)}
                                                            className="w-9 h-9 rounded-full hover:bg-foreground/5"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    {/* Price */}
                                                    <span className="text-xl lg:text-2xl font-black">
                                                        {formatNaira(item.product.price * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Summary - Desktop Sticky */}
                        <motion.div
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            className="hidden lg:block"
                        >
                            <div className="sticky top-24 p-8 border border-foreground/10 rounded-2xl space-y-6">
                                <h2 className="text-xl font-black">Order Summary</h2>

                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-bold">{formatNaira(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivery</span>
                                        <span className="font-bold">{formatNaira(deliveryFee)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-bold">Total</span>
                                        <span className="font-black">{formatNaira(total)}</span>
                                    </div>
                                </div>

                                {/* Promo Code */}
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Promo code"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button variant="outline" onClick={handleApplyPromo} disabled={promoApplied}>
                                            {promoApplied ? "Applied!" : "Apply"}
                                        </Button>
                                    </div>
                                    {promoApplied && (
                                        <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                                            <Tag className="w-3 h-3 mr-1" />
                                            10% discount applied
                                        </Badge>
                                    )}
                                    <p className="text-xs text-muted-foreground">Try: DEBELU10</p>
                                </div>

                                <Link href="/checkout">
                                    <Button size="xl" className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90">
                                        Checkout
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Recommendations */}
                {hasItems && (
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        className="mt-12 space-y-6"
                    >
                        <h2 className="text-xl font-black">You Might Also Like</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {recommendations.map((product) => (
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
                )}

                {/* Saved for Later */}
                {hasItems && savedForLater.length > 0 && (
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        className="mt-12 space-y-6 pb-32 lg:pb-8"
                    >
                        <h2 className="text-xl font-black flex items-center gap-2">
                            <Bookmark className="w-5 h-5" />
                            From your Wishlist
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {savedForLater.map((item) => (
                                <Card key={item.id} className="flex gap-4 p-4 hover:border-primary/30 transition-all">
                                    <div className="w-20 h-20 rounded-xl bg-muted relative overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                                        <p className="text-xs text-muted-foreground">{item.vendorName}</p>
                                        <p className="font-bold text-primary mt-2">{formatNaira(item.price)}</p>
                                    </div>
                                    <Button variant="outline" size="sm">Move to Cart</Button>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>


            {/* Mobile Bottom Bar */}
            {hasItems && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-foreground/10 safe-bottom">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <span className="text-2xl font-black">{formatNaira(total)}</span>
                    </div>
                    <Link href="/checkout">
                        <Button size="lg" className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90">
                            Checkout <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
