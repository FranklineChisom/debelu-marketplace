"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    User,
    MapPin,
    CreditCard,
    Heart,
    Bell,
    HelpCircle,
    LogOut,
    ArrowUpRight,
    Moon,
    Sun,
    Award,
    Gift,
    Settings,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores";
import { CAMPUSES } from "@/lib/constants";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function ProfilePage() {
    const { theme, setTheme } = useTheme();
    const selectedCampus = useUIStore((state) => state.selectedCampus);
    const campus = CAMPUSES.find((c) => c.id === selectedCampus);

    const menuItems = [
        { icon: MapPin, label: "Addresses", href: "/profile/addresses", badge: "2" },
        { icon: CreditCard, label: "Payments", href: "/profile/payments" },
        { icon: Heart, label: "Wishlist", href: "/wishlist" },
        { icon: Award, label: "Badges", href: "/badges", badge: "3 New" },
        { icon: Gift, label: "Referrals", href: "/referral" },
        { icon: Bell, label: "Notifications", href: "/profile/notifications" },
        { icon: Settings, label: "Settings", href: "/profile/settings" },
        { icon: HelpCircle, label: "Help", href: "/help" },
    ];

    return (
        <div className="flex-1 overflow-y-auto scrollbar-thin">
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="px-6 lg:px-12 xl:px-16 py-8 lg:py-12 max-w-4xl mx-auto"
            >
                {/* Profile Header */}
                <motion.div variants={fadeInUp} className="mb-12 lg:mb-16">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div className="flex items-center gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-foreground text-background flex items-center justify-center">
                                    <span className="text-4xl lg:text-5xl font-black">C</span>
                                </div>
                                {/* Online indicator */}
                                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-400 border-4 border-background" />
                            </div>

                            <div>
                                <h1 className="text-2xl lg:text-4xl font-black tracking-tight">Chioma Adebayo</h1>
                                <p className="text-muted-foreground mt-1">chioma@student.unilag.edu.ng</p>
                                {campus && (
                                    <p className="text-sm text-muted-foreground mt-2">📍 {campus.name}</p>
                                )}
                            </div>
                        </div>

                        <Button variant="outline" className="rounded-full border-foreground/20 hover:bg-foreground/5">
                            Edit Profile
                        </Button>
                    </div>
                </motion.div>

                {/* Theme Toggle */}
                <motion.div variants={fadeInUp} className="mb-8">
                    <div className="flex items-center justify-between p-5 lg:p-6 border border-foreground/10 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center">
                                {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="font-bold">Appearance</p>
                                <p className="text-sm text-muted-foreground">
                                    {theme === "dark" ? "Dark mode" : "Light mode"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="relative w-16 h-9 rounded-full bg-foreground/10 transition-colors"
                        >
                            <motion.div
                                className="absolute top-1 left-1 w-7 h-7 rounded-full bg-foreground flex items-center justify-center"
                                animate={{ x: theme === "dark" ? 28 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                                {theme === "dark" ? (
                                    <Moon className="w-4 h-4 text-background" />
                                ) : (
                                    <Sun className="w-4 h-4 text-background" />
                                )}
                            </motion.div>
                        </button>
                    </div>
                </motion.div>

                {/* Menu Items - Minimal List */}
                <motion.div variants={fadeInUp} className="mb-8">
                    <div className="border border-foreground/10 rounded-2xl divide-y divide-foreground/10">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center justify-between p-5 lg:p-6 hover:bg-foreground/5 transition-colors first:rounded-t-2xl last:rounded-b-2xl group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center">
                                        <item.icon className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {item.badge && (
                                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-400/10 text-emerald-400">
                                            {item.badge}
                                        </span>
                                    )}
                                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:rotate-45 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Logout */}
                <motion.div variants={fadeInUp}>
                    <button className="w-full flex items-center gap-4 p-5 lg:p-6 border border-red-500/20 rounded-2xl text-red-500 hover:bg-red-500/5 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <span className="font-bold">Log Out</span>
                    </button>
                </motion.div>

                {/* Footer */}
                <motion.div variants={fadeInUp} className="mt-12 text-center text-sm text-muted-foreground">
                    <p>Debelu v1.0.0 (Beta)</p>
                    <p className="mt-1">Made in Nigeria 🇳🇬</p>
                </motion.div>
            </motion.div>
        </div>
    );
}
