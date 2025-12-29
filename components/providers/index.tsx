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
                {children}
            </ThemeProvider>
        </QueryProvider>
    );
}
