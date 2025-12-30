"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight, ArrowLeft, ShoppingBag, Store, Check, User, Phone, Mail, Lock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CAMPUSES } from "@/lib/constants";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useUIStore } from "@/stores";

type Step = "role" | "campus" | "details";
type Role = "buyer" | "vendor";

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setSelectedCampus = useUIStore((state) => state.setSelectedCampus);

    const initialRole = searchParams.get("role") as Role | null;

    const [step, setStep] = useState<Step>(initialRole ? "campus" : "role");
    const [role, setRole] = useState<Role>(initialRole || "buyer");
    const [campus, setCampus] = useState<string>("");
    const [campusSearch, setCampusSearch] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const filteredCampuses = CAMPUSES.filter(
        (c) =>
            c.name.toLowerCase().includes(campusSearch.toLowerCase()) ||
            c.shortName.toLowerCase().includes(campusSearch.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Save campus selection
        if (campus) {
            setSelectedCampus(campus as any);
        }

        // Simulate registration
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Redirect based on role
        router.push(role === "vendor" ? "/vendor/dashboard" : "/chat");
    };

    const goBack = () => {
        if (step === "details") setStep("campus");
        else if (step === "campus") setStep("role");
    };

    // Step Progress Indicator
    const stepNumber = step === "role" ? 1 : step === "campus" ? 2 : 3;

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
        >
            {/* Progress Indicator */}
            {step !== "role" && (
                <motion.div
                    variants={fadeInUp}
                    className="flex items-center justify-center gap-2 mb-4"
                >
                    {[1, 2, 3].map((num) => (
                        <div key={num} className="flex items-center">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                                    num < stepNumber && "bg-primary text-primary-foreground",
                                    num === stepNumber && "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
                                    num > stepNumber && "bg-muted text-muted-foreground"
                                )}
                            >
                                {num < stepNumber ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    num
                                )}
                            </div>
                            {num < 3 && (
                                <div
                                    className={cn(
                                        "w-8 h-0.5 mx-1 transition-all duration-300",
                                        num < stepNumber ? "bg-primary" : "bg-muted"
                                    )}
                                />
                            )}
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Back Button */}
            {step !== "role" && (
                <motion.button
                    variants={fadeInUp}
                    onClick={goBack}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </motion.button>
            )}

            <AnimatePresence mode="wait">
                {/* Step 1: Role Selection */}
                {step === "role" && (
                    <motion.div
                        key="role"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <motion.div variants={fadeInUp} className="text-center space-y-4">
                            <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter">
                                Join Debelu.
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                How would you like to use Debelu?
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="space-y-4">
                            <button
                                onClick={() => {
                                    setRole("buyer");
                                    setStep("campus");
                                }}
                                className="w-full group relative overflow-hidden rounded-3xl bg-foreground text-background p-8 lg:p-10 text-left transition-all duration-500 hover:scale-[1.02]"
                            >
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-display text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-2">
                                            Shop
                                        </h3>
                                        <p className="text-white/60 text-lg max-w-xs font-medium">
                                            Find everything you need on campus.
                                        </p>
                                    </div>
                                    <ArrowRight className="w-12 h-12 text-emerald-400 transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            </button>

                            <button
                                onClick={() => {
                                    setRole("vendor");
                                    setStep("campus");
                                }}
                                className="w-full group relative overflow-hidden rounded-3xl border-2 border-foreground/10 hover:border-foreground bg-transparent p-8 lg:p-10 text-left transition-all duration-500 hover:bg-foreground hover:text-background"
                            >
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-display text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-2">
                                            Sell
                                        </h3>
                                        <p className="text-muted-foreground group-hover:text-white/60 text-lg max-w-xs font-medium transition-colors">
                                            Start your business on campus.
                                        </p>
                                    </div>
                                    <Store className="w-12 h-12 text-foreground/20 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-500" />
                                </div>
                            </button>
                        </motion.div>

                        <motion.p
                            variants={fadeInUp}
                            className="text-center text-sm text-muted-foreground"
                        >
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                                Sign in
                            </Link>
                        </motion.p>
                    </motion.div>
                )}

                {/* Step 2: Campus Selection */}
                {step === "campus" && (
                    <motion.div
                        key="campus"
                        variants={staggerContainer}
                        initial={{ opacity: 0, x: 20 }}
                        animate="animate"
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <motion.div variants={fadeInUp} className="text-center space-y-4">
                            <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter">
                                Select your campus
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                This helps us show you relevant products
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    placeholder="Search universities..."
                                    value={campusSearch}
                                    onChange={(e) => setCampusSearch(e.target.value)}
                                    variant="premium"
                                    className="pl-12"
                                />
                            </div>

                            <div className="max-h-56 overflow-y-auto space-y-2 scrollbar-thin rounded-xl">
                                {filteredCampuses.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setCampus(c.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200",
                                            campus === c.id
                                                ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                                : "hover:border-primary/50 hover:bg-accent/50"
                                        )}
                                    >
                                        <div className="text-left">
                                            <div className="font-semibold">{c.name}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                {c.shortName} • {c.state}
                                            </div>
                                        </div>
                                        {campus === c.id && (
                                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                <Check className="w-4 h-4 text-primary-foreground" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <Button
                                variant="glow"
                                className="w-full"
                                size="lg"
                                disabled={!campus}
                                onClick={() => setStep("details")}
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    </motion.div>
                )}

                {/* Step 3: Account Details */}
                {step === "details" && (
                    <motion.div
                        key="details"
                        variants={staggerContainer}
                        initial={{ opacity: 0, x: 20 }}
                        animate="animate"
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <motion.div variants={fadeInUp} className="text-center space-y-4">
                            <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter">
                                Create your account
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                {role === "vendor"
                                    ? "Set up your vendor account"
                                    : "Just a few more details"}
                            </p>
                        </motion.div>

                        <motion.form
                            variants={fadeInUp}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            {/* Name */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    {role === "vendor" ? "Business Name" : "Full Name"}
                                </label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder={role === "vendor" ? "e.g., TechHub NG" : "e.g., Chioma Adebayo"}
                                    required
                                    variant="brutalist"
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    Phone Number
                                </label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="08012345678"
                                    required
                                    variant="brutalist"
                                />
                            </div>

                            {/* Email (optional for buyers) */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    Email {role === "buyer" && <span className="text-muted-foreground font-normal">(optional)</span>}
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@university.edu"
                                    required={role === "vendor"}
                                    variant="brutalist"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-muted-foreground" />
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        variant="brutalist"
                                        className="pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-accent"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="mt-1 w-4 h-4 rounded border-2 border-input accent-primary"
                                />
                                <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-primary hover:underline font-medium">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="text-primary hover:underline font-medium">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                variant="glow"
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                            >
                                {role === "vendor" ? "Create Vendor Account" : "Create Account"}
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </motion.form>

                        {role === "vendor" && (
                            <motion.div variants={fadeInUp} className="flex justify-center">
                                <Badge variant="secondary" className="text-xs py-1.5 px-3">
                                    Vendor accounts require verification (24-48 hours)
                                </Badge>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function RegisterSkeleton() {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <Skeleton className="h-9 w-48 mx-auto mb-3" />
                <Skeleton className="h-5 w-64 mx-auto" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<RegisterSkeleton />}>
            <RegisterForm />
        </Suspense>
    );
}
