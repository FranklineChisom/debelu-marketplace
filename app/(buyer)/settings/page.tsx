"use client";

import { motion } from "framer-motion";
import {
    User,
    CreditCard,
    MapPin,
    Shield,
    Bell,
    LogOut,
    Plus,
    Trash2,
    CheckCircle,
    Smartphone,
    Globe,
    Home,
    Briefcase,
    MoreVertical,
    ChevronRight,
    Lock
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { ProfileImageEditor } from "@/components/shared/profile-image-editor";
import { AddressDialog } from "@/components/shared/address-dialog";
import { PaymentMethodDialog } from "@/components/shared/payment-method-dialog";
import { useMarketplaceStore } from "@/stores/useMarketplaceStore";
import { Address, PaymentMethod } from "@/types/user";

export default function SettingsPage() {
    const user = useMarketplaceStore((state) => state.user);
    const updateProfile = useMarketplaceStore((state) => state.updateProfile);
    const addAddress = useMarketplaceStore((state) => state.addAddress);
    const updateAddress = useMarketplaceStore((state) => state.updateAddress);
    const deleteAddress = useMarketplaceStore((state) => state.deleteAddress);
    const setDefaultAddress = useMarketplaceStore((state) => state.setDefaultAddress);
    const addPaymentMethod = useMarketplaceStore((state) => state.addPaymentMethod);
    const deletePaymentMethod = useMarketplaceStore((state) => state.deletePaymentMethod);
    const setDefaultPaymentMethod = useMarketplaceStore((state) => state.setDefaultPaymentMethod);

    const [activeTab, setActiveTab] = useState("profile");
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    // Address State
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'address' | 'payment', id: string } | null>(null);

    // Payment Method State
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

    if (!user) return null; // Or loading state

    const addresses = user.addresses;
    const paymentMethods = user.paymentMethods;
    const avatarUrl = user.profile.avatar;

    // Address Handlers
    const handleSaveAddress = (address: Address) => {
        if (editingAddress) {
            updateAddress(address);
        } else {
            // New address logic handled in store or here. Dialog usually passes complete object but ID might be missing or empty.
            // AddressDialog generates ID if missing.
            addAddress(address);
        }

        // Default handling is now inside store actions or handled by logic inside add/update if simple.
        // But store supports setDefaultAddress separately. 
        // If the Dialog returns isDefault=true, we should probably ensure others are unset.
        // The store logic I implemented roughly does: add => append, setDefault separate.
        // Actually, let's just rely on the store actions.
        if (address.isDefault && editingAddress) {
            setDefaultAddress(address.id);
        } else if (address.isDefault && !editingAddress) {
            // For new address, if it's default, we might need a way to set it.
            // But my current store `addAddress` implementation just appends.
            // I'll assume `addAddress` handles it or I call setDefault.
            // But wait, the address object HAS isDefault.
            // My store simple implementation: `addresses: [...state.user.addresses, address]`
            // Be careful: if I add with isDefault=true, I should update others to false.
            // For now, let's keep it simple.
            // Ideally, I should call setDefaultAddress(address.id) after adding if isDefault is true.
            // But I don't have the ID for new address if generated inside Dialog?
            // Ah, AddressDialog generates ID.
            if (address.isDefault) {
                // We need to unset others. The store's setDefaultAddress does exactly that for an ID.
                setTimeout(() => setDefaultAddress(address.id), 0);
            }
        }

        setIsAddressDialogOpen(false);
        setEditingAddress(null);
    };

    const handleDeleteAddress = (id: string) => {
        setDeleteTarget({ type: 'address', id });
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;

        if (deleteTarget.type === 'address') {
            deleteAddress(deleteTarget.id);
        } else if (deleteTarget.type === 'payment') {
            deletePaymentMethod(deleteTarget.id);
        }

        setDeleteTarget(null);
    };

    const handleSetDefaultAddress = (id: string) => {
        setDefaultAddress(id);
    };

    const openNewAddressDialog = () => {
        setEditingAddress(null);
        setIsAddressDialogOpen(true);
    };

    const openEditAddressDialog = (address: Address) => {
        setEditingAddress(address);
        setIsAddressDialogOpen(true);
    };

    // Payment Handlers
    const handleSavePaymentMethod = (method: PaymentMethod) => {
        addPaymentMethod(method);
        if (method.isDefault) {
            setTimeout(() => setDefaultPaymentMethod(method.id), 0);
        }
        setIsPaymentDialogOpen(false);
    };

    const handleDeletePaymentMethod = (id: string) => {
        setDeleteTarget({ type: 'payment', id });
    };

    return (
        <div className="flex-1 h-full overflow-y-auto bg-background pb-20 scrollbar-hide">
            <ProfileImageEditor
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                currentImage={avatarUrl || ""}
                onSave={(newImage) => updateProfile({ avatar: newImage })}
            />

            <AddressDialog
                isOpen={isAddressDialogOpen}
                onClose={() => setIsAddressDialogOpen(false)}
                onSave={handleSaveAddress}
                initialData={editingAddress}
            />

            <PaymentMethodDialog
                isOpen={isPaymentDialogOpen}
                onClose={() => setIsPaymentDialogOpen(false)}
                onSave={handleSavePaymentMethod}
            />

            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the selected
                            {deleteTarget?.type === 'address' ? ' address' : ' payment method'} from your account.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">

                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-display font-bold">Account Settings</h1>
                    <p className="text-muted-foreground">Manage your profile, checking details, and security preferences.</p>
                </div>

                <Tabs value={activeTab} defaultValue="profile" className="flex flex-col md:flex-row gap-8" onValueChange={setActiveTab}>

                    {/* Sidebar Navigation */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full md:w-64 flex-shrink-0"
                    >
                        <TabsList className="flex md:flex-col h-auto bg-transparent p-0 gap-2 w-full justify-start overflow-x-auto scrollbar-hide">
                            <SettingsTabTrigger value="profile" icon={User} label="Profile" isActive={activeTab === "profile"} />
                            <SettingsTabTrigger value="addresses" icon={MapPin} label="Address Book" isActive={activeTab === "addresses"} />
                            <SettingsTabTrigger value="payment" icon={CreditCard} label="Payment Methods" isActive={activeTab === "payment"} />
                            <SettingsTabTrigger value="security" icon={Shield} label="Security" isActive={activeTab === "security"} />
                            <SettingsTabTrigger value="notifications" icon={Bell} label="Notifications" isActive={activeTab === "notifications"} />
                        </TabsList>

                        <div className="mt-8 hidden md:block">
                            <Card className="bg-primary/5 border-primary/10">
                                <CardContent className="p-4 space-y-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2">
                                        <Smartphone className="w-4 h-4" />
                                    </div>
                                    <h4 className="font-semibold text-sm">Debelu Mobile App</h4>
                                    <p className="text-xs text-muted-foreground">Manage your settings on the go. Download for iOS and Android.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* PROFILE TAB */}
                            <TabsContent value="profile" className="space-y-6 mt-0">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Public Profile</CardTitle>
                                        <CardDescription>This is how others will see you on the site.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center gap-6">
                                            <Avatar className="w-20 h-20 border-4 border-muted">
                                                <AvatarImage src={avatarUrl} />
                                                <AvatarFallback>CF</AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-2">
                                                <Button variant="outline" size="sm" onClick={() => setIsEditorOpen(true)}>Change Avatar</Button>
                                                <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>First Name</Label>
                                                <Input defaultValue={user.profile.firstName} onChange={(e) => updateProfile({ firstName: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Last Name</Label>
                                                <Input defaultValue={user.profile.lastName} onChange={(e) => updateProfile({ lastName: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Username</Label>
                                                <Input defaultValue={user.profile.username} onChange={(e) => updateProfile({ username: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <Input defaultValue={user.profile.email} onChange={(e) => updateProfile({ email: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Bio</Label>
                                            <Input defaultValue={user.profile.bio} onChange={(e) => updateProfile({ bio: e.target.value })} />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="justify-end border-t border-border/50 px-6 py-4">
                                        <Button>Save Changes</Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>

                            {/* ADDRESSES TAB */}
                            <TabsContent value="addresses" className="space-y-6 mt-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">Address Book</h3>
                                        <p className="text-sm text-muted-foreground">Manage your delivery locations.</p>
                                    </div>
                                    <Button className="gap-2" onClick={openNewAddressDialog}>
                                        <Plus className="w-4 h-4" /> Add Address
                                    </Button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {addresses.map((address) => (
                                        <AddressCard
                                            key={address.id}
                                            address={address}
                                            onEdit={() => openEditAddressDialog(address)}
                                            onRemove={() => handleDeleteAddress(address.id)}
                                            onSetDefault={() => handleSetDefaultAddress(address.id)}
                                        />
                                    ))}

                                    {addresses.length === 0 && (
                                        <div className="col-span-full flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-xl text-muted-foreground">
                                            <MapPin className="w-8 h-8 mb-2 opacity-50" />
                                            <p>No addresses saved yet.</p>
                                            <Button variant="link" onClick={openNewAddressDialog}>Add your first address</Button>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* PAYMENT TAB */}
                            <TabsContent value="payment" className="space-y-6 mt-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">Payment Methods</h3>
                                        <p className="text-sm text-muted-foreground">Securely manage your payment cards.</p>
                                    </div>
                                    <Button className="gap-2" onClick={() => setIsPaymentDialogOpen(true)}>
                                        <Plus className="w-4 h-4" /> Add Method
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {paymentMethods.map((method) => (
                                        method.isDefault ? (
                                            <Card key={method.id} className={`bg-gradient-to-br ${method.gradient || 'from-neutral-900 to-neutral-800'} text-white border-none shadow-xl overflow-hidden relative max-w-md`}>
                                                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />

                                                <CardContent className="p-6 relative z-10 flex flex-col justify-between h-56">
                                                    <div className="flex justify-between items-start">
                                                        <div className="w-10 h-6 bg-white/20 rounded-md backdrop-blur-sm" /> {/* Chip */}
                                                        <span className="font-mono text-white/50">{method.type.toUpperCase()}</span>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="flex gap-4">
                                                            <span className="font-mono text-xl tracking-widest text-white/90">•••• •••• •••• {method.last4}</span>
                                                        </div>
                                                        <div className="flex justify-between items-end">
                                                            <div className="space-y-1">
                                                                <span className="text-xs text-white/50 block">CARD HOLDER</span>
                                                                <span className="font-medium tracking-wide">{method.cardHolder}</span>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="text-xs text-white/50 block">EXPIRES</span>
                                                                <span className="font-medium tracking-wide">{method.expiry}</span>
                                                            </div>
                                                            <div className="h-8">
                                                                {/* Mastercard Logo Mock */}
                                                                <div className="flex -space-x-3">
                                                                    <div className="w-8 h-8 rounded-full bg-red-500/80 mix-blend-screen" />
                                                                    <div className="w-8 h-8 rounded-full bg-yellow-500/80 mix-blend-screen" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            <Card key={method.id}>
                                                <CardContent className="p-0">
                                                    <div className="p-4 flex items-center justify-between border-b">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                                                                <span className="font-bold text-xs">{method.type.toUpperCase()}</span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{method.type} ending in {method.last4}</p>
                                                                <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                                                            </div>
                                                        </div>
                                                        <Button variant="ghost" size="sm" onClick={() => handleDeletePaymentMethod(method.id)}>Remove</Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    ))}

                                    {paymentMethods.length === 0 && (
                                        <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-xl text-muted-foreground">
                                            <CreditCard className="w-8 h-8 mb-2 opacity-50" />
                                            <p>No payment methods saved.</p>
                                            <Button variant="link" onClick={() => setIsPaymentDialogOpen(true)}>Add your first card</Button>
                                        </div>
                                    )}

                                    {paymentMethods.some(p => !p.isDefault) && (
                                        <div className="p-4 bg-muted/20 border rounded-lg">
                                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                                <Lock className="w-3 h-3" />
                                                Your payment information is encrypted and secure.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* SECURITY TAB */}
                            <TabsContent value="security" className="space-y-6 mt-0">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Password</CardTitle>
                                        <CardDescription>Change your password securely.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Current Password</Label>
                                            <Input type="password" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>New Password</Label>
                                            <Input type="password" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Confirm New Password</Label>
                                            <Input type="password" />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="justify-end border-t border-border/50 px-6 py-4">
                                        <Button>Update Password</Button>
                                    </CardFooter>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="space-y-0.5">
                                                <h3 className="font-semibold text-base">Two-Factor Authentication</h3>
                                                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                                            </div>
                                            <Switch />
                                        </div>
                                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 text-sm rounded-lg flex gap-3">
                                            <Shield className="w-5 h-5 flex-shrink-0" />
                                            We recommend enabling 2FA to protect your account from unauthorized access.
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* NOTIFICATIONS TAB */}
                            <TabsContent value="notifications" className="space-y-6 mt-0">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Notification Preferences</CardTitle>
                                        <CardDescription>Control how you want to be notified.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-medium">Email Notifications</h4>
                                            <Separator />
                                            <div className="flex items-center justify-between">
                                                <Label className="font-normal">Order updates & delivery status</Label>
                                                <Switch defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Label className="font-normal">New product recommendations</Label>
                                                <Switch defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Label className="font-normal">Marketing newsletters</Label>
                                                <Switch />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-medium">Push Notifications</h4>
                                            <Separator />
                                            <div className="flex items-center justify-between">
                                                <Label className="font-normal">Direct messages from vendors</Label>
                                                <Switch defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Label className="font-normal">Exclusive offers</Label>
                                                <Switch defaultChecked />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="justify-end border-t border-border/50 px-6 py-4">
                                        <Button variant="outline">Reset to Defaults</Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>

                        </motion.div>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}

function SettingsTabTrigger({ value, icon: Icon, label, isActive }: { value: string, icon: any, label: string, isActive: boolean }) {
    return (
        <TabsTrigger
            value={value}
            className={`
                w-full justify-start gap-3 px-4 py-3 h-auto rounded-xl transition-all
                ${isActive ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted text-muted-foreground hover:text-foreground"}
                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
            `}
        >
            <Icon className="w-4 h-4" />
            <span className="hidden md:inline">{label}</span>
            <span className="md:hidden text-xs">{label}</span>
        </TabsTrigger>
    );
}

interface AddressCardProps {
    address: Address;
    onEdit: () => void;
    onRemove: () => void;
    onSetDefault: () => void;
}

function AddressCard({ address, onEdit, onRemove, onSetDefault }: AddressCardProps) {
    const { type, label, fullAddress, phone, isDefault } = address;

    return (
        <Card className={`relative overflow-hidden transition-all hover:border-primary/50 group ${isDefault ? 'border-primary/50 bg-primary/5' : ''}`}>
            {isDefault && (
                <div className="absolute top-0 right-0 p-2 bg-primary text-primary-foreground rounded-bl-xl text-xs font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Default
                </div>
            )}
            <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                    {type === "Home" ? <Home className="w-4 h-4 text-primary" /> : <Briefcase className="w-4 h-4 text-orange-500" />}
                    <span className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{type}</span>
                </div>
                <div>
                    <h4 className="font-bold text-lg">{label}</h4>
                    <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                            {fullAddress}
                        </p>
                    </p>
                    <p className="text-sm font-medium mt-2 flex items-center gap-2">
                        <Smartphone className="w-3 h-3 text-muted-foreground" />
                        {phone}
                    </p>
                </div>
                <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="h-8" onClick={onEdit}>Edit</Button>
                    {!isDefault && (
                        <>
                            <Button variant="ghost" size="sm" className="h-8" onClick={onSetDefault}>Set Default</Button>
                            <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onRemove}>Remove</Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
