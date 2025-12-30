"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Upload, X, ZoomIn, ZoomOut, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ProfileImageEditorProps {
    isOpen: boolean;
    onClose: () => void;
    currentImage: string;
    onSave: (newImage: string) => void;
}

export function ProfileImageEditor({ isOpen, onClose, currentImage, onSave }: ProfileImageEditorProps) {
    const [image, setImage] = useState<string>(currentImage);
    const [zoom, setZoom] = useState([1]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onSave(image);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Profile Photo</DialogTitle>
                    <DialogDescription>
                        Upload a new photo or adjust the current one.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center gap-6 py-4">
                    {/* Preview Area */}
                    <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-muted shadow-inner group bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center cursor-move">
                        {image ? (
                            <motion.div
                                className="relative w-full h-full"
                                style={{ scale: zoom[0] }}
                                drag
                                dragConstraints={{
                                    top: -50 * zoom[0],
                                    left: -50 * zoom[0],
                                    right: 50 * zoom[0],
                                    bottom: 50 * zoom[0]
                                }}
                            >
                                <Image
                                    src={image}
                                    alt="Profile Preview"
                                    fill
                                    className="object-cover pointer-events-none"
                                />
                            </motion.div>
                        ) : (
                            <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                        )}

                        {/* Overlay with instructions */}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <span className="text-white text-sm font-medium">Drag to reposition</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="w-full space-y-4 px-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><ZoomOut className="w-3 h-3" /></span>
                                <span className="flex items-center gap-1"><ZoomIn className="w-3 h-3" /></span>
                            </div>
                            <Slider
                                value={zoom}
                                onValueChange={setZoom}
                                min={1}
                                max={3}
                                step={0.1}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload New
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                                onClick={() => setImage("")}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Remove
                            </Button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                <DialogFooter className="sm:justify-between">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Photo</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
