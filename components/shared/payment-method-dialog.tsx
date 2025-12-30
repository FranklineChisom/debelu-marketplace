"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Lock } from "lucide-react"
import { PaymentMethod } from "@/types/user"

interface PaymentMethodDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (paymentMethod: PaymentMethod) => void;
}

export function PaymentMethodDialog({ isOpen, onClose, onSave }: PaymentMethodDialogProps) {
    const [formData, setFormData] = useState({
        cardNumber: "",
        expiry: "",
        cvc: "",
        cardHolder: ""
    });

    // Reset form when dialog opens
    useEffect(() => {
        if (isOpen) {
            setFormData({ cardNumber: "", expiry: "", cvc: "", cardHolder: "" });
        }
    }, [isOpen]);

    const handleChange = (field: string, value: string) => {
        let formattedValue = value;

        if (field === "cardNumber") {
            // Remove non-digits and limit to 16
            const digits = value.replace(/\D/g, '').substring(0, 16);
            // Add space every 4 digits
            formattedValue = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
        } else if (field === "expiry") {
            // Remove non-digits and limit to 4
            const digits = value.replace(/\D/g, '').substring(0, 4);
            if (digits.length >= 2) {
                formattedValue = `${digits.substring(0, 2)}/${digits.substring(2)}`;
            } else {
                formattedValue = digits;
            }
        } else if (field === "cvc") {
            formattedValue = value.replace(/\D/g, '').substring(0, 3);
        }

        setFormData(prev => ({ ...prev, [field]: formattedValue }));
    };

    const handleSave = () => {
        // Basic validation mock
        if (formData.cardNumber.length < 16) return; // very basic check

        // Mocking the card type detection
        const type = Math.random() > 0.5 ? "Visa" : "Mastercard";
        const last4 = formData.cardNumber.replace(/\s/g, '').slice(-4);

        const newPaymentMethod: PaymentMethod = {
            id: crypto.randomUUID(),
            type,
            last4,
            expiry: formData.expiry,
            cardHolder: formData.cardHolder.toUpperCase(),
            isDefault: false,
            // Random dark gradient
            gradient: Math.random() > 0.5
                ? "from-neutral-900 to-neutral-800"
                : "from-slate-900 to-slate-800"
        };

        onSave(newPaymentMethod);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                    <DialogDescription>
                        Enter your card details to securely save this payment method.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Card Number</Label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-9"
                                placeholder="0000 0000 0000 0000"
                                value={formData.cardNumber}
                                onChange={(e) => handleChange("cardNumber", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Expiry Date</Label>
                            <Input
                                placeholder="MM/YY"
                                value={formData.expiry}
                                onChange={(e) => handleChange("expiry", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>CVC</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    placeholder="123"
                                    type="password"
                                    value={formData.cvc}
                                    onChange={(e) => handleChange("cvc", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Cardholder Name</Label>
                        <Input
                            placeholder="JOHN DOE"
                            value={formData.cardHolder}
                            onChange={(e) => handleChange("cardHolder", e.target.value)}
                        />
                    </div>

                    <div className="bg-muted/30 p-3 rounded-lg flex items-start gap-3 text-xs text-muted-foreground">
                        <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p>Your payment information is encrypted and stored securely. We never store your full card number.</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={!formData.cardNumber || !formData.expiry || !formData.cvc || !formData.cardHolder}>Save Card</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
