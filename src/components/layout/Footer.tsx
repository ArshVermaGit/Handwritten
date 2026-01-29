import { Github, Twitter, Linkedin, Heart } from 'lucide-react';
const logo = '/images/logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';

export default function Footer() {
    const navigate = useNavigate();
    const location = useLocation();

    // Helper for smooth scrolling
    const scrollToSection = (id: string) => {
        if (location.pathname !== '/') {
            navigate('/#' + id);
            // After navigation, the browser's default hash handling might take over,
            // or we might need a small delay/effect on the LandingPage.
            return;
        }

        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    return (
        <motion.footer 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="pt-24 pb-8 border-t border-black/5 relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-10 lg:gap-8 mb-12 sm:mb-16">
                    {/* Brand Column */}
                    <motion.div variants={itemVariants} className="col-span-2 lg:col-span-4">
                        <Link to="/" className="flex items-center gap-3 mb-6 group">
                             <img src={logo} alt="Handwritten" className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform duration-500" />
                             <span className="font-display font-bold text-2xl tracking-tight text-neutral-900">Handwritten.</span>
                        </Link>
                        <p className="text-neutral-500 leading-relaxed max-w-sm text-sm font-medium">
                            A digital sanctuary for your thoughts. We blend the nostalgia of analog writing with the power of modern technology.
                        </p>
                    </motion.div>

                    {/* Navigation Columns */}
                    <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2">
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-neutral-400 mb-6 focus:outline-none">Product</h4>
                        <ul className="space-y-4">
                            <li><Link to="/features" className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-bold">Features</Link></li>
                            <li><Link to="/how-it-works" className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-bold">How It Works</Link></li>
                            <li><button onClick={() => scrollToSection('editor')} className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-bold text-left group flex items-center gap-2">Editor <span className="w-1 h-1 rounded-full bg-neutral-200 group-hover:bg-indigo-500 transition-colors" /></button></li>
                        </ul>
                    </motion.div>

                    <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2">
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-neutral-400 mb-6">Support</h4>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-bold">About Us</Link></li>
                            <li><Link to="/contact" className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-bold">Contact</Link></li>
                            <li><Link to="/support" className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-bold">Support</Link></li>
                            <li><Link to="/faq" className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-bold">FAQ</Link></li>
                            <li><Link to="/changelog" className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-bold">Changelog</Link></li>
                        </ul>
                    </motion.div>

                    <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2">
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-neutral-400 mb-6">Legal</h4>
                        <ul className="space-y-3">
                            <li><Link to="/privacy" className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-bold">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-bold">Terms of Service</Link></li>
                            <li><Link to="/disclaimer" className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-bold">Disclaimer</Link></li>
                            <li><Link to="/cookies" className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-bold">Cookie Policy</Link></li>
                        </ul>
                    </motion.div>

                    <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2">
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-neutral-400 mb-6 focus:outline-none">Socials</h4>
                        <ul className="space-y-3">
                            <li><a href="https://x.com/TheArshVerma" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-sky-500 transition-colors flex items-center gap-3 text-sm font-bold"><Twitter size={14} /> X (Twitter)</a></li>
                            <li><a href="https://github.com/ArshVermaGit" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-purple-600 transition-colors flex items-center gap-3 text-sm font-bold"><Github size={14} /> GitHub</a></li>
                            <li><a href="https://www.linkedin.com/in/arshvermadev/" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-blue-600 transition-colors flex items-center gap-3 text-sm font-bold"><Linkedin size={14} /> LinkedIn</a></li>
                        </ul>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-black/5 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-4">
                        <p className="text-xs text-neutral-400 font-bold">
                            &copy; {new Date().getFullYear()} Handwritten. All rights reserved.
                        </p>
                        <a href="https://github.com/ArshVermaGit/Handwritten" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-900 transition-colors" title="View Source on GitHub">
                            <Github size={14} />
                        </a>
                    </div>
                    <p className="text-xs text-neutral-400 font-bold flex items-center gap-2">
                        Built with <Heart size={12} className="text-rose-500 fill-current" /> by <a href="https://www.linkedin.com/in/arshvermadev/" target="_blank" rel="noopener noreferrer" className="text-neutral-900 hover:underline underline-offset-4 font-black">Arsh Verma</a>
                    </p>
                </div>
            </div>
        </motion.footer>
    );
}
