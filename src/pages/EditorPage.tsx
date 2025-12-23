import { motion } from 'framer-motion';
import TextEditor from '../components/TextEditor';
import PreviewPanel from '../components/PreviewPanel';
import PageCustomizer from '../components/PageCustomizer';
import ExportManager from '../components/ExportManager';
import FontManager from '../components/FontManager';
import { useStore } from '../lib/store';
import { RefreshCw } from 'lucide-react';

export default function EditorPage() {
    const { reset } = useStore();

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24">
            <div className="max-w-[1600px] w-full mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Controls Column */}
                    <aside className="lg:col-span-3 space-y-8">
                        <TextEditor />

                        <div className="card-premium relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <button
                                    onClick={reset}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                                    title="Reset Workspace"
                                >
                                    <RefreshCw size={14} className="text-gray-400 group-hover:text-black transition-colors" />
                                </button>
                            </div>
                            <div className="mb-8">
                                <h2 className="text-xl font-bold uppercase tracking-tighter">Configuration</h2>
                                <div className="w-8 h-0.5 bg-black mt-2" />
                            </div>

                            <FontManager />

                            <div className="h-px bg-gray-100 my-10" />

                            <PageCustomizer />
                        </div>
                    </aside>

                    {/* Preview Column */}
                    <section className="lg:col-span-6">
                        <PreviewPanel />
                    </section>

                    {/* Actions Column */}
                    <aside className="lg:col-span-3 space-y-8">
                        <ExportManager />

                        <div className="card-premium bg-black text-white p-10">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-4">Pro Insight</span>
                            <h3 className="text-xl font-bold mb-6 italic tracking-tight">"Typography is Voice."</h3>
                            <p className="text-gray-400 text-xs leading-loose font-medium opacity-80">
                                Each handwriting engine has its own personality. Use 'Caveat' for quick notes, 'Dancing Script' for elegant correspondence, and 'Permanent Marker' for bold emphasis.
                            </p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center"
                        >
                            <div className="inline-block p-1 border border-black/5 rounded-full">
                                <div className="bg-green-500 w-2 h-2 rounded-full animate-pulse" />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-[0.4em] ml-2 text-gray-400">System Reactive</span>
                        </motion.div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
