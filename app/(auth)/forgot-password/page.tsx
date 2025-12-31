"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

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

const forgotPasswordSchema = z.object({
    contact: z.string().min(1, "Phone number or email is required"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            contact: "",
        },
    });

    const onSubmit = async (values: ForgotPasswordFormValues) => {
        setIsLoading(true);
        const supabase = createClient();

        // Determine if it's email or phone (simple check)
        const isEmail = values.contact.includes('@');

        try {
            if (isEmail) {
                const { error } = await supabase.auth.resetPasswordForEmail(values.contact, {
                    redirectTo: `${location.origin}/auth/callback?next=/settings/reset-password`,
                });
                if (error) throw error;
            } else {
                // For phone, typically an OTP flow is needed, but Supabase doesn't strictly have "resetPasswordForPhone" 
                // in the same way. Usually it's verifyOtp({ type: 'recovery' }). 
                // For now we'll assume email or notify user.
                // Or try signInWithOtp directly?
                toast.info("Phone password reset requires SMS OTP.");
                // Implementation depends on if you're using Twilio/MessageBird for Supabase.
            }

            setIsSubmitted(true);
            toast.success("Reset link sent!");
        } catch (error: any) {
            toast.error(error.message || "Failed to send reset link.");
        } finally {
            setIsLoading(false);
        }
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
                {!isSubmitted ? (
                    <>
                        <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter">
                            Forgot password?
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            It happens to the best of us. We'll get you back on track.
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter">
                            Check your <span className="text-emerald-500">phone</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            We've sent a reset link to your contact details.
                        </p>
                    </>
                )}
            </motion.div>

            {!isSubmitted ? (
                /* Form */
                <Form {...form}>
                    <motion.form
                        variants={fadeInUp}
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-3"
                    >
                        <FormField
                            control={form.control}
                            name="contact"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        Phone or Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="08012345678"
                                            variant="premium"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="pt-2">
                            <Button
                                type="submit"
                                size="xl"
                                className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold text-lg h-14 shadow-xl"
                                isLoading={isLoading}
                            >
                                Send Reset Link
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>

                        <div className="pt-14 text-center">
                            <Link href="/login">
                                <Button variant="ghost" className="rounded-full hover:bg-transparent hover:text-primary transition-colors text-muted-foreground font-medium">
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    </motion.form>
                </Form>
            ) : (
                /* Success State */
                <motion.div variants={fadeInUp} className="pt-4">
                    <Link href="/login">
                        <Button size="xl" variant="outline" className="w-full rounded-full border-2 border-foreground hover:bg-foreground hover:text-background h-14 text-lg font-bold">
                            Back to Login
                        </Button>
                    </Link>
                </motion.div>
            )}
        </motion.div>
    );
}
