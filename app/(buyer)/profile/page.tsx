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
    ChevronRight,
    Moon,
    Sun,
    Award,
    Gift,
    Settings,
    Shield,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useUIStore } from "@/stores";
import { CAMPUSES } from "@/lib/constants";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function ProfilePage() {
    const { theme, setTheme } = useTheme();
    const selectedCampus = useUIStore((state) => state.selectedCampus);
    const campus = CAMPUSES.find((c) => c.id === selectedCampus);

    const menuSections = [
        {
            title: "Account",
            items: [
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
                    href: "/wishlist",
                    badge: "5",
                },
            ],
        },
        {
            title: "Rewards",
            items: [
                {
                    icon: Award,
                    label: "My Badges",
                    href: "/badges",
                    badge: "3 New",
                    badgeVariant: "gradient" as const,
                },
                {
                    icon: Gift,
                    label: "Referral Program",
                    href: "/referral",
                    subtitle: "Earn ₦500 per referral",
                },
            ],
        },
        {
            title: "Preferences",
            items: [
                {
                    icon: Bell,
                    label: "Notifications",
                    href: "/profile/notifications",
                },
                {
                    icon: Shield,
                    label: "Privacy & Security",
                    href: "/profile/privacy",
                },
            ],
        },
        {
            title: "Support",
            items: [
                {
                    icon: HelpCircle,
                    label: "Help & Support",
                    href: "/help",
                },
                {
                    icon: Settings,
                    label: "Settings",
                    href: "/profile/settings",
                },
            ],
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
                    <motion.div variants={fadeInUp}>
                        <Card variant="gradient" className="overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
                                            <span className="text-3xl font-bold text-primary-foreground">
                                                C
                                            </span>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-card flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="font-display text-xl font-bold truncate">
                                            Chioma Adebayo
                                        </h2>
                                        <p className="text-sm text-muted-foreground truncate">
                                            chioma@student.unilag.edu.ng
                                        </p>
                                        {campus && (
                                            <Badge variant="secondary" className="mt-2 text-xs">
                                                📍 {campus.name}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="w-full mt-4">
                                    Edit Profile
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Theme Toggle */}
                    <motion.div variants={fadeInUp}>
                        <Card variant="premium">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                                            {theme === "dark" ? (
                                                <Moon className="w-5 h-5" />
                                            ) : (
                                                <Sun className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Dark Mode</span>
                                            <p className="text-xs text-muted-foreground">
                                                {theme === "dark" ? "Currently on" : "Currently off"}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                        className={`
                                            relative w-14 h-8 rounded-full transition-colors duration-300
                                            ${theme === "dark" ? "bg-primary" : "bg-muted"}
                                        `}
                                    >
                                        <motion.div
                                            className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
                                            animate={{ x: theme === "dark" ? 24 : 0 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        >
                                            {theme === "dark" ? (
                                                <Moon className="w-3 h-3 text-primary" />
                                            ) : (
                                                <Sun className="w-3 h-3 text-warning" />
                                            )}
                                        </motion.div>
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Menu Sections */}
                    {menuSections.map((section, sectionIndex) => (
                        <motion.div key={section.title} variants={fadeInUp}>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                                {section.title}
                            </p>
                            <Card variant="premium">
                                <CardContent className="p-0">
                                    {section.items.map((item, index) => (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className={`
                                                flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors
                                                ${index !== section.items.length - 1 ? "border-b" : ""}
                                            `}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                                                <item.icon className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="font-medium">{item.label}</span>
                                                {item.subtitle && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.subtitle}
                                                    </p>
                                                )}
                                            </div>
                                            {item.badge && (
                                                <Badge
                                                    variant={item.badgeVariant || "secondary"}
                                                    className="text-xs"
                                                >
                                                    {item.badge}
                                                </Badge>
                                            )}
                                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                        </Link>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    {/* Logout */}
                    <motion.div variants={fadeInUp}>
                        <Card variant="premium" className="border-destructive/20">
                            <CardContent className="p-0">
                                <button className="w-full flex items-center gap-3 p-4 text-destructive hover:bg-destructive/10 transition-colors rounded-2xl">
                                    <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                                        <LogOut className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold">Log Out</span>
                                </button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Version */}
                    <motion.div variants={fadeInUp} className="text-center py-4">
                        <p className="text-xs text-muted-foreground">
                            Debelu. v1.0.0 (Beta)
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                            Made with ❤️ in Nigeria
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
