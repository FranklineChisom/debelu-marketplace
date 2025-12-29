"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    Store,
    Package,
    Wallet,
    BarChart3,
    CheckCircle,
    Camera,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CAMPUSES } from "@/lib/constants";

type Step = "welcome" | "store" | "products" | "payments" | "complete";

const stepInfo = {
    welcome: {
        icon: Store,
        title: "Welcome to Debelu Vendor",
        description: "Set up your store and start selling to students on your campus.",
    },
    store: {
        icon: Store,
        title: "Store Details",
        description: "Tell us about your business.",
    },
    products: {
        icon: Package,
        title: "Add Your First Product",
        description: "Show students what you're selling.",
    },
    payments: {
        icon: Wallet,
        title: "Set Up Payments",
        description: "Where should we send your earnings?",
    },
    complete: {
        icon: CheckCircle,
        title: "You're All Set! 🎉",
        description: "Your store is ready. Start selling!",
    },
};

export default function VendorOnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("welcome");
    const [storeName, setStoreName] = useState("");
    const [campus, setCampus] = useState("");
    const [phone, setPhone] = useState("");

    const steps: Step[] = ["welcome", "store", "products", "payments", "complete"];
    const currentIndex = steps.indexOf(step);

    const next = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < steps.length) {
            setStep(steps[nextIndex]);
        } else {
            router.push("/vendor/dashboard");
        }
    };

    const canProceed = () => {
        if (step === "store") {
            return storeName.length > 2 && campus.length > 0;
        }
        return true;
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Progress Bar */}
            <div className="h-1 bg-muted">
                <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
                />
            </div>

            <div className="max-w-lg mx-auto p-6 py-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {/* Welcome Step */}
                        {step === "welcome" && (
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-primary flex items-center justify-center">
                                    <Store className="w-10 h-10 text-primary-foreground" />
                                </div>
                                <h1 className="font-display text-3xl font-bold mb-3">
                                    Become a Vendor
                                </h1>
                                <p className="text-muted-foreground mb-8">
                                    Join hundreds of vendors selling to students on their campus.
                                    It only takes 5 minutes to set up.
                                </p>

                                <div className="space-y-3 text-left mb-8">
                                    {[
                                        { icon: Store, text: "Create your store profile" },
                                        { icon: Package, text: "List your products" },
                                        { icon: Wallet, text: "Get paid instantly" },
                                        { icon: BarChart3, text: "Track your sales" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <item.icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <span className="font-medium">{item.text}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button onClick={next} className="w-full" size="lg">
                                    Get Started
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        )}

                        {/* Store Setup Step */}
                        {step === "store" && (
                            <div>
                                <h1 className="font-display text-2xl font-bold mb-2">
                                    Store Details
                                </h1>
                                <p className="text-muted-foreground mb-6">
                                    Tell us about your business
                                </p>

                                <div className="space-y-4 mb-8">
                                    {/* Store Logo */}
                                    <div className="flex justify-center mb-6">
                                        <button className="w-24 h-24 rounded-2xl bg-muted flex flex-col items-center justify-center gap-1 hover:bg-muted/80 transition-colors">
                                            <Camera className="w-6 h-6 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">
                                                Add Logo
                                            </span>
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Store Name</label>
                                        <Input
                                            placeholder="e.g., TechHub NG"
                                            value={storeName}
                                            onChange={(e) => setStoreName(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Campus</label>
                                        <div className="flex flex-wrap gap-2">
                                            {CAMPUSES.slice(0, 6).map((c) => (
                                                <Badge
                                                    key={c.id}
                                                    variant={campus === c.id ? "default" : "outline"}
                                                    className="cursor-pointer"
                                                    onClick={() => setCampus(c.id)}
                                                >
                                                    {c.shortName}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phone Number</label>
                                        <Input
                                            placeholder="08012345678"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={next}
                                    className="w-full"
                                    size="lg"
                                    disabled={!canProceed()}
                                >
                                    Continue
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        )}

                        {/* Products Step */}
                        {step === "products" && (
                            <div>
                                <h1 className="font-display text-2xl font-bold mb-2">
                                    Add Your First Product
                                </h1>
                                <p className="text-muted-foreground mb-6">
                                    You can add more products later from your dashboard
                                </p>

                                <Card className="mb-6">
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            <button className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                                                <Camera className="w-6 h-6 text-muted-foreground" />
                                            </button>
                                            <div className="flex-1 space-y-3">
                                                <Input placeholder="Product name" />
                                                <Input placeholder="Price (₦)" type="number" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={next}
                                        className="flex-1"
                                        size="lg"
                                    >
                                        Skip for Now
                                    </Button>
                                    <Button onClick={next} className="flex-1" size="lg">
                                        Add Product
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Payments Step */}
                        {step === "payments" && (
                            <div>
                                <h1 className="font-display text-2xl font-bold mb-2">
                                    Set Up Payments
                                </h1>
                                <p className="text-muted-foreground mb-6">
                                    Add your bank account to receive payouts
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Bank Name</label>
                                        <Input placeholder="Select bank" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Account Number</label>
                                        <Input placeholder="0123456789" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Account Name</label>
                                        <Input placeholder="Auto-filled" disabled />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={next}
                                        className="flex-1"
                                        size="lg"
                                    >
                                        Skip for Now
                                    </Button>
                                    <Button onClick={next} className="flex-1" size="lg">
                                        Save & Continue
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Complete Step */}
                        {step === "complete" && (
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
                                    <CheckCircle className="w-12 h-12 text-success" />
                                </div>
                                <h1 className="font-display text-3xl font-bold mb-3">
                                    You're All Set! 🎉
                                </h1>
                                <p className="text-muted-foreground mb-8">
                                    Your store "{storeName || "Your Store"}" is now live. Students
                                    can start browsing your products.
                                </p>

                                <div className="space-y-3">
                                    <Button
                                        onClick={() => router.push("/vendor/dashboard")}
                                        className="w-full"
                                        size="lg"
                                    >
                                        Go to Dashboard
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => router.push("/vendor/products/new")}
                                        className="w-full"
                                        size="lg"
                                    >
                                        Add More Products
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
