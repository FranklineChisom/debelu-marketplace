"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    MapPin,
    Clock,
    CreditCard,
    CheckCircle,
    ChevronRight,
    Plus,
    X,
    Building2,
    Phone,
    Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNaira, generateOrderId } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useCartStore, useChatStore } from "@/stores";
import { PAYMENT_METHODS } from "@/lib/constants";

type Step = "address" | "delivery" | "payment";

const steps: { id: Step; label: string; icon: React.ComponentType<any> }[] = [
    { id: "address", label: "Address", icon: MapPin },
    { id: "delivery", label: "Delivery", icon: Clock },
    { id: "payment", label: "Payment", icon: CreditCard },
];

const mockAddresses = [
    { id: "1", label: "Moremi Hall, Room 234", fullAddress: "Moremi Hall, UNILAG", isDefault: true },
    { id: "2", label: "Faculty of Engineering", fullAddress: "Faculty of Engineering, UNILAG", isDefault: false },
];

const deliverySlots = [
    { id: "1", label: "ASAP", time: "30-60 mins", fee: 500, popular: true },
    { id: "2", label: "Today 2-4pm", time: "In 3 hours", fee: 300 },
];

export function CheckoutPanel() {
    const [currentStep, setCurrentStep] = useState<Step>("address");
    const [selectedAddress, setSelectedAddress] = useState(mockAddresses[0].id);
    const [selectedSlot, setSelectedSlot] = useState(deliverySlots[0].id);
    const [selectedPayment, setSelectedPayment] = useState("paystack");
    const [promoCode, setPromoCode] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);

    const items = useCartStore((state) => state.items);
    const getSubtotal = useCartStore((state) => state.getSubtotal);
    const clearCart = useCartStore((state) => state.clearCart);

    const openPanel = useChatStore((state) => state.openPanel);
    const closePanel = useChatStore((state) => state.closePanel);
    const addAssistantMessage = useChatStore((state) => state.addAssistantMessage);

    const subtotal = getSubtotal();
    const deliveryFee = deliverySlots.find((s) => s.id === selectedSlot)?.fee || 500;
    const total = subtotal + deliveryFee;

    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

    const goNext = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < steps.length) {
            setCurrentStep(steps[nextIndex].id);
        }
    };

    const goBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStep(steps[currentStepIndex - 1].id);
        } else {
            openPanel('cart'); // Go back to cart
        }
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        await new Promise((r) => setTimeout(r, 2000));

        const newOrderNumber = generateOrderId();
        const newOrder = {
            id: `ord_${Math.random().toString(36).substring(7)}`,
            orderNumber: newOrderNumber,
            items: items.map(i => i.product), // Simplified item structure for demo
            total: total,
            status: "pending",
            date: new Date().toISOString(),
            itemCount: items.length,
            createdAt: new Date().toISOString()
        };

        clearCart();
        setIsProcessing(false);

        // Add confirmation to chat - use current session
        const currentSessionId = useChatStore.getState().currentSessionId;
        if (currentSessionId) {
            addAssistantMessage(currentSessionId, `🎉 Your order #${newOrderNumber} has been placed successfully! We'll notify you when it's on the way.`);
        }

        // Open Order Detail Panel
        openPanel('order_detail', { type: 'order_detail', orderId: newOrder.id, order: newOrder });
    };

    return (
        <div className="flex flex-col h-full bg-background relative z-20">
            {/* Header */}
            <header className="h-14 flex items-center justify-between px-4 border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
                <div className="flex items-center gap-2">
                    <button
                        onClick={goBack}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h1 className="font-display font-semibold text-lg">Checkout</h1>
                </div>
                <Button variant="ghost" size="icon" onClick={() => closePanel()} className="h-8 w-8">
                    <X className="w-4 h-4" />
                </Button>
            </header>

            {/* Steps Indicator */}
            <div className="px-6 py-4 border-b border-border/40 bg-muted/10">
                <div className="flex items-center justify-between">
                    {steps.map((step, i) => {
                        const isActive = step.id === currentStep;
                        const isComplete = i < currentStepIndex;
                        return (
                            <div key={step.id} className="flex flex-col items-center gap-1">
                                <motion.div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                                        isComplete
                                            ? "bg-primary text-primary-foreground"
                                            : isActive
                                                ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                                                : "bg-muted text-muted-foreground"
                                    )}
                                    animate={{ scale: isActive ? 1.1 : 1 }}
                                >
                                    {isComplete ? <CheckCircle className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                                </motion.div>
                                <span className={cn("text-[10px] font-medium transition-colors", isActive ? "text-foreground" : "text-muted-foreground")}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="pb-20"
                >
                    <AnimatePresence mode="wait">
                        {/* Address */}
                        {currentStep === "address" && (
                            <motion.div
                                key="address"
                                variants={fadeInUp}
                                initial="initial"
                                animate="animate"
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-3"
                            >
                                {isAddingAddress ? (
                                    <div className="space-y-3 p-4 border border-border/40 rounded-xl bg-muted/20">
                                        <h3 className="text-sm font-semibold">New Address</h3>
                                        <div className="space-y-2">
                                            <Input placeholder="Label (e.g., Home, Work)" />
                                            <Input placeholder="Full Address" />
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" id="default-address" className="rounded border-gray-300" />
                                                <label htmlFor="default-address" className="text-xs">Set as default</label>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" className="flex-1" onClick={() => setIsAddingAddress(false)}>Save Address</Button>
                                            <Button size="sm" variant="outline" className="flex-1" onClick={() => setIsAddingAddress(false)}>Cancel</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Select Address</h3>
                                        {mockAddresses.map((address) => (
                                            <div
                                                key={address.id}
                                                onClick={() => setSelectedAddress(address.id)}
                                                className={cn(
                                                    "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                                                    selectedAddress === address.id
                                                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                                        : "border-border/40 hover:bg-muted/50"
                                                )}
                                            >
                                                <div className={cn("w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center", selectedAddress === address.id ? "border-primary" : "border-muted-foreground")}>
                                                    {selectedAddress === address.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm">{address.label}</span>
                                                        {address.isDefault && <Badge variant="secondary" className="text-[10px] h-4 px-1">Default</Badge>}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{address.fullAddress}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            className="w-full dashed border-muted-foreground/30 text-muted-foreground"
                                            onClick={() => setIsAddingAddress(true)}
                                        >
                                            <Plus className="w-4 h-4 mr-2" /> Add New Address
                                        </Button>
                                    </>
                                )}
                            </motion.div>
                        )}

                        {/* Delivery */}
                        {currentStep === "delivery" && (
                            <motion.div
                                key="delivery"
                                variants={fadeInUp}
                                initial="initial"
                                animate="animate"
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-3"
                            >
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Delivery Slot</h3>
                                {deliverySlots.map((slot) => (
                                    <div
                                        key={slot.id}
                                        onClick={() => setSelectedSlot(slot.id)}
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                                            selectedSlot === slot.id
                                                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                                : "border-border/40 hover:bg-muted/50"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", selectedSlot === slot.id ? "border-primary" : "border-muted-foreground")}>
                                                {selectedSlot === slot.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm">{slot.label}</span>
                                                    {slot.popular && <Badge variant="outline" className="text-[10px] h-4 px-1 bg-gradient-to-r from-orange-500/10 to-pink-500/10 text-orange-600 border-orange-200">Popular</Badge>}
                                                </div>
                                                <p className="text-xs text-muted-foreground">{slot.time}</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-sm">{formatNaira(slot.fee)}</span>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Payment */}
                        {currentStep === "payment" && (
                            <motion.div
                                key="payment"
                                variants={fadeInUp}
                                initial="initial"
                                animate="animate"
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-4"
                            >
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Select Payment</h3>
                                <div className="space-y-3">
                                    {PAYMENT_METHODS.map((method) => {
                                        const Icon = {
                                            paystack: CreditCard,
                                            bank_transfer: Building2,
                                            ussd: Phone,
                                            pod: Banknote
                                        }[method.id] || CreditCard;

                                        return (
                                            <div
                                                key={method.id}
                                                onClick={() => setSelectedPayment(method.id)}
                                                className={cn(
                                                    "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                                                    selectedPayment === method.id
                                                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                                        : "border-border/40 hover:bg-muted/50"
                                                )}
                                            >
                                                <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", selectedPayment === method.id ? "border-primary" : "border-muted-foreground")}>
                                                    {selectedPayment === method.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                                </div>
                                                <Icon className="w-5 h-5 text-muted-foreground" />
                                                <div className="flex-1">
                                                    <span className="font-medium text-sm block">{method.name}</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="p-4 bg-muted/30 rounded-xl space-y-2 mt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>{formatNaira(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Delivery</span>
                                        <span>{formatNaira(deliveryFee)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-base pt-2 border-t border-border/40">
                                        <span>Total to Pay</span>
                                        <span className="text-primary">{formatNaira(total)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border/40 bg-background/95 backdrop-blur-xl absolute bottom-0 left-0 right-0">
                {currentStep === "payment" ? (
                    <Button
                        size="lg"
                        className="w-full rounded-full font-semibold shadow-lg shadow-primary/20"
                        onClick={handlePlaceOrder}
                        isLoading={isProcessing}
                    >
                        Pay {formatNaira(total)}
                    </Button>
                ) : (
                    <Button
                        size="lg"
                        className="w-full rounded-full"
                        onClick={goNext}
                    >
                        Continue <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
}
