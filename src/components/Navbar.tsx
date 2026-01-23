import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

import logo from '../assets/logo.png';
import UserMenu from './UserMenu';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Editor', path: '/editor' },
    { name: 'About', path: '/about' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { user, setAuthModalOpen } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'py-3 bg-[#F2F0E9]/95 backdrop-blur-sm border-b border-black/5 shadow-sm'
                    : 'py-5 bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img 
                            src={logo} 
                            alt="InkPad Logo" 
                            className="w-14 h-14 object-contain transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 drop-shadow-md" 
                        />
                        <span className="text-2xl font-display font-bold tracking-tight text-ink uppercase">InkPad</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-10">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 relative group pb-1 ${location.pathname === item.path ? 'text-ink' : 'text-ink/40 hover:text-ink'
                                    }`}
                            >
                                {item.name}
                                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-accent transition-all duration-500 ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                                    }`} />
                            </Link>
                        ))}
                        
                        <div className="pl-4 border-l border-ink/10">
                            <UserMenu />
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-ink"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute top-full left-4 right-4 mt-2 glass border border-black/5 p-8 flex flex-col gap-6 md:hidden shadow-2xl rounded-2xl"
                        >
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-xl font-display font-bold uppercase tracking-widest ${location.pathname === item.path ? 'text-ink' : 'text-ink/30'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-black/5">
                                {user ? (
                                    <div className="flex items-center gap-3">
                                        <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
                                        <span className="font-bold text-ink">{user.name}</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setAuthModalOpen(true);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full btn-premium text-center uppercase tracking-widest py-4"
                                    >
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
            <AuthModal />
        </>
    );
}
