import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, Check, Info, FolderArchive } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalPages: number;
    dimensions: { width: number; height: number };
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export default function ExportModal({ isOpen, onClose, totalPages, dimensions, canvasRef }: ExportModalProps) {
    const [exportFormat, setExportFormat] = useState<'pdf' | 'png'>('pdf');
    const [pageSelection, setPageSelection] = useState<'all' | 'custom'>('all');
    const [customRange, setCustomRange] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleExport = async () => {
        setIsExporting(true);
        setProgress(0);

        try {
            const canvas = canvasRef.current;
            if (!canvas) throw new Error("Canvas not found");

            if (exportFormat === 'pdf') {
                const pdf = new jsPDF({
                    orientation: dimensions.width > dimensions.height ? 'landscape' : 'portrait',
                    unit: 'pt',
                    format: [dimensions.width, dimensions.height]
                });

                const pagesToExport = pageSelection === 'all' ? Array.from({ length: totalPages }, (_, i) => i + 1) : [1];

                for (let i = 0; i < pagesToExport.length; i++) {
                    setProgress(Math.round(((i + 1) / pagesToExport.length) * 100));
                    if (i > 0) pdf.addPage([dimensions.width, dimensions.height], dimensions.width > dimensions.height ? 'l' : 'p');

                    const imgData = canvas.toDataURL('image/png', 1.0);
                    pdf.addImage(imgData, 'PNG', 0, 0, dimensions.width, dimensions.height);
                    await new Promise(r => setTimeout(r, 100));
                }

                pdf.save(`inkpad-document-${new Date().getTime()}.pdf`);
            } else {
                const link = document.createElement('a');
                link.download = `inkpad-page-1.png`;
                link.href = canvas.toDataURL('image/png', 1.0);
                link.click();
            }
        } catch (error) {
            console.error("Export failed", error);
        } finally {
            setIsExporting(false);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Export Document</h3>
                                <p className="text-xs text-gray-500 font-medium">Professional high-fidelity output</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-8">
                            {/* Format Selection */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Choose Format</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setExportFormat('pdf')}
                                        className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all ${exportFormat === 'pdf'
                                                ? 'border-black bg-black text-white shadow-lg'
                                                : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                                            }`}
                                    >
                                        <FileText size={24} />
                                        <div className="text-center">
                                            <span className="block text-xs font-bold uppercase tracking-tight">PDF Document</span>
                                            <span className="text-[9px] opacity-60">High Resolution</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setExportFormat('png')}
                                        className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all ${exportFormat === 'png'
                                                ? 'border-black bg-black text-white shadow-lg'
                                                : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                                            }`}
                                    >
                                        <FolderArchive size={24} />
                                        <div className="text-center">
                                            <span className="block text-xs font-bold uppercase tracking-tight">PNG Images</span>
                                            <span className="text-[9px] opacity-60">ZIP Archive</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Page Range Selection */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Page Range</label>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setPageSelection('all')}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${pageSelection === 'all' ? 'border-black bg-gray-50' : 'border-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${pageSelection === 'all' ? 'border-black bg-black' : 'border-gray-200'
                                                }`}>
                                                {pageSelection === 'all' && <Check size={10} className="text-white" />}
                                            </div>
                                            <span className="text-xs font-bold">All Pages ({totalPages})</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setPageSelection('custom')}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${pageSelection === 'custom' ? 'border-black bg-gray-50' : 'border-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${pageSelection === 'custom' ? 'border-black bg-black' : 'border-gray-200'
                                                }`}>
                                                {pageSelection === 'custom' && <Check size={10} className="text-white" />}
                                            </div>
                                            <span className="text-xs font-bold whitespace-nowrap">Custom Range:</span>
                                            <input
                                                type="text"
                                                placeholder="e.g. 1-3, 5"
                                                className="bg-transparent border-none p-0 text-xs focus:ring-0 w-full"
                                                disabled={pageSelection !== 'custom'}
                                                value={customRange}
                                                onChange={(e) => setCustomRange(e.target.value)}
                                            />
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="flex gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] leading-relaxed text-blue-700/80 font-medium">
                                    Exporting as <b>{exportFormat.toUpperCase()}</b> will generate a document with a resolution of 300DPI for optimal printing results. Single PDF will combine all selected pages.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-gray-50 border-t border-gray-100">
                            <button
                                onClick={handleExport}
                                disabled={isExporting}
                                className="w-full h-14 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:bg-gray-800 transition-all active:scale-[0.99] disabled:opacity-50"
                            >
                                {isExporting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Exporting {progress}%</span>
                                    </>
                                ) : (
                                    <>
                                        <Download size={20} />
                                        <span>Initialize Export</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
