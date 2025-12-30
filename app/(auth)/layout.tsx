"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
            {/* Left Side - Branding (Desktop Only) */}
            <motion.div
                className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-foreground text-background relative overflow-hidden"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Giant Typography */}
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="relative">
                        <motion.h1
                            className="text-[15vw] font-black leading-[0.8] tracking-tighter"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <span className="block text-background/10">SHOP</span>
                            <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                                SMART
                            </span>
                        </motion.h1>

                        {/* Floating accent */}
                        <motion.div
                            className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400/30 to-cyan-400/30 blur-2xl"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                        />
                    </div>
                </div>

                {/* Corner branding */}
                <div className="absolute top-8 left-8">
                    <Link href="/" className="text-xl font-black tracking-tighter text-background">
                        DEBELU
                    </Link>
                </div>

                {/* Bottom tagline */}
                <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-sm text-background/40 max-w-xs">
                        AI-powered campus marketplace. Just chat, we'll find what you need.
                    </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/4 right-12 w-1 h-32 bg-background/10" />
                <div className="absolute bottom-1/4 right-24 w-24 h-1 bg-background/10" />
            </motion.div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 flex items-center justify-center px-6 border-b border-foreground/10">
                    <Link href="/" className="text-xl font-black tracking-tighter">
                        DEBELU
                    </Link>
                </header>

                {/* Form Container */}
                <main className="flex-1 flex items-center justify-center px-6 py-12">
                    <motion.div
                        className="w-full max-w-sm"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        {children}
                    </motion.div>
                </main>

                {/* Mobile Bottom Branding */}
                <div className="lg:hidden py-6 text-center text-xs text-muted-foreground">
                    AI-powered campus marketplace
                </div>
            </div>
        </div>
    );
}
