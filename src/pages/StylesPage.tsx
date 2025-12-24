import { motion } from 'framer-motion';
import { useStore, getAvailableFonts } from '../lib/store';
import { useNavigate } from 'react-router-dom';

export default function StylesPage() {
    const { handwritingStyle, setHandwritingStyle } = useStore();
    const navigate = useNavigate();
    const allFonts = getAvailableFonts(useStore.getState());

    const handleSelect = (id: string) => {
        setHandwritingStyle(id);
        navigate('/editor');
    };

    return (
        <div className="section-padding bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-2xl mb-24">
                    <h1 className="text-5xl md:text-7xl mb-8 tracking-tighter">Handwriting Library.</h1>
                    <p className="text-gray-400 text-xl font-medium">
                        Discover the perfect handwriting engine for your digital documents.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    {allFonts.map((font, i) => (
                        <motion.div
                            key={font.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => handleSelect(font.id)}
                            className={`card-premium group cursor-pointer border-l-4 flex flex-col lg:flex-row justify-between items-center gap-12 ${handwritingStyle === font.id ? 'border-l-black shadow-premium-hover' : 'border-l-transparent'
                                }`}
                        >
                            <div className="flex-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] block mb-4">
                                    {font.type === 'custom' ? 'Your Font' : `Library Engine ${i + 1}`}
                                </span>
                                <h2 className="text-3xl md:text-4xl mb-4 group-hover:translate-x-2 transition-transform duration-500 uppercase tracking-tighter">{font.name}</h2>
                                <div className="flex items-center gap-4">
                                    <div className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest ${font.type === 'custom' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {font.type === 'custom' ? 'Local' : 'Global'}
                                    </div>
                                    {handwritingStyle === font.id && (
                                        <span className="text-[8px] font-bold text-black uppercase tracking-widest border border-black px-2 py-0.5">Active</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 w-full lg:w-auto overflow-hidden bg-gray-50 p-12 flex items-center justify-center min-h-[160px]">
                                <span
                                    className="text-3xl md:text-4xl text-black select-none pointer-events-none text-center"
                                    style={{ fontFamily: `"${font.family}", cursive` }}
                                >
                                    The quick brown fox jumps over the lazy dog.
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
