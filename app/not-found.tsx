"use client";

import { ErrorState } from "@/components/ui/error-state";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <ErrorState
                type="notFound"
                title="Page Not Found"
                message="Sorry, we couldn't find the page you're looking for. It may have been moved or deleted."
                showHomeButton={false}
            >
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Link href="/">
                        <Button>
                            <Home className="w-4 h-4 mr-2" />
                            Go Home
                        </Button>
                    </Link>
                    <Link href="/search">
                        <Button variant="outline">
                            <Search className="w-4 h-4 mr-2" />
                            Search Products
                        </Button>
                    </Link>
                </div>
            </ErrorState>
        </div>
    );
}
