"use client";

import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatNaira } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: number | string;
    change?: number;
    trend?: "up" | "down" | "neutral";
    formatter?: "currency" | "number" | "rating" | "none";
    icon?: LucideIcon;
    chartData?: any[];
    chartColor?: string;
    variant?: "default" | "analytics";
    className?: string;
}

export function StatCard({
    label,
    value,
    change,
    trend,
    formatter = "none",
    icon: Icon,
    chartData,
    chartColor,
    variant = "default",
    className
}: StatCardProps) {
    // Determine trend if not provided but change is
    const derivedTrend = trend || (change && change > 0 ? "up" : change && change < 0 ? "down" : "neutral");

    const formattedValue = () => {
        if (typeof value === "string") return value;
        if (formatter === "currency") return formatNaira(value);
        if (formatter === "rating") return value.toFixed(1);
        if (formatter === "number") return value.toLocaleString();
        return value;
    };

    if (variant === "analytics") {
        const isPositive = derivedTrend === "up";
        return (
            <Card className={cn("border-border/50 overflow-hidden relative", className)}>
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        {Icon && (
                            <div className="p-2 bg-primary/5 rounded-xl text-primary">
                                <Icon className="w-5 h-5" />
                            </div>
                        )}
                        {change !== undefined && (
                            <Badge variant={isPositive ? "default" : "destructive"} className={cn(
                                "border-0",
                                isPositive ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                            )}>
                                {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {Math.abs(change)}%
                            </Badge>
                        )}
                    </div>

                    <div className="space-y-1 z-10 relative">
                        <h3 className="text-2xl font-bold tracking-tight">{formattedValue()}</h3>
                        <p className="text-xs text-muted-foreground">{label}</p>
                    </div>

                    {/* Mini background chart */}
                    {chartData && chartColor && (
                        <div className="absolute bottom-0 right-0 w-[120px] h-[60px] opacity-20 pointer-events-none">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke={chartColor}
                                        strokeWidth={2}
                                        fill={chartColor}
                                        fillOpacity={0.2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    // Default Dashboard Variant
    return (
        <Card className={cn("border-foreground/10 hover:border-foreground/30 transition-colors", className)}>
            <CardContent className="p-5 lg:p-6 xl:p-8">
                <div className="flex items-start justify-between mb-4">
                    <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        {label}
                    </span>
                    {change !== undefined && (
                        <span className={cn(
                            "text-xs font-bold",
                            derivedTrend === "up" ? "text-emerald-400" : derivedTrend === "down" ? "text-red-400" : "text-muted-foreground"
                        )}>
                            {derivedTrend === "up" ? "+" : ""}{change}%
                        </span>
                    )}
                </div>
                <p className="text-2xl lg:text-3xl font-black tracking-tight" style={{ wordBreak: 'break-word' }}>
                    {formattedValue()}
                </p>
            </CardContent>
        </Card>
    );
}
