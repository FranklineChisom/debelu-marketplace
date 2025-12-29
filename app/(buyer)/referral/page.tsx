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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const referralStats = {
    code: "CHIOMA2024",
    totalReferrals: 5,
    pendingReferrals: 2,
    earnedAmount: 2500,
    pendingAmount: 1000,
};

const referralHistory = [
    { name: "Emeka O.", status: "completed", amount: 500, date: "2 days ago" },
    { name: "Blessing N.", status: "completed", amount: 500, date: "1 week ago" },
    { name: "Tunde B.", status: "pending", amount: 500, date: "3 days ago" },
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
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="h-14 flex items-center justify-between px-4 border-b bg-background sticky top-0 z-30">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="font-display text-lg font-bold">Refer & Earn</h1>
                <div className="w-10" />
            </header>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="p-4 space-y-6"
            >
                {/* Hero */}
                <motion.div variants={fadeInUp}>
                    <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
                        <CardContent className="p-6 text-center relative">
                            <Gift className="w-12 h-12 mx-auto mb-4" />
                            <h2 className="font-display text-2xl font-bold mb-2">
                                Earn ₦500 per Referral
                            </h2>
                            <p className="text-sm text-primary-foreground/80 mb-4">
                                Share your code with friends. When they make their first
                                purchase, you both get ₦500!
                            </p>

                            {/* Referral Code */}
                            <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
                                <p className="text-xs mb-2">Your Referral Code</p>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="font-mono text-xl font-bold tracking-wider">
                                        {referralStats.code}
                                    </span>
                                    <button
                                        onClick={handleCopy}
                                        className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                    >
                                        {copied ? (
                                            <CheckCircle className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                onClick={handleShare}
                                variant="secondary"
                                className="w-full"
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share with Friends
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Stats */}
                <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                            <p className="text-2xl font-bold">
                                {referralStats.totalReferrals}
                            </p>
                            <p className="text-xs text-muted-foreground">Total Referrals</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <Coins className="w-6 h-6 mx-auto mb-2 text-success" />
                            <p className="text-2xl font-bold">
                                {formatNaira(referralStats.earnedAmount)}
                            </p>
                            <p className="text-xs text-muted-foreground">Total Earned</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Pending */}
                {referralStats.pendingAmount > 0 && (
                    <motion.div variants={fadeInUp}>
                        <Card className="bg-warning/10 border-warning/20">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">Pending Earnings</p>
                                    <p className="text-xs text-muted-foreground">
                                        {referralStats.pendingReferrals} friends haven't ordered yet
                                    </p>
                                </div>
                                <span className="font-bold">
                                    {formatNaira(referralStats.pendingAmount)}
                                </span>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* How it Works */}
                <motion.div variants={fadeInUp}>
                    <h2 className="font-display font-bold mb-3">How It Works</h2>
                    <div className="space-y-3">
                        {[
                            { step: "1", text: "Share your unique referral code" },
                            { step: "2", text: "Friend signs up and makes first purchase" },
                            { step: "3", text: "You both get ₦500 credited instantly" },
                        ].map((item) => (
                            <div key={item.step} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                                    {item.step}
                                </div>
                                <span className="text-sm">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Referral History */}
                <motion.div variants={fadeInUp}>
                    <h2 className="font-display font-bold mb-3">Referral History</h2>
                    <Card>
                        <CardContent className="p-0 divide-y">
                            {referralHistory.map((ref, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-4"
                                >
                                    <div>
                                        <p className="font-medium text-sm">{ref.name}</p>
                                        <p className="text-xs text-muted-foreground">{ref.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge
                                            variant={
                                                ref.status === "completed" ? "success" : "warning"
                                            }
                                            className="mb-1"
                                        >
                                            {ref.status}
                                        </Badge>
                                        <p className="text-sm font-medium">
                                            {formatNaira(ref.amount)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}
