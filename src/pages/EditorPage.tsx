import { motion, AnimatePresence } from 'framer-motion';
import TextEditor from '../components/TextEditor';
import PreviewPanel from '../components/PreviewPanel';
import EditorSidebar from '../components/EditorSidebar';
import PresetsGallery from '../components/PresetsGallery';
import { useStore } from '../lib/store';
import { X } from 'lucide-react';

export default function EditorPage() {
    const { isSettingsOpen, setSettingsOpen } = useStore();

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden relative">

            {/* Main Editor Layout: Three Panels */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* LEFT SIDEBAR (280px) - Controls */}
                <motion.div
                    initial={{ x: -280, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-[280px] shrink-0"
                >
                    <EditorSidebar />
                </motion.div>

                {/* CENTER INPUT AREA (Flex grow) */}
                <motion.main
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 flex flex-col overflow-hidden bg-white"
                >
                    <TextEditor />
                </motion.main>

                {/* RIGHT PREVIEW PANEL (420px) */}
                <motion.aside
                    initial={{ x: 420, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="w-[420px] shrink-0 bg-[#F5F5F5] border-l border-gray-200"
                >
                    <PreviewPanel />
                </motion.aside>
            </div>

            {/* Presets Modal (Style Library) */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-6xl h-[85vh] rounded-2xl overflow-hidden flex flex-col relative shadow-2xl border border-gray-100"
                        >
                            <div className="p-8 flex justify-between items-start border-b border-gray-100">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight mb-1 text-black">Style Library</h2>
                                    <p className="text-gray-500 text-sm">Instantly transform your handwriting with curated presets.</p>
                                </div>
                                <button
                                    onClick={() => setSettingsOpen(false)}
                                    className="p-3 bg-gray-100 hover:bg-black hover:text-white rounded-full transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-hidden p-8">
                                <PresetsGallery />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
