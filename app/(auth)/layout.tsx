import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="h-16 flex items-center justify-center px-4 safe-top">
                <Link
                    href="/"
                    className="font-display text-xl font-bold tracking-tight"
                >
                    Debelu.
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-sm">{children}</div>
            </main>

            {/* Background Grid */}
            <div className="fixed inset-0 -z-10 bg-grid bg-grid-fade" />
        </div>
    );
}
