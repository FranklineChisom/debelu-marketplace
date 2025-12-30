"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Store,
    CreditCard,
    Truck,
    ShieldCheck,
    Bell,
    ChevronRight,
    User,
    HelpCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";

const settingsGroups = [
    {
        title: "Business Settings",
        items: [
            {
                title: "Store Profile",
                description: "Manage your store name, logo, and contact info.",
                href: "/vendor/settings/store",
                icon: Store,
                color: "text-blue-500",
                bg: "bg-blue-500/10"
            },
            {
                title: "Payments & Payouts",
                description: "Manage bank accounts and view withdrawal history.",
                href: "/vendor/settings/payments",
                icon: CreditCard,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10"
            },
            {
                title: "Shipping & Delivery",
                description: "Set up delivery zones, fees, and pickup options.",
                href: "/vendor/settings/shipping",
                icon: Truck,
                color: "text-amber-500",
                bg: "bg-amber-500/10"
            }
        ]
    },
    {
        title: "Account & Security",
        items: [
            {
                title: "Login & Security",
                description: "Change your password and secure your account.",
                href: "/vendor/settings/security",
                icon: ShieldCheck,
                color: "text-purple-500",
                bg: "bg-purple-500/10"
            },
            {
                title: "Notifications",
                description: "Choose what updates you want to receive.",
                href: "/vendor/settings/notifications",
                icon: Bell,
                color: "text-pink-500",
                bg: "bg-pink-500/10"
            }
        ]
    }
];

export default function VendorSettingsPage() {
    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-5xl mx-auto space-y-10 py-8 lg:py-12"
        >
            <motion.div variants={fadeInUp} className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight font-display">Settings</h1>
                <p className="text-muted-foreground text-lg">
                    Manage your store preferences and account security.
                </p>
            </motion.div>

            <motion.div variants={staggerContainer} className="space-y-8">
                {settingsGroups.map((group, i) => (
                    <div key={i} className="space-y-4">
                        <motion.h2
                            variants={fadeInUp}
                            className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1"
                        >
                            {group.title}
                        </motion.h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {group.items.map((item, j) => (
                                <motion.div key={j} variants={fadeInUp}>
                                    <Link href={item.href}>
                                        <Card className="h-full border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group cursor-pointer overflow-hidden relative">
                                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300", item.bg, item.color)}>
                                                    <item.icon className="w-6 h-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <CardTitle className="text-lg">{item.title}</CardTitle>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <CardDescription className="text-base">
                                                    {item.description}
                                                </CardDescription>
                                            </CardContent>
                                            <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <p>Debelu Vendor Portal v2.0.1</p>
                <div className="flex items-center gap-6">
                    <Link href="/vendor/help" className="hover:text-foreground transition-colors">Help Center</Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                </div>
            </motion.div>
        </motion.div>
    );
}
