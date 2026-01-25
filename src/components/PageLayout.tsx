import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageLayoutProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

export default function PageLayout({ title, subtitle, children }: PageLayoutProps) {
    return (
        <div className="min-h-screen bg-paper pt-28 pb-20 relative overflow-hidden">
             {/* Background Pattern */}
             <div className="absolute inset-0 bg-[radial-gradient(#00000005_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
             
             <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-neutral-900 mb-6 tracking-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-lg md:text-xl text-neutral-500 font-serif italic max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-black/5 prose prose-neutral prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-neutral-900 prose-p:text-neutral-600 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-li:text-neutral-600"
                >
                    {children}
                </motion.div>
             </div>
        </div>
    );
}
