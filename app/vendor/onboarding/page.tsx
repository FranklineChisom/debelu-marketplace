"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    Store,
    Package,
    Wallet,
    CheckCircle,
    Camera,
    Sparkles,
    ChevronRight,
    Building2,
    ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CAMPUSES } from "@/lib/constants";

type Step = "welcome" | "store" | "products" | "payments" | "complete";

const steps: Step[] = ["welcome", "store", "products", "payments", "complete"];

export default function VendorOnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("welcome");
    const [formData, setFormData] = useState({
        storeName: "",
        campus: "",
        description: "",
        phoneNumber: "",
        productName: "",
        productPrice: "",
        bankName: "",
        accountNumber: ""
    });

    const currentIndex = steps.indexOf(step);
    const progress = ((currentIndex) / (steps.length - 1)) * 100;

    const handleNext = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < steps.length) {
            setStep(steps[nextIndex]);
        } else {
            router.push("/vendor/dashboard");
        }
    };

    const updateForm = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-background flex">

            {/* Left Panel - Visuals (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 bg-muted/30 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full mix-blend-multiply" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full mix-blend-multiply" />
                </div>

                <div className="relative z-10 max-w-md space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                    >
                        <Badge variant="outline" className="bg-background/50 backdrop-blur-md border-primary/20 text-primary px-4 py-1.5 text-sm">
                            Vendor Portal
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight font-display">
                            Start your <br />
                            <span className="text-primary">Business Empire</span> <br />
                            on Campus.
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Join over 500+ student entrepreneurs earning daily on Debelu. Set up your store in minutes.
                        </p>
                    </motion.div>

                    {/* Testimonial Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-background/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl"
                    >
                        <div className="flex gap-1 text-yellow-500 mb-3">
                            {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-base font-medium mb-4">
                            "I started selling my baked goods on Debelu last month. I've already made ₦150k! It's so easy to use."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-700 font-bold">
                                JD
                            </div>
                            <div>
                                <p className="font-bold text-sm">Jane Doe</p>
                                <p className="text-xs text-muted-foreground">Baker @ UNILAG</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex flex-col relative bg-background">
                {/* Mobile Header Image (Only Mobile) */}
                <div className="lg:hidden h-2 bg-primary w-full" />

                {/* Progress Bar (Desktop & Mobile) */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-muted">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-md mx-auto px-6 py-12 lg:py-24">

                        <div className="mb-8">
                            <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground" onClick={() => router.push('/')}>
                                Cancel Setup
                            </Button>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium uppercase tracking-wider">
                                <span>Step {currentIndex + 1} of {steps.length}</span>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                {step === "welcome" && (
                                    <div className="space-y-6">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                            <Sparkles className="w-8 h-8 text-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-3xl font-bold tracking-tight">Let's build your store</h2>
                                            <p className="text-muted-foreground">
                                                Everything you need to sell online, ship orders, and manage your payments.
                                            </p>
                                        </div>
                                        <div className="grid gap-4">
                                            <div className="flex gap-4 p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors">
                                                <Store className="w-6 h-6 text-primary mt-1" />
                                                <div>
                                                    <h3 className="font-bold">Create a Storefront</h3>
                                                    <p className="text-sm text-muted-foreground">Customize your store with your logo and brand.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors">
                                                <Package className="w-6 h-6 text-primary mt-1" />
                                                <div>
                                                    <h3 className="font-bold">Add Products</h3>
                                                    <p className="text-sm text-muted-foreground">List unlimited products with images and details.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors">
                                                <Wallet className="w-6 h-6 text-primary mt-1" />
                                                <div>
                                                    <h3 className="font-bold">Get Paid Fast</h3>
                                                    <p className="text-sm text-muted-foreground">Receive payments directly to your bank account.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button size="lg" className="w-full gap-2 text-lg font-bold shadow-lg shadow-primary/20" onClick={handleNext}>
                                            Start Setup <ArrowRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                )}

                                {step === "store" && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <h2 className="text-3xl font-bold tracking-tight">Store Details</h2>
                                            <p className="text-muted-foreground">Tell us about your business to get started.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-2xl bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer group">
                                                <div className="text-center space-y-2">
                                                    <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                                                        <Camera className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                    <p className="text-sm font-medium text-muted-foreground">Upload Store Logo</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Store Name</Label>
                                                <Input
                                                    placeholder="e.g. Campus Cravings"
                                                    className="h-12 text-lg"
                                                    value={formData.storeName}
                                                    onChange={(e) => updateForm('storeName', e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Select Campus</Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {CAMPUSES.slice(0, 4).map(campus => (
                                                        <div
                                                            key={campus.id}
                                                            onClick={() => updateForm('campus', campus.id)}
                                                            className={cn(
                                                                "p-3 rounded-xl border cursor-pointer transition-all text-sm font-medium flex items-center gap-2",
                                                                formData.campus === campus.id
                                                                    ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                                                                    : "hover:border-primary/50 hover:bg-muted/50"
                                                            )}
                                                        >
                                                            <Building2 className="w-4 h-4" />
                                                            {campus.shortName}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>WhatsApp Number</Label>
                                                <Input
                                                    placeholder="080 1234 5678"
                                                    className="h-11"
                                                    value={formData.phoneNumber}
                                                    onChange={(e) => updateForm('phoneNumber', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            size="lg"
                                            className="w-full gap-2 font-bold"
                                            onClick={handleNext}
                                            disabled={!formData.storeName || !formData.campus}
                                        >
                                            Continue <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}

                                {step === "products" && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <h2 className="text-3xl font-bold tracking-tight">Add First Product</h2>
                                            <p className="text-muted-foreground">What's the first thing you want to sell?</p>
                                        </div>

                                        <Card className="p-6 border-2 border-dashed border-muted-foreground/20 shadow-none bg-muted/30">
                                            <div className="space-y-4">
                                                <div className="h-32 rounded-xl bg-muted/50 flex items-center justify-center border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors cursor-pointer">
                                                    <div className="text-center">
                                                        <Camera className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">Add Image</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Product Name</Label>
                                                    <Input placeholder="e.g. Chocolate Cake Slice" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Price (₦)</Label>
                                                    <Input placeholder="0.00" type="number" />
                                                </div>
                                            </div>
                                        </Card>

                                        <div className="flex flex-col gap-3">
                                            <Button size="lg" className="w-full gap-2 font-bold" onClick={handleNext}>
                                                Add Product & Continue <ArrowRight className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" className="w-full text-muted-foreground" onClick={handleNext}>
                                                Skip for now
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {step === "payments" && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <h2 className="text-3xl font-bold tracking-tight">Get Paid</h2>
                                            <p className="text-muted-foreground">Add your bank account to receive payouts.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Bank Name</Label>
                                                <Input placeholder="Select Bank" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Account Number</Label>
                                                <Input placeholder="0123456789" />
                                            </div>
                                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3">
                                                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-foreground">Verified Merchant</p>
                                                    <p className="text-xs text-muted-foreground">Your account name will be automatically verified against your bank details.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <Button size="lg" className="w-full gap-2 font-bold" onClick={handleNext}>
                                                Complete Setup <ArrowRight className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" className="w-full text-muted-foreground" onClick={handleNext}>
                                                Skip for now
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {step === "complete" && (
                                    <div className="text-center space-y-6 py-8">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", duration: 0.6 }}
                                            className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-green-500/30"
                                        >
                                            <CheckCircle className="w-12 h-12 text-white" />
                                        </motion.div>

                                        <div className="space-y-2">
                                            <h2 className="text-3xl font-black tracking-tight">You're All Set! 🎉</h2>
                                            <p className="text-muted-foreground max-w-xs mx-auto">
                                                Your store <span className="font-bold text-foreground">{formData.storeName || "Store"}</span> is now live on Debelu.
                                            </p>
                                        </div>

                                        <div className="grid gap-3 pt-4">
                                            <Button size="lg" className="w-full font-bold shadow-lg shadow-primary/25" onClick={() => router.push("/vendor/dashboard")}>
                                                Go to Dashboard
                                            </Button>
                                            <Button variant="outline" size="lg" className="w-full" onClick={() => router.push("/vendor/products/new")}>
                                                Add Another Product
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                    </div>
                </div>
            </div>
        </div>
    );
}
