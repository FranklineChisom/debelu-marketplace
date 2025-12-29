"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Copy,
    CheckCircle,
    Share2,
    MessageCircle,
    Instagram,
    Twitter,
    Facebook,
    Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatNaira } from "@/lib/utils";

interface ShareSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    text?: string;
    url: string;
    image?: string;
    price?: number;
}

export function ShareSheet({
    isOpen,
    onClose,
    title,
    text,
    url,
    image,
    price,
}: ShareSheetProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleNativeShare = async () => {
        try {
            await navigator.share({
                title,
                text: text || title,
                url,
            });
            onClose();
        } catch (err) {
            // User cancelled or web share not supported
        }
    };

    const shareOptions = [
        {
            name: "WhatsApp",
            icon: MessageCircle,
            color: "bg-green-500",
            url: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
        },
        {
            name: "Instagram",
            icon: Instagram,
            color: "bg-gradient-to-br from-purple-500 to-pink-500",
            url: null, // Instagram doesn't support direct sharing from web
        },
        {
            name: "Twitter",
            icon: Twitter,
            color: "bg-sky-500",
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                title
            )}&url=${encodeURIComponent(url)}`,
        },
        {
            name: "Facebook",
            icon: Facebook,
            color: "bg-blue-600",
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                url
            )}`,
        },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/50"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl safe-bottom"
                    >
                        {/* Handle */}
                        <div className="flex justify-center py-3">
                            <div className="w-10 h-1 rounded-full bg-muted" />
                        </div>

                        <div className="px-4 pb-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-display text-lg font-bold">Share</h2>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Preview Card */}
                            <div className="flex gap-3 p-3 mb-4 rounded-xl bg-muted/50">
                                {image && (
                                    <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                                        No img
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm line-clamp-2">{title}</p>
                                    {price && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {formatNaira(price)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Share Options */}
                            <div className="flex justify-center gap-6 mb-6">
                                {shareOptions.map((option) => (
                                    <a
                                        key={option.name}
                                        href={option.url || undefined}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => !option.url && handleNativeShare()}
                                        className="flex flex-col items-center gap-2"
                                    >
                                        <div
                                            className={cn(
                                                "w-12 h-12 rounded-full flex items-center justify-center",
                                                option.color
                                            )}
                                        >
                                            <option.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-xs">{option.name}</span>
                                    </a>
                                ))}
                            </div>

                            {/* Copy Link */}
                            <Button
                                variant="outline"
                                onClick={handleCopy}
                                className="w-full"
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2 text-success" />
                                        Link Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy Link
                                    </>
                                )}
                            </Button>

                            {/* Native Share (if supported) */}
                            {"share" in navigator && (
                                <Button onClick={handleNativeShare} className="w-full mt-2">
                                    <Share2 className="w-4 h-4 mr-2" />
                                    More Options
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Quick share button component
interface ShareButtonProps {
    url: string;
    title: string;
    text?: string;
    className?: string;
}

export function ShareButton({ url, title, text, className }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
            } catch {
                setIsOpen(true);
            }
        } else {
            setIsOpen(true);
        }
    };

    return (
        <>
            <button
                onClick={handleShare}
                className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors",
                    className
                )}
            >
                <Share2 className="w-5 h-5" />
            </button>

            <ShareSheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={title}
                text={text}
                url={url}
            />
        </>
    );
}
