import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layers,
    Combine,
    Split,
    Files,
    Loader2,
    Check,
    AlertCircle
} from 'lucide-react';
import { useStore } from '../lib/store';

export default function BatchOperations() {
    const { pages, setPages } = useStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<string | null>(null);

    const handleMerge = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setIsProcessing(true);
        setStatus(`Merging ${files.length} documents...`);

        const newTexts = [...pages.map(p => p.text)];
        for (let i = 0; i < files.length; i++) {
            const text = await files[i].text();
            newTexts.push(text);
            setProgress(((i + 1) / files.length) * 100);
            // Artificial delay for visual feedback
            await new Promise(r => setTimeout(r, 200));
        }

        setPages(newTexts);
        setIsProcessing(false);
        setProgress(0);
        setStatus(`Successfully merged ${files.length} documents.`);
        setTimeout(() => setStatus(null), 3000);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Layers size={14} className="text-gray-400" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Batch Operations</h3>
            </div>

            <div className="grid grid-cols-1 gap-2">
                <BatchButton
                    icon={<Files size={14} />}
                    label="Bulk File Import"
                    description="Convert multiple .txt to sheets"
                    onClick={() => document.getElementById('batch-merge')?.click()}
                />
                <input
                    id="batch-merge"
                    type="file"
                    multiple
                    accept=".txt"
                    className="hidden"
                    onChange={handleMerge}
                />

                <BatchButton
                    icon={<Combine size={14} />}
                    label="Merge Selected"
                    description="Join sheets into one text stream"
                    onClick={() => {
                        const merged = pages.map(p => p.text).join('\n\n');
                        setPages([merged]);
                        setStatus('Sheets merged into one.');
                        setTimeout(() => setStatus(null), 3000);
                    }}
                />

                <BatchButton
                    icon={<Split size={14} />}
                    label="Split Document"
                    description="Divide into separate files"
                    onClick={() => {
                        // Splitting by paragraph as a basic implementation
                        const allText = pages.map(p => p.text).join('\n');
                        const paragraphs = allText.split(/\n\s*\n/).filter(Boolean);
                        if (paragraphs.length > 1) {
                            setPages(paragraphs);
                            setStatus(`Split into ${paragraphs.length} sheets.`);
                        } else {
                            setStatus('No split points found.');
                        }
                        setTimeout(() => setStatus(null), 3000);
                    }}
                />
            </div>

            <AnimatePresence>
                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-black text-white rounded-xl overflow-hidden shadow-xl"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Loader2 size={10} className="animate-spin" /> Processing
                            </span>
                            <span className="text-[9px] font-black">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white"
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-[8px] mt-2 font-medium opacity-60 uppercase tracking-widest">{status}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {status && !isProcessing && (
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3">
                    {status.includes('Success') || status.includes('merged') || status.includes('Split') ? (
                        <Check size={12} className="text-green-500" />
                    ) : (
                        <AlertCircle size={12} className="text-amber-500" />
                    )}
                    <span className="text-[9px] font-black uppercase tracking-widest text-black/60">{status}</span>
                </div>
            )}
        </div>
    );
}

function BatchButton({ icon, label, description, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="p-4 border border-gray-100 rounded-xl text-left hover:border-black hover:bg-gray-50 transition-all flex items-center gap-4 group"
        >
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                {icon}
            </div>
            <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-black">{label}</div>
                <div className="text-[8px] text-gray-400 font-medium">{description}</div>
            </div>
        </button>
    );
}
