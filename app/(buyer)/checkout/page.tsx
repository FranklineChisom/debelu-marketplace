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
    Sparkles,
    PartyPopper,
    Package,
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
    { id: "1", label: "ASAP", time: "30-60 mins", fee: 500, popular: true },
    { id: "2", label: "Today 2-4pm", time: "In 3 hours", fee: 300 },
    { id: "3", label: "Today 5-7pm", time: "In 6 hours", fee: 300 },
    { id: "4", label: "Tomorrow", time: "Morning", fee: 200, savings: true },
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
        if (currentStep === "confirm") {
            router.push("/orders");
            return;
        }
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
        <div className="flex-1 overflow-y-auto scrollbar-thin pb-32">
            {/* Header */}
            <header className="h-14 flex items-center justify-between px-4 border-b bg-background/80 backdrop-blur-lg sticky top-0 z-30">
                <button
                    onClick={goBack}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-accent transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="font-display text-lg font-bold">
                    {currentStep === "confirm" ? "Order Confirmed" : "Checkout"}
                </h1>
                <div className="w-10" />
            </header>

            {/* Progress Steps */}
            {currentStep !== "confirm" && (
                <div className="px-4 py-4 border-b bg-background/50">
                    <div className="flex items-center justify-center gap-2">
                        {steps.map((step, i) => {
                            const isActive = step.id === currentStep;
                            const isComplete = i < currentStepIndex;
                            return (
                                <div key={step.id} className="flex items-center">
                                    <motion.div
                                        className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300",
                                            isComplete
                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                                : isActive
                                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                                    : "bg-muted text-muted-foreground"
                                        )}
                                        animate={{ scale: isActive ? 1.1 : 1 }}
                                    >
                                        {isComplete ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : (
                                            <step.icon className="w-5 h-5" />
                                        )}
                                    </motion.div>
                                    {i < steps.length - 1 && (
                                        <div
                                            className={cn(
                                                "w-12 h-1 mx-2 rounded-full transition-all duration-300",
                                                i < currentStepIndex ? "bg-primary" : "bg-muted"
                                            )}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-center mt-2">
                        <span className="text-sm font-medium">
                            {steps[currentStepIndex]?.label}
                        </span>
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
                            <h2 className="font-display text-xl font-bold">
                                Delivery Address
                            </h2>
                            <div className="space-y-3">
                                {mockAddresses.map((address) => (
                                    <Card
                                        key={address.id}
                                        variant="premium"
                                        className={cn(
                                            "cursor-pointer transition-all duration-200",
                                            selectedAddress === address.id && "ring-2 ring-primary shadow-lg shadow-primary/10"
                                        )}
                                        onClick={() => setSelectedAddress(address.id)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={cn(
                                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                                                        selectedAddress === address.id
                                                            ? "border-primary bg-primary"
                                                            : "border-muted-foreground"
                                                    )}
                                                >
                                                    {selectedAddress === address.id && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                        >
                                                            <CheckCircle className="w-4 h-4 text-primary-foreground" />
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold">
                                                            {address.label}
                                                        </p>
                                                        {address.isDefault && (
                                                            <Badge variant="secondary" className="text-[10px]">
                                                                Default
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {address.fullAddress}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-2xl text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all">
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
                            <h2 className="font-display text-xl font-bold">Delivery Time</h2>
                            <div className="space-y-3">
                                {deliverySlots.map((slot) => (
                                    <Card
                                        key={slot.id}
                                        variant="premium"
                                        className={cn(
                                            "cursor-pointer transition-all duration-200",
                                            selectedSlot === slot.id && "ring-2 ring-primary shadow-lg shadow-primary/10"
                                        )}
                                        onClick={() => setSelectedSlot(slot.id)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={cn(
                                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                            selectedSlot === slot.id
                                                                ? "border-primary bg-primary"
                                                                : "border-muted-foreground"
                                                        )}
                                                    >
                                                        {selectedSlot === slot.id && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                            >
                                                                <CheckCircle className="w-4 h-4 text-primary-foreground" />
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-semibold">{slot.label}</p>
                                                            {slot.popular && (
                                                                <Badge variant="gradient" className="text-[10px]">
                                                                    Popular
                                                                </Badge>
                                                            )}
                                                            {slot.savings && (
                                                                <Badge variant="success" className="text-[10px]">
                                                                    Best Value
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {slot.time}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="font-bold">
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
                            <h2 className="font-display text-xl font-bold">Payment Method</h2>
                            <div className="space-y-3">
                                {PAYMENT_METHODS.map((method) => (
                                    <Card
                                        key={method.id}
                                        variant="premium"
                                        className={cn(
                                            "cursor-pointer transition-all duration-200",
                                            selectedPayment === method.id && "ring-2 ring-primary shadow-lg shadow-primary/10"
                                        )}
                                        onClick={() => setSelectedPayment(method.id)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={cn(
                                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                        selectedPayment === method.id
                                                            ? "border-primary bg-primary"
                                                            : "border-muted-foreground"
                                                    )}
                                                >
                                                    {selectedPayment === method.id && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                        >
                                                            <CheckCircle className="w-4 h-4 text-primary-foreground" />
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <span className="text-2xl">{method.icon}</span>
                                                <div className="flex-1">
                                                    <p className="font-semibold">{method.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {method.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Promo Code */}
                            <Card variant="frosted" className="mt-6">
                                <CardContent className="p-4">
                                    <p className="text-sm font-semibold mb-3">Promo Code</p>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Enter code"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                            variant="premium"
                                            className="flex-1"
                                        />
                                        <Button variant="outline">Apply</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Confirmation Step */}
                    {currentStep === "confirm" && (
                        <motion.div
                            key="confirm"
                            variants={fadeInUp}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-success to-success/80 flex items-center justify-center shadow-xl shadow-success/30"
                            >
                                <PartyPopper className="w-12 h-12 text-white" />
                            </motion.div>
                            <h2 className="font-display text-3xl font-bold mb-3">
                                Order Placed! 🎉
                            </h2>
                            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
                                Your order has been placed successfully and is being processed.
                            </p>
                            <Badge variant="secondary" className="font-mono text-lg px-4 py-2 mb-8">
                                #{orderNumber}
                            </Badge>
                            <div className="space-y-3 max-w-xs mx-auto">
                                <Link href="/orders">
                                    <Button variant="glow" className="w-full" size="lg">
                                        <Package className="w-4 h-4 mr-2" />
                                        Track Order
                                    </Button>
                                </Link>
                                <Link href="/chat">
                                    <Button variant="outline" className="w-full" size="lg">
                                        <Sparkles className="w-4 h-4 mr-2" />
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
                <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-xl border-t safe-bottom">
                    {currentStep === "payment" ? (
                        <div className="space-y-4">
                            <Card variant="frosted" className="border-0">
                                <CardContent className="p-4">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-gradient">{formatNaira(total)}</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Button
                                variant="glow"
                                className="w-full"
                                size="lg"
                                onClick={handlePlaceOrder}
                                isLoading={isProcessing}
                            >
                                Pay {formatNaira(total)}
                            </Button>
                        </div>
                    ) : (
                        <Button variant="glow" className="w-full" size="lg" onClick={goNext}>
                            Continue
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
