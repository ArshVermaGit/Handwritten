import { motion } from 'framer-motion';
import { useStore } from '../lib/store';

export default function TextEditor() {
    const { text, setText } = useStore();

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const charCount = text.length;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-premium h-full flex flex-col"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold uppercase tracking-tighter">Drafting</h2>
                <button
                    onClick={() => setText('')}
                    className="text-gray-300 hover:text-black text-[10px] font-black uppercase tracking-[0.3em] transition-colors"
                >
                    Wipe
                </button>
            </div>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Manifest your thoughts..."
                className="input-minimal flex-1 resize-none font-sans text-sm bg-gray-50/30 min-h-[300px]"
            />

            <div className="flex justify-between items-center mt-6 text-[8px] font-black uppercase tracking-[0.4em] text-gray-300">
                <span>Characters: {charCount}</span>
                <span>Words: {wordCount}</span>
            </div>
        </motion.div>
    );
}
