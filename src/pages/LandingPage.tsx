import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Keyboard,
    PenTool,
    Layers,
    Download,
    Zap,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import { useStore } from '../lib/store';
import CanvasRenderer from '../components/CanvasRenderer';

export default function LandingPage() {
    const { text, setText } = useStore();
    const { scrollYProgress } = useScroll();
    const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

    const features = [
        {
            title: 'Precision Rendering',
            desc: 'Our proprietary algorithm replicates the nuances of natural handwriting speed and pressure.',
            icon: <PenTool className="w-6 h-6" />
        },
        {
            title: 'Monochromatic Design',
            desc: 'A focused, distraction-free interface designed for modern document creation.',
            icon: <Layers className="w-6 h-6" />
        },
        {
            title: 'Instant PDF Export',
            desc: 'High-fidelity exports that look identical to authentic scanned physical paper.',
            icon: <Download className="w-6 h-6" />
        },
        {
            title: 'Blazing Fast',
            desc: 'Real-time previews with virtually zero latency, powered by high-performance canvas logic.',
            icon: <Zap className="w-6 h-6" />
        }
    ];

    const useCases = [
        { title: 'Students', desc: 'Convert digital notes to authentic-looking handwritten assignments.' },
        { title: 'Journaling', desc: 'Preserve the feeling of handwriting in your digital diary.' },
        { title: 'Personalized Mail', desc: 'Create letters that feel deeply personal and sincere.' },
        { title: 'Professional Docs', desc: 'Add a human touch to digital signatures and memos.' }
    ];

    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="section-padding flex flex-col items-center justify-center min-h-[90vh] text-center bg-white">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl"
                >
                    <div className="inline-block px-4 py-1.5 mb-8 border border-black/10 rounded-full">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">The Future of Digital Ink</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-display mb-8 tracking-tighter leading-tight font-extrabold">
                        Transform Text into <br />
                        <span className="relative inline-block">
                            Perfect Handwriting
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                className="absolute -bottom-2 left-0 h-1 bg-black/10"
                            />
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                        The minimalist tool to generate beautiful, professional handwritten pages from digital text instantly.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/editor" className="btn-minimal-primary text-sm tracking-widest uppercase flex items-center gap-3">
                            Start Writing <ArrowRight size={16} />
                        </Link>
                        <Link to="/gallery" className="btn-minimal-secondary text-sm tracking-widest uppercase">
                            View Showcase
                        </Link>
                    </div>
                </motion.div>

                {/* Floating Handwriting Animation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10"
                >
                    <div className="font-handwriting text-[20vw] absolute -top-10 -left-10 opacity-20 transform -rotate-12">write</div>
                    <div className="font-script text-[15vw] absolute bottom-20 right-10 opacity-10 transform rotate-12">create</div>
                </motion.div>
            </section>

            {/* Live Demo Section */}
            <section className="bg-gray-100 section-padding overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl mb-6 tracking-tight">Experience Real-time Magic.</h2>
                            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                                Watch as your typed characters instantly transform into unique, flowing handwriting. Customize line spacing, ink depth, and paper texture to match your vision.
                            </p>

                            <div className="space-y-4">
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Type anything here..."
                                    className="input-minimal h-32 text-lg italic"
                                />
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Try it above to see the transformation →
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            style={{ y: yParallax }}
                            className="relative"
                        >
                            <div className="card-premium h-[500px] overflow-hidden rotate-2 shadow-2xl">
                                <CanvasRenderer />
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-black -z-10" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="section-padding bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-24 text-center">
                        <h2 className="text-4xl md:text-5xl mb-6">Built for Excellence.</h2>
                        <div className="w-12 h-1 bg-black mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="card-premium h-full"
                            >
                                <div className="mb-6 p-3 inline-block bg-gray-100">{feature.icon}</div>
                                <h3 className="text-xl mb-4 uppercase tracking-tighter">{feature.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="section-padding bg-black text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                        <div>
                            <h2 className="text-5xl md:text-7xl mb-12 tracking-tighter leading-none">A New Way <br />to Think.</h2>
                            <p className="text-gray-400 text-xl leading-relaxed">
                                InkPad isn't just a tool; it's a bridge between the digital convenience of today and the timeless warmth of traditional writing.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                            {useCases.map((item) => (
                                <div key={item.title}>
                                    <h4 className="flex items-center gap-3 text-lg font-bold uppercase tracking-widest mb-4">
                                        <CheckCircle2 size={18} className="text-white" />
                                        {item.title}
                                    </h4>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-white text-center border-t border-gray-100">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-5xl md:text-7xl mb-12 tracking-tighter">Ready to create?</h2>
                    <Link to="/editor" className="btn-minimal-primary px-12 py-5 text-lg tracking-widest uppercase">
                        Initialize Workspace
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
