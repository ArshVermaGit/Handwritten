import { motion } from 'framer-motion';
import { PenTool, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EditorPage() {
    return (
        <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center relative overflow-hidden selection:bg-indigo-500/30">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-500/10 rounded-full blur-[100px]" />
                 <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-rose-500/10 rounded-full blur-[100px]" />
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply" />
            </div>

            <div className="relative z-10 max-w-2xl px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-neutral-900/5 flex items-center justify-center border border-black/5 rotate-3">
                            <PenTool size={32} className="text-indigo-500" />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-6 border border-indigo-100">
                        <Sparkles size={12} /> Work in Progress
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold text-neutral-900 mb-6 tracking-tight leading-[1.1]">
                        The Canvas is <br/>
                        <span className="italic font-serif text-indigo-500">Drying.</span>
                    </h1>

                    <p className="text-xl text-neutral-500 mb-10 leading-relaxed font-medium">
                        We are crafting the ultimate distraction-free writing experience. 
                        Polishing the pixels, refining the ink, and ensuring it meets your soul's standards.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                            to="/"
                            className="px-8 py-4 bg-white border border-black/5 text-neutral-900 rounded-full font-bold hover:bg-gray-50 transition-colors flex items-center gap-2 group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                        </Link>
                        <button className="px-8 py-4 bg-neutral-900 text-white rounded-full font-bold shadow-xl shadow-neutral-900/20 hover:scale-105 active:scale-95 transition-all">
                            Notify When Ready
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-black/5 to-transparent" />
        </div>
    );
}
