"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
    Upload,
    FileSpreadsheet,
    CheckCircle,
    AlertCircle,
    Download,
    X,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BulkUploadProps {
    onUpload: (data: Record<string, unknown>[]) => void;
    templateFields: string[];
    className?: string;
}

type UploadState = "idle" | "uploading" | "validating" | "success" | "error";

export function BulkUpload({
    onUpload,
    templateFields,
    className,
}: BulkUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [state, setState] = useState<UploadState>("idle");
    const [fileName, setFileName] = useState<string>("");
    const [progress, setProgress] = useState(0);
    const [errors, setErrors] = useState<string[]>([]);
    const [preview, setPreview] = useState<Record<string, unknown>[]>([]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setState("uploading");
        setErrors([]);

        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
            await new Promise((r) => setTimeout(r, 50));
            setProgress(i);
        }

        setState("validating");

        // Simulate validation
        await new Promise((r) => setTimeout(r, 500));

        // Mock parsing CSV - in production use papaparse
        const mockData = [
            { name: "Product 1", price: 10000, stock: 5 },
            { name: "Product 2", price: 15000, stock: 10 },
            { name: "Product 3", price: 20000, stock: 8 },
        ];

        // Simulate some validation errors
        const mockErrors: string[] = [];

        if (mockErrors.length > 0) {
            setErrors(mockErrors);
            setState("error");
        } else {
            setPreview(mockData);
            setState("success");
        }

        e.target.value = "";
    };

    const handleConfirm = () => {
        onUpload(preview);
        reset();
    };

    const reset = () => {
        setState("idle");
        setFileName("");
        setProgress(0);
        setErrors([]);
        setPreview([]);
    };

    const downloadTemplate = () => {
        const csv = templateFields.join(",") + "\n";
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "product_template.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    Bulk Upload Products
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {state === "idle" && (
                    <>
                        {/* Upload Zone */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                        >
                            <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                            <p className="text-sm font-medium mb-1">
                                Click to upload CSV file
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Maximum 100 products per upload
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        {/* Download Template */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={downloadTemplate}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download Template
                        </Button>

                        <p className="text-xs text-muted-foreground">
                            Template includes: {templateFields.join(", ")}
                        </p>
                    </>
                )}

                {(state === "uploading" || state === "validating") && (
                    <div className="text-center py-4">
                        <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-primary" />
                        <p className="font-medium mb-2">
                            {state === "uploading" ? "Uploading..." : "Validating..."}
                        </p>
                        {state === "uploading" && (
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">{fileName}</p>
                    </div>
                )}

                {state === "success" && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-success/10 border border-success/20">
                            <CheckCircle className="w-5 h-5 text-success" />
                            <div>
                                <p className="font-medium text-sm">File validated</p>
                                <p className="text-xs text-muted-foreground">
                                    {preview.length} products ready to import
                                </p>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="border rounded-xl overflow-hidden">
                            <div className="bg-muted px-3 py-2 text-xs font-medium">
                                Preview (first 3 rows)
                            </div>
                            <div className="divide-y max-h-40 overflow-y-auto">
                                {preview.slice(0, 3).map((item, i) => (
                                    <div key={i} className="px-3 py-2 text-sm">
                                        {Object.entries(item)
                                            .slice(0, 3)
                                            .map(([k, v]) => (
                                                <span key={k} className="mr-3">
                                                    <span className="text-muted-foreground">{k}:</span>{" "}
                                                    {String(v)}
                                                </span>
                                            ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={handleConfirm} className="flex-1">
                                Import {preview.length} Products
                            </Button>
                            <Button variant="outline" onClick={reset}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {state === "error" && (
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                            <div>
                                <p className="font-medium text-sm">Validation failed</p>
                                <p className="text-xs text-muted-foreground">
                                    Please fix the errors and try again
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {errors.map((error, i) => (
                                <Badge key={i} variant="destructive" className="mr-2">
                                    {error}
                                </Badge>
                            ))}
                        </div>

                        <Button variant="outline" onClick={reset} className="w-full">
                            Try Again
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
