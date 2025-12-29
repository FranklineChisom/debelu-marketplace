"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
    Upload,
    X,
    Image as ImageIcon,
    GripVertical,
    Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
    className?: string;
}

export function ImageUploader({
    images,
    onChange,
    maxImages = 8,
    className,
}: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);

            const files = Array.from(e.dataTransfer.files).filter((file) =>
                file.type.startsWith("image/")
            );

            if (files.length === 0) return;

            // In production, upload to Supabase Storage
            // For now, create object URLs as placeholders
            const newImages = files.slice(0, maxImages - images.length).map((file) =>
                URL.createObjectURL(file)
            );

            onChange([...images, ...newImages]);
        },
        [images, maxImages, onChange]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);
            const newImages = files.slice(0, maxImages - images.length).map((file) =>
                URL.createObjectURL(file)
            );
            onChange([...images, ...newImages]);
            e.target.value = "";
        },
        [images, maxImages, onChange]
    );

    const removeImage = useCallback(
        (index: number) => {
            const newImages = [...images];
            newImages.splice(index, 1);
            onChange(newImages);
        },
        [images, onChange]
    );

    return (
        <div className={cn("space-y-3", className)}>
            {/* Drag and Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative border-2 border-dashed rounded-2xl p-6 text-center transition-colors",
                    isDragging
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50"
                )}
            >
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={images.length >= maxImages}
                />
                <Upload
                    className={cn(
                        "w-8 h-8 mx-auto mb-3",
                        isDragging ? "text-primary" : "text-muted-foreground"
                    )}
                />
                <p className="text-sm font-medium mb-1">
                    {isDragging ? "Drop images here" : "Drag & drop images here"}
                </p>
                <p className="text-xs text-muted-foreground">
                    or click to browse (max {maxImages} images)
                </p>
            </div>

            {/* Image Grid with Reorder */}
            {images.length > 0 && (
                <Reorder.Group
                    axis="x"
                    values={images}
                    onReorder={onChange}
                    className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
                >
                    {images.map((image, index) => (
                        <Reorder.Item
                            key={image}
                            value={image}
                            className="relative flex-shrink-0 group cursor-grab active:cursor-grabbing"
                        >
                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted">
                                <img
                                    src={image}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* First image badge */}
                            {index === 0 && (
                                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] font-medium rounded">
                                    Cover
                                </div>
                            )}

                            {/* Drag handle */}
                            <div className="absolute bottom-1 left-1 w-5 h-5 bg-black/50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <GripVertical className="w-3 h-3 text-white" />
                            </div>

                            {/* Remove button */}
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </Reorder.Item>
                    ))}

                    {/* Add more button */}
                    {images.length < maxImages && (
                        <label className="w-24 h-24 flex-shrink-0 border-2 border-dashed border-muted-foreground/25 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/50 transition-colors">
                            <Plus className="w-5 h-5 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">Add</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileInput}
                                className="hidden"
                            />
                        </label>
                    )}
                </Reorder.Group>
            )}

            {/* Helper text */}
            <p className="text-xs text-muted-foreground">
                {images.length}/{maxImages} images • Drag to reorder • First image is
                cover
            </p>
        </div>
    );
}
