import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
const logo = '/images/logo.png';
import UserMenu from '../UserMenu';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../lib/store';
import AuthModal from '../modals/AuthModal';

export default function Navbar() {
    const { user, setAuthModalOpen } = useAuth();
    const isNavbarVisible = useStore(state => state.isNavbarVisible);

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ 
                    y: isNavbarVisible ? 0 : -120,
                    opacity: isNavbarVisible ? 1 : 0,
                    scale: isNavbarVisible ? 1 : 0.95
                }}
                transition={{ 
                    duration: 0.5, 
                    ease: [0.16, 1, 0.3, 1],
                    opacity: { duration: 0.3 }
                }}
                className="fixed top-4 sm:top-8 left-0 right-0 z-50 px-4 sm:px-6 flex justify-center pointer-events-none"
            >
                <div className="w-full max-w-2xl glass rounded-4xl px-4 sm:px-8 py-2.5 sm:py-3 flex justify-between items-center pointer-events-auto ring-1 ring-black/5">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group relative">
                        <img 
                            src={logo} 
                            alt="Handwritten" 
                            className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform duration-500" 
                        />
                        <span className="hidden sm:inline text-xl sm:text-2xl font-display font-black text-neutral-900 tracking-tighter">Handwritten.</span>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <UserMenu />
                        ) : (
                            <button
                                onClick={() => setAuthModalOpen(true)}
                                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-neutral-900 text-white rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-neutral-900/10 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                            >
                                <span className="hidden sm:inline">Get Started</span>
                                <span className="sm:hidden">Start</span>
                            </button>
                        )}
                    </div>
                </div>
            </motion.nav>
            
            <AuthModal />
        </>
    );
}
