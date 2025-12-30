"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Map as MapIcon, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores";
import { Button } from "@/components/ui/button";

interface DeliveryMapProps {
    orderId?: string;
    deliveryAddress?: string;
    currentLocation?: string;
    eta?: string;
    className?: string;
}

export function DeliveryMap({
    orderId,
    deliveryAddress = "Moremi Hall, UNILAG",
    currentLocation = "Main Gate",
    eta = "15 mins",
    className
}: DeliveryMapProps) {
    const openPanel = useChatStore((state) => state.openPanel);

    return (
        <div className={cn("relative w-full h-full bg-slate-100 rounded-xl overflow-hidden border border-border", className)}>
            <div className="absolute top-4 left-4 z-50">
                <Button
                    variant="secondary"
                    size="sm"
                    className="shadow-md bg-background/90 backdrop-blur-sm hover:bg-background/100"
                    onClick={() => openPanel('order_detail')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div>

            {/* Mock Map Background */}
            <div className="absolute inset-0 opacity-50 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=6.5158,3.3898&zoom=15&size=600x300&style=feature:all|element:all|saturation:-100&key=YOUR_API_KEY')] bg-cover bg-center">
                {/* Fallback pattern if image fails */}
                <div className="w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            {/* Map UI Elements */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">

                {/* Status Pill */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="self-center bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-border/50 flex items-center gap-2 pointer-events-auto mt-12"
                >
                    <Navigation className="w-4 h-4 text-primary fill-primary animate-pulse" />
                    <span className="text-xs font-medium">Rider is {eta} away</span>
                </motion.div>

                {/* Markers - Positioned absolutely relative to container */}
                <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                    <div className="relative">
                        <div className="w-8 h-8 bg-primary/20 rounded-full animate-ping absolute inset-0" />
                        <div className="w-8 h-8 bg-background rounded-full shadow-md flex items-center justify-center relative z-10 border-2 border-primary">
                            <Navigation className="w-4 h-4 text-primary fill-primary transform rotate-45" />
                        </div>
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-background/90 px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap shadow-sm">
                            Rider
                        </div>
                    </div>
                </div>

                <div className="absolute top-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                    <div className="relative group">
                        <MapPin className="w-8 h-8 text-destructive -mt-8" />
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-background/90 px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap shadow-sm">
                            {deliveryAddress}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="self-end mt-auto flex gap-2 pointer-events-auto">
                    <button className="bg-background/90 p-2 rounded-lg shadow-sm border hover:bg-muted transition-colors">
                        <MapIcon className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>
            </div>
        </div>
    );
}
