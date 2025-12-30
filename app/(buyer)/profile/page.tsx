"use client";

import { motion } from "framer-motion";
import {
    User,
    Settings,
    ShoppingBag,
    Heart,
    Star,
    LogOut,
    Sparkles,
    Camera,
    Mail,
    Phone,
    MapPin,
    Bell,
    Shield,
    Globe,
    ChevronRight,
    Edit2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { ProfileImageEditor } from "@/components/shared/profile-image-editor";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);

    // Mock User Data
    const user = {
        name: "Chisom Frank",
        email: "chisom.frank@example.com",
        phone: "+234 801 234 5678",
        hostel: "Hall 3, Room A204",
        vibe: "Tech Minimalist",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2574&auto=format&fit=crop",
        stats: {
            orders: 12,
            reviews: 5,
            wishlist: 8
        }
    };

    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(user.avatar);

    return (
        <div className="flex-1 h-full overflow-y-auto bg-background pb-20 scrollbar-hide">
            <ProfileImageEditor
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                currentImage={avatarUrl}
                onSave={(newImage) => setAvatarUrl(newImage)}
            />
            {/* Header / Banner */}
            <div className="relative h-48 md:h-64 bg-muted overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-background/5" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            </div>

            <div className="max-w-5xl mx-auto px-4 lg:px-8 -mt-24 relative z-10">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="flex flex-col gap-6"
                >
                    {/* User Profile Header Card */}
                    <motion.div variants={fadeInUp}>
                        <Card className="border-border/50 shadow-xl shadow-primary/5 overflow-hidden">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row gap-6 md:items-end">
                                    <div className="relative">
                                        <div className="w-32 h-32 rounded-3xl border-4 border-background shadow-lg overflow-hidden relative group">
                                            <Image
                                                src={avatarUrl}
                                                alt={user.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <div
                                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                onClick={() => setIsEditorOpen(true)}
                                            >
                                                <Camera className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-background p-1.5 rounded-full border border-border/50 shadow-sm">
                                            <div className="bg-emerald-500 w-4 h-4 rounded-full border-2 border-background" />
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <h1 className="text-3xl font-display font-bold">{user.name}</h1>
                                                <p className="text-muted-foreground font-medium flex items-center gap-2">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Button variant="outline" className="rounded-full gap-2 hover:bg-muted" onClick={() => setIsEditing(!isEditing)}>
                                                    <Edit2 className="w-4 h-4" />
                                                    {isEditing ? "Cancel Edit" : "Edit Profile"}
                                                </Button>
                                                <Button variant="destructive" size="icon" className="rounded-full opacity-0 hover:opacity-100 transition-opacity">
                                                    <LogOut className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 pt-4 md:pt-2">
                                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10">
                                                <ShoppingBag className="w-4 h-4 text-primary" />
                                                <span className="font-bold">{user.stats.orders}</span>
                                                <span className="text-xs text-muted-foreground uppercase tracking-wide">Orders</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/5 border border-orange-500/10">
                                                <Star className="w-4 h-4 text-orange-500" />
                                                <span className="font-bold">{user.stats.reviews}</span>
                                                <span className="text-xs text-muted-foreground uppercase tracking-wide">Reviews</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/5 border border-red-500/10">
                                                <Heart className="w-4 h-4 text-red-500" />
                                                <span className="font-bold">{user.stats.wishlist}</span>
                                                <span className="text-xs text-muted-foreground uppercase tracking-wide">Wishlist</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Left Column: Personal Info & Vibe */}
                        <div className="md:col-span-2 space-y-6">

                            {/* Personal Info */}
                            <motion.div variants={fadeInUp}>
                                <Card className="border-border/50">
                                    <CardHeader>
                                        <CardTitle className="font-display">Personal Information</CardTitle>
                                        <CardDescription>Manage your contact details and address.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input id="name" defaultValue={user.name} disabled={!isEditing} className="pl-10 h-11 bg-muted/30 border-border/50" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input id="email" defaultValue={user.email} disabled={!isEditing} className="pl-10 h-11 bg-muted/30 border-border/50" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input id="phone" defaultValue={user.phone} disabled={!isEditing} className="pl-10 h-11 bg-muted/30 border-border/50" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="hostel">Campus Address (Hostel)</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input id="hostel" defaultValue={user.hostel} disabled={!isEditing} className="pl-10 h-11 bg-muted/30 border-border/50" />
                                                </div>
                                            </div>
                                        </div>
                                        {isEditing && (
                                            <div className="flex justify-end pt-4">
                                                <Button className="rounded-full px-8">Save Changes</Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* My Vibe */}
                            <motion.div variants={fadeInUp}>
                                <Card className="border-none bg-gradient-to-br from-indigo-500 to-purple-600 text-white overflow-hidden relative">
                                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                                    <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

                                    <CardContent className="p-8 relative z-10">
                                        <div className="flex items-start justify-between mb-8">
                                            <div>
                                                <Badge variant="outline" className="text-white border-white/20 mb-3 bg-white/10 backdrop-blur-md">
                                                    <Sparkles className="w-3 h-3 mr-1" /> My Vibe
                                                </Badge>
                                                <h3 className="text-3xl font-display font-black tracking-tight">{user.vibe}</h3>
                                            </div>
                                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                                                <span className="text-3xl">💻</span>
                                            </div>
                                        </div>
                                        <p className="text-white/80 max-w-lg mb-6">
                                            We've customized your explore feed to show more tech gadgets, desk setups, and minimal accessories.
                                        </p>
                                        <Button variant="secondary" className="rounded-full bg-white text-indigo-600 hover:bg-white/90 border-0">
                                            Retake Vibe Quiz
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Right Column: Settings */}
                        <motion.div variants={fadeInUp} className="space-y-6">
                            <Card className="border-border/50 h-full">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="font-display">Settings</CardTitle>
                                        <CardDescription>Quick controls.</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild className="h-8">
                                        <Link href="/settings">View All <ChevronRight className="w-4 h-4 ml-1" /></Link>
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-6">

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Notifications</h4>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                    <Bell className="w-4 h-4" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <Label className="text-sm font-medium">Order Updates</Label>
                                                    <p className="text-xs text-muted-foreground">Get notified about delivery status</p>
                                                </div>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                                                    <Tag className="w-4 h-4" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <Label className="text-sm font-medium">Promotions</Label>
                                                    <p className="text-xs text-muted-foreground">Daily deals and offers</p>
                                                </div>
                                            </div>
                                            <Switch />
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Security</h4>
                                        <div className="flex items-center justify-between group cursor-pointer hover:bg-muted/50 p-2 -mx-2 rounded-xl transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                                    <Shield className="w-4 h-4" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <Label className="text-sm font-medium cursor-pointer">Password & Security</Label>
                                                    <p className="text-xs text-muted-foreground">Update password, 2FA</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                    </div>

                                    <Separator />

                                    <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/30">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Log Out
                                    </Button>

                                </CardContent>
                            </Card>
                        </motion.div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function Tag({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l5 5a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828l-5-5z" />
            <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
        </svg>
    )
}
