import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToPDF, exportToImages } from '../utils/export';
import { useStore } from '../lib/store';
import { Download, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function ExportManager() {
    const state = useStore();
    const [isExporting, setIsExporting] = useState(false);
    const [msg, setMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const handleExport = async (format: 'pdf' | 'png' | 'jpg') => {
        setIsExporting(true);
        setMsg(null);

        try {
            if (format === 'pdf') {
                await exportToPDF(
                    state.pages,
                    state.handwritingStyle,
                    state.customFonts,
                    state.fontSize,
                    state.inkColor,
                    state.settings,
                    state.paperMaterial,
                    state.paperPattern,
                    { format: 'pdf', pageRange: 'all', quality: 0.85, dpi: 300 }
                );
            } else {
                await exportToImages(
                    state.pages,
                    state.handwritingStyle,
                    state.customFonts,
                    state.fontSize,
                    state.inkColor,
                    state.settings,
                    state.paperMaterial,
                    state.paperPattern,
                    {
                        format: format as 'png' | 'jpg',
                        pageRange: 'current',
                        quality: 1,
                        dpi: 300
                    },
                    state.currentPageIndex
                );
            }

            setMsg({ text: `Exported as ${format.toUpperCase()} successfully!`, type: 'success' });
            setTimeout(() => setMsg(null), 3000);
        } catch (error) {
            console.error(error);
            setMsg({ text: 'Export failed. Please try again.', type: 'error' });
            setTimeout(() => setMsg(null), 3000);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <Download size={16} className="text-gray-400" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Output Production</h3>
            </div>

            <div className="space-y-3">
                <button
                    onClick={() => handleExport('pdf')}
                    disabled={isExporting}
                    className="w-full bg-black text-white p-5 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-gray-900 transition-all disabled:opacity-50"
                >
                    {isExporting ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                    Export Complete Manuscript (.pdf)
                </button>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleExport('png')}
                        disabled={isExporting}
                        className="bg-white border border-gray-100 p-4 text-[8px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                        <ImageIcon size={14} />
                        Current Page (.png)
                    </button>
                    <button
                        onClick={() => handleExport('jpg')}
                        disabled={isExporting}
                        className="bg-white border border-gray-100 p-4 text-[8px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                        <ImageIcon size={14} />
                        Current Page (.jpg)
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {msg && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`p-4 text-[8px] font-black text-center uppercase tracking-[0.3em] ${msg.type === 'error'
                            ? 'bg-red-50 text-red-600 border border-red-100'
                            : 'bg-black text-white'
                            }`}
                    >
                        {msg.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="p-4 bg-gray-50 border border-gray-100">
                <p className="text-[8px] text-gray-400 font-medium leading-relaxed uppercase tracking-wider">
                    Note: PDF export compiles all {state.pages.length} sheets in the manuscript. Image exports capture only the currently active sheet.
                </p>
            </div>
        </div>
    );
}
