"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatNaira } from "@/lib/utils";

export function RevenueChart() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const generated = months.map(month => ({
            name: month,
            value: Math.floor(Math.random() * 5000000) + 1000000
        }));
        setData(generated);
    }, []);

    const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero

    if (data.length === 0) {
        return <div className="w-full h-[300px] flex items-center justify-center text-muted-foreground">Loading chart...</div>;
    }

    return (
        <div className="w-full h-[300px] flex items-end justify-between gap-2 pt-10 pb-2">
            {data.map((item, i) => {
                const height = (item.value / maxValue) * 100;
                return (
                    <div key={item.name} className="flex flex-col items-center gap-2 flex-1 group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {formatNaira(item.value)}
                        </div>

                        {/* Bar */}
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                            className="w-full bg-primary/20 hover:bg-primary/80 transition-colors rounded-t-sm"
                        />

                        {/* Label */}
                        <span className="text-[10px] text-muted-foreground">{item.name}</span>
                    </div>
                );
            })}
        </div>
    );
}
