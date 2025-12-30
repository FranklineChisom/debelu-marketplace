"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Minus, Plus, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useCartStore } from "@/stores";

export default function CartPage() {
    const router = useRouter();
    const items = useCartStore((state) => state.items);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);
    const getSubtotal = useCartStore((state) => state.getSubtotal);
    const clearCart = useCartStore((state) => state.clearCart);

    const subtotal = getSubtotal();
    const deliveryFee = items.length > 0 ? 500 : 0;
    const total = subtotal + deliveryFee;
    const hasItems = items.length > 0;

    return (
        <div className="flex-1 overflow-y-auto scrollbar-thin">
            {/* Header */}
            <header className="h-14 lg:h-16 flex items-center justify-between px-6 lg:px-12 border-b border-foreground/10 sticky top-0 z-30 bg-background">
                <button
                    onClick={() => router.back()}
                    className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg lg:text-xl font-black tracking-tight">
                    CART {hasItems && <span className="text-muted-foreground">({items.length})</span>}
                </h1>
                {hasItems ? (
                    <button onClick={clearCart} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Clear
                    </button>
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
                                                    <button
                                                        onClick={() => removeItem(item.product.id, item.variant)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">{item.product.vendorName}</p>

                                                <div className="mt-auto pt-4 flex items-center justify-between">
                                                    {/* Quantity */}
                                                    <div className="flex items-center gap-1 border border-foreground/10 rounded-full">
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant)}
                                                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-foreground/5 disabled:opacity-50"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant)}
                                                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-foreground/5"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
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
                                    <div className="border-t border-foreground/10 pt-4 flex justify-between text-xl">
                                        <span className="font-bold">Total</span>
                                        <span className="font-black">{formatNaira(total)}</span>
                                    </div>
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
