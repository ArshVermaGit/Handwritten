import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield } from 'lucide-react';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50"
                >
                    <div className="bg-white/80 backdrop-blur-xl rounded-4xl p-6 shadow-premium border border-black/5 flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                                    <Shield className="text-indigo-600" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-neutral-900 text-sm">Privacy & Cookies</h4>
                                    <p className="text-xs text-neutral-500 leading-relaxed mt-1">
                                        We use cookies to improve your experience and analyze site traffic. Your productivity is our priority.
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsVisible(false)}
                                className="p-1 hover:bg-black/5 rounded-lg transition-colors"
                            >
                                <X size={16} className="text-neutral-400" />
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={handleAccept}
                                className="flex-1 px-4 py-2.5 bg-neutral-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all active:scale-95"
                            >
                                Accept All
                            </button>
                            <a 
                                href="/privacy" 
                                className="px-4 py-2.5 bg-neutral-100 text-neutral-600 text-xs font-bold rounded-xl hover:bg-neutral-200 transition-all text-center"
                            >
                                Settings
                            </a>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
