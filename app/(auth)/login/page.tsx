"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, Lock, Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const loginSchema = z.object({
    email: z.string().min(1, "Phone number or email is required"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        setIsLoading(true);

        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
                loading: 'Signing in...',
                success: () => {
                    setTimeout(() => {
                        router.push("/chat");
                    }, 500);
                    return "Welcome back!";
                },
                error: 'Invalid credentials. Please try again.',
            }
        );

        setIsLoading(false);
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-4 pt-20 lg:pt-32"
        >
            {/* Header */}
            <motion.div variants={fadeInUp} className="space-y-1">
                <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter">
                    Welcome back.
                </h1>
                <p className="text-muted-foreground text-lg">
                    Sign in to continue shopping on Debelu.
                </p>
            </motion.div>

            {/* Form */}
            <Form {...form}>
                <motion.form
                    variants={fadeInUp}
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3"
                >
                    {/* Phone or Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    Phone or Email
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="08012345678"
                                        autoComplete="username"
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
                                <div className="flex items-center justify-between">
                                    <FormLabel className="flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-muted-foreground" />
                                        Password
                                    </FormLabel>
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs text-primary hover:underline font-medium"
                                    >
                                        Forgot?
                                    </Link>
                                </div>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            autoComplete="current-password"
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

                    {/* Submit */}
                    <div className="pt-2">
                        <Button
                            type="submit"
                            size="xl"
                            className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold text-lg h-14 shadow-xl"
                            isLoading={isLoading}
                        >
                            Sign In
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </motion.form>
            </Form>

            {/* Divider */}
            <motion.div variants={fadeInUp} className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-foreground/10" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-background px-4 text-xs uppercase tracking-widest text-muted-foreground">
                        Or
                    </span>
                </div>
            </motion.div>

            {/* Social Login */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
                <Button variant="outline" size="lg" type="button" className="h-12 rounded-full border-foreground/10 hover:border-foreground/30 hover:bg-foreground/5" aria-label="Sign in with Google">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                </Button>
                <Button variant="outline" size="lg" type="button" className="h-12 rounded-full border-foreground/10 hover:border-foreground/30 hover:bg-foreground/5" aria-label="Sign in with Apple">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                </Button>
            </motion.div>

            {/* Register Link */}
            <motion.p variants={fadeInUp} className="text-center text-sm text-muted-foreground pt-14">
                New here?{" "}
                <Link href="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                    Create account
                </Link>
            </motion.p>
        </motion.div>
    );
}
