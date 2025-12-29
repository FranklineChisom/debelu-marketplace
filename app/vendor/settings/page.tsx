"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Store,
    User,
    Bell,
    CreditCard,
    Shield,
    HelpCircle,
    ChevronRight,
    Camera,
    Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const settingsSections = [
    { id: "store", label: "Store Settings", icon: Store },
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payments", label: "Payments & Payouts", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
    { id: "help", label: "Help & Support", icon: HelpCircle },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState("store");
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 1000));
        setIsLoading(false);
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={fadeInUp}>
                <h2 className="text-2xl font-bold font-display tracking-tight">
                    Settings
                </h2>
                <p className="text-muted-foreground mt-1">
                    Manage your store and account settings
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <motion.div variants={fadeInUp} className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-2">
                            {settingsSections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${activeSection === section.id
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted"
                                        }`}
                                >
                                    <section.icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{section.label}</span>
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Content */}
                <motion.div variants={fadeInUp} className="lg:col-span-3 space-y-6">
                    {activeSection === "store" && <StoreSettings onSave={handleSave} isLoading={isLoading} />}
                    {activeSection === "profile" && <ProfileSettings onSave={handleSave} isLoading={isLoading} />}
                    {activeSection === "notifications" && <NotificationSettings />}
                    {activeSection === "payments" && <PaymentSettings />}
                    {activeSection === "security" && <SecuritySettings />}
                    {activeSection === "help" && <HelpSection />}
                </motion.div>
            </div>
        </motion.div>
    );
}

function StoreSettings({ onSave, isLoading }: { onSave: () => void; isLoading: boolean }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Store Settings</CardTitle>
                <CardDescription>
                    Update your store information and preferences
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-foreground">T</span>
                    </div>
                    <div>
                        <Button variant="outline" size="sm">
                            <Camera className="w-4 h-4 mr-2" />
                            Change Logo
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                            Recommended: 400x400px, PNG or JPG
                        </p>
                    </div>
                </div>

                {/* Fields */}
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Store Name</label>
                        <Input defaultValue="TechHub NG" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            className="flex min-h-20 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            defaultValue="Your one-stop shop for quality electronics and accessories on UNILAG campus."
                        />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone</label>
                            <Input defaultValue="08012345678" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">WhatsApp</label>
                            <Input defaultValue="08012345678" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input defaultValue="SUB Building, UNILAG" />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <Button onClick={onSave} isLoading={isLoading}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function ProfileSettings({ onSave, isLoading }: { onSave: () => void; isLoading: boolean }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                    Manage your personal account information
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input defaultValue="Chukwuemeka Okafor" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input type="email" defaultValue="emeka@techhub.ng" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Phone</label>
                        <Input defaultValue="08012345678" />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <Button onClick={onSave} isLoading={isLoading}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function NotificationSettings() {
    const notifications = [
        { id: "orders", label: "New Orders", description: "Get notified when you receive an order", enabled: true },
        { id: "messages", label: "Customer Messages", description: "Notifications for chat messages", enabled: true },
        { id: "reviews", label: "Reviews", description: "When customers leave reviews", enabled: false },
        { id: "stock", label: "Low Stock Alerts", description: "When products run low", enabled: true },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                    Choose what notifications you want to receive
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {notifications.map((notif) => (
                    <div key={notif.id} className="flex items-center justify-between p-4 rounded-xl border">
                        <div>
                            <p className="font-medium text-sm">{notif.label}</p>
                            <p className="text-xs text-muted-foreground">{notif.description}</p>
                        </div>
                        <button
                            className={`relative w-12 h-6 rounded-full transition-colors ${notif.enabled ? "bg-primary" : "bg-muted"
                                }`}
                        >
                            <motion.div
                                className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow"
                                animate={{ x: notif.enabled ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function PaymentSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Payments & Payouts</CardTitle>
                <CardDescription>
                    Manage your bank account for payouts
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 rounded-xl border bg-muted/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Bank Account</p>
                            <p className="text-sm text-muted-foreground">
                                GTBank • **** 1234
                            </p>
                        </div>
                        <Badge variant="success">Verified</Badge>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Bank Name</label>
                        <Input defaultValue="GTBank" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Account Number</label>
                        <Input defaultValue="0123456789" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Account Name</label>
                        <Input defaultValue="TechHub NG Enterprise" disabled />
                        <p className="text-xs text-muted-foreground">
                            Auto-filled from your bank
                        </p>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <Button>Update Bank Details</Button>
                </div>
            </CardContent>
        </Card>
    );
}

function SecuritySettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                    Manage your account security settings
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors">
                    <div>
                        <p className="font-medium text-sm">Change Password</p>
                        <p className="text-xs text-muted-foreground">
                            Last changed 3 months ago
                        </p>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                </button>

                <button className="w-full flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors">
                    <div>
                        <p className="font-medium text-sm">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground">
                            Add an extra layer of security
                        </p>
                    </div>
                    <Badge variant="secondary">Off</Badge>
                </button>

                <button className="w-full flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors">
                    <div>
                        <p className="font-medium text-sm">Active Sessions</p>
                        <p className="text-xs text-muted-foreground">
                            Manage devices logged into your account
                        </p>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </CardContent>
        </Card>
    );
}

function HelpSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Help & Support</CardTitle>
                <CardDescription>
                    Get help with your vendor account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors">
                    <div>
                        <p className="font-medium text-sm">Vendor Guide</p>
                        <p className="text-xs text-muted-foreground">
                            Learn how to get the most out of Debelu
                        </p>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                </button>

                <button className="w-full flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors">
                    <div>
                        <p className="font-medium text-sm">Contact Support</p>
                        <p className="text-xs text-muted-foreground">
                            Chat with our support team
                        </p>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                </button>

                <button className="w-full flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors">
                    <div>
                        <p className="font-medium text-sm">FAQs</p>
                        <p className="text-xs text-muted-foreground">
                            Frequently asked questions
                        </p>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </CardContent>
        </Card>
    );
}
