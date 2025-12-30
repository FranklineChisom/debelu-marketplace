import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    HelpCircle
} from "lucide-react";

export const vendorNavItems = [
    { href: "/vendor/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/vendor/products", icon: Package, label: "Products" },
    { href: "/vendor/orders", icon: ShoppingCart, label: "Orders", badge: "3" },
    { href: "/vendor/analytics", icon: BarChart3, label: "Analytics" },
];

export const vendorBottomNavItems = [
    { href: "/vendor/settings", icon: Settings, label: "Settings" },
    { href: "/vendor/help", icon: HelpCircle, label: "Help & Support" },
];
