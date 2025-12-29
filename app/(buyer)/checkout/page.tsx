"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    MapPin,
    Clock,
    CreditCard,
    CheckCircle,
    ChevronRight,
    Plus,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNaira, generateOrderId } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useCartStore } from "@/stores";
import { PAYMENT_METHODS } from "@/lib/constants";

type Step = "address" | "delivery" | "payment" | "confirm";

const steps: { id: Step; label: string; icon: React.ComponentType<any> }[] = [
    { id: "address", label: "Address", icon: MapPin },
    { id: "delivery", label: "Delivery", icon: Clock },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "confirm", label: "Confirm", icon: CheckCircle },
];

const mockAddresses = [
    {
        id: "1",
        label: "Moremi Hall, Room 234",
        fullAddress: "Moremi Hall, Room 234, University of Lagos, Akoka",
        isDefault: true,
    },
    {
        id: "2",
        label: "Faculty of Engineering",
        fullAddress: "Faculty of Engineering Building, UNILAG",
        isDefault: false,
    },
];

const deliverySlots = [
    { id: "1", label: "ASAP", time: "30-60 mins", fee: 500 },
    { id: "2", label: "Today 2-4pm", time: "In 3 hours", fee: 300 },
    { id: "3", label: "Today 5-7pm", time: "In 6 hours", fee: 300 },
    { id: "4", label: "Tomorrow", time: "Morning", fee: 200 },
];

export default function CheckoutPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<Step>("address");
    const [selectedAddress, setSelectedAddress] = useState(mockAddresses[0].id);
    const [selectedSlot, setSelectedSlot] = useState(deliverySlots[0].id);
    const [selectedPayment, setSelectedPayment] = useState("paystack");
    const [promoCode, setPromoCode] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderNumber, setOrderNumber] = useState("");

    const items = useCartStore((state) => state.items);
    const getSubtotal = useCartStore((state) => state.getSubtotal);
    const clearCart = useCartStore((state) => state.clearCart);

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
            router.back();
        }
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        await new Promise((r) => setTimeout(r, 2000));
        const newOrderNumber = generateOrderId();
        setOrderNumber(newOrderNumber);
        clearCart();
        setCurrentStep("confirm");
        setIsProcessing(false);
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <header className="h-14 flex items-center justify-between px-4 border-b bg-background sticky top-0 z-30">
                <button
                    onClick={goBack}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="font-display text-lg font-bold">Checkout</h1>
                <div className="w-10" />
            </header>

            {/* Progress Steps */}
            {currentStep !== "confirm" && (
                <div className="px-4 py-3 border-b">
                    <div className="flex items-center justify-between">
                        {steps.slice(0, 3).map((step, i) => {
                            const isActive = step.id === currentStep;
                            const isComplete = i < currentStepIndex;
                            return (
                                <div key={step.id} className="flex items-center">
                                    <div
                                        className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                                            isComplete
                                                ? "bg-primary text-primary-foreground"
                                                : isActive
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted text-muted-foreground"
                                        )}
                                    >
                                        {isComplete ? (
                                            <CheckCircle className="w-4 h-4" />
                                        ) : (
                                            <step.icon className="w-4 h-4" />
                                        )}
                                    </div>
                                    {i < 2 && (
                                        <div
                                            className={cn(
                                                "w-16 sm:w-24 h-0.5 mx-2",
                                                i < currentStepIndex ? "bg-primary" : "bg-muted"
                                            )}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="p-4"
            >
                <AnimatePresence mode="wait">
                    {/* Address Step */}
                    {currentStep === "address" && (
                        <motion.div
                            key="address"
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <h2 className="font-display text-lg font-bold">
                                Delivery Address
                            </h2>
                            <div className="space-y-3">
                                {mockAddresses.map((address) => (
                                    <Card
                                        key={address.id}
                                        className={cn(
                                            "cursor-pointer transition-colors",
                                            selectedAddress === address.id && "border-primary"
                                        )}
                                        onClick={() => setSelectedAddress(address.id)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                                                        selectedAddress === address.id
                                                            ? "border-primary bg-primary"
                                                            : "border-muted-foreground"
                                                    )}
                                                >
                                                    {selectedAddress === address.id && (
                                                        <CheckCircle className="w-3 h-3 text-primary-foreground" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-sm">
                                                            {address.label}
                                                        </p>
                                                        {address.isDefault && (
                                                            <Badge variant="secondary" className="text-[10px]">
                                                                Default
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {address.fullAddress}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-2xl text-sm text-muted-foreground hover:border-primary/50 transition-colors">
                                    <Plus className="w-4 h-4" />
                                    Add New Address
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Delivery Slot Step */}
                    {currentStep === "delivery" && (
                        <motion.div
                            key="delivery"
                            variants={fadeInUp}
                            initial={{ opacity: 0, x: 20 }}
                            animate="animate"
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <h2 className="font-display text-lg font-bold">Delivery Time</h2>
                            <div className="space-y-3">
                                {deliverySlots.map((slot) => (
                                    <Card
                                        key={slot.id}
                                        className={cn(
                                            "cursor-pointer transition-colors",
                                            selectedSlot === slot.id && "border-primary"
                                        )}
                                        onClick={() => setSelectedSlot(slot.id)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={cn(
                                                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                            selectedSlot === slot.id
                                                                ? "border-primary bg-primary"
                                                                : "border-muted-foreground"
                                                        )}
                                                    >
                                                        {selectedSlot === slot.id && (
                                                            <CheckCircle className="w-3 h-3 text-primary-foreground" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{slot.label}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {slot.time}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="font-medium text-sm">
                                                    {formatNaira(slot.fee)}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Payment Step */}
                    {currentStep === "payment" && (
                        <motion.div
                            key="payment"
                            variants={fadeInUp}
                            initial={{ opacity: 0, x: 20 }}
                            animate="animate"
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <h2 className="font-display text-lg font-bold">Payment Method</h2>
                            <div className="space-y-3">
                                {PAYMENT_METHODS.map((method) => (
                                    <Card
                                        key={method.id}
                                        className={cn(
                                            "cursor-pointer transition-colors",
                                            selectedPayment === method.id && "border-primary"
                                        )}
                                        onClick={() => setSelectedPayment(method.id)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        selectedPayment === method.id
                                                            ? "border-primary bg-primary"
                                                            : "border-muted-foreground"
                                                    )}
                                                >
                                                    {selectedPayment === method.id && (
                                                        <CheckCircle className="w-3 h-3 text-primary-foreground" />
                                                    )}
                                                </div>
                                                <span className="text-xl">{method.icon}</span>
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{method.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {method.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Promo Code */}
                            <div className="pt-4">
                                <p className="text-sm font-medium mb-2">Promo Code</p>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        className="flex-1"
                                    />
                                    <Button variant="outline">Apply</Button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Confirmation Step */}
                    {currentStep === "confirm" && (
                        <motion.div
                            key="confirm"
                            variants={fadeInUp}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-success" />
                            </div>
                            <h2 className="font-display text-2xl font-bold mb-2">
                                Order Placed! 🎉
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                Your order has been placed successfully.
                            </p>
                            <Badge variant="secondary" className="font-mono text-base mb-6">
                                #{orderNumber}
                            </Badge>
                            <div className="space-y-3">
                                <Link href="/orders">
                                    <Button className="w-full">Track Order</Button>
                                </Link>
                                <Link href="/chat">
                                    <Button variant="outline" className="w-full">
                                        Continue Shopping
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Bottom Action */}
            {currentStep !== "confirm" && (
                <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t safe-bottom">
                    {currentStep === "payment" ? (
                        <div className="space-y-3">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{formatNaira(total)}</span>
                            </div>
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handlePlaceOrder}
                                isLoading={isProcessing}
                            >
                                Pay {formatNaira(total)}
                            </Button>
                        </div>
                    ) : (
                        <Button className="w-full" size="lg" onClick={goNext}>
                            Continue
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
