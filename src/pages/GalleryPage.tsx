import { motion } from 'framer-motion';
import { LayoutGrid, FileText, Square, Grid } from 'lucide-react';

export default function GalleryPage() {
    const templates = [
        { name: 'Lined Classic', icon: <FileText className="w-8 h-8" /> },
        { name: 'Pure White', icon: <Square className="w-8 h-8" /> },
        { name: 'Grid Master', icon: <Grid className="w-8 h-8" /> },
        { name: 'Laboratory', icon: <LayoutGrid className="w-8 h-8" /> },
    ];

    return (
        <div className="section-padding bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-2xl mb-24">
                    <h1 className="text-5xl md:text-7xl mb-8 tracking-tighter">Paper Gallery.</h1>
                    <p className="text-gray-500 text-xl font-medium">
                        Explore our collection of specialized paper layouts.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {templates.map((template, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group cursor-default"
                        >
                            <div className="card-premium aspect-[3/4] flex flex-col items-center justify-center p-12">
                                <div className="mb-8 text-gray-300">
                                    {template.icon}
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-center">{template.name}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
