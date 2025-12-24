import { useState, useRef } from 'react';
import { Plus, FolderOpen, Save, Search, FileText, Grid3X3, Type, Settings2, Palette, Upload, X } from 'lucide-react';
import { useStore, getAvailableFonts } from '../lib/store';
import type { PaperSize, OutputEffect, OutputResolution, PagePreset } from '../types';

// Page presets using JPG images from public/page_presets
const pagePresets: { name: string; value: PagePreset; image: string }[] = [
    { name: 'White Page 1', value: 'white-page-1', image: '/page_presets/white-page-1.jpg' },
    { name: 'White Page 2', value: 'white-page-2', image: '/page_presets/white-page-2.jpg' },
    { name: 'White Page 3', value: 'white-page-3', image: '/page_presets/white-page-3.jpg' },
    { name: 'Black Lines', value: 'black-line-page', image: '/page_presets/black-line-page.jpg' },
    { name: 'Blue Lines', value: 'blue-line-page', image: '/page_presets/blue-line-page.jpg' },
    { name: 'Grey Lines', value: 'grey-line-page', image: '/page_presets/grey-line-page.jpg' },
    { name: 'Maths Grid', value: 'maths-page', image: '/page_presets/maths-page.jpg' },
];

const pageSizes: { name: string; value: PaperSize; dimensions: string }[] = [
    { name: 'A4', value: 'a4', dimensions: '210×297mm' },
    { name: 'Letter', value: 'letter', dimensions: '8.5×11"' },
    { name: 'A5', value: 'a5', dimensions: '148×210mm' },
    { name: 'A6', value: 'a6', dimensions: '105×148mm' },
    { name: 'Legal', value: 'legal', dimensions: '8.5×14"' },
];

const inkColors = [
    { name: 'Blue', value: '#1e40af', preset: 'blue' as const },
    { name: 'Black', value: '#030712', preset: 'black' as const },
    { name: 'Red', value: '#dc2626', preset: 'red' as const },
];

const effects: { name: string; value: OutputEffect }[] = [
    { name: 'No Effect', value: 'none' },
    { name: 'Shadows', value: 'shadows' },
    { name: 'Scanner', value: 'scanner' },
];

const resolutions: { name: string; value: OutputResolution }[] = [
    { name: 'Very Low', value: 'very-low' },
    { name: 'Low', value: 'low' },
    { name: 'Normal', value: 'normal' },
    { name: 'High', value: 'high' },
    { name: 'Very High', value: 'very-high' },
];

export default function EditorSidebar() {
    const {
        handwritingStyle,
        setHandwritingStyle,
        pagePreset,
        setPagePreset,
        customBackground,
        setCustomBackground,
        paperSize,
        setPaperSize,
        paperOrientation,
        setPaperOrientation,
        fontSize,
        setFontSize,
        inkColor,
        setInkColor,
        settings,
        updateSettings,
        showPaperLines,
        setShowPaperLines,
        showMarginLine,
        setShowMarginLine,
        outputEffect,
        setOutputEffect,
        outputResolution,
        setOutputResolution,
        addPage,
    } = useStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'styles' | 'paper' | 'page' | 'customize' | 'effects'>('styles');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fonts = getAvailableFonts(useStore.getState());

    const filteredFonts = fonts.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle custom background upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a JPG, PNG, or PDF file');
            return;
        }

        // For PDF, we'd need a library like pdf.js - for now just handle images
        if (file.type === 'application/pdf') {
            alert('PDF support coming soon! Please upload a JPG or PNG image.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setCustomBackground(dataUrl);
            setPagePreset('custom');
        };
        reader.readAsDataURL(file);
    };

    // Slider component for reuse
    const Slider = ({
        label,
        value,
        min,
        max,
        step = 1,
        unit = '',
        onChange
    }: {
        label: string;
        value: number;
        min: number;
        max: number;
        step?: number;
        unit?: string;
        onChange: (v: number) => void
    }) => (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <span className="text-[11px] font-medium text-gray-600">{label}</span>
                <span className="text-[11px] font-bold text-black">{value}{unit}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
        </div>
    );

    // Toggle component
    const Toggle = ({
        label,
        checked,
        onChange
    }: {
        label: string;
        checked: boolean;
        onChange: (v: boolean) => void
    }) => (
        <div className="flex items-center justify-between py-2">
            <span className="text-[11px] font-medium text-gray-700">{label}</span>
            <button
                onClick={() => onChange(!checked)}
                className={`w-10 h-5 rounded-full transition-all relative ${checked ? 'bg-black' : 'bg-gray-300'
                    }`}
            >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${checked ? 'right-0.5' : 'left-0.5'
                    }`} />
            </button>
        </div>
    );

    return (
        <aside className="h-full bg-[#FAFAFA] border-r border-gray-200 flex flex-col overflow-hidden">

            {/* Quick Actions Section */}
            <div className="p-3 space-y-2 border-b border-gray-100">
                <button
                    onClick={() => addPage()}
                    className="w-full h-9 flex items-center justify-center gap-2 bg-black text-white rounded-lg font-bold text-xs hover:bg-gray-800 transition-all active:scale-[0.98]"
                >
                    <Plus size={14} />
                    New Doc
                </button>
                <div className="grid grid-cols-2 gap-1.5">
                    <button className="flex items-center justify-center gap-1.5 h-7 bg-white border border-gray-200 rounded-md text-[10px] font-medium text-gray-600 hover:bg-gray-50 transition-all">
                        <FolderOpen size={11} />
                        Open
                    </button>
                    <button className="flex items-center justify-center gap-1.5 h-7 bg-white border border-gray-200 rounded-md text-[10px] font-medium text-gray-600 hover:bg-gray-50 transition-all">
                        <Save size={11} />
                        Save
                    </button>
                </div>
            </div>

            {/* Tab Selector */}
            <div className="flex border-b border-gray-100 px-1 overflow-x-auto">
                {[
                    { key: 'styles', icon: <Type size={12} />, label: 'Styles' },
                    { key: 'paper', icon: <Grid3X3 size={12} />, label: 'Paper' },
                    { key: 'page', icon: <FileText size={12} />, label: 'Size' },
                    { key: 'customize', icon: <Settings2 size={12} />, label: 'Spacing' },
                    { key: 'effects', icon: <Palette size={12} />, label: 'Effects' },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as typeof activeTab)}
                        className={`flex-1 py-2 flex flex-col items-center gap-0.5 text-[9px] font-medium transition-all min-w-[50px] ${activeTab === tab.key
                                ? 'text-black border-b-2 border-black'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-3">

                {/* Writing Styles Tab */}
                {activeTab === 'styles' && (
                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                            <input
                                type="text"
                                placeholder="Search styles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-black transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                            {filteredFonts.map((font) => (
                                <button
                                    key={font.id}
                                    onClick={() => setHandwritingStyle(font.id)}
                                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all min-h-[52px] ${handwritingStyle === font.id
                                            ? 'bg-black text-white shadow-lg'
                                            : 'bg-white border border-gray-200 hover:border-gray-400'
                                        }`}
                                >
                                    <div
                                        className="text-base mb-0.5"
                                        style={{ fontFamily: font.family }}
                                    >
                                        Aa
                                    </div>
                                    <span className="text-[8px] font-medium opacity-80">
                                        {font.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Paper Tab - JPG Presets */}
                {activeTab === 'paper' && (
                    <div className="space-y-4">
                        <p className="text-[10px] text-gray-500">Choose paper background</p>

                        {/* Page Presets Grid */}
                        <div className="grid grid-cols-2 gap-2">
                            {pagePresets.map((preset) => (
                                <button
                                    key={preset.value}
                                    onClick={() => {
                                        setPagePreset(preset.value);
                                        if (preset.value !== 'custom') {
                                            setCustomBackground(null);
                                        }
                                    }}
                                    className={`relative overflow-hidden rounded-lg transition-all ${pagePreset === preset.value
                                            ? 'ring-2 ring-black shadow-lg'
                                            : 'ring-1 ring-gray-200 hover:ring-gray-400'
                                        }`}
                                >
                                    <img
                                        src={preset.image}
                                        alt={preset.name}
                                        className="w-full h-20 object-cover"
                                    />
                                    <div className={`absolute bottom-0 left-0 right-0 px-1.5 py-1 text-[8px] font-medium ${pagePreset === preset.value
                                            ? 'bg-black text-white'
                                            : 'bg-white/90 text-gray-700'
                                        }`}>
                                        {preset.name}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Custom Upload Section */}
                        <div className="border-t border-gray-200 pt-4">
                            <p className="text-[10px] font-bold text-gray-900 uppercase tracking-wide mb-2">
                                Custom Background
                            </p>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handleFileUpload}
                                className="hidden"
                            />

                            {customBackground ? (
                                <div className="relative">
                                    <img
                                        src={customBackground}
                                        alt="Custom background"
                                        className={`w-full h-24 object-cover rounded-lg ${pagePreset === 'custom' ? 'ring-2 ring-black' : 'ring-1 ring-gray-200'
                                            }`}
                                        onClick={() => setPagePreset('custom')}
                                    />
                                    <button
                                        onClick={() => {
                                            setCustomBackground(null);
                                            if (pagePreset === 'custom') {
                                                setPagePreset('white-page-1');
                                            }
                                        }}
                                        className="absolute top-1 right-1 p-1 bg-black/70 rounded-full text-white hover:bg-black"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-all"
                                >
                                    <Upload size={20} />
                                    <span className="text-[10px] font-medium">Upload JPG, PNG</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Page Settings Tab */}
                {activeTab === 'page' && (
                    <div className="space-y-4">
                        {/* Page Size */}
                        <div>
                            <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wide mb-2">
                                Page Size
                            </h4>
                            <div className="space-y-1">
                                {pageSizes.map((size) => (
                                    <button
                                        key={size.value}
                                        onClick={() => setPaperSize(size.value)}
                                        className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${paperSize === size.value
                                                ? 'bg-black text-white'
                                                : 'bg-white border border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        <span className="text-xs font-medium">{size.name}</span>
                                        <span className={`text-[9px] ${paperSize === size.value ? 'opacity-70' : 'text-gray-400'}`}>
                                            {size.dimensions}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Orientation */}
                        <div>
                            <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wide mb-2">
                                Orientation
                            </h4>
                            <div className="grid grid-cols-2 gap-1.5">
                                <button
                                    onClick={() => setPaperOrientation('portrait')}
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${paperOrientation === 'portrait'
                                            ? 'bg-black text-white'
                                            : 'bg-white border border-gray-200 hover:border-gray-400'
                                        }`}
                                >
                                    <div className={`w-4 h-6 border-2 rounded mb-1 ${paperOrientation === 'portrait' ? 'border-white' : 'border-gray-400'
                                        }`} />
                                    <span className="text-[9px] font-medium">Portrait</span>
                                </button>
                                <button
                                    onClick={() => setPaperOrientation('landscape')}
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${paperOrientation === 'landscape'
                                            ? 'bg-black text-white'
                                            : 'bg-white border border-gray-200 hover:border-gray-400'
                                        }`}
                                >
                                    <div className={`w-6 h-4 border-2 rounded mb-1 ${paperOrientation === 'landscape' ? 'border-white' : 'border-gray-400'
                                        }`} />
                                    <span className="text-[9px] font-medium">Landscape</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Customization Tab */}
                {activeTab === 'customize' && (
                    <div className="space-y-4">
                        {/* Font Settings */}
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wide">
                                Font
                            </h4>
                            <Slider
                                label="Size"
                                value={fontSize}
                                min={12}
                                max={48}
                                unit="px"
                                onChange={setFontSize}
                            />
                        </div>

                        {/* Spacing Settings */}
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wide">
                                Spacing
                            </h4>
                            <Slider
                                label="Line Height"
                                value={settings.lineHeight}
                                min={1}
                                max={3}
                                step={0.1}
                                onChange={(v) => updateSettings({ lineHeight: v })}
                            />
                            <Slider
                                label="Letter Spacing"
                                value={settings.letterSpacing}
                                min={0}
                                max={5}
                                step={0.1}
                                unit="px"
                                onChange={(v) => updateSettings({ letterSpacing: v })}
                            />
                            <Slider
                                label="Word Spacing"
                                value={settings.wordSpacing}
                                min={0.5}
                                max={4}
                                step={0.1}
                                onChange={(v) => updateSettings({ wordSpacing: v })}
                            />
                        </div>

                        {/* Margin Settings */}
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wide">
                                Margins
                            </h4>
                            <Slider
                                label="Top"
                                value={settings.margins.top}
                                min={20}
                                max={150}
                                unit="px"
                                onChange={(v) => updateSettings({ margins: { ...settings.margins, top: v } })}
                            />
                            <Slider
                                label="Bottom"
                                value={settings.margins.bottom}
                                min={20}
                                max={150}
                                unit="px"
                                onChange={(v) => updateSettings({ margins: { ...settings.margins, bottom: v } })}
                            />
                            <Slider
                                label="Left"
                                value={settings.margins.left}
                                min={20}
                                max={150}
                                unit="px"
                                onChange={(v) => updateSettings({ margins: { ...settings.margins, left: v } })}
                            />
                            <Slider
                                label="Right"
                                value={settings.margins.right}
                                min={20}
                                max={150}
                                unit="px"
                                onChange={(v) => updateSettings({ margins: { ...settings.margins, right: v } })}
                            />
                        </div>
                    </div>
                )}

                {/* Effects Tab */}
                {activeTab === 'effects' && (
                    <div className="space-y-4">
                        {/* Ink Color */}
                        <div>
                            <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wide mb-2">
                                Ink Color
                            </h4>
                            <div className="flex gap-2">
                                {inkColors.map((color) => (
                                    <button
                                        key={color.preset}
                                        onClick={() => setInkColor(color.value)}
                                        className={`flex-1 flex flex-col items-center p-2 rounded-lg transition-all ${inkColor === color.value
                                                ? 'bg-gray-100 ring-2 ring-black'
                                                : 'bg-white border border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        <div
                                            className="w-6 h-6 rounded-full mb-1 shadow-inner"
                                            style={{ backgroundColor: color.value }}
                                        />
                                        <span className="text-[9px] font-medium">{color.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Paper Options */}
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wide">
                                Overlays
                            </h4>
                            <Toggle
                                label="Show Paper Lines"
                                checked={showPaperLines}
                                onChange={setShowPaperLines}
                            />
                            <Toggle
                                label="Show Margin Line"
                                checked={showMarginLine}
                                onChange={setShowMarginLine}
                            />
                        </div>

                        {/* Output Effects */}
                        <div>
                            <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wide mb-2">
                                Output Effect
                            </h4>
                            <div className="space-y-1">
                                {effects.map((effect) => (
                                    <button
                                        key={effect.value}
                                        onClick={() => setOutputEffect(effect.value)}
                                        className={`w-full p-2 rounded-lg text-xs font-medium transition-all text-left ${outputEffect === effect.value
                                                ? 'bg-black text-white'
                                                : 'bg-white border border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        {effect.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Resolution */}
                        <div>
                            <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wide mb-2">
                                Resolution
                            </h4>
                            <select
                                value={outputResolution}
                                onChange={(e) => setOutputResolution(e.target.value as OutputResolution)}
                                className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-black"
                            >
                                {resolutions.map((res) => (
                                    <option key={res.value} value={res.value}>
                                        {res.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Handwriting Variation */}
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wide">
                                Handwriting Variation
                            </h4>
                            <Slider
                                label="Baseline"
                                value={settings.baselineVar}
                                min={0}
                                max={5}
                                step={0.1}
                                onChange={(v) => updateSettings({ baselineVar: v })}
                            />
                            <Slider
                                label="Rotation"
                                value={settings.rotationVar}
                                min={0}
                                max={5}
                                step={0.1}
                                unit="°"
                                onChange={(v) => updateSettings({ rotationVar: v })}
                            />
                            <Slider
                                label="Slant"
                                value={settings.slant}
                                min={-15}
                                max={15}
                                unit="°"
                                onChange={(v) => updateSettings({ slant: v })}
                            />
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
