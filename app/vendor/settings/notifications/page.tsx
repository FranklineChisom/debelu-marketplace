"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft,
    Bell,
    Mail,
    Smartphone,
    MessageSquare,
    Package,
    ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function NotificationsSettingsPage() {
    const [emailNotifications, setEmailNotifications] = useState({
        newOrder: true,
        orderStatus: true,
        lowStock: true,
        messages: true,
        promotions: false
    });

    const [pushNotifications, setPushNotifications] = useState({
        newOrder: true,
        orderStatus: false,
        lowStock: true,
        messages: true
    });

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-3xl mx-auto space-y-8 py-8"
        >
            {/* Header */}
            <motion.div variants={fadeInUp} className="flex items-center gap-4">
                <Link href="/vendor/settings">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage how you want to be notified about activity.
                    </p>
                </div>
            </motion.div>

            <div className="space-y-6">
                {/* Email Notifications */}
                <motion.div variants={fadeInUp}>
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-base">Email Notifications</CardTitle>
                                <CardDescription>Receive updates directly to your inbox.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex items-start gap-3">
                                    <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">New Orders</p>
                                        <p className="text-xs text-muted-foreground">Get notified when a customer places an order.</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={emailNotifications.newOrder}
                                    onCheckedChange={(c) => setEmailNotifications(prev => ({ ...prev, newOrder: c }))}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex items-start gap-3">
                                    <ShieldAlert className="w-5 h-5 text-muted-foreground mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">Low Stock Alerts</p>
                                        <p className="text-xs text-muted-foreground">Get notified when product inventory is running low.</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={emailNotifications.lowStock}
                                    onCheckedChange={(c) => setEmailNotifications(prev => ({ ...prev, lowStock: c }))}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex items-start gap-3">
                                    <MessageSquare className="w-5 h-5 text-muted-foreground mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">Buyer Messages</p>
                                        <p className="text-xs text-muted-foreground">Receive emails when buyers send you a message.</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={emailNotifications.messages}
                                    onCheckedChange={(c) => setEmailNotifications(prev => ({ ...prev, messages: c }))}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Push Notifications */}
                <motion.div variants={fadeInUp}>
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <Smartphone className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-base">Push Notifications</CardTitle>
                                <CardDescription>Get real-time alerts on your device.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="flex items-center justify-between space-x-2">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">New Orders</p>
                                </div>
                                <Switch
                                    checked={pushNotifications.newOrder}
                                    onCheckedChange={(c) => setPushNotifications(prev => ({ ...prev, newOrder: c }))}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Order Status Updates</p>
                                </div>
                                <Switch
                                    checked={pushNotifications.orderStatus}
                                    onCheckedChange={(c) => setPushNotifications(prev => ({ ...prev, orderStatus: c }))}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Low Stock Alerts</p>
                                </div>
                                <Switch
                                    checked={pushNotifications.lowStock}
                                    onCheckedChange={(c) => setPushNotifications(prev => ({ ...prev, lowStock: c }))}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
