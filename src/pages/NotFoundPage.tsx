import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-paper flex items-center justify-center p-4 relative overflow-hidden">
             {/* Background Pattern */}
             <div className="absolute inset-0 bg-[radial-gradient(#00000005_1px,transparent_1px)] bg-size-[20px_20px]" />
             
             <div className="relative z-10 max-w-lg w-full text-center">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="text-9xl font-display font-bold text-neutral-900/10 select-none">
                        404
                    </div>
                </motion.div>

                <h1 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-4">
                    Page not found
                </h1>
                
                <p className="text-neutral-500 mb-10 max-w-sm mx-auto font-serif italic text-lg">
                    "Not all those who wander are lost... but you might be."
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 rounded-xl border border-neutral-200 text-neutral-600 font-medium hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                    
                    <button 
                        onClick={() => navigate('/')}
                        className="px-6 py-3 rounded-xl bg-neutral-900 text-white font-bold hover:shadow-xl hover:shadow-neutral-900/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        <Home size={18} />
                        Return Home
                    </button>
                </div>
             </div>
        </div>
    );
}
