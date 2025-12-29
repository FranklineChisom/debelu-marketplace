"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Trash2,
    Minus,
    Plus,
    ShoppingBag,
    ArrowRight,
} from "lucide-react";
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
        <div className="min-h-screen bg-background pb-32">
            {/* Header */}
            <header className="h-14 flex items-center justify-between px-4 border-b bg-background sticky top-0 z-30">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="font-display text-lg font-bold">Cart</h1>
                {hasItems && (
                    <button
                        onClick={clearCart}
                        className="text-sm text-destructive hover:underline"
                    >
                        Clear
                    </button>
                )}
                {!hasItems && <div className="w-10" />}
            </header>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="p-4"
            >
                {!hasItems ? (
                    // Empty State
                    <motion.div variants={fadeInUp} className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h2 className="font-display text-lg font-bold mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Start shopping to add items to your cart
                        </p>
                        <Link href="/chat">
                            <Button>Start Shopping</Button>
                        </Link>
                    </motion.div>
                ) : (
                    // Cart Items
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <motion.div
                                key={`${item.product.id}-${JSON.stringify(item.variant)}`}
                                variants={fadeInUp}
                                layout
                            >
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            {/* Image */}
                                            <div className="w-20 h-20 rounded-xl bg-muted flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                                                {item.product.image ? (
                                                    <Image
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        width={80}
                                                        height={80}
                                                        className="rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    "No img"
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="font-medium text-sm line-clamp-2">
                                                        {item.product.name}
                                                    </h3>
                                                    <button
                                                        onClick={() =>
                                                            removeItem(item.product.id, item.variant)
                                                        }
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {item.product.vendorName}
                                                </p>

                                                {/* Variant */}
                                                {item.variant && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {Object.entries(item.variant)
                                                            .map(([k, v]) => `${k}: ${v}`)
                                                            .join(", ")}
                                                    </p>
                                                )}

                                                <div className="flex items-center justify-between mt-3">
                                                    {/* Quantity */}
                                                    <div className="flex items-center gap-1 bg-muted rounded-lg">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.product.id,
                                                                    item.quantity - 1,
                                                                    item.variant
                                                                )
                                                            }
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted-foreground/10 transition-colors"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-6 text-center text-sm font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.product.id,
                                                                    item.quantity + 1,
                                                                    item.variant
                                                                )
                                                            }
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted-foreground/10 transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    {/* Price */}
                                                    <span className="font-bold">
                                                        {formatNaira(item.product.price * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Bottom Summary */}
            {hasItems && (
                <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t safe-bottom">
                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatNaira(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Delivery</span>
                            <span>{formatNaira(deliveryFee)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-3">
                            <span>Total</span>
                            <span>{formatNaira(total)}</span>
                        </div>
                    </div>
                    <Link href="/checkout">
                        <Button className="w-full" size="lg">
                            Proceed to Checkout
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
