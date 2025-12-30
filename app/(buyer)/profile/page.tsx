"use client";

import { motion } from "framer-motion";
import {
    User,
    Settings,
    ShoppingBag,
    Heart,
    Star,
    LogOut,
    Sparkles,
    Camera,
    ChevronRight,
    Trophy,
    Gift,
    Package,
    CreditCard,
    MapPin,
    Bell,
    Shield,
    HelpCircle,
    FileText,
    Moon,
    Smartphone,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn, formatNaira } from "@/lib/utils";
import { ProfileImageEditor } from "@/components/shared/profile-image-editor";

export default function ProfilePage() {
    const router = useRouter();
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    // Mock User Data
    const user = {
        name: "Chisom Frank",
        email: "chisom.frank@example.com",
        phone: "+234 801 234 5678",
        campus: "University of Lagos",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&auto=format&fit=crop",
        memberSince: "Dec 2024",
        vibe: "Tech Minimalist",
        level: 3,
        stats: {
            orders: 12,
            reviews: 5,
            wishlist: 8,
            spent: 125000,
        }
    };

    const [avatarUrl, setAvatarUrl] = useState(user.avatar);

    interface MenuItem {
        icon: any;
        label: string;
        href: string;
        badge?: string;
        color?: string;
        toggle?: boolean;
        defaultOn?: boolean;
    }

    const menuSections: { title: string; items: MenuItem[] }[] = [
        {
            title: "Activity",
            items: [
                { icon: Package, label: "My Orders", href: "/orders", badge: "2 active", color: "text-primary bg-primary/10" },
                { icon: Heart, label: "Wishlist", href: "/wishlist", badge: `${user.stats.wishlist}`, color: "text-rose-500 bg-rose-500/10" },
                { icon: Star, label: "Reviews", href: "/profile/reviews", badge: `${user.stats.reviews}`, color: "text-amber-500 bg-amber-500/10" },
                { icon: MapPin, label: "Saved Addresses", href: "/profile/addresses", color: "text-blue-500 bg-blue-500/10" },
            ]
        },
        {
            title: "Rewards",
            items: [
                { icon: Trophy, label: "Achievements", href: "/profile/badges", badge: `Level ${user.level}`, color: "text-amber-500 bg-amber-500/10" },
                { icon: Gift, label: "Refer & Earn", href: "/profile/referral", badge: "₦500/friend", color: "text-emerald-500 bg-emerald-500/10" },
                { icon: CreditCard, label: "Wallet", href: "/profile/wallet", badge: formatNaira(2500), color: "text-violet-500 bg-violet-500/10" },
            ]
        },
        {
            title: "Preferences",
            items: [
                { icon: Bell, label: "Notifications", href: "/settings/notifications", toggle: true, defaultOn: true },
                { icon: Moon, label: "Dark Mode", href: "/settings/appearance", toggle: true, defaultOn: false },
                { icon: Smartphone, label: "App Settings", href: "/settings" },
            ]
        },
        {
            title: "Support",
            items: [
                { icon: HelpCircle, label: "Help Center", href: "/help" },
                { icon: Shield, label: "Privacy & Security", href: "/privacy" },
                { icon: FileText, label: "Terms of Service", href: "/terms" },
            ]
        }
    ];

    return (
        <div className="flex-1 overflow-y-auto bg-background">
            <ProfileImageEditor
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                currentImage={avatarUrl}
                onSave={(newImage) => setAvatarUrl(newImage)}
            />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-b from-primary/10 via-primary/5 to-background pt-6 pb-20">
                {/* Subtle Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_50%)]" />

                <div className="relative max-w-2xl mx-auto px-4">
                    {/* Settings Button */}
                    <div className="flex justify-end mb-6">
                        <Link href="/settings">
                            <button className="w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors shadow-sm">
                                <Settings className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </Link>
                    </div>

                    {/* Avatar & Name */}
                    <div className="flex flex-col items-center text-center">
                        {/* Avatar */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative mb-4"
                        >
                            <div
                                className="w-28 h-28 rounded-full border-4 border-background shadow-xl overflow-hidden cursor-pointer group"
                                onClick={() => setIsEditorOpen(true)}
                            >
                                <Image
                                    src={avatarUrl}
                                    alt={user.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            {/* Online Indicator */}
                            <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-3 border-background" />
                        </motion.div>

                        {/* Name & Email */}
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </motion.div>

                        {/* Vibe Badge */}
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-4"
                        >
                            <Badge className="bg-gradient-to-r from-primary/20 to-violet-500/20 border-primary/20 text-foreground px-4 py-1.5 text-sm">
                                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                                {user.vibe}
                            </Badge>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Stats Cards - Overlapping Hero */}
            <div className="max-w-2xl mx-auto px-4 -mt-12 relative z-10">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-3 gap-3"
                >
                    <div className="bg-card rounded-2xl p-4 text-center shadow-lg border border-border/50">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-xl font-bold">{user.stats.orders}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Orders</p>
                    </div>
                    <div className="bg-card rounded-2xl p-4 text-center shadow-lg border border-border/50">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <Star className="w-5 h-5 text-amber-500" />
                        </div>
                        <p className="text-xl font-bold">{user.stats.reviews}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Reviews</p>
                    </div>
                    <div className="bg-card rounded-2xl p-4 text-center shadow-lg border border-border/50">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-emerald-500" />
                        </div>
                        <p className="text-xl font-bold">Lv.{user.level}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Level</p>
                    </div>
                </motion.div>
            </div>

            {/* Menu Sections */}
            <div className="max-w-2xl mx-auto px-4 py-8 pb-24 space-y-6">
                {menuSections.map((section, sectionIndex) => (
                    <motion.div
                        key={section.title}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + sectionIndex * 0.1 }}
                    >
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                            {section.title}
                        </h2>
                        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden divide-y divide-border/50">
                            {section.items.map((item, i) => {
                                const renderContent = () => (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-9 h-9 rounded-xl flex items-center justify-center",
                                                item.color || "bg-muted text-muted-foreground"
                                            )}>
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-sm">{item.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {item.badge && (
                                                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                                    {item.badge}
                                                </span>
                                            )}
                                            {item.toggle ? (
                                                <Switch
                                                    defaultChecked={item.defaultOn}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                            )}
                                        </div>
                                    </>
                                );

                                if (item.toggle) {
                                    return (
                                        <div
                                            key={item.label}
                                            onClick={() => router.push(item.href)}
                                            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                                        >
                                            {renderContent()}
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                                    >
                                        {renderContent()}
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}

                {/* Logout Button */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <button className="w-full p-4 rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2 font-medium">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </motion.div>

                {/* App Version */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-center pt-4"
                >
                </motion.div>
            </div>
        </div>
    );
}
