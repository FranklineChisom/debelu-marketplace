"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight, ArrowLeft, ShoppingBag, Store, Check } from "lucide-react";
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

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
        >
            {/* Back Button */}
            {step !== "role" && (
                <motion.button
                    variants={fadeInUp}
                    onClick={goBack}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4" />
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
                        <motion.div variants={fadeInUp} className="text-center">
                            <h1 className="font-display text-2xl font-bold tracking-tight">
                                Join Debelu.
                            </h1>
                            <p className="text-sm text-muted-foreground mt-2">
                                How would you like to use Debelu?
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="grid gap-3">
                            <button
                                onClick={() => {
                                    setRole("buyer");
                                    setStep("campus");
                                }}
                                className="group p-4 border rounded-2xl text-left hover:border-primary transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <ShoppingBag className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">I want to shop</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Discover and buy products from vendors on your campus
                                        </p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    setRole("vendor");
                                    setStep("campus");
                                }}
                                className="group p-4 border rounded-2xl text-left hover:border-primary transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Store className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">I want to sell</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            List your products and reach students on your campus
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </motion.div>

                        <motion.p
                            variants={fadeInUp}
                            className="text-center text-sm text-muted-foreground"
                        >
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-primary hover:underline">
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
                        <motion.div variants={fadeInUp} className="text-center">
                            <h1 className="font-display text-2xl font-bold tracking-tight">
                                Select your campus
                            </h1>
                            <p className="text-sm text-muted-foreground mt-2">
                                This helps us show you relevant products
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <Input
                                placeholder="Search universities..."
                                value={campusSearch}
                                onChange={(e) => setCampusSearch(e.target.value)}
                                className="mb-4"
                            />

                            <div className="max-h-64 overflow-y-auto space-y-2 scrollbar-thin">
                                {filteredCampuses.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setCampus(c.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-3 rounded-xl border transition-colors",
                                            campus === c.id
                                                ? "border-primary bg-primary/5"
                                                : "hover:border-primary/50"
                                        )}
                                    >
                                        <div className="text-left">
                                            <div className="font-medium text-sm">{c.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {c.shortName} • {c.state}
                                            </div>
                                        </div>
                                        {campus === c.id && (
                                            <Check className="w-5 h-5 text-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <Button
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
                        <motion.div variants={fadeInUp} className="text-center">
                            <h1 className="font-display text-2xl font-bold tracking-tight">
                                Create your account
                            </h1>
                            <p className="text-sm text-muted-foreground mt-2">
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
                                <label htmlFor="name" className="text-sm font-medium">
                                    {role === "vendor" ? "Business Name" : "Full Name"}
                                </label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder={role === "vendor" ? "e.g., TechHub NG" : "e.g., Chioma Adebayo"}
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium">
                                    Phone Number
                                </label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="08012345678"
                                    required
                                />
                            </div>

                            {/* Email (optional for buyers) */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email {role === "buyer" && <span className="text-muted-foreground">(optional)</span>}
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@university.edu"
                                    required={role === "vendor"}
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="mt-1"
                                />
                                <label htmlFor="terms" className="text-xs text-muted-foreground">
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-primary hover:underline">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="text-primary hover:underline">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                            >
                                {role === "vendor" ? "Create Vendor Account" : "Create Account"}
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </motion.form>

                        {role === "vendor" && (
                            <motion.div variants={fadeInUp}>
                                <Badge variant="secondary" className="text-xs">
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
                <Skeleton className="h-8 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-64 mx-auto" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
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
