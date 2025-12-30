"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn, formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useCartStore, useChatStore } from "@/stores";

export function CartPanel() {
    const items = useCartStore((state) => state.items);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);
    const getSubtotal = useCartStore((state) => state.getSubtotal);
    const clearCart = useCartStore((state) => state.clearCart);

    const openPanel = useChatStore((state) => state.openPanel);
    const closePanel = useChatStore((state) => state.closePanel);

    const subtotal = getSubtotal();
    const deliveryFee = items.length > 0 ? 500 : 0;
    const total = subtotal + deliveryFee;
    const hasItems = items.length > 0;

    return (
        <div className="flex flex-col h-full bg-background relative z-20">
            {/* Header */}
            <header className="h-14 flex items-center justify-between px-6 border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
                <h2 className="font-display font-semibold text-lg flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Cart {hasItems && <span className="text-muted-foreground text-sm font-normal">({items.length})</span>}
                </h2>
                <div className="flex items-center gap-2">
                    {hasItems && (
                        <button
                            onClick={clearCart}
                            className="text-xs text-muted-foreground hover:text-destructive transition-colors mr-2 font-medium"
                        >
                            Clear
                        </button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => closePanel()} className="h-8 w-8">
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
                {!hasItems ? (
                    // Empty State
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                            <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
                        <p className="text-sm text-muted-foreground mb-6 max-w-[200px] mx-auto">
                            Add items from the chat to see them here
                        </p>
                        <Button onClick={() => closePanel()} variant="outline" className="rounded-full">
                            Back to Chat
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="space-y-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {items.map((item) => (
                                <motion.div
                                    key={`${item.product.id}-${JSON.stringify(item.variant)}`}
                                    variants={fadeInUp}
                                    layout
                                    exit={{ opacity: 0, x: -100 }}
                                    className="flex gap-4 p-3 border border-border/40 rounded-xl bg-card/50 hover:bg-card hover:border-border/80 transition-colors group"
                                >
                                    {/* Image */}
                                    <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
                                        {item.product.image ? (
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-[10px] text-muted-foreground">No img</span>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="font-medium text-sm line-clamp-2 leading-tight">{item.product.name}</h4>
                                                <button
                                                    onClick={() => removeItem(item.product.id, item.variant)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">{item.product.vendorName}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            {/* Quantity */}
                                            <div className="flex items-center gap-1 border border-border/40 rounded-md bg-background h-7">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant)}
                                                    className="w-7 h-full flex items-center justify-center hover:bg-muted/50 disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant)}
                                                    className="w-7 h-full flex items-center justify-center hover:bg-muted/50"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <span className="font-bold text-sm">
                                                {formatNaira(item.product.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Footer Summary */}
            {hasItems && (
                <div className="p-4 border-t border-border/40 bg-background/95 backdrop-blur-xl">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Subtotal</span>
                            <span>{formatNaira(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Delivery Fee</span>
                            <span>{formatNaira(deliveryFee)}</span>
                        </div>
                        <div className="flex justify-between font-bold pt-2 border-t border-border/40">
                            <span>Total</span>
                            <span className="text-lg">{formatNaira(total)}</span>
                        </div>
                    </div>
                    <Button
                        size="lg"
                        className="w-full rounded-full font-semibold"
                        onClick={() => openPanel('checkout')}
                    >
                        Checkout
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            )}
        </div>
    );
}
