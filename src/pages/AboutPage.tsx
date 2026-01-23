import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, ArrowRight } from 'lucide-react';
import photo from '../assets/arsh.jpg';

export default function AboutPage() {
    return (
        <div className="relative paper-texture overflow-hidden min-h-screen bg-[#F2F0E9]">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none mix-blend-multiply" />
            
             {/* Ambient Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-200/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-200/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-40 relative z-10">
                <div className="flex flex-col md:flex-row gap-20 items-start">

                    {/* Left Column: Photo Area - Polaroid Style */}
                    <motion.div
                        initial={{ opacity: 0, rotate: -5, x: -20 }}
                        animate={{ opacity: 1, rotate: -2, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full md:w-1/3 relative"
                    >
                        {/* Washi Tape */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-yellow-200/80 rotate-2 z-20 shadow-sm backdrop-blur-sm" />

                        <div className="bg-white p-4 pb-12 shadow-2xl shadow-ink/10 rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
                            <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
                                <img
                                    src={photo}
                                    alt="Arsh Verma"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-ink/20 to-transparent mix-blend-overlay" />
                            </div>
                            <div className="mt-4 text-center font-handwriting text-2xl text-ink/80">
                                Arsh Verma
                            </div>
                        </div>

                         {/* Decorative Doodle */}
                         <svg className="absolute -bottom-12 -right-12 w-32 h-32 text-accent/20 rotate-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 50 Q 50 10 90 50 T 50 90" />
                        </svg>
                    </motion.div>

                    {/* Right Column: Bio - Paper Note Style */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="w-full md:w-2/3"
                    >
                        <div className="mb-12 relative">
                            <span className="inline-block py-1 px-3 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6 transform -rotate-1">
                                The Developer
                            </span>
                            <h1 className="text-6xl md:text-8xl font-display font-black text-ink mb-6 tracking-tighter leading-[0.9]">
                                Hello, <br />
                                <span className="font-serif italic text-accent">I'm Arsh.</span>
                            </h1>
                            {/* Underline Scribble */}
                            <svg className="w-48 h-4 text-ink/20 ml-2" viewBox="0 0 200 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 100 10 200 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                            </svg>
                        </div>

                        <div className="bg-white p-8 md:p-12 shadow-xl shadow-ink/5 border border-black/5 rounded-sm relative">
                            {/* "Paper" lines background */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_29px,#00000005_30px)] bg-size-[100%_30px] pointer-events-none" />
                            
                            <div className="relative z-10 space-y-8 text-lg md:text-xl font-medium text-ink/70 leading-relaxed font-serif">
                                <p>
                                    <span className="font-sans font-bold text-ink uppercase tracking-wider text-xs block mb-2 opacity-40">About Me</span>
                                    I'm a student at VIT Bhopal with a passion for building digital experiences. 
                                    Whether it's developing games in Unity or creating tools like InkPad, I love the challenge of 
                                    turning a simple idea into something people can actually use and enjoy.
                                </p>
                                <p>
                                    I focus on making things that look great and work even better. 
                                    For me, coding isn't just about logic—it's about creating something that feels 
                                    <span className="font-handwriting text-2xl mx-2 text-accent">human</span> 
                                    on the other side of the screen.
                                </p>
                                <p className="text-ink font-bold font-sans text-base">
                                    Have a look around, and feel free to reach out if you'd like to collaborate!
                                </p>
                            </div>
                        </div>

                        <div className="mt-12 flex flex-wrap gap-4">
                            <SocialLink href="https://github.com/ArshVermaGit" icon={Github} label="GitHub" />
                            <SocialLink href="https://linkedin.com/in/arshverma" icon={Linkedin} label="LinkedIn" />
                            <SocialLink href="https://twitter.com/arshverma" icon={Twitter} label="Twitter" />
                            <SocialLink href="mailto:Arshverma.dev@gmail.com" icon={Mail} label="Email Me" />
                        </div>

                        <div className="mt-12 pt-8 border-t border-black/5">
                            <a
                                href="https://www.arshcreates.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-3 text-ink font-black uppercase tracking-widest text-xs hover:text-accent transition-colors"
                            >
                                View Portfolio <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

interface SocialLinkProps {
    href: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
}

function SocialLink({ href, icon: Icon, label }: SocialLinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 bg-white border border-black/5 shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1 transition-all group"
        >
            <Icon size={18} className="text-ink/40 group-hover:text-ink transition-colors" />
            <span className="text-xs font-bold uppercase tracking-widest text-ink/60 group-hover:text-ink transition-colors">{label}</span>
        </a>
    );
}
