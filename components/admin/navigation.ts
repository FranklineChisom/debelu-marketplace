import {
    LayoutDashboard,
    Store,
    Users,
    ShoppingCart,
    ShieldAlert,
    Settings,
    Shield
} from "lucide-react";

export const adminNavItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Overview" },
    { href: "/admin/vendors", icon: Store, label: "Vendors", badge: "2" }, // Mock badge for pending verifications
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/orders", icon: ShoppingCart, label: "All Orders" },
];

export const adminBottomNavItems = [
    { href: "/admin/settings", icon: Settings, label: "Platform Settings" },
    { href: "/admin/security", icon: Shield, label: "Security" },
];
