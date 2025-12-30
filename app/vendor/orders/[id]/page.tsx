"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft,
    Clock,
    User,
    MapPin,
    Phone,
    Copy,
    MessageSquare,
    Truck,
    Package,
    CheckCircle2,
    Printer,
    MoreHorizontal
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatNaira, formatRelativeTime, cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
    const [status, setStatus] = useState<"pending" | "processing" | "delivering" | "delivered">("pending");

    // Mock Order Data
    const order = {
        id: params.id || "ORD-5521",
        date: "Oct 24, 2025 at 4:30 PM",
        customer: {
            name: "Chioma Adebayo",
            email: "chioma.ade@student.unilag.edu.ng",
            phone: "+234 812 345 6789",
            avatar: "CA"
        },
        address: {
            line1: "Room 234, Moremi Hall",
            line2: "University of Lagos, Akoka",
            city: "Yaba",
            state: "Lagos"
        },
        items: [
            { name: "Dell Inspiron 15 Laptop 3620", price: 165000, qty: 1, image: "", variant: "Silver / 512GB" },
            { name: "USB-C Hub 7-in-1", price: 12500, qty: 1, image: "", variant: "Space Grey" }
        ],
        summary: {
            subtotal: 177500,
            shipping: 1500,
            total: 179000
        }
    };

    const statuses = ["pending", "processing", "delivering", "delivered"];
    const currentStatusIndex = statuses.indexOf(status);

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-5xl mx-auto space-y-8 py-4 lg:py-8"
        >
            {/* Header */}
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/vendor/orders">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight font-mono">Order #{order.id}</h1>
                            <Badge variant="outline" className="uppercase text-[10px] tracking-wider bg-orange-500/10 text-orange-600 border-orange-200">
                                {status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3" />
                            Placed on {order.date}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Printer className="w-4 h-4 mr-2" /> Print Invoice
                    </Button>
                    {status === "pending" && (
                        <Button onClick={() => setStatus("processing")} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                            Confirm Order
                        </Button>
                    )}
                    {status === "processing" && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">
                                    <Truck className="w-4 h-4 mr-2" /> Dispatch Runner
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Dispatch Order</DialogTitle>
                                    <DialogDescription>
                                        Assign a delivery runner and set an estimated delivery time.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Delivery Runner / Courier</Label>
                                        <Input placeholder="e.g. Gig Logistics or John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tracking Number / Phone</Label>
                                        <Input placeholder="e.g. +234 800 000 0000" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Estimated Delivery Time</Label>
                                        <Input type="datetime-local" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => setStatus("delivering")} className="w-full">
                                        Confirm Dispatch
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                    {status === "delivering" && (
                        <Button onClick={() => setStatus("delivered")} className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20">
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Delivered
                        </Button>
                    )}
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Status Timeline */}
                    <motion.div variants={fadeInUp}>
                        <Card className="border-border/50">
                            <CardContent className="p-8">
                                <div className="relative flex justify-between">
                                    {/* Connectivity Line */}
                                    <div className="absolute top-4 left-0 w-full h-1 bg-muted -z-10" />
                                    <div
                                        className="absolute top-4 left-0 h-1 bg-primary -z-10 transition-all duration-500"
                                        style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                                    />

                                    {statuses.map((s, i) => {
                                        const isActive = i <= currentStatusIndex;
                                        const isCurrent = i === currentStatusIndex;
                                        return (
                                            <div key={s} className="flex flex-col items-center gap-2">
                                                <div
                                                    className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-background z-10",
                                                        isActive ? "border-primary text-primary" : "border-muted text-muted-foreground",
                                                        isCurrent && "ring-4 ring-primary/20 scale-110"
                                                    )}
                                                >
                                                    {i === 0 && <Package className="w-3.5 h-3.5" />}
                                                    {i === 1 && <Clock className="w-3.5 h-3.5" />}
                                                    {i === 2 && <Truck className="w-3.5 h-3.5" />}
                                                    {i === 3 && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                </div>
                                                <span className={cn(
                                                    "text-xs font-medium uppercase tracking-wider transition-colors duration-300",
                                                    isActive ? "text-foreground" : "text-muted-foreground"
                                                )}>
                                                    {s}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Order Items */}
                    <motion.div variants={fadeInUp}>
                        <Card className="border-border/50">
                            <CardHeader>
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex items-start gap-4 pb-6 border-b border-border/50 last:pb-0 last:border-0">
                                            <div className="w-16 h-16 rounded-lg bg-muted border border-border/50 overflow-hidden flex-shrink-0">
                                                {/* Image Placeholder */}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold text-sm">{item.name}</h3>
                                                        <p className="text-sm text-muted-foreground">{item.variant}</p>
                                                    </div>
                                                    <p className="font-medium text-sm">{formatNaira(item.price)}</p>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-2">Quantity: {item.qty}</p>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span>{formatNaira(order.summary.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Delivery Fee</span>
                                            <span>{formatNaira(order.summary.shipping)}</span>
                                        </div>
                                        <Separator className="my-2" />
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span>{formatNaira(order.summary.total)}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Sidebar - Customer Info */}
                <div className="space-y-6">
                    <motion.div variants={fadeInUp}>
                        <Card className="border-border/50">
                            <CardHeader>
                                <CardTitle>Customer</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10 border">
                                        <AvatarFallback>{order.customer.avatar}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-sm">{order.customer.name}</p>
                                        <p className="text-xs text-muted-foreground">Previous orders: 2</p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-border/50">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-muted-foreground">Contact</p>
                                            <p className="text-sm truncate">{order.customer.email}</p>
                                            <p className="text-sm text-blue-500 hover:underline cursor-pointer">{order.customer.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-muted-foreground">Delivery Address</p>
                                            <p className="text-sm font-medium">{order.address.line1}</p>
                                            <p className="text-xs text-muted-foreground">{order.address.line2}</p>
                                            <p className="text-xs text-muted-foreground">{order.address.city}, {order.address.state}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
