"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    MapPin,
    Clock,
    CreditCard,
    Check,
    ChevronRight,
    Plus,
    Sparkles,
    Package,
    Shield,
    Copy,
    Home,
    Building,
    Zap,
    Truck,
    X,
    Trash2,
    Edit3,
    MoreVertical,
    GraduationCap,
    Smartphone,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn, formatNaira, generateOrderId } from "@/lib/utils";
import { useCartStore } from "@/stores";
import { PAYMENT_METHODS, OrderStatus } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useMarketplaceStore } from "@/stores/useMarketplaceStore";
import { Order } from "@/types/order";
import { toast } from "sonner";
import { Address } from "@/types/user";

type Step = "address" | "delivery" | "payment" | "confirm";
// Map shared types to icons. Shared: "Home" | "Work" | "Other"
const addressTypeIcons: Record<string, React.ComponentType<any>> = {
    Home: Home,
    Work: GraduationCap, // Work/Academic
    Other: Building,
};

// Removed initialAddresses, using store now

const deliverySlots = [
    { id: "1", label: "Express", time: "30-45 mins", fee: 500, icon: Zap, recommended: true },
    { id: "2", label: "Standard", time: "1-2 hours", fee: 300, icon: Truck },
    { id: "3", label: "Economy", time: "Same day", fee: 150, icon: Clock, savings: true },
];

export default function CheckoutPage() {
    const router = useRouter();

    // Store
    const user = useMarketplaceStore((state) => state.user);
    const placeOrder = useMarketplaceStore((state) => state.placeOrder);
    const addAddress = useMarketplaceStore((state) => state.addAddress);
    const updateAddress = useMarketplaceStore((state) => state.updateAddress);
    const deleteAddress = useMarketplaceStore((state) => state.deleteAddress);

    const addresses = user?.addresses || [];

    const [currentStep, setCurrentStep] = useState<Step>("address");
    // Default to first address or empty
    const [selectedAddress, setSelectedAddress] = useState(addresses.find(a => a.isDefault)?.id || addresses[0]?.id || "");
    const [selectedSlot, setSelectedSlot] = useState(deliverySlots[0].id);
    const [selectedPayment, setSelectedPayment] = useState("paystack");
    const [promoCode, setPromoCode] = useState("");
    const [promoApplied, setPromoApplied] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderNumber, setOrderNumber] = useState("");
    const [copied, setCopied] = useState(false);

    // Address modal state
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [addressForm, setAddressForm] = useState<Partial<Address>>({
        label: "",
        fullAddress: "",
        type: "Home",
        phone: user?.profile.phone || "",
        isDefault: false
    });

    const items = useCartStore((state) => state.items);
    const getSubtotal = useCartStore((state) => state.getSubtotal);
    const clearCart = useCartStore((state) => state.clearCart);

    const subtotal = getSubtotal();
    const deliveryFee = deliverySlots.find((s) => s.id === selectedSlot)?.fee || 500;
    const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal + deliveryFee - discount;

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

    const handleApplyPromo = () => {
        if (promoCode.toUpperCase() === "DEBELU10") {
            setPromoApplied(true);
        }
    };

    const handleCopyOrder = () => {
        navigator.clipboard.writeText(orderNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const placeOrder = useMarketplaceStore((state) => state.placeOrder);

    const handlePlaceOrder = () => {
        setIsProcessing(true);

        // Create new order object
        if (!user) {
            toast.error("Please log in to place an order");
            return;
        }

        // Create new order object
        const newOrder: Order = {
            id: `order-${Date.now()}`,
            orderNumber: generateOrderId(),
            buyerId: user.id,
            buyerName: `${user.profile.firstName} ${user.profile.lastName}`,
            buyerPhone: user.profile.phone,
            vendorId: "vendor-1", // Mock Vendor (assuming single vendor for now or derived from cart)
            vendorName: "Chisom Gadgets", // Mock Vendor Name
            campusId: user.profile.campusId,
            items: items.map(item => ({
                id: `item-${Date.now()}-${Math.random()}`,
                productId: item.product.id,
                productName: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                image: item.product.image,
                product: item.product // Store the full product info for reference
            })),
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            discount: discount,
            total: total,
            deliveryAddress: selectedAddressData ? {
                id: selectedAddressData.id,
                label: selectedAddressData.label,
                fullAddress: selectedAddressData.fullAddress,
                isDefault: selectedAddressData.isDefault
            } : {
                id: "default-addr",
                label: "Default Address",
                fullAddress: "No address selected",
                isDefault: true
            },
            deliverySlot: selectedSlotData ? {
                id: selectedSlotData.id,
                label: selectedSlotData.label,
                date: new Date().toISOString(), // Placeholder
                startTime: "09:00", // Placeholder
                endTime: "17:00", // Placeholder
                fee: selectedSlotData.fee
            } : {
                id: "default-slot",
                label: "Standard Delivery",
                date: new Date().toISOString(),
                startTime: "09:00",
                endTime: "17:00",
                fee: 0
            },
            paymentMethod: selectedPayment as any,
            paymentStatus: "paid", // Assuming successful payment
            status: "pending",
            statusHistory: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Dispatch to store
        placeOrder(newOrder);

        // Simulate API delay
        setTimeout(() => {
            setIsProcessing(false);
            setOrderNumber(newOrder.orderNumber); // Set the order number for display
            clearCart(); // Clear the cart after placing order
            setCurrentStep("confirm");
            toast.success("Order placed successfully!");
        }, 2000);
    };

    // Address management functions
    const openAddAddress = () => {
        setEditingAddress(null);
        setAddressForm({ label: "", fullAddress: "", type: "Home", phone: user?.profile.phone || "", isDefault: false });
        setShowAddressModal(true);
    };

    const openEditAddress = (address: Address) => {
        setEditingAddress(address);
        setAddressForm({
            label: address.label,
            fullAddress: address.fullAddress,
            type: address.type,
            phone: address.phone,
            isDefault: address.isDefault
        });
        setShowAddressModal(true);
    };

    const handleSaveAddress = () => {
        if (!addressForm.label || !addressForm.fullAddress) return;

        // Complete the address object
        const addressData = {
            ...addressForm,
            type: addressForm.type || "Home",
            phone: addressForm.phone || "",
            isDefault: !!addressForm.isDefault
        } as Address;

        if (editingAddress) {
            // Update existing
            updateAddress({ ...editingAddress, ...addressData });
        } else {
            // Add new
            const newAddress: Address = {
                id: crypto.randomUUID(),
                ...addressData,
                isDefault: addresses.length === 0,
            };
            addAddress(newAddress);
            setSelectedAddress(newAddress.id);
        }
        setShowAddressModal(false);
    };

    const handleDeleteAddress = (id: string) => {
        deleteAddress(id);
        if (selectedAddress === id) {
            // select another if available
            const remaining = addresses.filter(a => a.id !== id);
            if (remaining.length > 0) setSelectedAddress(remaining[0].id);
            else setSelectedAddress("");
        }
    };

    const handleSetDefault = (id: string) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
    };

    const selectedAddressData = addresses.find((a) => a.id === selectedAddress);
    const selectedSlotData = deliverySlots.find((s) => s.id === selectedSlot);

    return (
        <div className="flex-1 overflow-y-auto bg-background">
            {/* Minimal Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border/40">
                <div className="flex items-center justify-between px-4 h-14 max-w-2xl mx-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={goBack}
                        className="-ml-2 rounded-full hover:bg-muted"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="font-semibold text-base">
                        {currentStep === "confirm" ? "Order Placed" : "Checkout"}
                    </h1>
                    <div className="w-10" />
                </div>
            </header>

            {/* Progress Bar */}
            {currentStep !== "confirm" && (
                <div className="sticky top-14 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30">
                    <div className="max-w-2xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            {steps.map((step, i) => {
                                const isActive = step.id === currentStep;
                                const isComplete = i < currentStepIndex;
                                return (
                                    <div key={step.id} className="flex items-center">
                                        <div className="flex flex-col items-center">
                                            <motion.div
                                                className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                                                    isComplete
                                                        ? "bg-primary text-primary-foreground"
                                                        : isActive
                                                            ? "bg-foreground text-background"
                                                            : "bg-muted text-muted-foreground"
                                                )}
                                                animate={{ scale: isActive ? 1 : 0.9 }}
                                            >
                                                {isComplete ? (
                                                    <Check className="w-5 h-5" strokeWidth={3} />
                                                ) : (
                                                    <span className="text-sm font-semibold">{i + 1}</span>
                                                )}
                                            </motion.div>
                                            <span className={cn(
                                                "text-[11px] font-medium mt-1.5 transition-colors",
                                                isActive ? "text-foreground" : "text-muted-foreground"
                                            )}>
                                                {step.label}
                                            </span>
                                        </div>
                                        {i < steps.length - 1 && (
                                            <div className="w-16 sm:w-24 h-0.5 mx-2 mb-5 rounded-full overflow-hidden bg-muted">
                                                <motion.div
                                                    className="h-full bg-primary"
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: i < currentStepIndex ? "100%" : "0%" }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-4 py-6 pb-40">
                <AnimatePresence mode="wait">
                    {/* Address Step */}
                    {currentStep === "address" && (
                        <motion.div
                            key="address"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Where should we deliver?</h2>
                                <p className="text-muted-foreground mt-1">Select or add a delivery address</p>
                            </div>

                            <div className="space-y-3">
                                {addresses.map((address) => {
                                    const isSelected = selectedAddress === address.id;
                                    const Icon = addressTypeIcons[address.type];
                                    return (
                                        <motion.div
                                            key={address.id}
                                            whileTap={{ scale: 0.98 }}
                                            className={cn(
                                                "relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                                                isSelected
                                                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                                            )}
                                        >
                                            {/* Selection & Actions */}
                                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                                {/* Edit Button */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditAddress(address);
                                                    }}
                                                    className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </Button>
                                                {/* Delete Button */}
                                                {addresses.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteAddress(address.id);
                                                        }}
                                                        className="w-8 h-8 rounded-full bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                )}
                                                {/* Selection Indicator */}
                                                <div
                                                    onClick={() => setSelectedAddress(address.id)}
                                                    className={cn(
                                                        "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                                        isSelected ? "bg-primary" : "bg-muted"
                                                    )}
                                                >
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", stiffness: 500 }}
                                                        >
                                                            <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>

                                            <div
                                                className="flex gap-4"
                                                onClick={() => setSelectedAddress(address.id)}
                                            >
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                                                    isSelected ? "bg-primary/10" : "bg-muted"
                                                )}>
                                                    <Icon className={cn(
                                                        "w-6 h-6",
                                                        isSelected ? "text-primary" : "text-muted-foreground"
                                                    )} />
                                                </div>
                                                <div className="flex-1 pr-28">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold">{address.label}</h3>
                                                        {address.isDefault && (
                                                            <Badge variant="secondary" className="text-[10px] font-medium">
                                                                Default
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-0.5">{address.phone}</p>
                                                    <p className="text-xs text-muted-foreground/70 mt-2 line-clamp-1">
                                                        {address.fullAddress}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                {/* Add New Address */}
                                <Button
                                    variant="ghost"
                                    onClick={openAddAddress}
                                    className="w-full h-auto p-5 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 flex items-center justify-center gap-3 text-muted-foreground hover:text-foreground normal-case"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span className="font-medium">Add New Address</span>
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Delivery Step */}
                    {currentStep === "delivery" && (
                        <motion.div
                            key="delivery"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">When do you need it?</h2>
                                <p className="text-muted-foreground mt-1">Choose your preferred delivery speed</p>
                            </div>

                            <div className="space-y-3">
                                {deliverySlots.map((slot) => {
                                    const isSelected = selectedSlot === slot.id;
                                    return (
                                        <motion.div
                                            key={slot.id}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedSlot(slot.id)}
                                            className={cn(
                                                "relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                                                isSelected
                                                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                                isSelected ? "bg-primary" : "bg-muted"
                                            )}>
                                                {isSelected && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 500 }}
                                                    >
                                                        <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
                                                    </motion.div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                                                    isSelected ? "bg-primary/10" : "bg-muted"
                                                )}>
                                                    <slot.icon className={cn(
                                                        "w-6 h-6",
                                                        isSelected ? "text-primary" : "text-muted-foreground"
                                                    )} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold">{slot.label}</h3>
                                                        {slot.recommended && (
                                                            <Badge className="bg-primary/10 text-primary border-0 text-[10px]">
                                                                Recommended
                                                            </Badge>
                                                        )}
                                                        {slot.savings && (
                                                            <Badge variant="success" className="text-[10px]">
                                                                Best Value
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{slot.time}</p>
                                                </div>
                                                <span className="font-bold text-lg pr-10">{formatNaira(slot.fee)}</span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Delivery Summary */}
                            <div className="bg-muted/50 rounded-2xl p-4 flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Delivering to</p>
                                    <p className="text-xs text-muted-foreground">{selectedAddressData?.label}, {selectedAddressData?.fullAddress}</p>
                                </div>
                                <Button
                                    variant="link"
                                    onClick={() => setCurrentStep("address")}
                                    className="text-xs font-medium text-primary h-auto p-0"
                                >
                                    Change
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Payment Step */}
                    {currentStep === "payment" && (
                        <motion.div
                            key="payment"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">How would you like to pay?</h2>
                                <p className="text-muted-foreground mt-1">All transactions are secure and encrypted</p>
                            </div>

                            <div className="space-y-3">
                                {PAYMENT_METHODS.map((method) => {
                                    const isSelected = selectedPayment === method.id;
                                    return (
                                        <motion.div
                                            key={method.id}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedPayment(method.id)}
                                            className={cn(
                                                "relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                                                isSelected
                                                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                                isSelected ? "bg-primary" : "bg-muted"
                                            )}>
                                                {isSelected && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 500 }}
                                                    >
                                                        <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
                                                    </motion.div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <span className="text-3xl">{method.icon}</span>
                                                <div className="flex-1 pr-8">
                                                    <h3 className="font-semibold">{method.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{method.description}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Promo Code */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Have a promo code?</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        className="flex-1 h-12 rounded-xl"
                                        disabled={promoApplied}
                                    />
                                    <Button
                                        variant={promoApplied ? "default" : "outline"}
                                        className="h-12 px-6 rounded-xl"
                                        onClick={handleApplyPromo}
                                        disabled={promoApplied || !promoCode}
                                    >
                                        {promoApplied ? <Check className="w-4 h-4" /> : "Apply"}
                                    </Button>
                                </div>
                                {promoApplied && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm text-green-600 font-medium"
                                    >
                                        ✓ 10% discount applied!
                                    </motion.p>
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className="bg-muted/30 rounded-2xl p-5 space-y-4">
                                <h3 className="font-semibold">Order Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                                        <span>{formatNaira(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivery ({selectedSlotData?.label})</span>
                                        <span>{formatNaira(deliveryFee)}</span>
                                    </div>
                                    {promoApplied && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount (DEBELU10)</span>
                                            <span>-{formatNaira(discount)}</span>
                                        </div>
                                    )}
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>{formatNaira(total)}</span>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex items-center justify-center gap-6 py-4 text-muted-foreground">
                                <div className="flex items-center gap-1.5 text-xs">
                                    <Shield className="w-4 h-4" />
                                    <span>Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs">
                                    <Check className="w-4 h-4" />
                                    <span>Verified Sellers</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Confirmation Step */}
                    {currentStep === "confirm" && (
                        <motion.div
                            key="confirm"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-center py-12"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
                                className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30"
                            >
                                <Check className="w-14 h-14 text-white" strokeWidth={3} />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <h2 className="text-3xl font-bold tracking-tight mb-2">Order Placed!</h2>
                                <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
                                    Your order is being prepared and will be on its way soon.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="mb-8"
                            >
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Order Number</p>
                                <Button
                                    variant="secondary"
                                    onClick={handleCopyOrder}
                                    className="gap-2 bg-muted hover:bg-muted/80 rounded-xl px-5 py-6 font-mono text-lg h-auto"
                                >
                                    <span>{orderNumber}</span>
                                    {copied ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="space-y-3 max-w-xs mx-auto"
                            >
                                <Link href="/orders" className="block">
                                    <Button className="w-full h-14 text-base font-semibold rounded-2xl bg-foreground text-background hover:bg-foreground/90">
                                        <Package className="w-5 h-5 mr-2" />
                                        Track Order
                                    </Button>
                                </Link>
                                <Link href="/chat" className="block">
                                    <Button variant="ghost" className="w-full h-14 text-base rounded-2xl">
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Continue Shopping
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom CTA Bar */}
            {currentStep !== "confirm" && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-2xl border-t border-border/50 safe-bottom">
                    <div className="max-w-2xl mx-auto px-4 py-4">
                        {currentStep === "payment" ? (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total</span>
                                    <span className="text-xl font-bold">{formatNaira(total)}</span>
                                </div>
                                <Button
                                    className="w-full h-14 text-base font-semibold rounded-2xl bg-foreground text-background hover:bg-foreground/90"
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full"
                                        />
                                    ) : (
                                        <>Place Order</>
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <Button
                                className="w-full h-14 text-base font-semibold rounded-2xl bg-foreground text-background hover:bg-foreground/90"
                                onClick={goNext}
                                disabled={currentStep === "address" && !selectedAddress}
                            >
                                Continue
                                <ChevronRight className="w-5 h-5 ml-1" />
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Address Modal - Premium Apple Style */}
            <AnimatePresence>
                {showAddressModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddressModal(false)}
                            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-4 z-[70] md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-background rounded-3xl shadow-2xl flex flex-col max-h-[calc(100vh-2rem)] overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-border/50">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        {editingAddress ? "Edit Address" : "New Address"}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        Add a delivery location on campus
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowAddressModal(false)}
                                    className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Form Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Address Type - Large Visual Cards */}
                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-muted-foreground">Where is this?</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {([
                                            { type: "hostel" as AddressType, icon: Home, label: "Hostel", desc: "Hall of residence" },
                                            { type: "academic" as AddressType, icon: GraduationCap, label: "Academic", desc: "Faculty or library" },
                                            { type: "other" as AddressType, icon: Building, label: "Other", desc: "Any other location" },
                                        ]).map(({ type, icon: Icon, label, desc }) => {
                                            const isSelected = addressForm.type === type;
                                            return (
                                                <motion.button
                                                    key={type}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setAddressForm({ ...addressForm, type })}
                                                    className={cn(
                                                        "relative p-4 rounded-2xl border-2 text-left transition-all duration-200",
                                                        isSelected
                                                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                                            : "border-border hover:border-primary/30 hover:bg-muted/50"
                                                    )}
                                                >
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                                                        >
                                                            <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
                                                        </motion.div>
                                                    )}
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors",
                                                        isSelected ? "bg-primary/10" : "bg-muted"
                                                    )}>
                                                        <Icon className={cn(
                                                            "w-5 h-5 transition-colors",
                                                            isSelected ? "text-primary" : "text-muted-foreground"
                                                        )} />
                                                    </div>
                                                    <p className={cn(
                                                        "font-semibold text-sm transition-colors",
                                                        isSelected ? "text-foreground" : "text-muted-foreground"
                                                    )}>
                                                        {label}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                                                        {desc}
                                                    </p>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Location Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="label" className="text-sm font-medium">
                                        Location Name <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            id="label"
                                            placeholder="e.g., Moremi Hall, Main Library"
                                            value={addressForm.label}
                                            onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                                            className="h-14 pl-12 rounded-2xl text-base bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium">
                                        Phone Number
                                    </Label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            placeholder="e.g., +234 801 234 5678"
                                            value={addressForm.phone}
                                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                            className="h-14 pl-12 rounded-2xl text-base bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>

                                {/* Full Address / Directions */}
                                <div className="space-y-2">
                                    <Label htmlFor="fullAddress" className="text-sm font-medium">
                                        Delivery Instructions <span className="text-destructive">*</span>
                                    </Label>
                                    <textarea
                                        id="fullAddress"
                                        placeholder="Describe how to find you. Include landmarks, building color, or any helpful details for the delivery person."
                                        value={addressForm.fullAddress}
                                        onChange={(e) => setAddressForm({ ...addressForm, fullAddress: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-4 rounded-2xl text-base bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 resize-none placeholder:text-muted-foreground"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Tip: The more details you provide, the faster your delivery!
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-border/50 bg-muted/30">
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowAddressModal(false)}
                                        className="flex-1 h-14 rounded-2xl text-base font-medium"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSaveAddress}
                                        disabled={!addressForm.label || !addressForm.fullAddress}
                                        className="flex-1 h-14 rounded-2xl text-base font-semibold bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                                    >
                                        {editingAddress ? "Save Changes" : "Add Address"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
}
