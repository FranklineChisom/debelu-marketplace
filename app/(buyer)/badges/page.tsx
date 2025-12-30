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
    ChevronRight,
    Medal
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const allBadges = [
    {
        id: "first-purchase",
        name: "First Steps",
        description: "Made your first purchase",
        icon: ShoppingBag,
        color: "bg-gradient-to-br from-emerald-400 to-emerald-600",
        shadow: "shadow-emerald-500/20",
        earned: true,
        earnedAt: "Dec 15, 2024",
    },
    {
        id: "streak-7",
        name: "Week Warrior",
        description: "7-day login streak",
        icon: Flame,
        color: "bg-gradient-to-br from-orange-400 to-red-500",
        shadow: "shadow-orange-500/20",
        earned: true,
        earnedAt: "Dec 20, 2024",
    },
    {
        id: "reviewer",
        name: "Trusted Reviewer",
        description: "Left 5 product reviews",
        icon: Star,
        color: "bg-gradient-to-br from-yellow-400 to-amber-500",
        shadow: "shadow-yellow-500/20",
        earned: true,
        earnedAt: "Dec 22, 2024",
    },
    {
        id: "referrer",
        name: "Friend Maker",
        description: "Referred 3 friends",
        icon: Users,
        color: "bg-gradient-to-br from-blue-400 to-indigo-500",
        shadow: "shadow-blue-500/20",
        earned: false,
        progress: { current: 1, total: 3 },
    },
    {
        id: "wishlist",
        name: "Wishful Thinker",
        description: "Added 10 items to wishlist",
        icon: Heart,
        color: "bg-gradient-to-br from-pink-400 to-rose-500",
        shadow: "shadow-pink-500/20",
        earned: false,
        progress: { current: 4, total: 10 },
    },
    {
        id: "power-buyer",
        name: "Power Buyer",
        description: "Made 10 purchases",
        icon: Zap,
        color: "bg-gradient-to-br from-violet-400 to-purple-600",
        shadow: "shadow-purple-500/20",
        earned: false,
        progress: { current: 2, total: 10 },
    },
    {
        id: "vip",
        name: "VIP Customer",
        description: "Spent ₦500,000 total",
        icon: Crown,
        color: "bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500",
        shadow: "shadow-amber-500/20",
        earned: false,
        progress: { current: 85000, total: 500000 },
    },
    {
        id: "streak-30",
        name: "Monthly Master",
        description: "30-day login streak",
        icon: Flame,
        color: "bg-gradient-to-br from-red-500 to-rose-600",
        shadow: "shadow-red-500/20",
        earned: false,
        progress: { current: 7, total: 30 },
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

export default function BadgesPage() {
    const router = useRouter();
    const earnedBadges = allBadges.filter((b) => b.earned);
    const lockedBadges = allBadges.filter((b) => !b.earned);
    const progressPercentage = (userStats.points / userStats.nextLevelPoints) * 100;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40 safe-top">
                <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full hover:bg-muted"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="font-display text-lg font-bold">Achievements</h1>
                    <div className="w-9" /> {/* Spacer for centering */}
                </div>
            </header>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="p-4 max-w-4xl mx-auto space-y-8"
            >
                {/* Level Hero Card */}
                <motion.div variants={fadeInUp} className="relative overflow-hidden rounded-[2rem] bg-foreground text-background shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <CardContent className="relative z-10 p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-background/80 font-medium text-sm uppercase tracking-wider">
                                    <Medal className="w-4 h-4" />
                                    Current Rank
                                </div>
                                <h2 className="text-5xl font-black font-display tracking-tight">
                                    Level {userStats.level}
                                </h2>
                                <p className="text-background/60 text-sm max-w-xs">
                                    You're doing great! Keep collecting badges to level up and unlock exclusive rewards.
                                </p>
                            </div>

                            <div className="flex-1 w-full md:max-w-xs space-y-3">
                                <div className="flex justify-between text-sm font-bold">
                                    <span>{userStats.points} XP</span>
                                    <span className="text-background/50">/ {userStats.nextLevelPoints} XP</span>
                                </div>
                                <div className="h-4 bg-background/10 rounded-full overflow-hidden p-0.5 backdrop-blur-sm">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercentage}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-primary to-emerald-300 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                    />
                                </div>
                                <p className="text-xs text-right text-background/50">
                                    {userStats.nextLevelPoints - userStats.points} XP to Level {userStats.level + 1}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
                        <CardContent className="p-5 flex flex-col items-center justify-center text-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-1">
                                <Flame className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black">{userStats.currentStreak} Days</h3>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Current Streak</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                        <CardContent className="p-5 flex flex-col items-center justify-center text-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-1">
                                <Trophy className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black">{userStats.totalBadges}</h3>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Badges Earned</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Earned Badges Section */}
                <motion.div variants={fadeInUp} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-display font-bold flex items-center gap-2">
                            Collection
                            <Badge variant="secondary" className="rounded-full px-2.5 bg-foreground/5">{earnedBadges.length}</Badge>
                        </h2>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {earnedBadges.map((badge) => (
                            <motion.div
                                key={badge.id}
                                whileHover={{ y: -5, scale: 1.05 }}
                                className="group flex flex-col items-center gap-3"
                            >
                                <div className={cn(
                                    "w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 relative overflow-hidden group-hover:shadow-xl",
                                    badge.color,
                                    badge.shadow
                                )}>
                                    <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full group-hover:animate-shine" />
                                    <badge.icon className="w-8 h-8 text-white drop-shadow-md" />
                                </div>
                                <div className="text-center space-y-0.5">
                                    <p className="text-xs font-bold leading-tight">{badge.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{badge.earnedAt}</p>
                                </div>
                            </motion.div>
                        ))}
                        {/* Placeholder slots to fill grid visually if few badges */}
                        {Array.from({ length: Math.max(0, 5 - earnedBadges.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="flex flex-col items-center gap-3 opacity-30">
                                <div className="w-20 h-20 rounded-2xl bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Locked Badges List */}
                <motion.div variants={fadeInUp} className="space-y-4">
                    <h2 className="text-xl font-display font-bold flex items-center gap-2">
                        Next Achievements
                        <Badge variant="outline" className="rounded-full px-2.5">{lockedBadges.length}</Badge>
                    </h2>
                    <div className="grid gap-3">
                        {lockedBadges.map((badge) => (
                            <div
                                key={badge.id}
                                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-4 transition-all hover:bg-card hover:shadow-lg hover:border-primary/20"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-muted transition-colors group-hover:bg-primary/10">
                                        <badge.icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                                        <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5 shadow-sm">
                                            <Lock className="h-3 w-3 text-muted-foreground" />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold">{badge.name}</p>
                                            {badge.progress && (
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    {Math.round((badge.progress.current / badge.progress.total) * 100)}%
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">{badge.description}</p>

                                        {badge.progress && (
                                            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-full rounded-full bg-primary/50 transition-all group-hover:bg-primary"
                                                    style={{ width: `${(badge.progress.current / badge.progress.total) * 100}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
