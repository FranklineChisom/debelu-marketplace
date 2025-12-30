"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft,
    ShieldCheck,
    Key,
    Smartphone,
    Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function SecuritySettingsPage() {
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
                    <h1 className="text-2xl font-bold tracking-tight">Login & Security</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage your password and account protection.
                    </p>
                </div>
            </motion.div>

            <div className="grid gap-8">
                {/* Password Change */}
                <motion.div variants={fadeInUp}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="w-5 h-5 text-purple-500" />
                                Change Password
                            </CardTitle>
                            <CardDescription>
                                Update your password to keep your account secure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 max-w-lg">
                            <div className="space-y-2">
                                <Label>Current Password</Label>
                                <Input type="password" />
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label>New Password</Label>
                                <Input type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label>Confirm New Password</Label>
                                <Input type="password" />
                            </div>
                            <div className="pt-2">
                                <Button>Update Password</Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* 2FA */}
                <motion.div variants={fadeInUp}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-purple-500" />
                                Two-Factor Authentication (2FA)
                            </CardTitle>
                            <CardDescription>
                                Add an extra layer of security to your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Enable 2FA via SMS/Email</Label>
                                    <p className="text-sm text-muted-foreground">
                                        We'll send a code to your verified phone number when you sign in from a new device.
                                    </p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                    <Card className="border-red-500/20 bg-red-500/5">
                        <CardHeader>
                            <CardTitle className="text-red-700 flex items-center gap-2">
                                <Lock className="w-5 h-5" />
                                Danger Zone
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Deactivate Account</p>
                                    <p className="text-sm text-muted-foreground">Temporarily disable your store. Your products won't be visible.</p>
                                </div>
                                <Button variant="outline" className="text-red-600 hover:bg-red-500/10 hover:text-red-700 border-red-200">
                                    Deactivate
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}

function Separator() {
    return <div className="h-px w-full bg-border/50 my-2" />;
}
