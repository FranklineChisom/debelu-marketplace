"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Copy,
    Share2,
    Gift,
    Users,
    Check,
    Wallet,
    ChevronRight,
    Sparkles,
    UserPlus,
    ShoppingBag,
    Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNaira, cn } from "@/lib/utils";

const referralStats = {
    code: "CHIOMA2024",
    totalReferrals: 5,
    pendingReferrals: 2,
    earnedAmount: 2500,
    pendingAmount: 1000,
};

const referralHistory = [
    { name: "Emeka O.", status: "completed", amount: 500, date: "2 days ago", initial: "E", color: "bg-blue-500" },
    { name: "Blessing N.", status: "completed", amount: 500, date: "1 week ago", initial: "B", color: "bg-purple-500" },
    { name: "Tunde B.", status: "pending", amount: 500, date: "3 days ago", initial: "T", color: "bg-amber-500" },
    { name: "Ngozi A.", status: "pending", amount: 500, date: "Yesterday", initial: "N", color: "bg-rose-500" },
];

const howItWorks = [
    { icon: Share2, title: "Share", description: "Send your code to friends" },
    { icon: ShoppingBag, title: "They Shop", description: "Friend makes first order" },
    { icon: Coins, title: "Earn", description: "You both get ₦500" },
];

export default function ReferralPage() {
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralStats.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        const shareData = {
            title: "Join Debelu!",
            text: `Use my code ${referralStats.code} to get ₦500 off your first order on Debelu!`,
            url: `https://debelu.ng/ref/${referralStats.code}`,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                handleCopy();
            }
        } catch (err) {
            handleCopy();
        }
    };

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
                    <h1 className="font-semibold text-base">Refer & Earn</h1>
                    <div className="w-10" />
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-6 pb-20 space-y-8">
                {/* Hero Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-violet-500 to-purple-600 text-white p-6"
                >
                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />

                    <div className="relative z-10 text-center">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center"
                        >
                            <Gift className="w-10 h-10" />
                        </motion.div>

                        <h2 className="text-3xl font-bold mb-2">Earn ₦500 per Friend</h2>
                        <p className="text-white/80 text-sm mb-6 max-w-xs mx-auto">
                            Share your code. They get ₦500 off, you get ₦500 cash.
                        </p>

                        {/* Referral Code Box */}
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-4">
                            <p className="text-[10px] uppercase tracking-wider text-white/60 mb-1">Your Code</p>
                            <div className="flex items-center justify-center gap-3">
                                <span className="font-mono text-2xl font-bold tracking-wider">{referralStats.code}</span>
                                <button
                                    onClick={handleCopy}
                                    className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center hover:scale-105 transition-transform"
                                >
                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            onClick={handleShare}
                            variant="ghost"
                            className="text-white hover:bg-white/10 rounded-full"
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Link
                        </Button>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 gap-3"
                >
                    <div className="p-5 rounded-2xl border border-border/50 bg-card text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-2xl font-black">{referralStats.totalReferrals}</p>
                        <p className="text-xs text-muted-foreground font-medium">Friends Invited</p>
                    </div>
                    <div className="p-5 rounded-2xl border border-border/50 bg-card text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-emerald-600" />
                        </div>
                        <p className="text-2xl font-black text-emerald-600">{formatNaira(referralStats.earnedAmount)}</p>
                        <p className="text-xs text-muted-foreground font-medium">Total Earned</p>
                    </div>
                </motion.div>

                {/* Pending Alert */}
                {referralStats.pendingAmount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm">Pending Rewards</p>
                            <p className="text-xs text-muted-foreground">
                                <span className="font-bold text-amber-600">{formatNaira(referralStats.pendingAmount)}</span> from {referralStats.pendingReferrals} friends awaiting first purchase
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* How it Works */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <h3 className="font-bold">How It Works</h3>
                    <div className="flex items-start justify-between relative">
                        {/* Connector Line */}
                        <div className="absolute top-5 left-10 right-10 h-0.5 bg-border -z-10" />

                        {howItWorks.map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center w-24">
                                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-2 ring-4 ring-background">
                                    <step.icon className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-bold">{step.title}</p>
                                <p className="text-[10px] text-muted-foreground">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Referral History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold">Recent Invites</h3>
                        <button className="text-xs text-primary font-medium hover:underline">View All</button>
                    </div>

                    <div className="rounded-2xl border border-border/50 overflow-hidden divide-y divide-border/50">
                        {referralHistory.map((ref, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.05 }}
                                className="p-4 flex items-center justify-between bg-card hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm", ref.color)}>
                                        {ref.initial}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{ref.name}</p>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="secondary"
                                                className={cn(
                                                    "h-5 text-[10px] px-1.5 rounded-full",
                                                    ref.status === 'completed'
                                                        ? "bg-emerald-500/10 text-emerald-600"
                                                        : "bg-amber-500/10 text-amber-600"
                                                )}
                                            >
                                                {ref.status === 'completed' ? 'Completed' : 'Pending'}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground">{ref.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm text-primary">{formatNaira(ref.amount)}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Invite CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Button
                        onClick={handleShare}
                        className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 text-base font-semibold"
                    >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Invite Friends
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
