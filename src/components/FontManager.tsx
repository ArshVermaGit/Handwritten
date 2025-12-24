import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Check, Loader2, Trash2 } from 'lucide-react';
import { useStore, getAvailableFonts } from '../lib/store';
import type { FontPreference } from '../types';

export default function FontManager() {
    const { handwritingStyle, customFonts, setHandwritingStyle, addCustomFont, removeCustomFont } = useStore();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const allFonts = getAvailableFonts(useStore.getState());
    const sampleText = "The quick brown fox jumps over the lazy dog.";

    // Inject custom fonts into document
    useEffect(() => {
        customFonts.forEach(font => {
            if (font.url) {
                const fontFace = new FontFace(font.family, `url(${font.url})`);
                fontFace.load().then((loadedFace) => {
                    document.fonts.add(loadedFace);
                }).catch(err => console.error("Error loading custom font:", err));
            }
        });
    }, [customFonts]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const fontName = file.name.split('.')[0].replace(/-/g, ' ');
        const fontId = `custom-${Date.now()}`;
        const fontFamily = `CustomFont-${fontId}`;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64Url = event.target?.result as string;

            try {
                const fontFace = new FontFace(fontFamily, `url(${base64Url})`);
                const loadedFace = await fontFace.load();
                document.fonts.add(loadedFace);

                const newFont: FontPreference = {
                    id: fontId,
                    name: fontName,
                    family: fontFamily,
                    type: 'custom',
                    url: base64Url
                };

                addCustomFont(newFont);
                setHandwritingStyle(fontId);
            } catch (err) {
                alert("Failed to load font file. Please use .ttf or .woff");
            } finally {
                setIsUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <label className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Handwriting Engines</label>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                    title="Upload Custom Font"
                    disabled={isUploading}
                >
                    {isUploading ? <Loader2 size={14} className="animate-spin text-black" /> : <Upload size={14} className="text-gray-400 group-hover:text-black" />}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".ttf,.woff,.woff2"
                    className="hidden"
                    onChange={handleFileUpload}
                />
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {allFonts.map((font) => (
                    <motion.div
                        key={font.id}
                        whileHover={{ x: 4 }}
                        className={`group relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 ${handwritingStyle === font.id
                            ? 'border-black bg-black text-white shadow-xl shadow-black/10'
                            : 'border-transparent bg-black/5 hover:bg-black/10'
                            }`}
                        onClick={() => setHandwritingStyle(font.id)}
                    >
                        <div className="flex justify-between items-start">
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${handwritingStyle === font.id ? 'text-gray-400' : 'text-gray-400 group-hover:text-black'
                                }`}>
                                {font.type === 'custom' ? 'User Custom' : 'Studio Engine'}
                            </span>
                            <div className="flex gap-2">
                                {handwritingStyle === font.id && <Check size={12} />}
                                {font.type === 'custom' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeCustomFont(font.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <h3 className="text-base font-bold tracking-tight">{font.name}</h3>

                        <div
                            className={`text-xl truncate ${handwritingStyle === font.id ? 'text-white' : 'text-gray-400 group-hover:text-black'}`}
                            style={{ fontFamily: `"${font.family}", cursive` }}
                        >
                            {sampleText}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
