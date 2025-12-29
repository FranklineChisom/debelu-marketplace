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
        // Log error to monitoring service (e.g., Sentry)
        console.error("Global error:", error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center p-4">
                    <ErrorState
                        type="generic"
                        title="Something went wrong"
                        message="We're sorry, an unexpected error occurred. Our team has been notified."
                        onRetry={reset}
                        showHomeButton={true}
                        showSupportButton={true}
                    />
                </div>
            </body>
        </html>
    );
}
