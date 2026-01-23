import { useState, useRef, useEffect } from 'react';
import { LogOut, Clock, ChevronDown } from 'lucide-react';
import HistoryModal from './HistoryModal';
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
                className="btn-premium-outline py-2 px-6 text-[10px] hover:bg-ink hover:text-white transition-all"
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
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 z-50"
                    >
                        <div className="px-4 py-3 border-b border-gray-50">
                            <p className="text-sm font-bold text-ink truncate">{user.name}</p>
                            <p className="text-[10px] font-medium text-ink/40 truncate">{user.email}</p>
                        </div>
                        
                        <div className="p-1">
                            <button 
                                onClick={() => {
                                    setIsHistoryOpen(true);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-ink/70 hover:text-ink hover:bg-gray-50 rounded-lg transition-colors text-left"
                            >
                                <Clock size={14} /> History
                            </button>
                        </div>

                        <div className="border-t border-gray-50 p-1 mt-1">
                            <button 
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left"
                            >
                                <LogOut size={14} /> Sign Out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
        </div>
    );
}
