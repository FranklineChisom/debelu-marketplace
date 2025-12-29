import { cn } from "@/lib/utils";

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-xl bg-muted",
                className
            )}
            {...props}
        />
    );
}

function SkeletonText({
    className,
    lines = 1,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) {
    return (
        <div className={cn("space-y-2", className)} {...props}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn(
                        "h-4",
                        i === lines - 1 && lines > 1 && "w-3/4"
                    )}
                />
            ))}
        </div>
    );
}

function SkeletonCard({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("rounded-2xl border p-5 space-y-4", className)}
            {...props}
        >
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    );
}

function SkeletonAvatar({
    className,
    size = "default",
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    size?: "sm" | "default" | "lg";
}) {
    return (
        <Skeleton
            className={cn(
                "rounded-full",
                size === "sm" && "h-8 w-8",
                size === "default" && "h-10 w-10",
                size === "lg" && "h-14 w-14",
                className
            )}
            {...props}
        />
    );
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar };
