import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trash2, ZoomIn, ZoomOut, Loader2, Upload, FileText, Download, FileDown, 
    Bold, Italic, Underline, List, Layers, ChevronLeft, ChevronRight, Search, 
    Zap, Type, Settings2, Sparkles, Palette, FileImage, Layout, CheckCircle2, 
    Image as ImageIcon, PanelLeftClose, PanelLeft, Minimize2
} from 'lucide-react';
import { useStore } from '../lib/store';
import { HandwritingCanvas } from '../components/HandwritingCanvas';
import type { HandwritingCanvasHandle } from '../components/HandwritingCanvas';
import type { PaperMaterial } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';
import { TimeAgo } from '../components/ui/TimeAgo';
import logo from '../assets/logo.png';

// --- CONSTANTS & CONFIG ---

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

const INK_COLORS = [
    { id: 'blue-dark', name: 'Blue Dark', color: '#0051a8' },
    { id: 'blue-light', name: 'Blue Light', color: '#0066cc' },
    { id: 'black', name: 'Black', color: '#111827' },
    { id: 'black-gray', name: 'Black Gray', color: '#374151' },
    { id: 'red', name: 'Red', color: '#cc0000' },
];

const PAPER_TYPES = [
    { id: 'white', name: 'White', bg: '#ffffff', pattern: 'none' },
    { id: 'ruled', name: 'Standard Ruled', bg: '#ffffff', pattern: 'repeating-linear-gradient(transparent, transparent 38px, #e0e0e0 38px, #e0e0e0 40px)' },
    { id: 'college', name: 'College Ruled', bg: '#ffffff', pattern: 'repeating-linear-gradient(transparent, transparent 28px, #e0e0e0 28px, #e0e0e0 30px)' },
    { id: 'wide', name: 'Wide Ruled', bg: '#ffffff', pattern: 'repeating-linear-gradient(transparent, transparent 48px, #e0e0e0 48px, #e0e0e0 50px)' },
    { id: 'graph', name: 'Graph Paper', bg: '#ffffff', pattern: 'linear-gradient(#e0e0e0 1px, transparent 1px), linear-gradient(90deg, #e0e0e0 1px, transparent 1px)' },
    { id: 'dotted', name: 'Dotted Paper', bg: '#ffffff', pattern: 'radial-gradient(circle, #c0c0c0 1px, transparent 1px)' },
    { id: 'vintage', name: 'Vintage', bg: '#f5f0e1', pattern: 'none' },
    { id: 'aged', name: 'Aged Manuscript', bg: '#e8dcc4', pattern: 'none' },
    { id: 'love-letter', name: 'Love Letter', bg: '#fff0f5', pattern: 'none' },
    { id: 'birthday', name: 'Birthday', bg: '#fffbf0', pattern: 'none' },
    { id: 'christmas', name: 'Christmas', bg: '#f0fff4', pattern: 'none' },
    { id: 'professional', name: 'Professional', bg: '#ffffff', pattern: 'none' },
];

const PRESETS = {
    homework: { handwritingStyle: 'gloria-hallelujah', inkColor: '#0051a8', paperMaterial: 'college' as const, fontSize: 18, lineHeight: 1.6, paperShadow: true, paperTilt: false },
    love: { handwritingStyle: 'indie-flower', inkColor: '#cc0000', paperMaterial: 'love-letter' as const, fontSize: 20, lineHeight: 1.4, paperShadow: true, paperTilt: true },
    professional: { handwritingStyle: 'patrick-hand', inkColor: '#111827', paperMaterial: 'professional' as const, fontSize: 16, lineHeight: 1.5, paperShadow: false, paperTilt: false },
    history: { handwritingStyle: 'caveat', inkColor: '#374151', paperMaterial: 'aged' as const, fontSize: 17, lineHeight: 1.8, paperShadow: true, paperTilt: false }
} as const;

// --- HELPER COMPONENTS ---

const Tooltip = ({ children, text }: { children: React.ReactNode, text: string }) => (
    <div className="group relative flex items-center justify-center">
        {children}
        <div className="absolute left-full ml-3 px-2 py-1 bg-ink text-white text-[10px] font-bold uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
            {text}
            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-ink" />
        </div>
    </div>
);

// --- MAIN PAGE COMPONENT ---

export default function EditorPage() {
    const {
        text, setText, lastSaved, setLastSaved, zoom, setZoom, editorMode, setEditorMode,
        uploadedFileName, setUploadedFileName, handwritingStyle, setHandwritingStyle,
        fontSize, setFontSize, letterSpacing, setLetterSpacing, lineHeight, setLineHeight,
        wordSpacing, setWordSpacing, inkColor, setInkColor, paperMaterial, setPaperMaterial,
        paperShadow, setPaperShadow, paperTexture, setPaperTexture, paperTilt, setPaperTilt,
        isRendering, setIsRendering, applyPreset, addToHistory
    } = useStore();

    const [fontSearch, setFontSearch] = useState('');
    const richTextRef = useRef<HTMLDivElement>(null);
    const [activeDockTab, setActiveDockTab] = useState<'style' | 'paper' | 'export' | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // Page State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Export State
    const [isLoading, setIsLoading] = useState(false);
    const debouncedText = useDebounce(text, 300);
    const debouncedFontFamily = useDebounce(handwritingStyle, 300);
    const debouncedPaperMaterial = useDebounce(paperMaterial, 300);
    const [isExporting, setIsExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState<'image/png' | 'image/jpeg'>('image/png');
    const [exportQuality, setExportQuality] = useState(1.0);
    const canvasRef = useRef<HandwritingCanvasHandle>(null);
    const { addToast } = useToast();
    const { user } = useAuth();

    // Derived
    const wordCount = useMemo(() => text.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length, [text]);
    const charCount =  text.replace(/<[^>]*>/g, '').length;
    const filteredFonts = useMemo(() => HANDWRITING_FONTS.filter(f => f.name.toLowerCase().includes(fontSearch.toLowerCase())), [fontSearch]);

    useEffect(() => {
        if (text !== debouncedText || handwritingStyle !== debouncedFontFamily || paperMaterial !== debouncedPaperMaterial) setIsRendering(true);
    }, [text, debouncedText, handwritingStyle, debouncedFontFamily, paperMaterial, debouncedPaperMaterial, setIsRendering]);

    useEffect(() => {
        const i = setInterval(() => {
            const now = new Date();
            setLastSaved(now);
            if (user && text && text.trim().length > 0) {
                addToHistory({
                    id: crypto.randomUUID(),
                    timestamp: now.getTime(),
                    text: text
                });
            }
        }, 30000);
        return () => clearInterval(i);
    }, [setLastSaved, user, text, addToHistory]);

    // --- HANDLERS ---
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value);
    
    const handleRichTextChange = () => {
        if (richTextRef.current) setText(richTextRef.current.innerHTML);
    };

    useEffect(() => {
        if (editorMode === 'rich' && richTextRef.current && richTextRef.current.innerHTML !== text) {
            richTextRef.current.innerHTML = text;
        }
    }, [editorMode, text]);

    const execCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        handleRichTextChange();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
         const file = e.target.files?.[0];
         if (!file) return;
         if (file.size > 5 * 1024 * 1024) return addToast('File too large (max 5MB)', 'error');
         
         setIsLoading(true);
         try {
             if (file.type === 'text/plain') {
                 const textContent = await file.text();
                 setText(textContent);
             } else if (file.type.includes('wordprocessingml')) {
                 const arrayBuffer = await file.arrayBuffer();
                 const mammoth = await import('mammoth');
                 const result = await mammoth.convertToHtml({ arrayBuffer });
                 setText(result.value);
             } else if (file.type === 'application/pdf') {
                 const pdfjs = await import('pdfjs-dist');
                 pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
                 const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
                 let fullText = '';
                 for (let i = 1; i <= pdf.numPages; i++) {
                     const page = await pdf.getPage(i);
                     const tx = await page.getTextContent();
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     fullText += tx.items.map((item: any) => item.str).join(' ') + '\\n\\n';
                 }
                 setText(fullText);
             }
             setUploadedFileName(file.name);
             addToast('Document loaded successfully', 'success');
         } catch (err) {
             console.error(err);
             addToast('Failed to load document', 'error');
         } finally {
             setIsLoading(false);
             if (e.target) e.target.value = '';
         }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => execCommand('insertImage', ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleExportPDF = useCallback(async () => { 
        if(!canvasRef.current || isExporting) return; 
        setIsExporting(true); 
        addToast('Preparing PDF...'); 
        try { 
            (await canvasRef.current.exportPDF()).save('inkpad-doc.pdf'); 
            addToast('PDF Downloaded'); 
        } catch(error){ 
            console.error(error);
            addToast('Export failed', 'error'); 
        } finally { 
            setIsExporting(false); 
        }
    }, [isExporting, addToast]);

    const handleExportPNG = useCallback(async () => { 
        if(!canvasRef.current || isExporting) return; 
        setIsExporting(true); 
        addToast('Capturing Image...'); 
        try { 
            const url = await canvasRef.current.exportPNG(exportQuality, exportFormat); 
            const a = document.createElement('a'); 
            a.href = url; 
            a.download = `inkpad-page.${exportFormat.split('/')[1]}`; 
            a.click(); 
            addToast('Image Downloaded'); 
        } catch(error){ 
            console.error(error);
            addToast('Export failed', 'error'); 
        } finally { 
            setIsExporting(false); 
        }
    }, [isExporting, addToast, exportQuality, exportFormat]);

    const handleExportZIP = useCallback(async () => { 
        if(!canvasRef.current || isExporting) return; 
        setIsExporting(true); 
        addToast('Zipping...'); 
        try { 
            const blob = await canvasRef.current.exportZIP(); 
            const url = URL.createObjectURL(blob); 
            const a = document.createElement('a'); 
            a.href = url; 
            a.download = 'inkpad-all.zip'; 
            a.click(); 
            URL.revokeObjectURL(url); 
            addToast('ZIP Downloaded'); 
        } catch(error){ 
            console.error(error);
            addToast('Export failed', 'error'); 
        } finally { 
            setIsExporting(false); 
        }
    }, [isExporting, addToast]);

    const shortcuts = useCallback((e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'g') { e.preventDefault(); handleExportPDF(); }
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') { e.preventDefault(); handleExportPNG(); }
    }, [handleExportPDF, handleExportPNG]);

    useEffect(() => { window.addEventListener('keydown', shortcuts); return () => window.removeEventListener('keydown', shortcuts); }, [shortcuts]);


    return (
        <div className="relative w-full h-screen bg-paper text-ink font-sans overflow-hidden selection:bg-accent/20">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none mix-blend-multiply" />
            
            {/* FLOATING HEADER */}
            <header className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 py-2 px-6 bg-white/80 backdrop-blur-xl rounded-full shadow-lg shadow-ink/5 border border-white/40">
                <a href="/" className="flex items-center gap-2 group">
                    <img src={logo} alt="InkPad" className="w-6 h-6 object-contain" />
                </a>
                <div className="h-4 w-px bg-black/10" />
                <input 
                    value={uploadedFileName || 'Untitled Document'}
                    onChange={(e) => setUploadedFileName(e.target.value)}
                    className="bg-transparent border-none p-0 text-sm font-bold text-ink focus:ring-0 placeholder:text-ink/40 w-32 text-center"
                    placeholder="Name..."
                />
                <div className="h-4 w-px bg-black/10" />
                <span className="text-[9px] font-black uppercase tracking-widest text-ink/30 whitespace-nowrap">
                    {isRendering ? 'Refining Ink...' : <TimeAgo date={lastSaved} />}
                </span>
            </header>

            {/* MAIN WORKSPACE */}
            <div className="absolute inset-0 flex overflow-hidden">
                
                {/* 1. SIDEBAR: INPUT EDITOR (Collapsible Glass Panel) */}
                <motion.div 
                    initial={false}
                    animate={{ x: isSidebarOpen ? 0 : -420, opacity: isSidebarOpen ? 1 : 0.5 }}
                    className="absolute left-6 top-24 bottom-24 w-[400px] z-40 flex flex-col pointer-events-none"
                    style={{ pointerEvents: isSidebarOpen ? 'auto' : 'none' }}
                >
                    <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-ink/10 border border-white/50 flex flex-col overflow-hidden">
                        
                        <div className="p-4 border-b border-black/5 flex items-center justify-between">
                            <div className="flex bg-black/5 rounded-lg p-0.5">
                                 <button onClick={() => setEditorMode('plain')} className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${editorMode === 'plain' ? 'bg-white shadow-sm text-ink' : 'text-ink/40 hover:text-ink'}`}>Plain</button>
                                 <button onClick={() => setEditorMode('rich')} className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${editorMode === 'rich' ? 'bg-white shadow-sm text-ink' : 'text-ink/40 hover:text-ink'}`}>Rich</button>
                            </div>
                            <div className="flex gap-1">
                                <Tooltip text="Clear">
                                    <button onClick={() => { if(confirm('Clear all?')) setText(''); }} className="p-2 hover:bg-red-50 text-ink/30 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={14}/></button>
                                </Tooltip>
                                <Tooltip text="Import">
                                    <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-black/5 text-ink/30 hover:text-ink rounded-lg transition-colors"><Upload size={14}/></button>
                                </Tooltip>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                            {editorMode === 'plain' ? (
                                <textarea 
                                    value={text} 
                                    onChange={handleTextChange} 
                                    className="w-full h-full bg-transparent border-none resize-none focus:ring-0 focus:outline-none p-0 text-sm leading-relaxed text-ink/80 placeholder:text-ink/30 font-medium font-sans"
                                    placeholder="Start typing your masterpiece..." 
                                />
                            ) : (
                                <div 
                                    ref={richTextRef}
                                    contentEditable
                                    onInput={handleRichTextChange}
                                    className="prose prose-sm max-w-none outline-none text-ink/80 min-h-full font-sans"
                                    dangerouslySetInnerHTML={{ __html: text || '<p>Start typing...</p>' }}
                                />
                            )}
                        </div>

                         {/* Rich Text Toolbar */}
                        {editorMode === 'rich' && (
                            <div className="p-2 border-t border-black/5 bg-white/50 flex gap-1 justify-center">
                                <button onClick={() => execCommand('bold')} className="p-2 hover:bg-white rounded transition-all text-ink/50 hover:text-ink"><Bold size={14}/></button>
                                <button onClick={() => execCommand('italic')} className="p-2 hover:bg-white rounded transition-all text-ink/50 hover:text-ink"><Italic size={14}/></button>
                                <button onClick={() => execCommand('underline')} className="p-2 hover:bg-white rounded transition-all text-ink/50 hover:text-ink"><Underline size={14}/></button>
                                <div className="w-px h-6 bg-black/5 mx-2" />
                                <button onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-white rounded transition-all text-ink/50 hover:text-ink"><List size={14}/></button>
                                <button onClick={() => imageInputRef.current?.click()} className="p-2 hover:bg-white rounded transition-all text-ink/50 hover:text-ink"><ImageIcon size={14}/></button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Sidebar Toggle */}
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute left-6 bottom-6 z-50 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg border border-white/20 text-ink hover:scale-110 transition-transform"
                >
                    {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
                </button>


                {/* 2. CENTER STAGE: CANVAS */}
                <div className="flex-1 relative flex items-center justify-center bg-transparent" onClick={() => setActiveDockTab(null)}>
                    
                    {/* Zoom & Page Controls */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
                        <div className="flex flex-col gap-2 p-1.5 bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 shadow-xl shadow-ink/5">
                            <button onClick={() => setZoom(Math.max(0.5, zoom + 0.1))} className="p-2 hover:bg-white rounded-xl transition-colors"><ZoomIn size={16} className="text-ink/60"/></button>
                            <span className="text-[10px] font-black text-center text-ink/40 py-1">{Math.round(zoom * 100)}%</span>
                            <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="p-2 hover:bg-white rounded-xl transition-colors"><ZoomOut size={16} className="text-ink/60"/></button>
                        </div>

                        <div className="flex flex-col gap-2 p-1.5 bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 shadow-xl shadow-ink/5 text-center">
                             <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="p-2 disabled:opacity-20 hover:text-accent"><ChevronLeft size={16}/></button>
                             <span className="text-[10px] font-black text-ink/60">{currentPage}/{totalPages}</span>
                             <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="p-2 disabled:opacity-20 hover:text-accent"><ChevronRight size={16}/></button>
                        </div>
                    </div>

                    {/* CANVAS */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: zoom }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        className="relative shadow-2xl shadow-ink/20"
                    >
                         {/* Loader Overlay */}
                        <AnimatePresence>
                            {(isLoading || isRendering) && (
                                <motion.div 
                                    initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} 
                                    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm"
                                >
                                    <Loader2 size={32} className="text-ink animate-spin" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <HandwritingCanvas 
                            ref={canvasRef}
                            text={debouncedText}
                            currentPage={currentPage}
                            onRenderComplete={setTotalPages}
                            // Using store values inside component, passed props are minimal
                        />
                    </motion.div>
                </div>


                {/* 3. DOCK: TOOLS (Floating Bottom Bar) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4">
                    
                    {/* EXPANDED TOOL PANELS */}
                    <AnimatePresence>
                        {activeDockTab && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                className="mb-4 bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-ink/10 p-6 w-[400px]"
                            >
                                {/* STYLE TOOLS */}
                                {activeDockTab === 'style' && (
                                    <div className="space-y-6">
                                        
                                        {/* Presets */}
                                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                            {Object.entries(PRESETS).map(([key, preset]) => (
                                                <button 
                                                    key={key}
                                                    onClick={() => { applyPreset(preset); addToast(`Applied ${key} theme`); }}
                                                    className="px-4 py-2 bg-white/50 border border-black/5 rounded-full hover:border-accent hover:text-accent transition-all text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                                                >
                                                    {key}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Font & Color */}
                                        <div className="flex gap-4">
                                            <div className="flex-1 space-y-2">
                                                <div className="text-[10px] font-bold uppercase text-ink/40">Font</div>
                                                <select 
                                                    value={handwritingStyle}
                                                    onChange={(e) => setHandwritingStyle(e.target.value)}
                                                    className="w-full bg-white border border-black/10 rounded-xl p-2 text-sm font-bold"
                                                >
                                                    {HANDWRITING_FONTS.map(f => (
                                                        <option key={f.id} value={f.id}>{f.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-[10px] font-bold uppercase text-ink/40">Ink</div>
                                                <div className="flex gap-1">
                                                     {INK_COLORS.map(c => (
                                                        <button 
                                                            key={c.id} 
                                                            onClick={() => setInkColor(c.color)}
                                                            className={`w-8 h-8 rounded-full border-2 transition-transform ${inkColor === c.color ? 'scale-110 border-ink shadow-sm' : 'border-transparent hover:scale-105'}`} 
                                                            style={{ backgroundColor: c.color }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sliders */}
                                        <div className="space-y-4">
                                            {[
                                                { l: 'Size', v: fontSize, s: setFontSize, min: 10, max: 40 },
                                                { l: 'Spacing', v: letterSpacing, s: setLetterSpacing, min: -2, max: 10 },
                                                { l: 'Line Height', v: lineHeight, s: setLineHeight, min: 1, max: 2.5, step: 0.1 },
                                            ].map(slider => (
                                                <div key={slider.l} className="flex items-center gap-3">
                                                    <span className="text-[10px] font-bold uppercase text-ink/40 w-16">{slider.l}</span>
                                                    <input 
                                                        type="range" 
                                                        min={slider.min} max={slider.max} step={slider.step || 1}
                                                        value={slider.v} 
                                                        onChange={e => slider.s(parseFloat(e.target.value))}
                                                        className="flex-1 h-1 bg-black/5 rounded-full appearance-none cursor-pointer accent-ink"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* PAPER TOOLS */}
                                {activeDockTab === 'paper' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto scrollbar-hide">
                                            {PAPER_TYPES.map(p => (
                                                <button 
                                                    key={p.id}
                                                    onClick={() => setPaperMaterial(p.id as PaperMaterial)}
                                                    className={`p-2 rounded-xl border text-center transition-all ${paperMaterial === p.id ? 'bg-ink text-white border-ink' : 'bg-white border-black/5 hover:border-black/20'}`}
                                                >
                                                    <div className="w-full h-8 mb-2 rounded border bg-white/50" style={{ background: p.bg }} />
                                                    <span className="text-[8px] font-black uppercase tracking-widest truncate block">{p.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            {[
                                                { label: 'Shadow', active: paperShadow, toggle: () => setPaperShadow(!paperShadow) },
                                                { label: 'Texture', active: paperTexture, toggle: () => setPaperTexture(!paperTexture) },
                                                { label: 'Tilt', active: paperTilt, toggle: () => setPaperTilt(!paperTilt) },
                                            ].map(opt => (
                                                <button 
                                                    key={opt.label}
                                                    onClick={opt.toggle}
                                                    className={`flex-1 py-2 px-3 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${opt.active ? 'bg-accent/10 border-accent text-accent' : 'bg-white border-black/5 text-ink/40'}`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* EXPORT TOOLS */}
                                {activeDockTab === 'export' && (
                                    <div className="space-y-6">
                                        <div className="flex gap-2 bg-black/5 p-1 rounded-xl">
                                             {['image/png', 'image/jpeg'].map(f => (
                                                 <button 
                                                    key={f}
                                                    onClick={() => setExportFormat(f as 'image/png' | 'image/jpeg')}
                                                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${exportFormat === f ? 'bg-white shadow-sm text-ink' : 'text-ink/40 hover:text-ink'}`}
                                                 >
                                                    {f.split('/')[1]}
                                                 </button>
                                             ))}
                                        </div>

                                        <div className="flex gap-3">
                                            <button onClick={handleExportPNG} disabled={isExporting} className="flex-1 py-3 bg-ink text-white rounded-xl shadow-lg shadow-ink/20 hover:-translate-y-0.5 transition-all font-bold flex items-center justify-center gap-2">
                                                <FileImage size={16}/> Image
                                            </button>
                                            <button onClick={handleExportPDF} disabled={isExporting} className="flex-1 py-3 bg-white border border-black/5 text-ink rounded-xl hover:bg-gray-50 transition-all font-bold flex items-center justify-center gap-2">
                                                <FileText size={16}/> PDF
                                            </button>
                                            <button onClick={handleExportZIP} disabled={isExporting} className="flex-1 py-3 bg-white border border-black/5 text-ink rounded-xl hover:bg-gray-50 transition-all font-bold flex items-center justify-center gap-2">
                                                <Layers size={16}/> ZIP
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* DOCK BAR */}
                    <motion.div 
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        className="flex items-center gap-2 px-2 py-2 bg-white/80 backdrop-blur-2xl rounded-full border border-white/40 shadow-2xl shadow-ink/20"
                    >
                         {[
                            { id: 'style', icon: <Palette size={20}/>, label: 'Style' },
                            { id: 'paper', icon: <Layout size={20}/>, label: 'Paper' },
                            { id: 'export', icon: <Download size={20}/>, label: 'Export' }
                        ].map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveDockTab(activeDockTab === tab.id ? null : tab.id as any)}
                                className={`p-4 rounded-full transition-all duration-300 ${activeDockTab === tab.id ? 'bg-ink text-white shadow-lg -translate-y-2' : 'hover:bg-black/5 text-ink/60 hover:text-ink'}`}
                            >
                                {tab.icon}
                            </button>
                        ))}
                    </motion.div>
                </div>

            </div>

             <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".txt,.docx,.pdf" />
             <input type="file" ref={imageInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
        </div>
    );
}
