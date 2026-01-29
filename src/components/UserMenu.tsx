import { useState, useRef, useEffect } from 'react';
import { LogOut, Clock, ChevronDown } from 'lucide-react';
import HistoryModal from './modals/HistoryModal';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserMenu() {
    const { user, logout, setAuthModalOpen } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!user) {
        return (
            <button
                onClick={() => setAuthModalOpen(true)}
                className="px-6 py-2.5 bg-neutral-900 text-white rounded-full text-xs font-bold shadow-premium hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
                Sign In
            </button>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all bg-white"
            >
                <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-xs font-bold text-ink max-w-[100px] truncate hidden md:block">
                    {user.given_name}
                </span>
                <ChevronDown size={14} className={`text-ink/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-3 w-64 glass rounded-2xl shadow-premium border border-neutral-100 overflow-hidden z-50"
                    >
                        {/* User Info Header */}
                        <div className="px-5 py-4 bg-[#FAFAFA] border-b border-neutral-100 relative">
                            <div className="absolute inset-0 bg-[radial-gradient(#00000005_1px,transparent_1px)] bg-size-[16px_16px] pointer-events-none" />
                            <div className="relative z-10">
                                <p className="text-sm font-bold text-neutral-900 truncate">{user.name}</p>
                                <p className="text-[10px] font-medium text-neutral-400 truncate">{user.email}</p>
                            </div>
                        </div>
                        
                        <div className="p-2">
                            <button 
                                onClick={() => {
                                    setIsHistoryOpen(true);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition-all text-left"
                            >
                                <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
                                    <Clock size={14} />
                                </div>
                                History Vault
                            </button>
                        </div>

                        <div className="border-t border-neutral-100 p-2">
                            <button 
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all text-left"
                            >
                                <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
                                    <LogOut size={14} />
                                </div>
                                Sign Out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
        </div>
    );
}
