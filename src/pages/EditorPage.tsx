import { motion, AnimatePresence } from 'framer-motion';
import TextEditor from '../components/TextEditor';
import PreviewPanel from '../components/PreviewPanel';
import PageCustomizer from '../components/PageCustomizer';
import HandwritingCustomizer from '../components/HandwritingCustomizer';
import FontManager from '../components/FontManager';
import PresetsGallery from '../components/PresetsGallery';
import { useStore } from '../lib/store';
import { Settings2, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function EditorPage() {
    const { reset } = useStore();
    const [showPresets, setShowPresets] = useState(false);
    const [showConfig, setShowConfig] = useState(true);
    const [activeTab, setActiveTab] = useState<'config' | 'fidelity'>('config');

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <main className="flex-1 flex overflow-hidden">

                {/* Collapsible Configuration Sidebar */}
                <AnimatePresence mode="wait">
                    {showConfig && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 320, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="border-r border-gray-100 flex flex-col bg-white z-20"
                        >
                            <div className="p-6 flex flex-col h-full">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Engine Config</h2>
                                    <button onClick={() => setShowConfig(false)} className="p-2 hover:bg-gray-50"><ChevronLeft size={14} /></button>
                                </div>

                                <div className="flex border-b border-gray-50 mb-8">
                                    <button
                                        onClick={() => setActiveTab('config')}
                                        className={`flex-1 py-3 text-[8px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'config' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                                    >
                                        Assets
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('fidelity')}
                                        className={`flex-1 py-3 text-[8px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'fidelity' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                                    >
                                        Fidelity
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                                    {activeTab === 'config' ? (
                                        <div className="space-y-10">
                                            <FontManager />
                                            <PageCustomizer />
                                        </div>
                                    ) : (
                                        <HandwritingCustomizer />
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-50">
                                    <button
                                        onClick={() => setShowPresets(true)}
                                        className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-gray-900 transition-all"
                                    >
                                        <Sparkles size={14} /> Style Library
                                    </button>
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {!showConfig && (
                    <button
                        onClick={() => setShowConfig(true)}
                        className="fixed left-4 bottom-4 z-30 w-10 h-10 bg-black text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all"
                    >
                        <Settings2 size={16} />
                    </button>
                )}

                {/* Main Split Screen Area */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left: Text Editor (40%) */}
                    <div className="w-[40%] min-w-[400px] border-r border-gray-100 h-full overflow-hidden flex flex-col">
                        <TextEditor />
                    </div>

                    {/* Right: Live Preview (60%) */}
                    <div className="w-[60%] h-full overflow-hidden flex flex-col bg-gray-50/30">
                        <PreviewPanel />
                    </div>
                </div>
            </main>

            {/* Presets Modal */}
            <AnimatePresence>
                {showPresets && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-5xl h-[85vh] shadow-2xl p-12 relative flex flex-col"
                        >
                            <button
                                onClick={() => setShowPresets(false)}
                                className="absolute top-8 right-8 p-3 hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-12">
                                <h2 className="text-4xl font-bold uppercase tracking-tighter mb-2 text-black">Synthesis Library.</h2>
                                <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">Select your core handwriting engine model.</p>
                            </div>

                            <div className="flex-1 overflow-hidden">
                                <PresetsGallery />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
