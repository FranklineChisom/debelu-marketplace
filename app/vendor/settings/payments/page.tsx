"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft,
    CreditCard,
    DollarSign,
    Building,
    History,
    Plus,
    MoreHorizontal,
    Trash2,
    CheckCircle2,
    Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { formatNaira } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function PaymentsSettingsPage() {
    const [balance, setBalance] = useState(450500);

    const transactions = [
        { id: "TRX-8902", type: "payout", amount: 45000, status: "completed", date: "Oct 24, 2025", bank: "GTBank •••• 4521" },
        { id: "TRX-8901", type: "payout", amount: 120000, status: "completed", date: "Oct 15, 2025", bank: "GTBank •••• 4521" },
        { id: "TRX-8892", type: "payout", amount: 80000, status: "completed", date: "Oct 01, 2025", bank: "Access •••• 1920" },
    ];

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-4xl mx-auto space-y-8 py-8"
        >
            {/* Header */}
            <motion.div variants={fadeInUp} className="flex items-center gap-4">
                <Link href="/vendor/settings">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Payments & Payouts</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage your earnings and withdrawal methods.
                    </p>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Balance Card */}
                    <motion.div variants={fadeInUp}>
                        <Card className="bg-gradient-to-br from-primary to-violet-600 text-white border-0 shadow-xl shadow-primary/20">
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Available Balance</p>
                                    <h2 className="text-5xl font-black font-display tracking-tight">{formatNaira(balance)}</h2>
                                </div>
                                <div className="flex gap-4">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold shadow-lg">
                                                Request Payout
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Request Payout</DialogTitle>
                                                <DialogDescription>
                                                    Transfer funds to your verified bank account.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label>Amount to Withdraw</Label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                                                        <Input className="pl-7 font-bold text-lg" defaultValue="50000" />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Available balance: {formatNaira(balance)}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Destination Account</Label>
                                                    <select className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                        <option>GTBank •••• 4521 (Primary)</option>
                                                        <option>Access •••• 1920</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button className="w-full">Confirm Withdrawal</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm">
                                        View Statement
                                    </Button>
                                </div>
                                <p className="text-xs text-blue-100/80 flex items-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    Your funds are held securely until payout.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Withdrawal Methods */}
                    <motion.div variants={fadeInUp}>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Bank Accounts</CardTitle>
                                    <CardDescription>Accounts available for withdrawal.</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Plus className="w-4 h-4" /> Add Bank
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-xl border bg-muted/20">
                                    <div className="w-12 h-12 rounded-lg bg-white border flex items-center justify-center p-2">
                                        <Building className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold">Guaranty Trust Bank</p>
                                            <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-600 border-0">Primary</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">TechHub Nigeria Limited •••• 4521</p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Make Primary</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Remove
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-xl border bg-muted/20 opacity-75">
                                    <div className="w-12 h-12 rounded-lg bg-white border flex items-center justify-center p-2">
                                        <Building className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold">Access Bank</p>
                                        <p className="text-sm text-muted-foreground">Chisom Frankline •••• 1920</p>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                </div>

                {/* Sidebar / History */}
                <div className="space-y-6">
                    <motion.div variants={fadeInUp}>
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="w-5 h-5 text-muted-foreground" />
                                    Payout History
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative border-l-2 border-muted pl-4 space-y-6">
                                    {transactions.map((trx, i) => (
                                        <div key={i} className="relative">
                                            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-background" />
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-bold text-foreground">
                                                    Payout Request
                                                </p>
                                                <p className="text-sm font-medium text-green-600">
                                                    {formatNaira(trx.amount)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {trx.date}
                                                </p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Badge variant="outline" className="text-[10px] h-5 font-normal">
                                                        {trx.bank}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="link" className="w-full mt-6 text-xs text-muted-foreground">
                                    View all transactions
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
