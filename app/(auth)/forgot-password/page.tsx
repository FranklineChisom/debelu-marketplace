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
            className="space-y-6"
        >
            {/* Back Link */}
            <motion.div variants={fadeInUp}>
                <Link
                    href="/login"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                </Link>
            </motion.div>

            {!isSubmitted ? (
                <>
                    {/* Header */}
                    <motion.div variants={fadeInUp} className="text-center">
                        <h1 className="font-display text-2xl font-bold tracking-tight">
                            Reset your password
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            Enter your phone number or email and we'll send you a reset link
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        variants={fadeInUp}
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <label htmlFor="contact" className="text-sm font-medium">
                                Phone or Email
                            </label>
                            <Input
                                id="contact"
                                type="text"
                                placeholder="08012345678 or you@university.edu"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            isLoading={isLoading}
                        >
                            Send Reset Link
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </motion.form>
                </>
            ) : (
                // Success State
                <motion.div
                    variants={fadeInUp}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-success" />
                    </div>
                    <h2 className="font-display text-xl font-bold mb-2">Check your phone</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        We've sent a password reset link to your phone/email.
                        Check your messages.
                    </p>
                    <Link href="/login">
                        <Button variant="outline" size="lg">
                            Back to login
                        </Button>
                    </Link>
                </motion.div>
            )}
        </motion.div>
    );
}
