import { useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageLayoutProps {
    title: string;
    subtitle?: string;
    description?: string;
    children: ReactNode;
}

export default function PageLayout({ title, subtitle, description, children }: PageLayoutProps) {
    useEffect(() => {
        document.title = `${title} | Handwritten - Premium Text to Handwriting`;
        
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', description || subtitle || "Transform digital text into realistic, organic handwriting instantly.");
        }

        // Canonical Tag
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        const path = window.location.pathname === '/' ? '' : window.location.pathname;
        canonical.setAttribute('href', `https://handwritten-git.vercel.app${path}`);
    }, [title, subtitle, description]);

    return (
        <div className="min-h-screen pt-40 pb-20 relative overflow-hidden">
             
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
                    className="bg-white rounded-3xl p-8 sm:p-12 shadow-premium border border-black/5 prose prose-neutral prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-neutral-900 prose-p:text-neutral-600 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-li:text-neutral-600"
                >
                    {children}
                </motion.div>
             </div>
        </div>
    );
}
