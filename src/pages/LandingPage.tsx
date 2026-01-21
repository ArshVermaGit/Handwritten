import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    PenTool,
    Layers,
    Download,
    Zap
} from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

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
            {/* Hero Section V3 - Living Canvas / Creative Desk */}
            <section className="relative min-h-screen flex items-start justify-center overflow-hidden bg-[#F2F0E9] pt-32 lg:pt-40">
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none mix-blend-multiply" />
                
                {/* Ambient Background Blobs (Warm & Organic) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div 
                        className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-orange-200/20 rounded-full blur-[100px]" 
                    />
                    <div 
                        className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-[100px]" 
                    />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        
                        {/* Left: Text Content */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-center lg:text-left relative"
                        >
                            <motion.div
                                initial={{ rotate: -5, opacity: 0 }}
                                animate={{ rotate: -2, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="inline-block mb-6 relative"
                            >
                                <div className="absolute inset-0 bg-yellow-200/50 transform rotate-2 rounded-sm blur-sm" />
                                <span className="relative font-handwriting text-2xl text-ink/70 font-bold block px-2">
                                    Notes that feel real.
                                </span>
                            </motion.div>

                            <h1 className="text-7xl md:text-9xl font-display font-black text-ink tracking-tighter mb-8 leading-[0.85] relative">
                                <span className="block text-transparent bg-clip-text bg-linear-to-br from-ink to-ink/70">Creative</span>
                                <span className="block italic font-serif text-accent relative">
                                    InkPad
                                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                                    </svg>
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-ink/60 mb-10 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed font-serif italic">
                                "The warmth of paper, captured in pixels."
                            </p>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                <button
                                    className="group relative px-8 py-4 bg-ink text-white rounded-2xl overflow-hidden shadow-2xl shadow-ink/20 hover:-translate-y-1 transition-all duration-300"
                                    onClick={() => navigate('/editor')}
                                >
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <span className="relative flex items-center gap-3 text-sm font-black tracking-[0.2em] uppercase">
                                        Start Creating <PenTool size={16} />
                                    </span>
                                </button>
                                <motion.div 
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                    className="px-6 py-4 bg-white/50 backdrop-blur-sm border border-black/5 rounded-2xl text-ink text-sm font-bold shadow-sm cursor-pointer"
                                >
                                    ✍️ No signup needed
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Right: Creative Desk Composition */}
                        <div className="relative w-full max-w-lg lg:max-w-xl aspect-square">
                             {/* Main Paper Sheet */}
                            <motion.div
                                initial={{ opacity: 0, rotate: 5, y: 50 }}
                                animate={{ opacity: 1, rotate: -3, y: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="absolute inset-4 bg-white shadow-2xl shadow-ink/10 rounded-sm p-8 flex flex-col items-center justify-center text-center transform origin-bottom-right transition-transform hover:rotate-0 hover:scale-[1.02] duration-500"
                            >
                                <div className="w-full h-full border border-black/5 p-6 flex flex-col items-center justify-center bg-[radial-gradient(#00000003_1px,transparent_1px)] bg-size-[16px_16px]">
                                    <p className="font-handwriting text-5xl text-ink mb-2">Hello World!</p>
                                    <p className="font-handwriting text-2xl text-accent/80">This is digital ink.</p>
                                    <div className="mt-8 w-32 h-1 bg-black/5 rounded-full" />
                                </div>
                            </motion.div>

                            {/* Sticky Note */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1, rotate: 12 }}
                                transition={{ duration: 0.6, delay: 0.8, type: "spring" }}
                                className="absolute -top-4 -right-4 w-40 h-40 bg-yellow-200 shadow-lg shadow-yellow-500/10 p-4 flex items-center justify-center transform hover:rotate-6 transition-transform"
                            >
                                <p className="font-handwriting text-xl text-ink/70 leading-tight">Don't forget to write today!</p>
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-yellow-300/50 blur-[1px]" />
                            </motion.div>

                            {/* Polaroid Photo */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1, rotate: -15 }}
                                transition={{ duration: 0.6, delay: 1, type: "spring" }}
                                className="absolute -bottom-8 -left-8 bg-white p-3 pb-8 shadow-xl shadow-black/10 transform hover:rotate-[-10deg] transition-transform w-48"
                            >
                                <div className="w-full h-32 bg-gray-100 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-accent/20" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Layers size={32} className="text-white drop-shadow-md" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
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
                                <div className="mb-8 w-14 h-14 bg-white rounded-xl border border-black/5 shadow-sm flex items-center justify-center text-accent transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
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

            {/* Use Cases Section - FIXED VISIBILITY */}
            <section className="section-padding relative overflow-hidden bg-[#1A1F2C] text-white">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05)_0%,transparent_60%)] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                        <div>
                            <motion.h2 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-6xl md:text-8xl font-display font-black mb-10 tracking-tighter leading-none"
                            >
                                Dedicated to <br /><span className="text-accent italic font-serif">Writing.</span>
                            </motion.h2>
                            <p className="text-white/60 text-xl leading-relaxed max-w-lg font-medium">
                                InkPad brings back the simple joy of writing by hand in a digital world. No distractions, just you and your thoughts.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
                            {useCases.map((item, i) => (
                                <motion.div 
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <h4 className="flex items-center gap-4 text-xs font-black text-accent uppercase tracking-[0.3em] mb-4">
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
                        className="bg-white p-20 rounded-[3rem] border border-black/5 shadow-2xl shadow-ink/10 overflow-hidden relative"
                    >
                        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-accent to-transparent opacity-20" />
                        
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
