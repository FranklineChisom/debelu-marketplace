"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsSubmitted(true);
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-12 lg:space-y-16"
        >
            {/* Header */}
            <motion.div variants={fadeInUp} className="space-y-6">
                {!isSubmitted ? (
                    <>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9]">
                            Forgot<br />
                            <span className="text-foreground/30">password?</span>
                        </h1>
                        <p className="text-muted-foreground text-lg lg:text-xl max-w-md">
                            It happens to the best of us. We'll get you back on track.
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9]">
                            Check your<br />
                            <span className="text-success">phone</span>
                        </h1>
                        <p className="text-muted-foreground text-lg lg:text-xl max-w-md">
                            We've sent a reset link to your contact details.
                        </p>
                    </>
                )}
            </motion.div>

            {!isSubmitted ? (
                /* Form */
                <motion.form
                    variants={fadeInUp}
                    onSubmit={handleSubmit}
                    className="space-y-10"
                >
                    <div className="space-y-3">
                        <label htmlFor="contact" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Phone or Email
                        </label>
                        <Input
                            id="contact"
                            type="text"
                            placeholder="08012345678"
                            required
                            variant="brutalist"
                        />
                    </div>

                    <div className="pt-4 space-y-4">
                        <Button
                            type="submit"
                            size="xl"
                            className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
                            isLoading={isLoading}
                        >
                            Send Reset Link
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Link href="/login" className="block text-center">
                            <Button variant="ghost" className="rounded-full hover:bg-transparent hover:underline text-muted-foreground">
                                Back to Login
                            </Button>
                        </Link>
                    </div>
                </motion.form>
            ) : (
                /* Success State */
                <motion.div variants={fadeInUp} className="pt-8">
                    <Link href="/login">
                        <Button size="xl" variant="outline" className="w-full rounded-full border-2 border-foreground hover:bg-foreground hover:text-background">
                            Back to Login
                        </Button>
                    </Link>
                </motion.div>
            )}
        </motion.div>
    );
}
