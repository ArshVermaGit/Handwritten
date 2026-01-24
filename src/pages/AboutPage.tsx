import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, ArrowRight } from 'lucide-react';
import photo from '../assets/arsh.jpg';
import React from 'react';

export default function AboutPage() {
    return (
        <div className="bg-[#FAF9F6] min-h-screen overflow-x-hidden selection:bg-accent/30">
            {/* Ambient Background - Exact match to Landing Page */}
            <div className="absolute inset-0 bg-[#FBFBFB]">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-rose-100/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-100/30 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
            </div>

            <AboutHero />
            
            {/* Minimal footer spacing if needed, but the page content handles height */}
        </div>
    );
}

function AboutHero() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY, currentTarget } = e;
        const { width, height, left, top } = currentTarget.getBoundingClientRect();
        mouseX.set((clientX - left) / width - 0.5);
        mouseY.set((clientY - top) / height - 0.5);
    };

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

    return (
        <section 
            onMouseMove={handleMouseMove}
            className="relative min-h-screen flex flex-col items-center justify-center pt-10 pb-20 px-4 perspective-1000 overflow-hidden"
        >
             <div className="relative z-10 text-center max-w-5xl mx-auto mb-10">
                 {/* Header removed as requested */}
            </div>

            {/* 3D Content Container - Matching Landing Page Structure */}
            <motion.div 
                style={{ rotateX, rotateY }}
                className="relative w-full max-w-6xl mx-auto perspective-1000"
            >
                <div className="relative bg-white rounded-xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-black/5 p-2 md:p-4 transition-transform duration-200 ease-out">
                     {/* Window Controls */}
                     <div className="absolute top-6 left-6 flex gap-2 z-20">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                     </div>

                     {/* Content Area */}
                     <div className="w-full bg-[#FAFAFA] rounded-md overflow-hidden relative min-h-[600px] flex flex-col md:flex-row">
                        
                        {/* Sidebar / Left Column (Photo) */}
                        <div className="w-full md:w-1/3 bg-white border-r border-black/5 p-8 flex flex-col items-center pt-20">
                            <div className="relative w-48 h-48 md:w-56 md:h-56 mb-8">
                                <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl transform translate-y-4" />
                                <img 
                                    src={photo} 
                                    alt="Arsh Verma" 
                                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl relative z-10"
                                />
                                <div className="absolute bottom-4 right-4 z-20 bg-white p-2 rounded-full shadow-md">
                                    <span className="text-2xl">👋</span>
                                </div>
                            </div>
                            
                            <h3 className="font-display font-bold text-2xl text-ink mb-1">Arsh Verma</h3>
                            <p className="text-xs font-black tracking-widest uppercase text-ink/40 mb-8">Developer & Designer</p>

                            <div className="flex gap-4">
                                <SocialLink href="https://github.com/ArshVermaGit" icon={Github} />
                                <SocialLink href="https://linkedin.com/in/arshverma" icon={Linkedin} />
                                <SocialLink href="https://twitter.com/arshverma" icon={Twitter} />
                                <SocialLink href="mailto:Arshverma.dev@gmail.com" icon={Mail} />
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 p-8 md:p-16 bg-[radial-gradient(#00000005_1px,transparent_1px)] bg-size-[16px_16px]">
                             <div className="max-w-2xl mx-auto space-y-8">
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 rotate-1 hover:rotate-0 transition-transform duration-300">
                                    <h4 className="font-bold text-ink mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-accent" /> About Me
                                    </h4>
                                    <p className="text-ink/70 leading-relaxed font-serif text-lg">
                                        I'm a student at <span className="font-bold text-ink">VIT Bhopal</span> with a passion for building digital experiences. 
                                        Whether it's developing games in Unity or creating tools like InkPad, I love the challenge of 
                                        turning a simple idea into something people can actually use and enjoy.
                                    </p>
                                </div>

                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 -rotate-1 hover:rotate-0 transition-transform duration-300">
                                    <h4 className="font-bold text-ink mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-rose-400" /> Philosophy
                                    </h4>
                                    <p className="text-ink/70 leading-relaxed font-serif text-lg">
                                        I focus on making things that look great and work even better. 
                                        For me, coding isn't just about logic—it's about creating something that feels 
                                        <span className="font-handwriting text-2xl mx-2 text-accent">human</span> 
                                        on the other side of the screen.
                                    </p>
                                </div>

                                <div className="pt-8">
                                    <a
                                        href="https://www.arshcreates.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-full font-bold hover:shadow-xl hover:shadow-neutral-900/20 transition-all"
                                    >
                                        View Portfolio <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                             </div>
                        </div>

                     </div>
                </div>
            </motion.div>
        </section>
    );    
}

function SocialLink({ href, icon: Icon }: { href: string, icon: React.ElementType }) {
    return (
        <a 
            href={href} 
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white border border-black/5 rounded-full flex items-center justify-center text-ink/60 hover:text-ink hover:bg-gray-50 hover:scale-110 transition-all shadow-sm"
        >
            <Icon size={18} />
        </a>
    )
}
