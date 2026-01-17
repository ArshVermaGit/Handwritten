import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trash2, 
    Clock, 
    ZoomIn, 
    ZoomOut, 
    Loader2,
    Upload,
    FileText,
    Bold,
    Italic,
    Underline,
    List,
    AlignLeft,
    AlignCenter,
    AlignRight,
    ChevronDown,
    Search,
    Check,
    RotateCcw
} from 'lucide-react';
import { useStore } from '../lib/store';

// Font Definitions
const HANDWRITING_FONTS = [
    { id: 'caveat', name: 'Caveat', family: "'Caveat', cursive" },
    { id: 'gloria-hallelujah', name: 'Gloria Hallelujah', family: "'Gloria Hallelujah', cursive" },
    { id: 'indie-flower', name: 'Indie Flower', family: "'Indie Flower', cursive" },
    { id: 'shadows-into-light', name: 'Shadows Into Light', family: "'Shadows Into Light', cursive" },
    { id: 'patrick-hand', name: 'Patrick Hand', family: "'Patrick Hand', cursive" },
    { id: 'permanent-marker', name: 'Permanent Marker', family: "'Permanent Marker', cursive" },
    { id: 'kalam', name: 'Kalam', family: "'Kalam', cursive" },
    { id: 'homemade-apple', name: 'Homemade Apple', family: "'Homemade Apple', cursive" },
    { id: 'reenie-beanie', name: 'Reenie Beanie', family: "'Reenie Beanie', cursive" },
    { id: 'nothing-you-could-do', name: 'Nothing You Could Do', family: "'Nothing You Could Do', cursive" },
];

export default function EditorPage() {
    const { 
        text, 
        setText, 
        lastSaved, 
        setLastSaved, 
        zoom, 
        setZoom,
        editorMode,
        setEditorMode,
        uploadedFileName,
        setUploadedFileName,
        handwritingStyle,
        setHandwritingStyle,
        fontSize,
        setFontSize,
        letterSpacing,
        setLetterSpacing,
        lineHeight,
        setLineHeight,
        wordSpacing,
        setWordSpacing,
        resetTypography
    } = useStore();
    
    const [isLoading, setIsLoading] = useState(true);
    const [secondsAgo, setSecondsAgo] = useState(0);
    const [isFontPanelOpen, setIsFontPanelOpen] = useState(true);
    const [isTypographyPanelOpen, setIsTypographyPanelOpen] = useState(false);
    const [fontSearch, setFontSearch] = useState('');
    const richTextRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get current font family for preview
    const currentFontFamily = useMemo(() => {
        const font = HANDWRITING_FONTS.find(f => f.id === handwritingStyle);
        return font?.family || HANDWRITING_FONTS[0].family;
    }, [handwritingStyle]);

    // Filter fonts by search
    const filteredFonts = useMemo(() => {
        if (!fontSearch.trim()) return HANDWRITING_FONTS;
        return HANDWRITING_FONTS.filter(f => 
            f.name.toLowerCase().includes(fontSearch.toLowerCase())
        );
    }, [fontSearch]);

    // Initial load
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Last saved display timer
    useEffect(() => {
        if (!lastSaved) return;
        const interval = setInterval(() => {
            const now = new Date();
            const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
            setSecondsAgo(diff);
        }, 1000);
        return () => clearInterval(interval);
    }, [lastSaved]);

    // 10-second Auto-save Interval
    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            setLastSaved(new Date());
        }, 10000);
        return () => clearInterval(autoSaveInterval);
    }, [setLastSaved]);

    // Handle Plain Text Changes
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    // Handle Rich Text Changes
    const handleRichTextChange = () => {
        if (richTextRef.current) {
            setText(richTextRef.current.innerHTML);
        }
    };

    // Sync Rich Text Ref on mode switch or load
    useEffect(() => {
        if (editorMode === 'rich' && richTextRef.current && richTextRef.current.innerHTML !== text) {
            richTextRef.current.innerHTML = text;
        }
    }, [editorMode, text]);

    // File Upload Logic
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'text/plain') {
                alert('Please upload a .txt file');
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                setText(content);
                setUploadedFileName(file.name);
                setLastSaved(new Date());
            };
            reader.readAsText(file);
        }
    };

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        handleRichTextChange();
    };

    const clearContent = () => {
        if (window.confirm('Are you sure you want to clear all text and saved data?')) {
            setText('');
            setUploadedFileName(null);
            setLastSaved(null);
            if (richTextRef.current) richTextRef.current.innerHTML = '';
            localStorage.removeItem('inkpad-core-storage');
        }
    };

    const wordCount = useMemo(() => {
        const plainText = text.replace(/<[^>]*>/g, ' ');
        return plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
    }, [text]);

    const charCount = text.replace(/<[^>]*>/g, '').length;

    const zoomLevels = [
        { label: 'Fit', value: 1 },
        { label: '75%', value: 0.75 },
        { label: '100%', value: 1 },
        { label: '125%', value: 1.25 },
        { label: '150%', value: 1.5 },
    ];

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-white font-sans text-gray-900">
            {/* LEFT PANEL (40%) */}
            <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-full md:w-[40%] h-full flex flex-col border-r border-gray-100 relative z-10"
            >
                <div className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto">
                    {/* Header with Mode Toggle and Upload */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">Editor Workspace</h2>
                            {uploadedFileName && (
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-tight">
                                    <FileText size={10} /> {uploadedFileName}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileUpload} 
                                accept=".txt" 
                                className="hidden" 
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-black hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                            >
                                <Upload size={14} /> Upload File
                            </button>
                            
                            <div className="flex p-1 bg-gray-100 rounded-lg">
                                <button 
                                    onClick={() => setEditorMode('plain')}
                                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${editorMode === 'plain' ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-black'}`}
                                >
                                    Plain
                                </button>
                                <button 
                                    onClick={() => setEditorMode('rich')}
                                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${editorMode === 'rich' ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-black'}`}
                                >
                                    Rich
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Editor Area */}
                    <div className="relative flex-1 flex flex-col group min-h-[250px]">
                        {editorMode === 'rich' && (
                            <div className="flex items-center gap-1 mb-2 p-1 bg-gray-50 rounded-xl border border-gray-100 overflow-x-auto scrollbar-hide">
                                <button onClick={() => execCommand('bold')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><Bold size={16} /></button>
                                <button onClick={() => execCommand('italic')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><Italic size={16} /></button>
                                <button onClick={() => execCommand('underline')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><Underline size={16} /></button>
                                <div className="w-px h-4 bg-gray-200 mx-1" />
                                <button onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><List size={16} /></button>
                                <button onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><AlignLeft size={16} /></button>
                                <button onClick={() => execCommand('justifyCenter')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><AlignCenter size={16} /></button>
                                <button onClick={() => execCommand('justifyRight')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><AlignRight size={16} /></button>
                            </div>
                        )}

                        <div className="flex-1 relative">
                            {editorMode === 'plain' ? (
                                <textarea
                                    value={text}
                                    onChange={handleTextChange}
                                    placeholder="Type or paste your text here..."
                                    className="w-full h-full p-6 text-lg leading-relaxed bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-black/5 focus:bg-white transition-all duration-300 outline-none resize-none font-medium placeholder:text-gray-300"
                                />
                            ) : (
                                <div
                                    ref={richTextRef}
                                    contentEditable
                                    onInput={handleRichTextChange}
                                    className="w-full h-full p-6 text-lg leading-relaxed bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-black/5 focus:bg-white transition-all duration-300 outline-none overflow-y-auto font-medium"
                                    style={{ minHeight: '100%' }}
                                />
                            )}
                            
                            {!text && editorMode === 'rich' && (
                                <div className="absolute top-6 left-6 pointer-events-none text-gray-300 italic text-lg font-medium">
                                    Type or paste your text here...
                                </div>
                            )}

                            <div className="absolute bottom-4 right-4 flex items-center gap-4 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                <button 
                                    onClick={clearContent}
                                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-500 border-2 border-red-500/20 hover:border-red-500 hover:bg-red-50 rounded-full transition-all"
                                >
                                    <Trash2 size={14} /> Clear
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            <span className="text-black">{wordCount}</span> words <span className="mx-2 text-gray-200">|</span> <span className="text-black">{charCount}</span> characters
                        </div>
                        
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <Clock size={12} className="text-gray-300" />
                            {lastSaved ? (
                                <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-500">
                                    Last saved: {secondsAgo}s ago
                                </span>
                            ) : (
                                <span className="animate-pulse">Waiting...</span>
                            )}
                        </div>
                    </div>

                    {/* ========== HANDWRITING STYLE PANEL ========== */}
                    <div className="mt-6 border-t border-gray-100 pt-6">
                        <button
                            onClick={() => setIsFontPanelOpen(!isFontPanelOpen)}
                            className="w-full flex items-center justify-between group"
                        >
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">
                                Handwriting Style
                            </h3>
                            <motion.div
                                animate={{ rotate: isFontPanelOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                            </motion.div>
                        </button>

                        <AnimatePresence>
                            {isFontPanelOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-4 space-y-4">
                                        {/* Search Box */}
                                        <div className="relative">
                                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input
                                                type="text"
                                                value={fontSearch}
                                                onChange={(e) => setFontSearch(e.target.value)}
                                                placeholder="Search fonts..."
                                                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 rounded-xl border border-transparent focus:border-gray-200 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                                            />
                                        </div>

                                        {/* Font Grid */}
                                        <div className="grid grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1 scrollbar-hide">
                                            {filteredFonts.map((font) => (
                                                <motion.button
                                                    key={font.id}
                                                    onClick={() => setHandwritingStyle(font.id)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`relative p-4 rounded-xl text-left transition-all duration-200 ${
                                                        handwritingStyle === font.id
                                                            ? 'bg-blue-50 border-2 border-blue-500 shadow-sm'
                                                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200'
                                                    }`}
                                                >
                                                    {handwritingStyle === font.id && (
                                                        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                            <Check size={12} className="text-white" />
                                                        </div>
                                                    )}
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                                                        {font.name}
                                                    </p>
                                                    <p 
                                                        className="text-lg text-gray-700 leading-tight truncate"
                                                        style={{ fontFamily: font.family }}
                                                    >
                                                        The quick brown fox
                                                    </p>
                                                </motion.button>
                                            ))}
                                        </div>

                                        {filteredFonts.length === 0 && (
                                            <p className="text-center text-sm text-gray-400 py-4">No fonts found</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ========== TYPOGRAPHY SETTINGS PANEL ========== */}
                    <div className="mt-6 border-t border-gray-100 pt-6">
                        <button
                            onClick={() => setIsTypographyPanelOpen(!isTypographyPanelOpen)}
                            className="w-full flex items-center justify-between group"
                        >
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">
                                Typography Settings
                            </h3>
                            <motion.div
                                animate={{ rotate: isTypographyPanelOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                            </motion.div>
                        </button>

                        <AnimatePresence>
                            {isTypographyPanelOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-4 space-y-6">
                                        {/* Font Size */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Font Size</label>
                                                <span className="text-xs font-bold text-black bg-gray-100 px-2 py-0.5 rounded-md">{fontSize}px</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="10"
                                                max="30"
                                                value={fontSize}
                                                onChange={(e) => setFontSize(Number(e.target.value))}
                                                className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-500"
                                            />
                                        </div>

                                        {/* Letter Spacing */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Letter Spacing</label>
                                                <span className="text-xs font-bold text-black bg-gray-100 px-2 py-0.5 rounded-md">{letterSpacing}px</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="-2"
                                                max="10"
                                                value={letterSpacing}
                                                onChange={(e) => setLetterSpacing(Number(e.target.value))}
                                                className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-500"
                                            />
                                        </div>

                                        {/* Line Height */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Line Height</label>
                                                <span className="text-xs font-bold text-black bg-gray-100 px-2 py-0.5 rounded-md">{lineHeight.toFixed(1)}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="1.0"
                                                max="3.0"
                                                step="0.1"
                                                value={lineHeight}
                                                onChange={(e) => setLineHeight(Number(e.target.value))}
                                                className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-500"
                                            />
                                        </div>

                                        {/* Word Spacing */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Word Spacing</label>
                                                <span className="text-xs font-bold text-black bg-gray-100 px-2 py-0.5 rounded-md">{wordSpacing}px</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="20"
                                                value={wordSpacing}
                                                onChange={(e) => setWordSpacing(Number(e.target.value))}
                                                className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-500"
                                            />
                                        </div>

                                        {/* Reset Button */}
                                        <button
                                            onClick={resetTypography}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 border border-gray-100 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <RotateCcw size={12} /> Reset Typography
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* RIGHT PANEL (60%) */}
            <div className="w-full md:w-[60%] h-full bg-[#f5f5f5] relative flex flex-col overflow-hidden">
                {/* TOOLBAR */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/50">
                    {zoomLevels.map((lvl) => (
                        <button
                            key={lvl.label}
                            onClick={() => setZoom(lvl.value)}
                            className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${
                                Math.abs(zoom - lvl.value) < 0.01 
                                ? 'bg-black text-white px-6' 
                                : 'hover:bg-gray-100 text-gray-400'
                            }`}
                        >
                            {lvl.label}
                        </button>
                    ))}
                </div>

                {/* CANVAS AREA */}
                <div className="flex-1 overflow-auto flex items-center justify-center p-12 scrollbar-hide">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <Loader2 className="w-10 h-10 text-black/10 animate-spin" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Rendering Handwriting</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="canvas"
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ 
                                    scale: zoom, 
                                    opacity: 1, 
                                    y: 0 
                                }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="relative bg-white shadow-2xl w-[210mm] min-h-[297mm] h-fit flex flex-col p-[20mm] origin-center"
                            >
                                <div className="absolute inset-0 border border-black/5 pointer-events-none" />
                                
                                <div 
                                    className="flex-1 whitespace-pre-wrap text-gray-800"
                                    style={{ 
                                        fontFamily: currentFontFamily,
                                        fontSize: `${fontSize}px`,
                                        letterSpacing: `${letterSpacing}px`,
                                        lineHeight: lineHeight,
                                        wordSpacing: `${wordSpacing}px`
                                    }}
                                    dangerouslySetInnerHTML={{ __html: text || '<span class="opacity-10 italic">Your handwritten preview will appear here...</span>' }}
                                />

                                <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ZOOM HUD */}
                <div className="absolute bottom-8 right-8 flex flex-col gap-2">
                    <button 
                        onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
                        className="p-3 bg-white hover:bg-black hover:text-white rounded-xl shadow-md transition-all group"
                    >
                        <ZoomIn size={18} className="text-gray-400 group-hover:text-white" />
                    </button>
                    <button 
                        onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
                        className="p-3 bg-white hover:bg-black hover:text-white rounded-xl shadow-md transition-all group"
                    >
                        <ZoomOut size={18} className="text-gray-400 group-hover:text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}
