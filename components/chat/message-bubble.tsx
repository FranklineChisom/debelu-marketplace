
import { useRouter } from "next/navigation";
import { MessageSquare, Package, ShoppingCart, CheckCircle, FileText, Download } from "lucide-react";
import { cn, formatNaira } from "@/lib/utils";
import type { ChatMessage, ProductSummary } from "@/types";
import { ProductCardChat } from "./product-card-chat";
import { Badge } from "@/components/ui/badge";
import { useChatStore } from "@/stores";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";


interface MessageBubbleProps {
    message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const router = useRouter();
    const openPanel = useChatStore((state) => state.openPanel);
    const setComparingProducts = useChatStore((state) => state.setComparingProducts);
    const { role, type, content, products, product, order, quickActions } = message;

    // ... (system and user message checks remain the same)

    // User message
    if (role === "user") {
        return (
            <div className="chat-bubble chat-bubble-user max-w-[85%]">
                <p className="text-sm sm:text-base">{content}</p>
            </div>
        );
    }

    // System message
    if (role === "system") {
        return (
            <div className="text-center py-2">
                <span className="text-xs text-muted-foreground">{content}</span>
            </div>
        );
    }

    // Assistant message - varies by type
    return (
        <div className="flex gap-3 max-w-full">


            {/* Message Content */}
            <div className="pl-2 space-y-3 min-w-0 flex-1">
                {/* Text content */}
                {content && (
                    <div className="chat-bubble chat-bubble-ai">
                        <p className="text-sm sm:text-base">{content}</p>
                    </div>
                )}

                {/* Products carousel */}
                {type === "products" && products && products.length > 0 && (
                    <div className="w-[85vw] md:w-[600px] lg:w-[700px] pr-8 pl-1">
                        <Carousel
                            opts={{
                                align: "start",
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-2">
                                {products.map((product) => (
                                    <CarouselItem key={product.id} className="pl-2 basis-[160px] sm:basis-[200px] lg:basis-1/3">
                                        <ProductCardChat product={product} />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-0 -translate-x-1/2 hidden sm:flex" />
                            <CarouselNext className="right-0 translate-x-1/2 hidden sm:flex" />
                        </Carousel>
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

                {/* Invoice */}
                {type === "invoice" && (
                    <InvoiceBubble order={order} />
                )}

                {/* Quick actions */}
                {quickActions && quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {quickActions.map((action) => (
                            <button
                                key={action.id}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
                                    action.variant === "default"
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent"
                                        : "bg-background hover:bg-muted border-border"
                                )}
                                onClick={() => {
                                    if (action.action === "compare" && products) {
                                        setComparingProducts(products);
                                    } else if (action.action === "checkout") {
                                        openPanel('checkout');
                                    } else if (action.action === "view_cart") {
                                        openPanel('cart');
                                    } else if (action.action === "track_order") {
                                        openPanel('order_detail', { orderId: order?.id });
                                    } else {
                                        console.log("Action clicked:", action.label);
                                    }
                                }}
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
    const openPanel = useChatStore((state) => state.openPanel);
    return (
        <div className="bg-background border rounded-2xl p-4 max-w-sm cursor-pointer hover:border-primary/50 transition-colors" onClick={() => openPanel('cart')}>
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
            <div className="mt-3 text-xs text-center text-primary font-medium">
                Click to view cart
            </div>
        </div>
    );
}

function OrderConfirmationBubble({ order }: { order: any }) {
    const openPanel = useChatStore((state) => state.openPanel);
    return (
        <div className="bg-background border rounded-2xl p-4 max-w-sm cursor-pointer hover:border-primary/50 transition-colors" onClick={() => openPanel('order_detail', { orderId: order?.id })}>
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
                <Badge variant="success" className="mt-2 text-xs">
                    Vendor notified
                </Badge>
            </div>
            <div className="mt-3 text-xs text-center text-primary font-medium">
                Click to track order
            </div>
        </div>
    );
}

function InvoiceBubble({ order }: { order: any }) {
    return (
        <div className="bg-background border rounded-2xl p-4 max-w-sm">
            <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-sm">Invoice Available</span>
            </div>
            <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="font-semibold">{formatNaira(order?.total || 178000)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span>Card ending 4242</span>
                </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2 bg-muted/50 hover:bg-muted text-foreground rounded-lg transition-colors text-xs font-medium border border-border/50">
                <Download className="w-3.5 h-3.5" />
                Download PDF
            </button>
        </div>
    );
}
