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
    Coins,
    CheckCircle,
    Sparkles,
    ChevronRight,
    Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNaira, cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Separator } from "@/components/ui/separator";

const referralStats = {
    code: "CHIOMA2024",
    totalReferrals: 5,
    pendingReferrals: 2,
    earnedAmount: 2500,
    pendingAmount: 1000,
};

const referralHistory = [
    { name: "Emeka O.", status: "completed", amount: 500, date: "2 days ago", avatarColor: "bg-blue-500/20 text-blue-600" },
    { name: "Blessing N.", status: "completed", amount: 500, date: "1 week ago", avatarColor: "bg-purple-500/20 text-purple-600" },
    { name: "Tunde B.", status: "pending", amount: 500, date: "3 days ago", avatarColor: "bg-amber-500/20 text-amber-600" },
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
        <div className="min-h-screen bg-background pb-20 flex flex-col">
            {/* Premium Sticky Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 safe-top">
                <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full hover:bg-muted"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="font-display text-lg font-bold">Refer & Earn</h1>
                    <div className="w-9" /> {/* Spacer for centering */}
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="p-4 max-w-4xl mx-auto space-y-8"
                >
                    {/* Hero Card */}
                    <motion.div variants={fadeInUp}>
                        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-2xl">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                            <CardContent className="relative z-10 p-8 text-center">
                                <motion.div
                                    initial={{ scale: 0.8, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg"
                                >
                                    <Gift className="w-10 h-10 text-white drop-shadow-md" />
                                </motion.div>

                                <h2 className="font-display text-3xl md:text-4xl font-black mb-3 tracking-tight">
                                    Earn ₦500 per Referral
                                </h2>
                                <p className="text-primary-foreground/90 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
                                    Invite your friends to Debelu. They get <span className="font-bold bg-white/20 px-1.5 py-0.5 rounded">₦500 off</span> their first order, and you get <span className="font-bold bg-white/20 px-1.5 py-0.5 rounded">₦500 cash</span> when they shop.
                                </p>

                                {/* Referral Code Box */}
                                <div className="max-w-sm mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/20 shadow-inner flex items-center gap-2">
                                    <div className="flex-1 bg-white/10 rounded-xl px-4 py-3 flex flex-col items-center justify-center">
                                        <span className="text-[10px] uppercase tracking-widest opacity-70 font-medium">Your Code</span>
                                        <span className="font-mono text-xl font-bold tracking-wider">{referralStats.code}</span>
                                    </div>
                                    <Button
                                        onClick={handleCopy}
                                        size="icon"
                                        className="h-14 w-14 rounded-xl bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all shadow-lg"
                                    >
                                        {copied ? (
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                        ) : (
                                            <Copy className="w-6 h-6" />
                                        )}
                                    </Button>
                                </div>

                                <div className="mt-6 flex justify-center">
                                    <Button
                                        onClick={handleShare}
                                        variant="ghost"
                                        className="text-white hover:bg-white/10 rounded-full text-sm font-medium"
                                    >
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share Link Instead
                                    </Button>
                                </div>
                            </CardContent>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
                        <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-5 flex flex-col items-center text-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black">{referralStats.totalReferrals}</p>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Friends Invited</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-5 flex flex-col items-center text-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <Wallet className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-emerald-600">{formatNaira(referralStats.earnedAmount)}</p>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Earned</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Pending Earnings Alert */}
                    {referralStats.pendingAmount > 0 && (
                        <motion.div variants={fadeInUp}>
                            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-5 h-5 text-amber-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-sm text-amber-900 dark:text-amber-100">Pending Earnings</h3>
                                    <p className="text-xs text-amber-700/80 dark:text-amber-200/80">
                                        <span className="font-bold">{formatNaira(referralStats.pendingAmount)}</span> creates awaiting completion from {referralStats.pendingReferrals} friends.
                                    </p>
                                </div>
                                <Button size="sm" variant="outline" className="h-8 text-xs border-amber-500/30 text-amber-700 bg-transparent hover:bg-amber-500/10">
                                    Nudge
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* How it Works Horizontal Steps */}
                    <motion.div variants={fadeInUp} className="space-y-4">
                        <h3 className="font-display font-bold text-lg">How It Works</h3>
                        <div className="flex items-start justify-between relative">
                            {/* Connector Line */}
                            <div className="absolute top-4 left-0 w-full h-0.5 bg-muted -z-10" />

                            {[
                                { step: "1", title: "Invite", desc: "Share code" },
                                { step: "2", title: "They Shop", desc: "First order" },
                                { step: "3", title: "Earn", desc: "Get paid" },
                            ].map((item, i) => (
                                <div key={item.step} className="flex flex-col items-center gap-2 bg-background px-2">
                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm ring-4 ring-background">
                                        {item.step}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-bold">{item.title}</p>
                                        <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Referral History List */}
                    <motion.div variants={fadeInUp} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-display font-bold text-lg">Recent Invites</h3>
                            <Button variant="link" className="text-xs h-auto p-0">View All</Button>
                        </div>

                        <div className="bg-card border border-border/50 rounded-2xl divide-y divide-border/50 shadow-sm overflow-hidden">
                            {referralHistory.map((ref, i) => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold", ref.avatarColor)}>
                                            {ref.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{ref.name}</p>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className={cn(
                                                    "h-5 text-[10px] px-1.5 font-medium rounded-full",
                                                    ref.status === 'completed' ? "bg-green-500/10 text-green-700" : "bg-amber-500/10 text-amber-700"
                                                )}>
                                                    {ref.status === 'completed' ? 'Completed' : 'Pending'}
                                                </Badge>
                                                <span className="text-[10px] text-muted-foreground">• {ref.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm text-primary">{formatNaira(ref.amount)}</p>
                                        <p className="text-[10px] text-muted-foreground">Commission</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
