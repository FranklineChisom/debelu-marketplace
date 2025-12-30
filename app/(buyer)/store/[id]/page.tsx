"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    MapPin,
    Star,
    MessageCircle,
    ShoppingBag,
    Clock,
    Search,
    ArrowLeft,
    Filter
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { formatNaira } from "@/lib/utils";

// Mock Data
const VENDOR = {
    id: "v1",
    name: "Campus Tech Hub",
    image: "https://github.com/shadcn.png",
    cover: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    rating: 4.8,
    reviews: 124,
    location: "UNILAG, Moore Hall",
    joined: "Aug 2023",
    responseTime: "< 30 mins",
    description: "Your #1 source for laptops, phones, and accessories on campus. We sell quality used and new gadgets with warranty.",
    categories: ["Electronics", "Accessories"]
};

const PRODUCTS = [
    {
        id: "1",
        name: "MacBook Pro M1 2020",
        price: 450000,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500&q=80",
        category: "Electronics",
        condition: "Used - Like New",
        rating: 4.9
    },
    {
        id: "2",
        name: "iPhone 13 128GB",
        price: 380000,
        image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&q=80",
        category: "Electronics",
        condition: "New",
        rating: 4.8
    },
    {
        id: "3",
        name: "Sony WH-1000XM4",
        price: 180000,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80",
        category: "Accessories",
        condition: "Open Box",
        rating: 4.7
    },
    {
        id: "4",
        name: "JBL Flip 6",
        price: 85000,
        image: "https://images.unsplash.com/photo-1646668498603-da8100652ee3?w=500&q=80",
        category: "Accessories",
        condition: "New",
        rating: 4.6
    },
];

export default function StorePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-muted/30 pb-20 lg:pb-0">
            {/* Header / Cover */}
            <div className="relative h-48 lg:h-64 bg-slate-900 overflow-hidden">
                <Image
                    src={VENDOR.cover}
                    alt="Cover"
                    fill
                    className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                <div className="absolute top-4 left-4">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full bg-background/20 backdrop-blur-md hover:bg-background/40"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </Button>
                </div>
            </div>

            {/* Vendor Info Card */}
            <div className="container max-w-7xl mx-auto px-4 -mt-16 lg:-mt-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="border-border/50 shadow-xl overflow-hidden backdrop-blur-sm bg-background/95">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <Avatar className="w-24 h-24 lg:w-32 lg:h-32 border-4 border-background shadow-lg">
                                    <AvatarImage src={VENDOR.image} />
                                    <AvatarFallback>{VENDOR.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-2 text-center md:text-left">
                                    <h1 className="text-2xl lg:text-3xl font-black tracking-tight">{VENDOR.name}</h1>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" /> {VENDOR.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                            <span className="font-medium text-foreground">{VENDOR.rating}</span>
                                            ({VENDOR.reviews} reviews)
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" /> Responds in {VENDOR.responseTime}
                                        </span>
                                    </div>
                                    <p className="text-sm max-w-2xl text-muted-foreground">{VENDOR.description}</p>
                                </div>

                                <div className="flex gap-2 w-full md:w-auto">
                                    <Button className="flex-1 md:flex-none">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Chat with Vendor
                                    </Button>
                                    <Button variant="outline" className="flex-1 md:flex-none">
                                        Follow
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Search & Filter */}
                <div className="mt-8 mb-6 flex items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder={`Search ${VENDOR.name}...`}
                            className="pl-9 bg-background/50 border-border/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" className="shrink-0">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>

                {/* Product Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                    {PRODUCTS.map((product) => (
                        <motion.div
                            key={product.id}
                            variants={fadeInUp}
                            whileHover={{ y: -4 }}
                        >
                            <Link href={`/product/${product.id}`} className="block h-full">
                                <Card className="group h-full overflow-hidden border-border/50 bg-card/60 hover:bg-card/80 transition-all duration-300 hover:shadow-lg">
                                    <div className="relative aspect-square bg-muted overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-2 left-2">
                                            <Badge variant="secondary" className="bg-background/80 backdrop-blur-md text-xs font-medium">
                                                {product.condition}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-3">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                                {product.category}
                                            </span>
                                            <div className="flex items-center text-amber-500 text-[10px] font-bold gap-0.5">
                                                <Star className="w-3 h-3 fill-current" />
                                                {product.rating}
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="font-bold text-base text-primary">
                                                {formatNaira(product.price)}
                                            </span>
                                            <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full">
                                                <ShoppingBag className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
