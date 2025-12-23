import { motion } from 'framer-motion';
import CanvasRenderer from './CanvasRenderer';

export default function PreviewPanel() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card h-full flex flex-col"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-ink-900">Preview</h2>
            </div>

            <div className="flex-1 border border-ink-100 rounded-lg overflow-auto shadow-inner bg-ink-50/50 p-4 flex justify-center">
                <div className="min-w-[600px] w-full max-w-4xl bg-white shadow-2xl">
                    <CanvasRenderer />
                </div>
            </div>
        </motion.div>
    );
}
