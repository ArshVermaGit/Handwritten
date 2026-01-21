import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    PenTool,
    Layers,
    Download,
    Zap,
    ArrowRight
} from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const yParallaxFast = useTransform(scrollYProgress, [0, 1], [0, -300]);
    const yParallaxMedium = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const yParallaxSlow = useTransform(scrollYProgress, [0, 1], [0, -50]);

    const features = [
        {
            title: 'Real Feel',
            desc: 'Captures the rhythm of a real pen, making your writing feel alive.',
            icon: <PenTool className="w-6 h-6" />
        },
        {
            title: 'Your Space',
            desc: 'A simple, clean place for you to just write.',
            icon: <Layers className="w-6 h-6" />
        },
        {
            title: 'Looks Like Paper',
            desc: 'Exports that look exactly like a scanned letter.',
            icon: <Download className="w-6 h-6" />
        },
        {
            title: 'Instant Ink',
            desc: 'See your words appear instantly as you type.',
            icon: <Zap className="w-6 h-6" />
        }
    ];

    const useCases = [
        { title: 'Students', desc: 'Turn your typed notes into realistic handwritten assignments.' },
        { title: 'Journaling', desc: 'Keep the personal feel of a diary in a digital format.' },
        { title: 'Letters', desc: 'Create notes that feel personal and sincere.' },
        { title: 'Professional', desc: 'Add a human touch to your digital signatures and memos.' }
    ];

    return (
        <div className="relative paper-texture overflow-hidden">
            {/* Hero Section */}
            <section className="section-padding flex flex-col items-center justify-center min-h-screen text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-5xl"
                >
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 mb-10 glass rounded-full border border-black/5"
                    >
                        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/60">New: Our Best Ink Yet</span>
                    </motion.div>

                    <h1 className="text-7xl md:text-9xl mb-10 tracking-tight leading-[0.9] font-black text-ink">
                        <span className="block overflow-hidden">
                            <motion.span
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="inline-block"
                            >
                                Make it
                            </motion.span>
                        </span>
                        <span className="block overflow-hidden">
                            <motion.span
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="block italic font-serif hero-text-shimmer"
                            >
                                Personal.
                            </motion.span>
                        </span>
                    </h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="text-xl md:text-2xl text-ink/60 mb-16 max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        Turn your notes into handwritten documents. Get the feel of real ink with the ease of digital editing.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center"
                    >
                        <button
                            className="btn-premium rounded-xl text-xs py-5 px-10 group"
                            onClick={() => navigate('/editor')}
                        >
                            Start Writing 
                            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </button>

                    </motion.div>
                </motion.div>

                {/* Animated Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                >
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black text-ink/30 translate-x-[0.2em]">Scroll</span>
                    <div className="w-6 h-10 border border-ink/10 rounded-full relative bg-ink/5">
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-accent rounded-full scroll-indicator-dot" />
                    </div>
                </motion.div>

                {/* Background Floating Elements */}
                <div className="absolute inset-0 pointer-events-none select-none -z-10 overflow-hidden">
                    <motion.div
                        style={{ y: yParallaxSlow }}
                        className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_center,var(--color-accent)_0%,transparent_70%)]"
                    />

                    <motion.div
                        style={{ y: yParallaxMedium }}
                        className="font-handwriting text-[25vw] absolute -top-10 -left-20 text-ink/2 italic -rotate-12 blur-3xl select-none"
                    >
                        type
                    </motion.div>

                    <motion.div
                        style={{ y: yParallaxFast, rotate: 8 }}
                        className="font-script text-[18vw] absolute top-1/2 -right-20 text-ink/2 blur-2xl select-none"
                    >
                        write
                    </motion.div>

                    <motion.div
                        style={{ y: yParallaxSlow, rotate: -5 }}
                        className="font-serif italic text-[12vw] absolute bottom-20 left-10 text-ink/2 blur-3xl select-none"
                    >
                        create
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="section-padding relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-32 text-center">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-6xl font-display font-black text-ink mb-6"
                        >
                            Made for <br /><span className="text-accent italic font-serif">Writers.</span>
                        </motion.h2>
                        <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: 80 }}
                            viewport={{ once: true }}
                            className="h-1 bg-accent mx-auto rounded-full" 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="card-premium group"
                            >
                                <div className="mb-8 w-14 h-14 glass rounded-2xl flex items-center justify-center text-accent transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 border border-black/5">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-display font-black text-ink mb-4 tracking-tight uppercase">{feature.title}</h3>
                                <p className="text-ink/50 text-sm leading-relaxed font-medium">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="section-padding relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-ink pointer-events-none -z-10" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,var(--color-ink-light)_0%,transparent_70%)] opacity-30 -z-10" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                        <div>
                            <motion.h2 
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-6xl md:text-8xl font-display font-black text-white mb-10 tracking-tighter leading-none"
                            >
                                Dedicated to <br /><span className="text-accent italic font-serif">Writing.</span>
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-white/40 text-xl leading-relaxed max-w-lg font-medium"
                            >
                                InkPad brings back the simple joy of writing by hand in a digital world.
                            </motion.p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
                            {useCases.map((item, i) => (
                                <motion.div 
                                    key={item.title}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <h4 className="flex items-center gap-4 text-xs font-black text-white uppercase tracking-[0.3em] mb-6">
                                        <div className="w-8 h-px bg-accent" />
                                        {item.title}
                                    </h4>
                                    <p className="text-white/50 text-sm leading-relaxed font-medium">
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding relative text-center">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="glass p-20 rounded-[3rem] border border-black/5 shadow-2xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-accent to-transparent opacity-30" />
                        
                        <h2 className="text-5xl md:text-7xl font-display font-black text-ink mb-8 tracking-tighter italic">Ready to create?</h2>
                        <p className="text-ink/40 text-lg mb-12 max-w-xl mx-auto font-medium">
                            Rediscover the simple beauty of a pen on paper.
                        </p>
                        <button
                            className="btn-premium rounded-2xl px-16 py-6 text-sm tracking-[0.2em] shadow-2xl shadow-ink/20 hover:scale-105 active:scale-95 transition-all mx-auto"
                            onClick={() => navigate('/editor')}
                        >
                            Open Editor
                        </button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
