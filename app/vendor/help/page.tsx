"use client";

import { motion } from "framer-motion";
import {
    Search,
    Book,
    MessageCircle,
    Phone,
    Mail,
    ChevronDown,
    ExternalLink,
    Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function HelpSupportPage() {
    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-4xl mx-auto space-y-8 py-8"
        >
            {/* Header */}
            <motion.div variants={fadeInUp} className="text-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">How can we help you?</h1>
                <div className="max-w-md mx-auto relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input className="pl-9 bg-background/50 backdrop-blur-sm" placeholder="Search for help articles..." />
                </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Quick Links */}
                <motion.div variants={fadeInUp} className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
                            <CardDescription>Common questions from other vendors.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>How do I withdraw my earnings?</AccordionTrigger>
                                    <AccordionContent>
                                        Go to Settings &gt; Payments &amp; Payouts. Click "Request Payout", enter the amount, and select your linked bank account. Withdrawals are processed within 24 hours.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>How do I add a new product?</AccordionTrigger>
                                    <AccordionContent>
                                        Navigate to the Products page and click the "Add Product" button. Fill in the details, upload images, set your price and inventory, then click Save.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>What are the platform fees?</AccordionTrigger>
                                    <AccordionContent>
                                        Debelu charges a flat 5% commission on all successful sales. There are no monthly subscription fees or listing fees.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>How does shipping work?</AccordionTrigger>
                                    <AccordionContent>
                                        You can configure your own shipping rates in Settings &gt; Shipping. Alternatively, you can use our integrated logistics partners for automated pickup and delivery.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Vendor Guides</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div
                                onClick={() => toast.info("Getting Started Guide coming soon!")}
                                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Book className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium group-hover:text-primary transition-colors">Getting Started Guide</p>
                                        <p className="text-xs text-muted-foreground">Learn the basics of selling on Debelu.</p>
                                    </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div
                                onClick={() => toast.info("Packaging Guidelines coming soon!")}
                                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <Package className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium group-hover:text-primary transition-colors">Packaging Guidelines</p>
                                        <p className="text-xs text-muted-foreground">Best practices for safe shipping.</p>
                                    </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Contact Options */}
                <motion.div variants={fadeInUp} className="space-y-6">
                    <Card className="bg-primary text-primary-foreground border-none shadow-lg">
                        <CardHeader>
                            <CardTitle>Need more help?</CardTitle>
                            <CardDescription className="text-primary-foreground/80">
                                Our support team is available 24/7.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                variant="secondary"
                                className="w-full justify-start gap-3"
                                onClick={() => toast.success("Starting live chat...")}
                            >
                                <MessageCircle className="w-4 h-4" />
                                Live Chat
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full justify-start gap-3"
                                onClick={() => toast.success("Email client opened!")}
                            >
                                <Mail className="w-4 h-4" />
                                Email Support
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full justify-start gap-3"
                                onClick={() => toast.success("Calling support...")}
                            >
                                <Phone className="w-4 h-4" />
                                Call Us
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
