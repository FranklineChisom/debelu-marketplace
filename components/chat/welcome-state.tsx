"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useChatStore, useUIStore } from "@/stores";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Laptop, Package, Truck } from "lucide-react";

export function WelcomeState() {
    const addUserMessage = useChatStore((state) => state.addUserMessage);
    const selectedCampus = useUIStore((state) => state.selectedCampus);

    const router = useRouter();

    const handleActionClick = (action: any) => {
        if (action.path) {
            router.push(action.path);
        } else {
            addUserMessage(action.query);
        }
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center py-8"
        >
            {/* Welcome Text */}
            <motion.div variants={fadeInUp} className="mb-10 mt-12">
                <h2 className="font-display text-4xl font-bold mb-3 text-foreground tracking-tight">
                    Good afternoon, Frankline.
                </h2>
                <p className="text-xl text-muted-foreground font-light">
                    How can I help you today?
                </p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                {[
                    { label: "Find a laptop", icon: Laptop, query: "I'm looking for a laptop" },
                    { label: "Track my order", icon: Package, query: "Track my recent order", path: "/orders" },
                    { label: "Campus delivery", icon: Truck, query: "How does campus delivery work?" },
                ].map((action) => (
                    <motion.button
                        key={action.label}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleActionClick(action)}
                        className="flex items-center gap-2 px-6 py-3 bg-background border border-border/50 hover:border-primary/50 hover:bg-muted/30 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <action.icon className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground/80">{action.label}</span>
                    </motion.button>
                ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-12">
                <button
                    onClick={() => {
                        useChatStore.getState().populateWithMockData();
                        window.location.reload(); // Force reload to see changes immediately
                    }}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors underline"
                >
                    Don't see any data? Start Demo Chat
                </button>
            </motion.div>
        </motion.div>
    );
}
