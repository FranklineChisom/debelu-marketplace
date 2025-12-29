"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    MessageSquare,
    ShoppingBag,
    Bell,
    MapPin,
    CheckCircle,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const onboardingSteps = [
    {
        icon: MessageSquare,
        title: "Chat to Shop",
        description:
            "Tell our AI what you're looking for and we'll find the best products on your campus.",
        image: "/onboarding/chat.png",
    },
    {
        icon: ShoppingBag,
        title: "Campus Marketplace",
        description:
            "Discover products from vendors right on your campus. Fast delivery, trusted sellers.",
        image: "/onboarding/marketplace.png",
    },
    {
        icon: Bell,
        title: "Price Alerts & Tracking",
        description:
            "Save items to your wishlist and get notified when prices drop or when your order is ready.",
        image: "/onboarding/alerts.png",
    },
    {
        icon: MapPin,
        title: "Same-Day Delivery",
        description:
            "Get your items delivered right to your hostel or faculty building. It's that easy.",
        image: "/onboarding/delivery.png",
    },
];

export default function BuyerOnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);

    const isLastStep = currentStep === onboardingSteps.length - 1;

    const nextStep = () => {
        if (isLastStep) {
            router.push("/chat");
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const skip = () => {
        router.push("/chat");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Skip Button */}
            <header className="flex justify-end p-4 safe-top">
                <button
                    onClick={skip}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    Skip
                </button>
            </header>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="text-center max-w-sm"
                    >
                        {/* Icon */}
                        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-primary/10 flex items-center justify-center">
                            {(() => {
                                const Icon = onboardingSteps[currentStep].icon;
                                return <Icon className="w-10 h-10 text-primary" />;
                            })()}
                        </div>

                        {/* Illustration Placeholder */}
                        <div className="w-full aspect-square max-w-64 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                            <Sparkles className="w-16 h-16 text-primary/30" />
                        </div>

                        {/* Title & Description */}
                        <h1 className="font-display text-2xl font-bold mb-3">
                            {onboardingSteps[currentStep].title}
                        </h1>
                        <p className="text-muted-foreground">
                            {onboardingSteps[currentStep].description}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom */}
            <div className="p-6 safe-bottom">
                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mb-6">
                    {onboardingSteps.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentStep(i)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                i === currentStep
                                    ? "bg-primary w-6"
                                    : i < currentStep
                                        ? "bg-primary/50"
                                        : "bg-muted"
                            )}
                        />
                    ))}
                </div>

                {/* CTA Button */}
                <Button onClick={nextStep} className="w-full" size="lg">
                    {isLastStep ? (
                        <>
                            Get Started
                            <CheckCircle className="w-4 h-4 ml-2" />
                        </>
                    ) : (
                        <>
                            Continue
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
