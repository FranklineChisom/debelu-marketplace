"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { MapPin, Briefcase, Home } from "lucide-react"

export interface Address {
    id: string;
    type: "Home" | "Work" | "Other";
    label: string;
    description: string;
    phone: string;
    isDefault: boolean;
}

interface AddressDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (address: Address) => void;
    initialData?: Address | null;
}

export function AddressDialog({ isOpen, onClose, onSave, initialData }: AddressDialogProps) {
    const defaultAddress: Address = {
        id: "",
        type: "Home",
        label: "",
        description: "",
        phone: "",
        isDefault: false
    };

    const [formData, setFormData] = useState<Address>(defaultAddress);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || { ...defaultAddress, id: crypto.randomUUID() });
        }
    }, [isOpen, initialData]);

    const handleChange = (field: keyof Address, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Address" : "Add New Address"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Update your address details below." : "Enter the details for your new delivery location."}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Address Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(val: "Home" | "Work" | "Other") => handleChange("type", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Home"><span className="flex items-center gap-2"><Home className="w-4 h-4" /> Home</span></SelectItem>
                                    <SelectItem value="Work"><span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> Work</span></SelectItem>
                                    <SelectItem value="Other"><span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Other</span></SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Label (Optional)</Label>
                            <Input
                                placeholder="e.g. My Apartment"
                                value={formData.label}
                                onChange={(e) => handleChange("label", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Full Address</Label>
                        <Input
                            placeholder="Street address, City, State"
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input
                            placeholder="+234..."
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-between border rounded-lg p-3 bg-muted/20">
                        <div className="space-y-0.5">
                            <Label className="text-base">Set as Default</Label>
                            <p className="text-xs text-muted-foreground">Use this address for checkout by default</p>
                        </div>
                        <Switch
                            checked={formData.isDefault}
                            onCheckedChange={(checked) => handleChange("isDefault", checked)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Address</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
