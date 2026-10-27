"use client";

import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { FileUp, FileText, X } from "lucide-react";

const ACCEPTED_TYPES = [
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];
const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const MAX_SIZE_MB = 5;

interface CvDropzoneProps {
    onFileSelect?: (file: File | null) => void;
}

export default function CvDropzone({ onFileSelect }: CvDropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const validate = (f: File): string | null => {
        const ext = "." + f.name.split(".").pop()?.toLowerCase();
        const validType = ACCEPTED_TYPES.includes(f.type) || ACCEPTED_EXTENSIONS.includes(ext);
        if (!validType) return "Only PDF, DOC, or DOCX files are allowed.";
        if (f.size > MAX_SIZE_MB * 1024 * 1024) return `File must be smaller than ${MAX_SIZE_MB}MB.`;
        return null;
    };

    const handleFile = (f: File | undefined) => {
        if (!f) return;
        const err = validate(f);
        if (err) {
            setError(err);
            setFile(null);
            onFileSelect?.(null);
            return;
        }
        setError(null);
        setFile(f);
        onFileSelect?.(f);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files?.[0]);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFile(e.target.files?.[0]);
        e.target.value = ""; // allow re-selecting the same file
    };

    const removeFile = () => {
        setFile(null);
        setError(null);
        onFileSelect?.(null);
    };

    return (
        <div className="w-full md:w-auto">
            <input
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={handleChange}
            />

            {file ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-[#07c4ec]/60 bg-[#07c4ec]/5 px-5 py-3 text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-5 h-5 shrink-0 text-[#07c4ec]" />
                        <span className="truncate text-gray-700">{file.name}</span>
                        <span className="shrink-0 text-xs text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={removeFile}
                        aria-label="Remove file"
                        className="cursor-pointer text-gray-400 hover:text-red-500"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => inputRef.current?.click()}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            inputRef.current?.click();
                        }
                    }}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`cursor-pointer flex w-full md:w-auto items-center justify-center gap-2 rounded-xl border-2 border-dashed px-5 py-3 text-sm transition-colors
                        ${isDragging
                            ? "border-[#07c4ec] bg-[#07c4ec]/10 text-[#07c4ec]"
                            : "border-gray-300 text-gray-500 hover:border-[#07c4ec]/60 hover:text-[#07c4ec]"
                        }`}
                >
                    <FileUp className="w-5 h-5" />
                    {isDragging ? "Drop it here" : "Drop your CV here"}
                </div>
            )}

            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
            {!file && !error && (
                <p className="mt-2 text-xs text-gray-400">PDF, DOC, DOCX · max {MAX_SIZE_MB}MB</p>
            )}
        </div>
    );
}