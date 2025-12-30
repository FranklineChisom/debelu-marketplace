import { Product } from "@/types/product";
import { Order } from "@/types/order";
import { OrderStatus } from "@/lib/constants";
import { User } from "@/types/user";

// Initial Mock Products (Vendor View Source)
export const INITIAL_PRODUCTS: Product[] = [
    {
        id: "1",
        vendorId: "vendor-1",
        campusId: "unilag",
        name: "Dell Inspiron 15 Laptop 3620",
        description: "Powerful laptop for students. 16GB RAM, 512GB SSD.",
        category: "electronics" as any,
        tags: ["laptop", "dell", "student"],
        price: 165000,
        images: [{ id: "img1", url: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6", alt: "Dell Laptop", order: 1 }],
        stock: 5,
        trackInventory: true,
        hasVariants: false,
        status: "active",
        isFeatured: true,
        views: 450,
        sales: 12,
        rating: 4.5,
        reviewCount: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "2",
        vendorId: "vendor-1",
        campusId: "unilag",
        name: "iPhone 12 Case Bundle",
        description: "Durable cases in multiple colors.",
        category: "accessories" as any,
        tags: ["iphone", "case"],
        price: 9000,
        images: [{ id: "img2", url: "https://images.unsplash.com/photo-1603539276580-c1e4c764b85d", alt: "iPhone Case", order: 1 }],
        stock: 45,
        trackInventory: true,
        hasVariants: true,
        status: "active",
        isFeatured: false,
        views: 890,
        sales: 28,
        rating: 4.2,
        reviewCount: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

export const mockUser: User = {
    id: "user-1",
    profile: {
        firstName: "Chisom",
        lastName: "Frank",
        username: "@chisomfrank",
        email: "chisom.frank@example.com",
        phone: "+234 801 234 5678",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2574&auto=format&fit=crop",
        bio: "Tech enthusiast and gadget lover.",
        campusId: "unilag"
    },
    addresses: [
        {
            id: "1",
            type: "Home",
            label: "Moremi Hall, Room 234",
            fullAddress: "Moremi Hall, University of Lagos, Akoka, Yaba, Lagos.",
            phone: "+234 801 234 5678",
            isDefault: true
        },
        {
            id: "2",
            type: "Work",
            label: "Faculty of Engineering",
            fullAddress: "Department of Systems Engineering, UNILAG.",
            phone: "+234 809 876 5432",
            isDefault: false
        }
    ],
    paymentMethods: [
        {
            id: "1",
            type: "Mastercard",
            last4: "4242",
            expiry: "12/25",
            cardHolder: "CHISOM FRANK",
            isDefault: true,
            gradient: "from-neutral-900 to-neutral-800"
        },
        {
            id: "2",
            type: "Visa",
            last4: "8899",
            expiry: "04/26",
            cardHolder: "CHISOM FRANK",
            isDefault: false
        }
    ],
    role: "buyer",
    preferences: {
        notifications: {
            push: true,
            email: true,
            whatsapp: false,
            orderUpdates: true,
            promotions: true,
            priceDrops: false
        },
        theme: "system",
        language: "en"
    },
    orderCount: 5,
    totalSpent: 125000,
    points: 120,
    badges: ["Early Adopter"],
    streak: 3,
    createdAt: "2024-01-01T00:00:00Z",
    lastActiveAt: new Date().toISOString()
};

// Initial Mock Orders (Vendor/Buyer View Source)
export const INITIAL_ORDERS: Order[] = [
    {
        id: "order-1",
        orderNumber: "DBL-XYZ789",
        buyerId: "user-1",
        buyerName: "Chioma Adebayo",
        buyerPhone: "08012345678",
        vendorId: "vendor-1",
        vendorName: "Chisom Gadgets",
        campusId: "unilag",
        items: [
            {
                id: "item-1",
                productId: "1",
                productName: "Dell Inspiron 15 Laptop 3620",
                image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6",
                product: {
                    id: "1",
                    name: "Dell Inspiron 15 Laptop 3620",
                    price: 165000,
                    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6",
                    vendorName: "Chisom Gadgets",
                    vendorId: "vendor-1",
                    rating: 4.5,
                    reviewCount: 8,
                    stock: 5,
                    campusId: "unilag"
                },
                quantity: 1,
                price: 165000
            }
        ],
        subtotal: 165000,
        deliveryFee: 1000,
        discount: 0,
        total: 166000,
        deliveryAddress: {
            id: "addr-1",
            label: "Hostel",
            fullAddress: "Moremi Hall, Room 234",
            isDefault: true
        },
        deliverySlot: {
            id: "slot-1",
            label: "Standard",
            date: "2024-05-20",
            startTime: "10:00",
            endTime: "12:00",
            fee: 1000
        },
        paymentMethod: "bank_transfer",
        paymentStatus: "paid",
        status: "pending",
        statusHistory: [],
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
    }
];
