import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Download, FileText, ImageIcon, X, Loader2 } from 'lucide-react';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    format: 'pdf' | 'zip';
    progress: number;
    status: 'idle' | 'processing' | 'complete' | 'error';
    fileName: string;
}

export default function ExportModal({ isOpen, onClose, format, progress, status, fileName }: ExportModalProps) {
    const isPDF = format === 'pdf';
    
    // Status messages for flavor
    const getStatusMessage = () => {
        if (status === 'complete') return 'Export Complete!';
        if (status === 'error') return 'Export Failed';
        
        if (progress < 30) return isPDF ? 'Scanning Pages...' : 'Capturing Canvases...';
        if (progress < 60) return isPDF ? 'Simulating High-DPI Ink...' : 'Optimizing Pixel Quality...';
        if (progress < 90) return isPDF ? 'Calibrating A4 Alignment...' : 'Compressing Images into ZIP...';
        return 'Finalizing Document...';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    {/* BACKDROP */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={status === 'complete' || status === 'error' ? onClose : undefined}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* MODAL CONTAINER */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border border-black/5 overflow-hidden p-10 flex flex-col items-center text-center"
                    >
                        {/* CLOSE BUTTON (Only on complete/error) */}
                        {(status === 'complete' || status === 'error') && (
                            <button 
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors"
                            >
                                <X size={20} className="text-neutral-400" />
                            </button>
                        )}

                        {/* ICON / PROGRESS RING */}
                        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className="text-neutral-50"
                                />
                                <motion.circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray="377"
                                    initial={{ strokeDashoffset: 377 }}
                                    animate={{ strokeDashoffset: 377 - (377 * progress) / 100 }}
                                    className="text-neutral-900"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                {status === 'complete' ? (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                        <CheckCircle2 size={48} className="text-emerald-500" />
                                    </motion.div>
                                ) : status === 'processing' ? (
                                     <div className="flex flex-col items-center">
                                         {isPDF ? <FileText size={32} className="text-neutral-400" /> : <ImageIcon size={32} className="text-neutral-400" />}
                                         <span className="text-xs font-black mt-2">{progress}%</span>
                                     </div>
                                ) : <Loader2 size={32} className="text-neutral-200 animate-spin" />}
                            </div>
                        </div>

                        {/* CONTENT */}
                        <h3 className="text-2xl font-black text-neutral-900 mb-2">
                            {status === 'complete' ? 'Success!' : isPDF ? 'Generating PDF' : 'Generating ZIP'}
                        </h3>
                        <p className="text-neutral-400 text-sm font-medium tracking-tight h-5">
                            {getStatusMessage()}
                        </p>

                        <div className="w-full h-px bg-neutral-100 my-8" />

                        <div className="w-full space-y-3">
                            {status === 'complete' ? (
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Download size={18} />
                                    Download Ready
                                </button>
                            ) : (
                                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">
                                    {fileName}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
