"use client";

import { cn } from "@/lib/utils";
import { formatNaira } from "@/lib/utils";

interface RevenueChartProps {
    data: {
        label: string;
        value: number;
    }[];
    className?: string;
}

export function RevenueChart({ data, className }: RevenueChartProps) {
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex items-end justify-between h-40 gap-1">
                {data.map((item, i) => {
                    const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                    return (
                        <div
                            key={i}
                            className="flex-1 flex flex-col items-center justify-end gap-1"
                        >
                            <div
                                className="w-full bg-primary/80 rounded-t-lg transition-all hover:bg-primary"
                                style={{ height: `${height}%`, minHeight: item.value > 0 ? "8px" : "0" }}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
                {data.map((item, i) => (
                    <span key={i} className="flex-1 text-center truncate px-0.5">
                        {item.label}
                    </span>
                ))}
            </div>
        </div>
    );
}

interface StatsPieChartProps {
    data: {
        label: string;
        value: number;
        color: string;
    }[];
    className?: string;
}

export function StatsPieChart({ data, className }: StatsPieChartProps) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let cumulativePercent = 0;

    return (
        <div className={cn("relative", className)}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
                {data.map((item, i) => {
                    const percent = (item.value / total) * 100;
                    const startAngle = cumulativePercent * 3.6;
                    cumulativePercent += percent;
                    const endAngle = cumulativePercent * 3.6;

                    const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                    const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                    const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
                    const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);

                    const largeArc = percent > 50 ? 1 : 0;

                    return (
                        <path
                            key={i}
                            d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                            fill={item.color}
                            className="transition-opacity hover:opacity-80"
                        />
                    );
                })}
                <circle cx="50" cy="50" r="25" className="fill-background" />
            </svg>

            {/* Legend */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-bold">{formatNaira(total)}</p>
                    <p className="text-[10px] text-muted-foreground">Total</p>
                </div>
            </div>
        </div>
    );
}

interface TrendSparklineProps {
    data: number[];
    positive?: boolean;
    className?: string;
}

export function TrendSparkline({
    data,
    positive = true,
    className,
}: TrendSparklineProps) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data
        .map((value, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - ((value - min) / range) * 80 - 10;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <svg viewBox="0 0 100 40" className={cn("w-20 h-8", className)}>
            <polyline
                points={points}
                fill="none"
                stroke={positive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
