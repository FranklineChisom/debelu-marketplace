"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft,
    Upload,
    Camera,
    Store,
    MapPin,
    Phone,
    Globe,
    Instagram,
    Save,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast"; // Assuming this exists, or use console log
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { CAMPUSES } from "@/lib/constants";

export default function StoreSettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    // const { toast } = useToast(); // If using shadcn/ui toast
    const [formData, setFormData] = useState({
        storeName: "TechHub NG",
        description: "Your #1 source for premium gadgets, laptops, and accessories on campus. We deliver quality products at student-friendly prices.",
        campus: "unilag",
        address: "Shop C4, Mariere Hall Complex",
        phone: "08123456789",
        whatsapp: "08123456789",
        instagram: "techhub_ng",
        website: "www.techhub.ng"
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setIsLoading(false);
        // toast({ title: "Changes saved", description: "Your store profile has been updated." });
        alert("Changes saved successfully!");
    };

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
                    <h1 className="text-2xl font-bold tracking-tight">Store Profile</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage how your store appears to customers on Debelu.
                    </p>
                </div>
                <div className="ml-auto">
                    <Button onClick={handleSave} disabled={isLoading} className="gap-2">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </Button>
                </div>
            </motion.div>

            <div className="grid gap-8">
                {/* Branding Section */}
                <motion.div variants={fadeInUp}>
                    <Card className="border-border/50 overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b border-border/50">
                            <CardTitle className="flex items-center gap-2">
                                <Store className="w-5 h-5 text-primary" />
                                Branding
                            </CardTitle>
                            <CardDescription>
                                Your store's visual identity.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            {/* Banner Image Mock */}
                            <div className="space-y-4">
                                <Label>Store Banner</Label>
                                <div className="h-48 w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 relative group overflow-hidden">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="secondary" className="gap-2">
                                            <Camera className="w-4 h-4" /> Change Banner
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">Recommended size: 1200x400px. Shows at the top of your shop page.</p>
                            </div>

                            {/* Logo Mock */}
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>TH</AvatarFallback>
                                    </Avatar>
                                    <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full shadow-md hover:scale-110 transition-transform">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-medium">Store Logo</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs">
                                        This logo will appear on your profile, products, and order receipts.
                                    </p>
                                    <Button variant="outline" size="sm" className="mt-2 text-xs h-8">Remove Logo</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Details Section */}
                <motion.div variants={fadeInUp}>
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Tell customers about your business.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="storeName">Store Name</Label>
                                    <Input
                                        id="storeName"
                                        value={formData.storeName}
                                        onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                        className="font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="campus">Main Campus</Label>
                                    <select
                                        id="campus"
                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.campus}
                                        onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                                    >
                                        {CAMPUSES.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">About the Store</Label>
                                <Textarea
                                    id="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="resize-none"
                                />
                                <p className="text-xs text-muted-foreground text-right">
                                    {formData.description.length}/500 characters
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Contact Section */}
                <motion.div variants={fadeInUp}>
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle>Contact & Socials</CardTitle>
                            <CardDescription>
                                How can customers reach you?
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        Display Phone Number
                                    </Label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-bold">W</div>
                                        WhatsApp Number
                                    </Label>
                                    <Input
                                        value={formData.whatsapp}
                                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Instagram className="w-4 h-4 text-muted-foreground" />
                                        Instagram Handle
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                                        <Input
                                            className="pl-8"
                                            value={formData.instagram}
                                            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-muted-foreground" />
                                        Website (Optional)
                                    </Label>
                                    <Input
                                        placeholder="https://"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    Pickup Address
                                </Label>
                                <Input
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">Keep this empty if you don't accept pickups.</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
