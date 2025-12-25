import { useRef, useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { Wand2, Sparkles, Type, Info, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TextEditor() {
    const {
        text,
        setText,
        currentPageIndex,
        isHumanizeEnabled,
        toggleHumanize,
        applyHumanize,
        humanizeIntensity,
        setHumanizeIntensity
    } = useStore();

    const [localText, setLocalText] = useState(text);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Sync with store on page switch
    useEffect(() => {
        setLocalText(text);
    }, [text, currentPageIndex]);

    // Debounced update to store
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localText !== text) {
                setText(localText);
            }
        }, 150);
        return () => clearTimeout(timer);
    }, [localText, text, setText]);

    const charCount = localText.length;
    const wordCount = localText.trim() ? localText.trim().split(/\s+/).length : 0;
    const pageCount = Math.ceil(charCount / 2000) || 1;

    return (
        <div className="h-full flex flex-col p-12 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gray-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />

            {/* Header */}
            <div className="mb-8 relative z-10">
                <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-gray-900 text-[10px] font-black tracking-[0.2em] text-white rounded-full uppercase">
                        Editor v2.0
                    </span>
                    <div className="h-px w-12 bg-gray-100" />
                </div>
                <h1 className="text-4xl text-gray-900 font-bold tracking-tight mb-3">
                    Your Handwriting, <span className="text-gray-300 italic font-light">Refined.</span>
                </h1>
                <p className="text-gray-400 text-sm font-medium max-w-md leading-relaxed">
                    Type your text below. Our "Infinity" engine ensures every baseline is perfectly captured on paper.
                </p>
            </div>

            {/* AI Humanizer Banner */}
            <AnimatePresence>
                {isHumanizeEnabled && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 flex items-center justify-between shadow-sm relative z-10"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-indigo-900">AI Humanizer Active</h4>
                                <p className="text-[10px] text-indigo-500 font-medium">Adding natural variations and imperfections...</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col gap-1 min-w-[120px]">
                                <div className="flex justify-between text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
                                    <span>Intensity</span>
                                    <span>{Math.round(humanizeIntensity * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={humanizeIntensity}
                                    onChange={(e) => setHumanizeIntensity(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-indigo-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>
                            <button
                                onClick={applyHumanize}
                                className="px-4 h-9 bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                            >
                                Apply Now
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Textarea Container */}
            <div className="flex-1 relative z-10 group">
                <textarea
                    ref={textareaRef}
                    value={localText}
                    onChange={(e) => setLocalText(e.target.value)}
                    spellCheck={false}
                    placeholder="Start typing your story..."
                    className="w-full h-full p-8 text-lg leading-loose resize-none bg-[#FAFAFA] border-2 border-gray-100 rounded-[2rem] focus:outline-none focus:border-black focus:bg-white transition-all placeholder:text-gray-200 placeholder:italic text-gray-800 shadow-inner group-hover:border-gray-200"
                    style={{ lineHeight: '2.4' }}
                />

                {/* Floating Tooltips or Actions */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setLocalText('')}
                        className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-100 shadow-sm transition-all"
                    >
                        <RotateCcw size={16} />
                    </button>
                    <button
                        onClick={toggleHumanize}
                        className={`p-2 border rounded-xl shadow-sm transition-all ${isHumanizeEnabled ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-100 text-gray-400 hover:text-indigo-600 hover:border-indigo-100'}`}
                    >
                        <Wand2 size={16} />
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="mt-8 flex justify-between items-center px-8 py-5 bg-gray-50/50 rounded-3xl border border-gray-100 relative z-10">
                <div className="flex gap-8">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Characters</span>
                        <span className="text-sm font-black text-gray-900">{charCount.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Words</span>
                        <span className="text-sm font-black text-gray-900">{wordCount.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Page Balance</span>
                        <span className="text-sm font-black text-gray-900">{pageCount} Sheets</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-lg shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                        <span className="text-[10px] font-bold text-gray-500 whitespace-nowrap uppercase tracking-tighter">Sync Active</span>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                        <Type size={16} />
                    </div>
                </div>
            </div>

            {/* Legend / Info */}
            <div className="absolute bottom-6 left-12 flex items-center gap-2 text-[10px] text-gray-300 font-medium">
                <Info size={12} />
                <span>Scroll to add more space. New pages are generated automatically once lines are full.</span>
            </div>
        </div>
    );
}
