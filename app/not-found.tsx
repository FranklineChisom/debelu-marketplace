"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, MoveLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-50" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen opacity-30" />
            </div>

            <div className="relative z-10 max-w-lg w-full text-center space-y-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <h1 className="text-[10rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground/5 to-foreground/0 select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-background rounded-3xl shadow-2xl flex items-center justify-center rotate-12 border border-border/50">
                            <span className="text-4xl">🤔</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                >
                    <h2 className="text-3xl font-bold tracking-tight">Page Not Found</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-sm mx-auto">
                        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center pt-4"
                >
                    <Link href="/">
                        <Button size="lg" className="w-full sm:w-auto h-12 px-8 font-bold shadow-lg shadow-primary/25 gap-2">
                            <Home className="w-4 h-4" />
                            Return Home
                        </Button>
                    </Link>
                    <Link href="/search">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 font-medium gap-2">
                            <Search className="w-4 h-4" />
                            Search Products
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="pt-12"
                >
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <MoveLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
