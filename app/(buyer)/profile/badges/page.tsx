"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Trophy,
    Flame,
    Star,
    ShoppingBag,
    Heart,
    Users,
    Zap,
    Crown,
    Lock,
    Medal,
    Sparkles,
    Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const allBadges = [
    {
        id: "first-purchase",
        name: "First Steps",
        description: "Made your first purchase",
        icon: ShoppingBag,
        gradient: "from-emerald-400 to-teal-500",
        earned: true,
        earnedAt: "Dec 15, 2024",
        rarity: "common",
    },
    {
        id: "streak-7",
        name: "Week Warrior",
        description: "7-day login streak",
        icon: Flame,
        gradient: "from-orange-400 to-red-500",
        earned: true,
        earnedAt: "Dec 20, 2024",
        rarity: "uncommon",
    },
    {
        id: "reviewer",
        name: "Trusted Voice",
        description: "Left 5 product reviews",
        icon: Star,
        gradient: "from-yellow-400 to-amber-500",
        earned: true,
        earnedAt: "Dec 22, 2024",
        rarity: "uncommon",
    },
    {
        id: "referrer",
        name: "Community Builder",
        description: "Referred 3 friends",
        icon: Users,
        gradient: "from-blue-400 to-indigo-500",
        earned: false,
        progress: { current: 1, total: 3 },
        rarity: "rare",
    },
    {
        id: "wishlist",
        name: "Wishful Thinker",
        description: "Added 10 items to wishlist",
        icon: Heart,
        gradient: "from-pink-400 to-rose-500",
        earned: false,
        progress: { current: 4, total: 10 },
        rarity: "common",
    },
    {
        id: "power-buyer",
        name: "Power Buyer",
        description: "Made 10 purchases",
        icon: Zap,
        gradient: "from-violet-400 to-purple-600",
        earned: false,
        progress: { current: 2, total: 10 },
        rarity: "rare",
    },
    {
        id: "vip",
        name: "VIP Status",
        description: "Spent ₦500,000 total",
        icon: Crown,
        gradient: "from-amber-300 via-yellow-400 to-orange-400",
        earned: false,
        progress: { current: 85000, total: 500000 },
        rarity: "legendary",
    },
    {
        id: "streak-30",
        name: "Monthly Master",
        description: "30-day login streak",
        icon: Flame,
        gradient: "from-red-500 to-rose-600",
        earned: false,
        progress: { current: 7, total: 30 },
        rarity: "epic",
    },
];

const userStats = {
    level: 3,
    points: 450,
    nextLevelPoints: 600,
    currentStreak: 7,
    longestStreak: 12,
    totalBadges: 3,
};

const rarityColors: Record<string, string> = {
    common: "text-slate-500",
    uncommon: "text-emerald-500",
    rare: "text-blue-500",
    epic: "text-violet-500",
    legendary: "text-amber-500",
};

export default function BadgesPage() {
    const router = useRouter();
    const earnedBadges = allBadges.filter((b) => b.earned);
    const lockedBadges = allBadges.filter((b) => !b.earned);
    const progressPercentage = (userStats.points / userStats.nextLevelPoints) * 100;

    return (
        <div className="flex-1 overflow-y-auto bg-background">
            {/* Minimal Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border/40">
                <div className="flex items-center justify-between px-4 h-14 max-w-2xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="font-semibold text-base">Achievements</h1>
                    <div className="w-10" />
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-6 pb-20 space-y-8">
                {/* Level Progress Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-foreground text-background p-6"
                >
                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center shadow-lg">
                                <Medal className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <p className="text-background/60 text-xs uppercase tracking-wider font-medium">Current Level</p>
                                <h2 className="text-4xl font-black">Level {userStats.level}</h2>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-semibold">{userStats.points} XP</span>
                                <span className="text-background/50">{userStats.nextLevelPoints} XP</span>
                            </div>
                            <div className="h-3 bg-background/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                                />
                            </div>
                            <p className="text-xs text-background/50 text-right">
                                {userStats.nextLevelPoints - userStats.points} XP to next level
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 gap-3"
                >
                    <div className="p-5 rounded-2xl border border-border/50 bg-card text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange-500/10 flex items-center justify-center">
                            <Flame className="w-6 h-6 text-orange-500" />
                        </div>
                        <p className="text-2xl font-black">{userStats.currentStreak}</p>
                        <p className="text-xs text-muted-foreground font-medium">Day Streak</p>
                    </div>
                    <div className="p-5 rounded-2xl border border-border/50 bg-card text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-2xl font-black">{userStats.totalBadges}</p>
                        <p className="text-xs text-muted-foreground font-medium">Badges Earned</p>
                    </div>
                </motion.div>

                {/* Earned Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Your Collection</h2>
                        <Badge variant="secondary" className="rounded-full">
                            {earnedBadges.length} / {allBadges.length}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {earnedBadges.map((badge, i) => (
                            <motion.div
                                key={badge.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="group flex flex-col items-center gap-3"
                            >
                                <div className={cn(
                                    "w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-shadow group-hover:shadow-xl",
                                    badge.gradient
                                )}>
                                    <badge.icon className="w-9 h-9 text-white drop-shadow-sm" />
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-bold line-clamp-1">{badge.name}</p>
                                    <p className={cn("text-[10px] font-medium capitalize", rarityColors[badge.rarity])}>
                                        {badge.rarity}
                                    </p>
                                </div>
                            </motion.div>
                        ))}

                        {/* Empty Slots */}
                        {Array.from({ length: Math.max(0, 3 - earnedBadges.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="flex flex-col items-center gap-3 opacity-25">
                                <div className="w-20 h-20 rounded-2xl bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-muted-foreground/50" />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Locked Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-muted-foreground" />
                        <h2 className="text-lg font-bold">In Progress</h2>
                    </div>

                    <div className="space-y-3">
                        {lockedBadges.map((badge, i) => (
                            <motion.div
                                key={badge.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.05 }}
                                className="p-4 rounded-2xl border border-border/50 bg-card hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center relative">
                                        <badge.icon className="w-6 h-6 text-muted-foreground" />
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center">
                                            <Lock className="w-3 h-3 text-muted-foreground" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-sm">{badge.name}</h3>
                                            {badge.progress && (
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    {Math.round((badge.progress.current / badge.progress.total) * 100)}%
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                                        {badge.progress && (
                                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full bg-gradient-to-r", badge.gradient)}
                                                    style={{ width: `${(badge.progress.current / badge.progress.total) * 100}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
