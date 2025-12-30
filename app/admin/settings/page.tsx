"use client";

import { useState } from "react";
import { useMarketplaceStore } from "@/stores/useMarketplaceStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Save, AlertTriangle } from "lucide-react";

export default function AdminSettingsPage() {
    const platformSettings = useMarketplaceStore((state) => state.platformSettings);
    const updatePlatformSettings = useMarketplaceStore((state) => state.updatePlatformSettings);

    const [formState, setFormState] = useState(platformSettings);

    const handleSave = () => {
        updatePlatformSettings(formState);
        toast.success("Platform settings updated successfully");
    };

    return (
        <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
                <p className="text-muted-foreground mt-1">Configure marketplace fees, limits, and operational modes.</p>
            </header>

            <div className="space-y-8">
                {/* Financials */}
                <section className="space-y-4 border p-6 rounded-2xl bg-card">
                    <h2 className="text-xl font-semibold">Financial Configuration</h2>
                    <Separator />
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="commission">Commission Rate (%)</Label>
                            <Input
                                id="commission"
                                type="number"
                                value={formState.commissionRate}
                                onChange={(e) => setFormState({ ...formState, commissionRate: Number(e.target.value) })}
                            />
                            <p className="text-xs text-muted-foreground">Percentage taken from each order.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="withdrawalFee">Withdrawal Fee (₦)</Label>
                            <Input
                                id="withdrawalFee"
                                type="number"
                                value={formState.withdrawalFee}
                                onChange={(e) => setFormState({ ...formState, withdrawalFee: Number(e.target.value) })}
                            />
                            <p className="text-xs text-muted-foreground">Fixed fee per withdrawal request.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minWithdrawal">Minimum Withdrawal (₦)</Label>
                            <Input
                                id="minWithdrawal"
                                type="number"
                                value={formState.minWithdrawal}
                                onChange={(e) => setFormState({ ...formState, minWithdrawal: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                </section>

                {/* Operations */}
                <section className="space-y-4 border p-6 rounded-2xl bg-card">
                    <h2 className="text-xl font-semibold">Operations</h2>
                    <Separator />
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">New Registrations</Label>
                                <p className="text-sm text-muted-foreground">Allow new users and vendors to sign up.</p>
                            </div>
                            <Switch
                                checked={formState.allowNewRegistrations}
                                onCheckedChange={(checked) => setFormState({ ...formState, allowNewRegistrations: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between border-t pt-6">
                            <div className="space-y-0.5">
                                <Label className="text-base text-amber-600 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" /> Maintenance Mode
                                </Label>
                                <p className="text-sm text-muted-foreground">Disable all marketplace transactions temporarily.</p>
                            </div>
                            <Switch
                                checked={formState.maintenanceMode}
                                onCheckedChange={(checked) => setFormState({ ...formState, maintenanceMode: checked })}
                            />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <Button size="lg" onClick={handleSave} className="gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}
