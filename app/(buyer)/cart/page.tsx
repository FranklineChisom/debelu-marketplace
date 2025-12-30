"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Trash2,
    Minus,
    Plus,
    ShoppingBag,
    ArrowRight,
    Sparkles,
    Tag,
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
        <div className="flex-1 overflow-y-auto scrollbar-thin pb-40">
            {/* Header */}
            <header className="h-14 flex items-center justify-between px-4 border-b bg-background/80 backdrop-blur-lg sticky top-0 z-30">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-accent transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="font-display text-lg font-bold">
                    Cart {hasItems && `(${items.length})`}
                </h1>
                {hasItems ? (
                    <button
                        onClick={clearCart}
                        className="text-sm text-destructive hover:text-destructive/80 font-medium transition-colors"
                    >
                        Clear
                    </button>
                ) : (
                    <div className="w-10" />
                )}
            </header>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="p-4"
            >
                {!hasItems ? (
                    // Empty State
                    <motion.div variants={fadeInUp} className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
                            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h2 className="font-display text-2xl font-bold mb-3">
                            Your cart is empty
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
                            Start shopping to add items to your cart
                        </p>
                        <Link href="/chat">
                            <Button variant="glow" size="lg">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Start Shopping
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    // Cart Items
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {items.map((item) => (
                                <motion.div
                                    key={`${item.product.id}-${JSON.stringify(item.variant)}`}
                                    variants={fadeInUp}
                                    layout
                                    exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                                >
                                    <Card variant="premium">
                                        <CardContent className="p-4">
                                            <div className="flex gap-4">
                                                {/* Image */}
                                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground overflow-hidden">
                                                    {item.product.image ? (
                                                        <Image
                                                            src={item.product.image}
                                                            alt={item.product.name}
                                                            width={96}
                                                            height={96}
                                                            className="rounded-2xl object-cover"
                                                        />
                                                    ) : (
                                                        "No img"
                                                    )}
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h3 className="font-semibold line-clamp-2">
                                                            {item.product.name}
                                                        </h3>
                                                        <button
                                                            onClick={() =>
                                                                removeItem(item.product.id, item.variant)
                                                            }
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {item.product.vendorName}
                                                    </p>

                                                    {/* Variant */}
                                                    {item.variant && (
                                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                            <Tag className="w-3 h-3" />
                                                            {Object.entries(item.variant)
                                                                .map(([k, v]) => `${k}: ${v}`)
                                                                .join(", ")}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center justify-between mt-4">
                                                        {/* Quantity */}
                                                        <div className="flex items-center gap-1 bg-accent rounded-xl p-1">
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.product.id,
                                                                        item.quantity - 1,
                                                                        item.variant
                                                                    )
                                                                }
                                                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background transition-colors disabled:opacity-50"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </button>
                                                            <span className="w-8 text-center font-semibold">
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
                                                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background transition-colors"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        {/* Price */}
                                                        <span className="font-bold text-lg">
                                                            {formatNaira(item.product.price * item.quantity)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>

            {/* Bottom Summary */}
            {hasItems && (
                <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-xl border-t safe-bottom">
                    <Card variant="frosted" className="mb-4 border-0">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">{formatNaira(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Delivery</span>
                                <span className="font-medium">{formatNaira(deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-3">
                                <span>Total</span>
                                <span className="text-gradient">{formatNaira(total)}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Link href="/checkout">
                        <Button variant="glow" className="w-full" size="lg">
                            Proceed to Checkout
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
