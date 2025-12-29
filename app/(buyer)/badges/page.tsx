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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const allBadges = [
    {
        id: "first-purchase",
        name: "First Steps",
        description: "Made your first purchase",
        icon: ShoppingBag,
        color: "bg-primary",
        earned: true,
        earnedAt: "Dec 15, 2024",
    },
    {
        id: "streak-7",
        name: "Week Warrior",
        description: "7-day login streak",
        icon: Flame,
        color: "bg-orange-500",
        earned: true,
        earnedAt: "Dec 20, 2024",
    },
    {
        id: "reviewer",
        name: "Trusted Reviewer",
        description: "Left 5 product reviews",
        icon: Star,
        color: "bg-warning",
        earned: true,
        earnedAt: "Dec 22, 2024",
    },
    {
        id: "referrer",
        name: "Friend Maker",
        description: "Referred 3 friends",
        icon: Users,
        color: "bg-success",
        earned: false,
        progress: { current: 1, total: 3 },
    },
    {
        id: "wishlist",
        name: "Wishful Thinker",
        description: "Added 10 items to wishlist",
        icon: Heart,
        color: "bg-pink-500",
        earned: false,
        progress: { current: 4, total: 10 },
    },
    {
        id: "power-buyer",
        name: "Power Buyer",
        description: "Made 10 purchases",
        icon: Zap,
        color: "bg-blue-500",
        earned: false,
        progress: { current: 2, total: 10 },
    },
    {
        id: "vip",
        name: "VIP Customer",
        description: "Spent ₦500,000 total",
        icon: Crown,
        color: "bg-purple-500",
        earned: false,
        progress: { current: 85000, total: 500000 },
    },
    {
        id: "streak-30",
        name: "Monthly Master",
        description: "30-day login streak",
        icon: Flame,
        color: "bg-red-500",
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

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="h-14 flex items-center justify-between px-4 border-b bg-background sticky top-0 z-30">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="font-display text-lg font-bold">Achievements</h1>
                <div className="w-10" />
            </header>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="p-4 space-y-6"
            >
                {/* Level Card */}
                <motion.div variants={fadeInUp}>
                    <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-primary-foreground/80">
                                        Your Level
                                    </p>
                                    <p className="text-4xl font-bold font-display">
                                        Level {userStats.level}
                                    </p>
                                </div>
                                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                                    <Trophy className="w-8 h-8" />
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>{userStats.points} XP</span>
                                    <span>{userStats.nextLevelPoints} XP</span>
                                </div>
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white rounded-full transition-all"
                                        style={{
                                            width: `${(userStats.points / userStats.nextLevelPoints) * 100
                                                }%`,
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-primary-foreground/70">
                                    {userStats.nextLevelPoints - userStats.points} XP to Level{" "}
                                    {userStats.level + 1}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Streak */}
                <motion.div variants={fadeInUp}>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                <Flame className="w-6 h-6 text-orange-500" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">Current Streak</p>
                                <p className="text-sm text-muted-foreground">
                                    Best: {userStats.longestStreak} days
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">{userStats.currentStreak}</p>
                                <p className="text-xs text-muted-foreground">days</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Earned Badges */}
                <motion.div variants={fadeInUp}>
                    <h2 className="font-display font-bold mb-3 flex items-center gap-2">
                        Earned Badges
                        <Badge variant="secondary">{earnedBadges.length}</Badge>
                    </h2>
                    <div className="grid grid-cols-3 gap-3">
                        {earnedBadges.map((badge) => (
                            <Card key={badge.id} className="text-center">
                                <CardContent className="p-3">
                                    <div
                                        className={cn(
                                            "w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-2",
                                            badge.color
                                        )}
                                    >
                                        <badge.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-xs font-medium line-clamp-1">
                                        {badge.name}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>

                {/* Locked Badges */}
                <motion.div variants={fadeInUp}>
                    <h2 className="font-display font-bold mb-3 flex items-center gap-2">
                        In Progress
                        <Badge variant="outline">{lockedBadges.length}</Badge>
                    </h2>
                    <div className="space-y-3">
                        {lockedBadges.map((badge) => (
                            <Card key={badge.id} className="opacity-75">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center relative">
                                        <badge.icon className="w-6 h-6 text-muted-foreground" />
                                        <Lock className="w-3 h-3 absolute -bottom-1 -right-1 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{badge.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {badge.description}
                                        </p>
                                        {badge.progress && (
                                            <div className="mt-2">
                                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary rounded-full"
                                                        style={{
                                                            width: `${(badge.progress.current / badge.progress.total) *
                                                                100
                                                                }%`,
                                                        }}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-muted-foreground mt-1">
                                                    {badge.progress.current} / {badge.progress.total}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
