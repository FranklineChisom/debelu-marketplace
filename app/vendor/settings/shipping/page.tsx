"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft,
    Truck,
    MapPin,
    Plus,
    Save,
    Trash2,
    Info,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { CAMPUSES } from "@/lib/constants";

export default function ShippingSettingsPage() {
    const [allowPickup, setAllowPickup] = useState(true);
    const [deliveryZones, setDeliveryZones] = useState([
        { id: 1, name: "Unilag Campus", fee: 500, duration: "24 hours" },
        { id: 2, name: "Yaba & Ebutte Metta", fee: 1000, duration: "1-2 days" },
    ]);

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
                    <h1 className="text-2xl font-bold tracking-tight">Shipping & Delivery</h1>
                    <p className="text-muted-foreground text-sm">
                        Configure how your products get to your customers.
                    </p>
                </div>
            </motion.div>

            <div className="grid gap-8">
                {/* Delivery Zones */}
                <motion.div variants={fadeInUp}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-amber-500" />
                                    Delivery Zones
                                </CardTitle>
                                <CardDescription>
                                    Set delivery fees for different locations.
                                </CardDescription>
                            </div>
                            <Button size="sm" className="gap-2">
                                <Plus className="w-4 h-4" /> Add Zone
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {deliveryZones.map((zone) => (
                                <div key={zone.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/20 transition-colors">
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold">{zone.name}</h3>
                                            <Badge variant="outline" className="text-[10px] font-normal">
                                                {zone.duration}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg">
                                            <span className="text-xs text-muted-foreground">Fee:</span>
                                            <span className="font-mono font-bold">₦{zone.fee}</span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex gap-3 text-sm text-blue-700">
                                <Info className="w-5 h-5 flex-shrink-0" />
                                <p>
                                    <strong>Tip:</strong> Keep your delivery fees reasonable. High shipping costs are the #1 reason for abandoned carts.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Pickup Options */}
                <motion.div variants={fadeInUp}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-amber-500" />
                                Pickup Options
                            </CardTitle>
                            <CardDescription>
                                Allow customers to pick up orders from your physical store.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Enable Store Pickup</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Customers will see "Pickup" as an option at checkout.
                                    </p>
                                </div>
                                <Switch checked={allowPickup} onCheckedChange={setAllowPickup} />
                            </div>

                            {allowPickup && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="p-4 rounded-xl border bg-muted/10 space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label>Pickup Instructions</Label>
                                        <textarea
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                            placeholder="e.g., Call when you arrive at Mariere Hall gate."
                                            defaultValue="Please bring your order confirmation ID. Open 9am - 6pm."
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="flex justify-end">
                <Button size="lg" className="gap-2">
                    <Save className="w-4 h-4" /> Save Configuration
                </Button>
            </div>
        </motion.div>
    );
}
