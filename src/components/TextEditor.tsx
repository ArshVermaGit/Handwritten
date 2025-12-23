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
            className="card h-full flex flex-col"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-ink-900">Editor</h2>
                <button
                    onClick={() => setText('')}
                    className="text-ink-400 hover:text-ink-900 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                    Clear
                </button>
            </div>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start typing your story..."
                className="input-base flex-1 resize-none font-mono text-sm bg-ink-50/30"
                rows={12}
            />

            <div className="flex justify-between items-center mt-4 text-[10px] font-bold uppercase tracking-widest text-ink-400">
                <span>Chars: {charCount}</span>
                <span>Words: {wordCount}</span>
            </div>
        </motion.div>
    );
}
