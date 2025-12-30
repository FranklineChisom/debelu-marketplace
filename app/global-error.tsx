"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global error:", error);
    }, [error]);

    return (
        <html>
            <body className="bg-background text-foreground antialiased overflow-hidden">
                <div className="min-h-screen flex items-center justify-center p-4 relative">
                    {/* Background Effects */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/10 blur-[120px] rounded-full mix-blend-multiply opacity-50" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full mix-blend-multiply opacity-50" />
                    </div>

                    <div className="max-w-md w-full text-center space-y-6 relative z-10">
                        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-red-600"
                            >
                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                                <path d="M12 9v4" />
                                <path d="M12 17h.01" />
                            </svg>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-black tracking-tight">Something went wrong!</h1>
                            <p className="text-muted-foreground text-lg">
                                Don't worry, our team has been notified. Let's try refreshing the page.
                            </p>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                            <button
                                onClick={reset}
                                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            >
                                Try Again
                            </button>
                            <div className="text-xs text-muted-foreground pt-4 font-mono opacity-50">
                                Error Code: {error.digest || "UNKNOWN_ERROR"}
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
