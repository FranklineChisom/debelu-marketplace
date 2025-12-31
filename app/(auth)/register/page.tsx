"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowRight, Check, Search, ArrowLeft, User, MessageSquare, Briefcase, Building, Store, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { CAMPUSES } from "@/lib/constants";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useUIStore } from "@/stores";
import { createClient } from "@/utils/supabase/client";

type Step = "role" | "campus" | "details";
type Role = "buyer" | "vendor";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Phone number must be valid"),
    email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
    password: z.string().min(8, "Password must be at least 8 characters"),
    terms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            staggerChildren: 0.1
        }
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setVerificationValues } = useUIStore();

    const [step, setStep] = useState<Step>("role");
    const [role, setRole] = useState<"buyer" | "vendor">("buyer");
    const [campus, setCampus] = useState<string>("");
    const [campusSearch, setCampusSearch] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form definition
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            password: "",
            terms: false,
        },
    });

    const filteredCampuses = CAMPUSES.filter(
        (c) =>
            c.name.toLowerCase().includes(campusSearch.toLowerCase()) ||
            c.shortName.toLowerCase().includes(campusSearch.toLowerCase())
    );

    const goBack = () => {
        if (step === "details") setStep("campus");
        else if (step === "campus") setStep("role");
    };

    // Step Progress Indicator
    const stepNumber = step === "role" ? 1 : step === "campus" ? 2 : 3;

    const onSubmit = async (values: RegisterFormValues) => {
        setIsLoading(true);
        const supabase = createClient();

        try {
            // 1. Sign up user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: values.email || undefined,
                phone: values.phone, // Ensure phone provider is enabled in Supabase
                password: values.password,
                options: {
                    data: {
                        full_name: values.name,
                        role: role,
                    }
                }
            });

            if (authError) throw authError;

            if (!authData.user) throw new Error("No user created");

            // 2. Create Profile
            // Note: This might be handled by a Postgres Trigger on auth.users insert, 
            // but for safety/explicitness we can do it here if RLS allows or if no trigger exists.
            // Given the schema had an INSERT policy for own profile, we can insert.

            const profileData = {
                id: authData.user.id,
                first_name: values.name.split(' ')[0],
                last_name: values.name.split(' ').slice(1).join(' '),
                campus_id: campus,
                role: role,
                email: values.email,
                phone: values.phone,
                // Defaults
                badges: ["Newcomer"],
                streak: 0,
                points: 0
            };

            const { error: profileError } = await supabase
                .from('profiles')
                .upsert(profileData);

            if (profileError) {
                // If trigger exists, upsert might conflict or fail. 
                // We'll log it but proceed if it's just a duplicate key error from a trigger race.
                console.error("Profile creation error:", profileError);
            }

            // 3. If Vendor, create Vendor Record
            if (role === 'vendor') {
                const { error: vendorError } = await supabase
                    .from('vendors')
                    .insert({
                        user_id: authData.user.id,
                        business_name: values.name, // Use input name as business name initially
                        campus_id: campus,
                        phone: values.phone,
                        email: values.email,
                        status: 'pending' // Matches schema default
                    });

                if (vendorError) console.error("Vendor creation error:", vendorError);
            }

            toast.success(`Welcome to Debelu, ${values.name.split(' ')[0]}!`);

            // Redirect to verify or dashboard
            // If phone verification is on, they need to verify.
            setVerificationValues({
                email: values.email || "",
                phone: values.phone,
            });

            setTimeout(() => {
                // If using email confirmation, maybe go to a "check email" page.
                // If phone, verify OTP.
                router.push("/verify");
            }, 1000);

        } catch (error: any) {
            toast.error(error.message || "Registration failed");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-4"
        >
            {/* Progress Indicator */}
            {step !== "role" && (
                <motion.div
                    variants={fadeInUp}
                    className="flex items-center justify-center gap-2 mb-2"
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
                        variants={{
                            initial: { opacity: 0, x: 20 },
                            animate: { opacity: 1, x: 0 },
                            exit: { opacity: 0, x: -20 }
                        }}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-4 pt-20 lg:pt-32"
                    >
                        <motion.div variants={fadeInUp} className="text-center space-y-1">
                            <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter">
                                Join Debelu.
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                How would you like to use Debelu?
                            </p>
                            <p className="text-xs text-muted-foreground/60 font-medium pt-2">
                                (You can use one account for both buying and selling)
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="space-y-3">
                            <button
                                onClick={() => {
                                    setRole("buyer");
                                    setStep("campus");
                                }}
                                className="w-full group relative overflow-hidden rounded-3xl bg-foreground text-background p-6 lg:p-8 text-left transition-all duration-500 hover:scale-[1.02]"
                            >
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-display text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-1">
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
                                className="w-full group relative overflow-hidden rounded-2xl border-2 border-foreground/10 hover:border-foreground bg-transparent p-6 lg:p-8 text-left transition-all duration-500 hover:bg-foreground hover:text-background"
                            >
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-display text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-1">
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
                            className="text-center text-sm text-muted-foreground pt-20"
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
                        variants={{
                            initial: { opacity: 0, x: 20 },
                            animate: { opacity: 1, x: 0 },
                            exit: { opacity: 0, x: -20 }
                        }}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-6"
                    >
                        <motion.div variants={fadeInUp} className="text-center space-y-2">
                            <h1 className="font-display text-3xl lg:text-4xl font-black tracking-tighter">
                                Select your campus.
                            </h1>
                            <p className="text-muted-foreground text-base">
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

                            <div className="max-h-[300px] overflow-y-auto space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] rounded-xl">
                                {filteredCampuses.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setCampus(c.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200",
                                            campus === c.id
                                                ? "border-black bg-black/5 shadow-sm"
                                                : "border-transparent bg-secondary/50 hover:bg-secondary"
                                        )}
                                    >
                                        <div className="text-left">
                                            <div className="font-bold text-sm text-foreground">{c.name}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                {c.shortName} • {c.state}
                                            </div>
                                        </div>
                                        {campus === c.id && (
                                            <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <Button
                                className="w-full rounded-full h-14 text-lg font-bold bg-black text-white hover:bg-black/90 disabled:bg-zinc-100 disabled:text-zinc-300 disabled:opacity-100 shadow-xl"
                                size="lg"
                                disabled={!campus}
                                onClick={() => setStep("details")}
                            >
                                Continue
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </motion.div>
                    </motion.div>
                )}

                {/* Step 3: Account Details */}
                {step === "details" && (
                    <motion.div
                        key="details"
                        variants={{
                            initial: { opacity: 0, x: 20 },
                            animate: { opacity: 1, x: 0 },
                            exit: { opacity: 0, x: -20 }
                        }}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-4"
                    >
                        <motion.div variants={fadeInUp} className="text-center space-y-1">
                            <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter">
                                Create your account
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                {role === "vendor"
                                    ? "Set up your vendor account"
                                    : "Just a few more details"}
                            </p>
                        </motion.div>

                        <Form {...form}>
                            <motion.form
                                variants={fadeInUp}
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-3"
                            >
                                {/* Name */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                {role === "vendor" ? "Business Name" : "Full Name"}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={role === "vendor" ? "e.g., TechHub NG" : "e.g. Chisom Obierika"}
                                                    variant="premium"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Phone */}
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-muted-foreground" />
                                                Phone Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    placeholder="08012345678"
                                                    variant="premium"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-muted-foreground" />
                                                Email {role === "buyer" && <span className="text-muted-foreground font-normal">(optional)</span>}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="you@university.edu"
                                                    variant="premium"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Password */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Lock className="w-4 h-4 text-muted-foreground" />
                                                Password
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        variant="premium"
                                                        className="pr-12"
                                                        {...field}
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
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Terms */}
                                <FormField
                                    control={form.control}
                                    name="terms"
                                    render={({ field }) => (
                                        <FormItem className="flex items-start gap-3 space-y-0 pt-2">
                                            <FormControl>
                                                <input
                                                    type="checkbox"
                                                    checked={field.value}
                                                    onChange={field.onChange}
                                                    className="mt-1 w-4 h-4 rounded border-2 border-input accent-primary"
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <label className="text-xs text-muted-foreground leading-relaxed">
                                                    I agree to the{" "}
                                                    <Link href="/terms" className="text-primary hover:underline font-medium">
                                                        Terms of Service
                                                    </Link>{" "}
                                                    and{" "}
                                                    <Link href="/privacy" className="text-primary hover:underline font-medium">
                                                        Privacy Policy
                                                    </Link>
                                                </label>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    size="xl"
                                    className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold text-lg h-14 shadow-xl"
                                    isLoading={isLoading}
                                >
                                    {role === "vendor" ? "Create Vendor Account" : "Create Account"}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </motion.form>
                        </Form>

                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60 pt-2">
                            <Lock className="w-3 h-3" />
                            <span>Your data is encrypted and secure</span>
                        </div>
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
