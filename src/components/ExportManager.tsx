import { useState } from 'react';
import { motion } from 'framer-motion';
import { exportToPDF, exportToImage } from '../utils/export';

export default function ExportManager() {
    const [isExporting, setIsExporting] = useState(false);
    const [msg, setMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const handleExport = async (format: 'pdf' | 'png' | 'jpg') => {
        setIsExporting(true);
        setMsg(null);

        try {
            const canvas = document.querySelector('canvas');
            if (!canvas) throw new Error('Preview canvas not found');

            if (format === 'pdf') {
                await exportToPDF(canvas);
            } else {
                await exportToImage(canvas, format);
            }

            setMsg({ text: `Exported as ${format.toUpperCase()} successfully!`, type: 'success' });
            setTimeout(() => setMsg(null), 3000);
        } catch (error) {
            setMsg({ text: 'Export failed. Please try again.', type: 'error' });
            setTimeout(() => setMsg(null), 3000);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="card">
            <h2 className="text-xl font-bold text-ink-900 mb-6">Export</h2>

            <div className="space-y-3">
                <button
                    onClick={() => handleExport('pdf')}
                    disabled={isExporting}
                    className="btn-primary w-full flex items-center justify-center gap-3 py-4"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                </button>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleExport('png')}
                        disabled={isExporting}
                        className="btn-secondary flex items-center justify-center gap-2 py-3"
                    >
                        PNG
                    </button>
                    <button
                        onClick={() => handleExport('jpg')}
                        disabled={isExporting}
                        className="btn-secondary flex items-center justify-center gap-2 py-3"
                    >
                        JPG
                    </button>
                </div>
            </div>

            {msg && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-3 rounded text-xs font-bold text-center border uppercase tracking-widest ${msg.type === 'error'
                            ? 'bg-red-50 border-red-200 text-red-600'
                            : 'bg-ink-50 border-ink-200 text-ink-900'
                        }`}
                >
                    {msg.text}
                </motion.div>
            )}
        </div>
    );
}
