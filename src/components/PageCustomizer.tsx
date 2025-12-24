import { useStore } from '../lib/store';
import type { PaperMaterial, PaperPattern, PaperSize } from '../types';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowDownWideNarrow, MoveHorizontal, MoveVertical, Timer } from 'lucide-react';

export default function PageCustomizer() {
    const {
        paperMaterial,
        setPaperMaterial,
        paperPattern,
        setPaperPattern,
        paperSize,
        setPaperSize,
        paperOrientation,
        setPaperOrientation,
        settings,
        updateSettings
    } = useStore();

    const [activeSection, setActiveSection] = useState<'base' | 'lines' | 'finishing' | 'aging'>('base');

    const materials: { id: PaperMaterial, label: string }[] = [
        { id: 'white', label: 'Pure White' },
        { id: 'cream', label: 'Cream' },
        { id: 'yellow', label: 'Legal Yellow' },
        { id: 'aged', label: 'Vintage' },
        { id: 'recycled', label: 'Recycled' },
        { id: 'parchment', label: 'Parchment' },
    ];

    const patterns: { id: PaperPattern, label: string }[] = [
        { id: 'none', label: 'Blank' },
        { id: 'wide', label: 'Wide Ruled' },
        { id: 'college', label: 'College Ruled' },
        { id: 'narrow', label: 'Narrow Ruled' },
        { id: 'primary', label: 'Primary' },
        { id: 'french', label: 'French (Seyès)' },
        { id: 'music', label: 'Music Staff' },
        { id: 'graph', label: 'Graph 5mm' },
        { id: 'dot', label: 'Dot Grid' },
        { id: 'cornell', label: 'Cornell Notes' },
        { id: 'legal', label: 'Legal Pad' },
        { id: 'todo', label: 'To-Do List' },
        { id: 'engineer', label: 'Engineering' },
        { id: 'isometric', label: 'Isometric' },
        { id: 'hex', label: 'Hexagonal' },
        { id: 'letter', label: 'Letter Frame' },
        { id: 'poetry', label: 'Poetry Frame' },
        { id: 'squared', label: 'Squared' },
    ];

    const paperSizes: { id: PaperSize, label: string, dims: string }[] = [
        { id: 'a4', label: 'A4', dims: '210×297mm' },
        { id: 'letter', label: 'Letter', dims: '8.5×11"' },
        { id: 'legal', label: 'Legal', dims: '8.5×14"' },
        { id: 'tabloid', label: 'Tabloid', dims: '11×17"' },
        { id: 'a5', label: 'A5', dims: '148×210mm' },
        { id: 'a6', label: 'A6', dims: '105×148mm' },
    ];

    const lineColors = [
        { name: 'Light Grey', value: '#e5e7eb' },
        { name: 'Cool Grey', value: '#9ca3af' },
        { name: 'Light Blue', value: '#E3F2FD' },
        { name: 'Standard Blue', value: '#93c5fd' },
        { name: 'Engineering Green', value: '#dcfce7' },
        { name: 'Pink', value: '#FCE4EC' },
        { name: 'Red', value: '#fca5a5' },
        { name: 'Black', value: '#000000' },
    ];

    const toggleDecoration = (key: keyof typeof settings.decorations) => {
        if (!settings.decorations) return;
        updateSettings({
            decorations: {
                ...settings.decorations,
                [key]: !settings.decorations[key]
            }
        });
    };

    const updateWatermark = (key: string, value: any) => {
        if (!settings.decorations) return;
        updateSettings({
            decorations: {
                ...settings.decorations,
                watermark: {
                    ...settings.decorations.watermark,
                    [key]: value
                }
            }
        });
    };

    const updateAging = (key: string, value: any) => {
        if (!settings.aging) return;
        updateSettings({
            aging: {
                ...settings.aging,
                [key]: value
            }
        });
    };

    const setMargins = (preset: 'none' | 'narrow' | 'normal' | 'wide') => {
        const presets = {
            none: 0,
            narrow: 40,
            normal: 60,
            wide: 100
        };
        const val = presets[preset];
        updateSettings({ margins: { top: val, bottom: val, left: val, right: val } });
    };

    return (
        <div className="space-y-8">
            <div className="flex border-b border-gray-100">
                <button onClick={() => setActiveSection('base')} className={`flex-1 py-3 text-[8px] font-black uppercase tracking-widest transition-all border-b-2 ${activeSection === 'base' ? 'border-black text-black' : 'border-transparent text-gray-300'}`}>Substrate</button>
                <button onClick={() => setActiveSection('lines')} className={`flex-1 py-3 text-[8px] font-black uppercase tracking-widest transition-all border-b-2 ${activeSection === 'lines' ? 'border-black text-black' : 'border-transparent text-gray-300'}`}>Lines</button>
                <button onClick={() => setActiveSection('finishing')} className={`flex-1 py-3 text-[8px] font-black uppercase tracking-widest transition-all border-b-2 ${activeSection === 'finishing' ? 'border-black text-black' : 'border-transparent text-gray-300'}`}>Finish</button>
                <button onClick={() => setActiveSection('aging')} className={`flex-1 py-3 text-[8px] font-black uppercase tracking-widest transition-all border-b-2 ${activeSection === 'aging' ? 'border-black text-black' : 'border-transparent text-gray-300'}`}>Aging</button>
            </div>

            <AnimatePresence mode="wait">
                {activeSection === 'base' ? (
                    <motion.div key="base" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                        {/* Format & Size */}
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Format</label>
                            <div className="flex gap-2 mb-4">
                                <button onClick={() => setPaperOrientation('portrait')} className={`flex-1 py-3 flex items-center justify-center gap-2 border ${paperOrientation === 'portrait' ? 'border-black bg-black text-white' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'}`}>
                                    <MoveVertical size={14} /> <span className="text-[9px] font-black uppercase tracking-widest">Portrait</span>
                                </button>
                                <button onClick={() => setPaperOrientation('landscape')} className={`flex-1 py-3 flex items-center justify-center gap-2 border ${paperOrientation === 'landscape' ? 'border-black bg-black text-white' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'}`}>
                                    <MoveHorizontal size={14} /> <span className="text-[9px] font-black uppercase tracking-widest">Landscape</span>
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {paperSizes.map((size) => (
                                    <button key={size.id} onClick={() => setPaperSize(size.id)} className={`p-3 text-left border transition-all ${paperSize === size.id ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}>
                                        <div className={`text-[10px] font-black uppercase tracking-widest ${paperSize === size.id ? 'text-black' : 'text-gray-500'}`}>{size.label}</div>
                                        <div className="text-[9px] text-gray-400 mt-1">{size.dims}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Material */}
                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Material</label>
                            <div className="grid grid-cols-1 gap-2">
                                {materials.map((mat) => (
                                    <button
                                        key={mat.id}
                                        onClick={() => setPaperMaterial(mat.id)}
                                        className={`py-3 px-4 text-[9px] font-black uppercase tracking-widest transition-all border text-left flex justify-between group ${paperMaterial === mat.id ? 'border-black bg-black text-white' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'}`}
                                    >
                                        <span>{mat.label}</span>
                                        <div className={`w-3 h-3 rounded-full border border-gray-500/20 ${mat.id === 'white' ? 'bg-white' : mat.id === 'cream' ? 'bg-[#FAF9F6]' : mat.id === 'yellow' ? 'bg-[#FEF9C3]' : mat.id === 'aged' ? 'bg-[#fdf6e3]' : mat.id === 'recycled' ? 'bg-[#f3f4f6]' : 'bg-[#e8dcc5]'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : activeSection === 'lines' ? (
                    <motion.div key="lines" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Rule Pattern</label>
                            <div className="grid grid-cols-2 gap-2 max-h-[240px] overflow-y-auto custom-scrollbar pr-2">
                                {patterns.map((pat) => (
                                    <button
                                        key={pat.id}
                                        onClick={() => setPaperPattern(pat.id)}
                                        className={`py-3 px-3 text-[9px] font-black uppercase tracking-widest transition-all border text-left flex items-center ${paperPattern === pat.id ? 'border-black bg-black text-white' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'}`}
                                    >
                                        {pat.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Stroke Color</label>
                            <div className="grid grid-cols-8 gap-2">
                                {lineColors.map((c) => (
                                    <button
                                        key={c.value}
                                        onClick={() => updateSettings({ lineColor: c.value })}
                                        className={`w-6 h-6 rounded-none border transition-all ${settings.lineColor === c.value ? 'ring-2 ring-black ring-offset-2 border-transparent' : 'border-gray-200 hover:border-gray-400'}`}
                                        style={{ backgroundColor: c.value }}
                                        title={c.name}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Margin Constraints</label>
                            <div className="flex justify-between items-center mb-2">
                                <ArrowDownWideNarrow size={14} className="text-gray-300" />
                            </div>
                            <div className="flex gap-1 mb-4">
                                {(['none', 'narrow', 'normal', 'wide'] as const).map(m => (
                                    <button key={m} onClick={() => setMargins(m)} className="flex-1 py-2 border border-gray-100 text-[8px] font-bold uppercase tracking-wider text-gray-400 hover:border-gray-300 hover:text-black transition-all">
                                        {m}
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <span className="text-[8px] font-bold text-gray-300 uppercase">Horizontal</span>
                                    <input type="number" value={settings.margins.left} onChange={(e) => updateSettings({ margins: { ...settings.margins, left: parseInt(e.target.value), right: parseInt(e.target.value) } })} className="w-full bg-gray-50 border border-gray-100 p-2 text-[10px] font-black focus:outline-none focus:border-black" />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[8px] font-bold text-gray-300 uppercase">Vertical</span>
                                    <input type="number" value={settings.margins.top} onChange={(e) => updateSettings({ margins: { ...settings.margins, top: parseInt(e.target.value), bottom: parseInt(e.target.value) } })} className="w-full bg-gray-50 border border-gray-100 p-2 text-[10px] font-black focus:outline-none focus:border-black" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : activeSection === 'finishing' ? (
                    <motion.div key="finishing" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                        {settings.decorations && (
                            <>
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Binding & Cutting</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        <button onClick={() => toggleDecoration('holes')} className={`py-3 px-4 text-[9px] font-black uppercase tracking-widest transition-all border text-left flex justify-between ${settings.decorations.holes ? 'border-black bg-black text-white' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'}`}>
                                            Hole Punch (3-Ring) <span>{settings.decorations.holes ? 'ON' : 'OFF'}</span>
                                        </button>
                                        <button onClick={() => toggleDecoration('spiral')} className={`py-3 px-4 text-[9px] font-black uppercase tracking-widest transition-all border text-left flex justify-between ${settings.decorations.spiral ? 'border-black bg-black text-white' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'}`}>
                                            Spiral Binding <span>{settings.decorations.spiral ? 'ON' : 'OFF'}</span>
                                        </button>
                                        <button onClick={() => toggleDecoration('perforation')} className={`py-3 px-4 text-[9px] font-black uppercase tracking-widest transition-all border text-left flex justify-between ${settings.decorations.perforation ? 'border-black bg-black text-white' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'}`}>
                                            Perforated Top <span>{settings.decorations.perforation ? 'ON' : 'OFF'}</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Artistic Details</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['none', 'geometric', 'floral'].map((style: any) => (
                                            <button key={style} onClick={() => updateSettings({ decorations: { ...settings.decorations, corners: style } })} className={`py-3 px-2 text-[8px] font-black uppercase tracking-widest transition-all border text-center ${settings.decorations?.corners === style ? 'border-black bg-black text-white' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'}`}>
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Watermark</label>
                                        <button onClick={() => updateWatermark('enabled', !settings.decorations!.watermark.enabled)} className="text-[9px] font-bold underline">
                                            {settings.decorations.watermark.enabled ? 'DISABLE' : 'ENABLE'}
                                        </button>
                                    </div>
                                    {settings.decorations.watermark.enabled && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <input type="text" value={settings.decorations.watermark.text} onChange={(e) => updateWatermark('text', e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-2 text-[12px] font-medium focus:outline-none focus:border-black" placeholder="Enter watermark text..." />
                                            <input type="range" min="0.01" max="0.3" step="0.01" value={settings.decorations.watermark.opacity} onChange={(e) => updateWatermark('opacity', Number(e.target.value))} className="w-full h-1 bg-gray-100 appearance-none cursor-pointer accent-black" />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="aging" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                        {settings.aging && (
                            <>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center bg-gray-50 p-4 border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <Timer size={16} className="text-gray-400" />
                                            <label className="text-[10px] font-black uppercase tracking-widest text-black">Aged Paper Engine</label>
                                        </div>
                                        <button onClick={() => updateAging('enabled', !settings.aging!.enabled)} className={`w-10 h-5 rounded-full transition-all relative ${settings.aging.enabled ? 'bg-black' : 'bg-gray-200'}`}>
                                            <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-all ${settings.aging.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                    {settings.aging.enabled && (
                                        <div className="space-y-2 mt-4 px-2">
                                            <div className="flex justify-between"><label className="text-[9px] uppercase font-bold text-gray-400">Master Intensity</label><span className="text-[9px] font-bold">{Math.round(settings.aging.intensity * 100)}%</span></div>
                                            <input type="range" min={0} max={1} step={0.05} value={settings.aging.intensity} onChange={(e) => updateAging('intensity', Number(e.target.value))} className="w-full h-1 bg-gray-100 appearance-none cursor-pointer accent-black" />
                                        </div>
                                    )}
                                </div>

                                {settings.aging.enabled && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="space-y-4">
                                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Distress & Wear</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <span className="text-[8px] font-bold text-gray-300 uppercase">Sepia Tint</span>
                                                    <input type="range" min={0} max={1} step={0.1} value={settings.aging.sepia} onChange={(e) => updateAging('sepia', Number(e.target.value))} className="w-full h-1 bg-gray-100 appearance-none cursor-pointer accent-black" />
                                                </div>
                                                <div className="space-y-2">
                                                    <span className="text-[8px] font-bold text-gray-300 uppercase">Fading Vignette</span>
                                                    <input type="range" min={0} max={1} step={0.1} value={settings.aging.vignette} onChange={(e) => updateAging('vignette', Number(e.target.value))} className="w-full h-1 bg-gray-100 appearance-none cursor-pointer accent-black" />
                                                </div>
                                                <div className="space-y-2">
                                                    <span className="text-[8px] font-bold text-gray-300 uppercase">Ink Spots</span>
                                                    <input type="range" min={0} max={1} step={0.1} value={settings.aging.spots} onChange={(e) => updateAging('spots', Number(e.target.value))} className="w-full h-1 bg-gray-100 appearance-none cursor-pointer accent-black" />
                                                </div>
                                                <div className="space-y-2">
                                                    <span className="text-[8px] font-bold text-gray-300 uppercase">Creases</span>
                                                    <input type="range" min={0} max={1} step={0.1} value={settings.aging.creases} onChange={(e) => updateAging('creases', Number(e.target.value))} className="w-full h-1 bg-gray-100 appearance-none cursor-pointer accent-black" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Damage</label>
                                            <div className="grid grid-cols-1 gap-2">
                                                <button onClick={() => updateAging('burnMarks', settings.aging!.burnMarks > 0 ? 0 : 0.5)} className={`py-3 px-4 text-[9px] font-black uppercase tracking-widest transition-all border text-left flex justify-between ${settings.aging.burnMarks > 0 ? 'border-black bg-black text-white' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'}`}>
                                                    Burn Marks <span>{settings.aging.burnMarks > 0 ? 'LOW' : 'OFF'}</span>
                                                </button>
                                                <button onClick={() => updateAging('waterStains', !settings.aging!.waterStains)} className={`py-3 px-4 text-[9px] font-black uppercase tracking-widest transition-all border text-left flex justify-between ${settings.aging.waterStains ? 'border-black bg-black text-white' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'}`}>
                                                    Coffee/Water Stains <span>{settings.aging.waterStains ? 'ON' : 'OFF'}</span>
                                                </button>
                                                <button onClick={() => updateAging('tornCorners', !settings.aging!.tornCorners)} className={`py-3 px-4 text-[9px] font-black uppercase tracking-widest transition-all border text-left flex justify-between ${settings.aging.tornCorners ? 'border-black bg-black text-white' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'}`}>
                                                    Torn Corner Effect <span>{settings.aging.tornCorners ? 'ON' : 'OFF'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
