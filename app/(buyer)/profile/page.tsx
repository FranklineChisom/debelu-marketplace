"use client";

import { motion } from "framer-motion";
import {
    User,
    MapPin,
    CreditCard,
    Heart,
    Bell,
    HelpCircle,
    LogOut,
    ChevronRight,
    Moon,
    Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUIStore } from "@/stores";
import { CAMPUSES } from "@/lib/constants";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function ProfilePage() {
    const { theme, setTheme } = useTheme();
    const selectedCampus = useUIStore((state) => state.selectedCampus);
    const campus = CAMPUSES.find((c) => c.id === selectedCampus);

    const menuItems = [
        {
            icon: MapPin,
            label: "Delivery Addresses",
            href: "/profile/addresses",
            badge: "2",
        },
        {
            icon: CreditCard,
            label: "Payment Methods",
            href: "/profile/payments",
        },
        {
            icon: Heart,
            label: "Wishlist",
            href: "/profile/wishlist",
            badge: "5",
        },
        {
            icon: Bell,
            label: "Notifications",
            href: "/profile/notifications",
        },
        {
            icon: HelpCircle,
            label: "Help & Support",
            href: "/help",
        },
    ];

    return (
        <div className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="max-w-2xl mx-auto p-4">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-6"
                >
                    {/* Profile Header */}
                    <motion.div
                        variants={fadeInUp}
                        className="flex items-center gap-4 p-4 bg-card border rounded-2xl"
                    >
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary-foreground">
                                C
                            </span>
                        </div>
                        <div className="flex-1">
                            <h2 className="font-display text-lg font-bold">Chioma Adebayo</h2>
                            <p className="text-sm text-muted-foreground">
                                chioma@student.unilag.edu.ng
                            </p>
                            {campus && (
                                <Badge variant="secondary" className="mt-2 text-xs">
                                    {campus.name}
                                </Badge>
                            )}
                        </div>
                        <Button variant="outline" size="sm">
                            Edit
                        </Button>
                    </motion.div>

                    {/* Theme Toggle */}
                    <motion.div variants={fadeInUp}>
                        <div className="flex items-center justify-between p-4 bg-card border rounded-2xl">
                            <div className="flex items-center gap-3">
                                {theme === "dark" ? (
                                    <Moon className="w-5 h-5" />
                                ) : (
                                    <Sun className="w-5 h-5" />
                                )}
                                <span className="font-medium">Dark Mode</span>
                            </div>
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className={`
                  relative w-12 h-6 rounded-full transition-colors
                  ${theme === "dark" ? "bg-primary" : "bg-muted"}
                `}
                            >
                                <motion.div
                                    className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow"
                                    animate={{ x: theme === "dark" ? 24 : 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            </button>
                        </div>
                    </motion.div>

                    {/* Menu Items */}
                    <motion.div variants={fadeInUp} className="space-y-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                className="w-full flex items-center gap-3 p-4 hover:bg-muted rounded-xl transition-colors"
                            >
                                <item.icon className="w-5 h-5 text-muted-foreground" />
                                <span className="flex-1 text-left font-medium">{item.label}</span>
                                {item.badge && (
                                    <Badge variant="secondary" className="text-xs">
                                        {item.badge}
                                    </Badge>
                                )}
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </button>
                        ))}
                    </motion.div>

                    {/* Logout */}
                    <motion.div variants={fadeInUp}>
                        <button className="w-full flex items-center gap-3 p-4 text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Log Out</span>
                        </button>
                    </motion.div>

                    {/* Version */}
                    <motion.div variants={fadeInUp} className="text-center py-4">
                        <p className="text-xs text-muted-foreground">
                            Debelu. v1.0.0 (Beta)
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
