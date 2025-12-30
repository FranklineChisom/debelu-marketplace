"use client";

import ProductForm from "@/components/vendor/ProductForm";

export default function EditProductPage({ params }: { params: { id: string } }) {
    // Mock Data Fetching based on ID
    const mockData = {
        name: "Dell Inspiron 15 Laptop 3620",
        description: "Powerful laptop for students and professionals. Features an Intel Core i5 processor, 16GB RAM, and 512GB SSD. Perfect for coding, design, and everyday tasks.",
        price: 165000,
        oldPrice: 180000,
        stock: 5,
        category: "electronics",
        images: [
            "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=200",
            "https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=200"
        ],
        hasVariants: true
    };

    return <ProductForm initialData={mockData} isEditing={true} />;
}
