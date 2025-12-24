import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Download,
    FileText,
    Image as ImageIcon,
    Printer,
    Link,
    X,
    ChevronRight,
    Settings,
    Type,
    Check,
    Loader2
} from 'lucide-react';
import { useStore } from '../lib/store';
import {
    exportToPDF,
    exportToImages,
    exportToSVG,
    printDocument
} from '../utils/export';
import { copyShareUrl } from '../utils/ShareUtility';

export default function ExportModal({ onClose }: { onClose: () => void }) {
    const state = useStore();
    const [activeTab, setActiveTab] = useState<'pdf' | 'image' | 'other'>('pdf');
    const [isExporting, setIsExporting] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [shareSuccess, setShareSuccess] = useState(false);

    // PDF Options
    const [pdfOptions, setPdfOptions] = useState({
        pageRange: 'all',
        quality: 0.85,
    });

    // Image Options
    const [imageOptions, setImageOptions] = useState({
        format: 'png' as 'png' | 'jpg',
        dpi: 300,
        transparent: false,
        pageRange: 'current' as 'current' | 'all',
    });

    const handleExport = async () => {
        setIsExporting(true);
        try {
            if (activeTab === 'pdf') {
                await exportToPDF(
                    state.pages,
                    state.handwritingStyle,
                    state.customFonts,
                    state.fontSize,
                    state.inkColor,
                    state.settings,
                    state.paperMaterial,
                    state.paperPattern,
                    {
                        format: 'pdf',
                        pageRange: pdfOptions.pageRange,
                        quality: pdfOptions.quality,
                        dpi: 300
                    }
                );
            } else if (activeTab === 'image') {
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
                        format: imageOptions.format,
                        pageRange: imageOptions.pageRange,
                        dpi: imageOptions.dpi,
                        transparent: imageOptions.transparent
                    },
                    state.currentPageIndex
                );
            }
        } catch (err) {
            console.error('Export failed:', err);
        } finally {
            setIsExporting(false);
            onClose();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col rounded-2xl"
            >
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-black">Mastering Export.</h2>
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mt-1">Configure your final manuscript output.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-50/50">
                    {(['pdf', 'image', 'other'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === tab ? 'border-black text-black bg-white' : 'border-transparent text-gray-400 hover:text-black'}`}
                        >
                            {tab === 'pdf' && <FileText size={14} />}
                            {tab === 'image' && <ImageIcon size={14} />}
                            {tab === 'other' && <Settings size={14} />}
                            {tab === 'other' ? 'Print & Share' : tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-8 flex-1 overflow-y-auto max-h-[60vh] custom-scrollbar">
                    {activeTab === 'pdf' && (
                        <div className="space-y-8">
                            <OptionGroup label="Page Selection">
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setPdfOptions({ ...pdfOptions, pageRange: 'all' })}
                                        className={`p-4 border rounded-xl text-left transition-all ${pdfOptions.pageRange === 'all' ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-black text-gray-400'}`}
                                    >
                                        <div className="text-[10px] font-black uppercase tracking-widest">Entire Document</div>
                                        <div className="text-[9px] mt-1 opacity-60">All {state.pages.length} pages</div>
                                    </button>
                                    <div className="p-4 border border-gray-100 rounded-xl">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Custom Range</div>
                                        <input
                                            type="text"
                                            placeholder="e.g. 1-3, 5"
                                            value={pdfOptions.pageRange === 'all' ? '' : pdfOptions.pageRange}
                                            onChange={e => setPdfOptions({ ...pdfOptions, pageRange: e.target.value })}
                                            className="w-full mt-2 text-sm font-bold focus:outline-none placeholder:text-gray-200"
                                        />
                                    </div>
                                </div>
                            </OptionGroup>

                            <OptionGroup label="Compression & Quality">
                                <div className="flex items-center gap-6">
                                    <input
                                        type="range" min="0.1" max="1" step="0.1"
                                        value={pdfOptions.quality}
                                        onChange={e => setPdfOptions({ ...pdfOptions, quality: parseFloat(e.target.value) })}
                                        className="flex-1 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
                                    />
                                    <div className="text-sm font-black w-12">{Math.round(pdfOptions.quality * 100)}%</div>
                                </div>
                            </OptionGroup>
                        </div>
                    )}

                    {activeTab === 'image' && (
                        <div className="space-y-8">
                            <OptionGroup label="Format & Transparency">
                                <div className="flex gap-4">
                                    {(['png', 'jpg'] as const).map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setImageOptions({ ...imageOptions, format: f })}
                                            className={`flex-1 py-3 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${imageOptions.format === f ? 'bg-black text-white border-black' : 'border-gray-100 text-gray-400 hover:border-black'}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setImageOptions({ ...imageOptions, transparent: !imageOptions.transparent })}
                                        className={`flex-1 py-3 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${imageOptions.transparent ? 'bg-black text-white border-black' : 'border-gray-100 text-gray-400 hover:border-black'}`}
                                    >
                                        Transparent
                                    </button>
                                </div>
                            </OptionGroup>

                            <OptionGroup label="Resolution (DPI)">
                                <div className="grid grid-cols-4 gap-3">
                                    {[72, 150, 300, 600].map(dpi => (
                                        <button
                                            key={dpi}
                                            onClick={() => setImageOptions({ ...imageOptions, dpi })}
                                            className={`py-3 border rounded-xl text-[10px] font-black transition-all ${imageOptions.dpi === dpi ? 'bg-black text-white border-black' : 'border-gray-100 text-gray-400 hover:border-black'}`}
                                        >
                                            {dpi}
                                        </button>
                                    ))}
                                </div>
                            </OptionGroup>

                            <OptionGroup label="Page Selection">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setImageOptions({ ...imageOptions, pageRange: 'current' })}
                                        className={`flex-1 py-4 border rounded-xl text-left px-6 transition-all ${imageOptions.pageRange === 'current' ? 'border-black bg-black text-white' : 'border-gray-100 text-gray-400 hover:border-black'}`}
                                    >
                                        <div className="text-[10px] font-black uppercase tracking-widest">Active Page</div>
                                        <div className="text-[9px] mt-1 opacity-60">Sheet {state.currentPageIndex + 1}</div>
                                    </button>
                                    <button
                                        onClick={() => setImageOptions({ ...imageOptions, pageRange: 'all' })}
                                        className={`flex-1 py-4 border rounded-xl text-left px-6 transition-all ${imageOptions.pageRange === 'all' ? 'border-black bg-black text-white' : 'border-gray-100 text-gray-400 hover:border-black'}`}
                                    >
                                        <div className="text-[10px] font-black uppercase tracking-widest">Batch All Pages</div>
                                        <div className="text-[9px] mt-1 opacity-60">Sequential {state.pages.length} images</div>
                                    </button>
                                </div>
                            </OptionGroup>
                        </div>
                    )}

                    {activeTab === 'other' && (
                        <div className="grid grid-cols-1 gap-4">
                            <ActionButton
                                icon={<Printer size={18} />}
                                label="In-Browser Print"
                                description="Optimized for physical sheets"
                                onClick={printDocument}
                            />
                            <ActionButton
                                icon={<Type size={18} />}
                                label="Scalable Vector (SVG)"
                                description="Pure scalable paths for design tools"
                                onClick={() => exportToSVG(state.text, state.handwritingStyle, state.fontSize, state.inkColor, state.settings)}
                            />
                            <ActionButton
                                icon={shareSuccess ? <Check size={18} className="text-green-500" /> : isSharing ? <Loader2 size={18} className="animate-spin" /> : <Link size={18} />}
                                label={shareSuccess ? "Link Copied!" : "Shareable Mirror"}
                                description={shareSuccess ? "Anyone with this link can view your state" : "Generate a persistent link with state"}
                                onClick={async () => {
                                    setIsSharing(true);
                                    const success = await copyShareUrl(state);
                                    if (success) {
                                        setShareSuccess(true);
                                        setTimeout(() => setShareSuccess(false), 2000);
                                    }
                                    setIsSharing(false);
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                        <Check size={14} className="text-black" /> Ready for processing
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="py-4 px-10 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-gray-900 transition-all disabled:opacity-50 rounded-xl"
                    >
                        {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                        Process Export
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function OptionGroup({ label, children }: { label: string, children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-black/40">{label}</h4>
            {children}
        </div>
    );
}

function ActionButton({ icon, label, description, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="p-6 border border-gray-100 rounded-2xl flex items-center gap-6 text-left hover:border-black hover:shadow-xl transition-all group"
        >
            <div className="p-4 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                {icon}
            </div>
            <div className="flex-1">
                <div className="text-xs font-black uppercase tracking-widest text-black">{label}</div>
                <div className="text-[10px] text-gray-400 mt-1 font-medium">{description}</div>
            </div>
            <ChevronRight size={16} className="text-gray-200 group-hover:text-black transition-all" />
        </button>
    );
}
