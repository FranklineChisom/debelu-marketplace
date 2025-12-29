"use client";

import { MessageSquare, Package, ShoppingCart, CheckCircle } from "lucide-react";
import { cn, formatNaira } from "@/lib/utils";
import type { ChatMessage, ProductSummary } from "@/types";
import { ProductCardChat } from "./product-card-chat";
import { Badge } from "@/components/ui/badge";

interface MessageBubbleProps {
    message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const { role, type, content, products, product, order, quickActions } = message;

    // System message
    if (role === "system") {
        return (
            <div className="text-center py-2">
                <span className="text-xs text-muted-foreground">{content}</span>
            </div>
        );
    }

    // User message
    if (role === "user") {
        return (
            <div className="chat-bubble chat-bubble-user max-w-[85%]">
                <p className="text-sm sm:text-base">{content}</p>
            </div>
        );
    }

    // Assistant message - varies by type
    return (
        <div className="flex gap-3 max-w-full">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-primary-foreground" />
            </div>

            {/* Message Content */}
            <div className="space-y-3 min-w-0 flex-1">
                {/* Text content */}
                {content && (
                    <div className="chat-bubble chat-bubble-ai">
                        <p className="text-sm sm:text-base">{content}</p>
                    </div>
                )}

                {/* Products carousel */}
                {type === "products" && products && products.length > 0 && (
                    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                        <div className="flex gap-3 pb-2">
                            {products.map((product) => (
                                <ProductCardChat key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Single product detail */}
                {type === "product-detail" && product && (
                    <ProductCardChat product={product} expanded />
                )}

                {/* Cart summary */}
                {type === "cart" && (
                    <CartSummaryBubble />
                )}

                {/* Order confirmation */}
                {type === "order-confirmation" && order && (
                    <OrderConfirmationBubble order={order} />
                )}

                {/* Quick actions */}
                {quickActions && quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {quickActions.map((action) => (
                            <button
                                key={action.id}
                                className="px-3 py-1.5 text-xs font-medium rounded-full border bg-background hover:bg-muted transition-colors"
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function CartSummaryBubble() {
    return (
        <div className="bg-background border rounded-2xl p-4 max-w-sm">
            <div className="flex items-center gap-2 mb-3">
                <ShoppingCart className="w-4 h-4" />
                <span className="font-semibold text-sm">Your Cart</span>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Dell Inspiron 15</span>
                    <span>{formatNaira(165000)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">USB-C Hub</span>
                    <span>{formatNaira(12500)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="price">{formatNaira(177500)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OrderConfirmationBubble({ order }: { order: any }) {
    return (
        <div className="bg-background border rounded-2xl p-4 max-w-sm">
            <div className="flex items-center gap-2 mb-3 text-success">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Order Confirmed!</span>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID</span>
                    <span className="font-mono text-xs">#{order?.orderNumber || "DBL-2024-1234"}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>Today, 2-4pm</span>
                </div>
                <Badge variant="success" className="mt-2">
                    Vendor notified
                </Badge>
            </div>
        </div>
    );
}
