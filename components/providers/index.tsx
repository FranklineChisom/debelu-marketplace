"use client";

import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";

interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <QueryProvider>
            <ThemeProvider>
                <StoreInitializer />
                {children}
            </ThemeProvider>
        </QueryProvider>
    );
}

import { useEffect, useRef } from "react";
import { useMarketplaceStore } from "@/stores/useMarketplaceStore";

function StoreInitializer() {
    const fetchInitialData = useMarketplaceStore((state) => state.fetchInitialData);
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            fetchInitialData();
            initialized.current = true;
        }
    }, [fetchInitialData]);

    return null;
}
