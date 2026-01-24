"use client";

import { useState, useRef } from "react";
import { Upload, X, FileSpreadsheet, CheckCircle, AlertCircle, Download } from "lucide-react";
import { importPatientsFromExcel } from "@/lib/actions";
import { useLanguage } from "@/context/LanguageContext";

interface ImportResult {
    total: number;
    success: number;
    failed: number;
    errors: Array<{ row: number; name: string; error: string }>;
}

export function ImportPatientsDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<ImportResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useLanguage();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const validTypes = [
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-excel",
            ];
            if (validTypes.includes(selectedFile.type)) {
                setFile(selectedFile);
                setResult(null);
            } else {
                alert("Please select a valid Excel file (.xlsx or .xls)");
            }
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            const validTypes = [
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-excel",
            ];
            if (validTypes.includes(droppedFile.type)) {
                setFile(droppedFile);
                setResult(null);
            } else {
                alert("Please select a valid Excel file (.xlsx or .xls)");
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleImport = async () => {
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await importPatientsFromExcel(formData);
            if (response.success && response.results) {
                setResult(response.results);
            } else {
                alert(response.message || "Failed to import patients");
            }
        } catch (error) {
            console.error("Import error:", error);
            alert("An error occurred during import");
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setFile(null);
        setResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const downloadTemplate = () => {
        // Create a simple template
        const templateData = [
            ["name", "type", "phone", "email", "whatsapp", "address", "gender", "birthDate"],
            ["John Doe", "Individual", "+201234567890", "john@example.com", "+201234567890", "123 Main St", "Male", "1990-01-01"],
            ["ABC Company", "Company", "+201234567891", "info@abc.com", "+201234567891", "456 Business Ave", "", ""],
        ];

        const csvContent = templateData.map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "patients-template.csv";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#b78a5d] to-[#8b6a47] text-white font-bold text-sm hover:shadow-xl transition-all duration-300 shadow-lg shadow-[#b78a5d]/20"
            >
                <Upload size={18} />
                <span>Import from Excel</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-[#0a192f] to-[#112240]">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-[#b78a5d] flex items-center justify-center">
                                    <FileSpreadsheet size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Import Patients from Excel</h3>
                                    <p className="text-sm text-slate-300 mt-0.5">Upload an Excel file to bulk import patients</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Template Download */}
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <FileSpreadsheet size={20} className="text-blue-600" />
                                    <div>
                                        <p className="text-sm font-bold text-blue-900">Need a template?</p>
                                        <p className="text-xs text-blue-600">Download our sample Excel template</p>
                                    </div>
                                </div>
                                <button
                                    onClick={downloadTemplate}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all"
                                >
                                    <Download size={16} />
                                    Download
                                </button>
                            </div>

                            {/* File Upload Area */}
                            {!result && (
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center hover:border-[#b78a5d] transition-all cursor-pointer bg-slate-50"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    {file ? (
                                        <div className="space-y-4">
                                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                                                <FileSpreadsheet size={32} className="text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{file.name}</p>
                                                <p className="text-sm text-slate-500 mt-1">
                                                    {(file.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFile(null);
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = "";
                                                    }
                                                }}
                                                className="text-sm text-red-600 hover:text-red-700 font-bold"
                                            >
                                                Remove file
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                                                <Upload size={32} className="text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">
                                                    Drop your Excel file here or click to browse
                                                </p>
                                                <p className="text-sm text-slate-500 mt-2">
                                                    Supported formats: .xlsx, .xls
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Import Results */}
                            {result && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                            <p className="text-2xl font-bold text-blue-900">{result.total}</p>
                                            <p className="text-xs text-blue-600 mt-1">Total Rows</p>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                            <p className="text-2xl font-bold text-green-900">{result.success}</p>
                                            <p className="text-xs text-green-600 mt-1">Imported</p>
                                        </div>
                                        <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                            <p className="text-2xl font-bold text-red-900">{result.failed}</p>
                                            <p className="text-xs text-red-600 mt-1">Failed</p>
                                        </div>
                                    </div>

                                    {result.errors.length > 0 && (
                                        <div className="max-h-64 overflow-y-auto space-y-2">
                                            <p className="font-bold text-sm text-slate-700">Errors:</p>
                                            {result.errors.map((error, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-3 bg-red-50 rounded-lg border border-red-100 flex items-start gap-3"
                                                >
                                                    <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-red-900">
                                                            Row {error.row}: {error.name}
                                                        </p>
                                                        <p className="text-xs text-red-600 mt-1">{error.error}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {result.success > 0 && (
                                        <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3">
                                            <CheckCircle size={24} className="text-green-600" />
                                            <div>
                                                <p className="font-bold text-green-900">Import Successful!</p>
                                                <p className="text-sm text-green-600 mt-0.5">
                                                    {result.success} patient{result.success !== 1 ? "s" : ""} imported successfully
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 p-4 flex gap-3 justify-end border-t border-slate-100">
                            <button
                                onClick={handleClose}
                                className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-white transition-all"
                            >
                                {result ? "Close" : "Cancel"}
                            </button>
                            {!result && file && (
                                <button
                                    onClick={handleImport}
                                    disabled={isUploading}
                                    className="px-6 py-2.5 rounded-xl bg-[#b78a5d] text-white font-bold text-sm hover:bg-[#8b6a47] shadow-lg shadow-[#b78a5d]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUploading ? "Importing..." : "Import Patients"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
