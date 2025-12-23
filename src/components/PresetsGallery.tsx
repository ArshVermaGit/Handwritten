import { useStore } from '../lib/store';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { RenderingSettings } from '../types';

interface Preset {
    id: string;
    name: string;
    desc: string;
    settings: Partial<RenderingSettings>;
    font: string;
    fontSize: number;
}

const presets: Preset[] = [
    {
        id: 'student',
        name: 'Student Notes',
        desc: 'Casual, slightly messy, rushed feel.',
        font: 'caveat',
        fontSize: 22,
        settings: { letterSpacingVar: 2, baselineVar: 1.5, rotationVar: 2, thickness: 1.0, speed: 'rushed', shakiness: 0.3 }
    },
    {
        id: 'pro',
        name: 'Professional',
        desc: 'Clean, consistent, and highly readable.',
        font: 'patrick',
        fontSize: 20,
        settings: { letterSpacingVar: 0.5, baselineVar: 0.2, rotationVar: 0.5, thickness: 1.2, speed: 'careful' }
    },
    {
        id: 'elegant',
        name: 'Elegant Cursive',
        desc: 'Flowing, connected, and formal.',
        font: 'dancing',
        fontSize: 26,
        settings: { letterSpacing: -2, slant: 10, thickness: 0.8, inkFlow: 'wet' }
    },
    {
        id: 'doctor',
        name: "Doctor's Script",
        desc: 'Rapid, energetic, and purposefully obscure.',
        font: 'shadows',
        fontSize: 18,
        settings: { letterSpacingVar: 4, baselineVar: 3, rotationVar: 5, thickness: 0.7, speed: 'rushed', letterSpacing: -3 }
    },
    {
        id: 'artistic',
        name: 'Artistic',
        desc: 'Decorative, stylized, and expressive.',
        font: 'indie',
        fontSize: 28,
        settings: { letterSpacingVar: 1, baselineVar: 2, rotationVar: 3, thickness: 2.0, inkFlow: 'wet' }
    },
    {
        id: 'teacher',
        name: "Teacher's Writing",
        desc: 'Large, clear, and perfectly spaced.',
        font: 'kalam',
        fontSize: 24,
        settings: { letterSpacingVar: 0.2, baselineVar: 0.1, rotationVar: 0.2, thickness: 1.5, speed: 'careful' }
    },
    {
        id: 'journal',
        name: 'Journal Entry',
        desc: 'Personal, relaxed, and intimate.',
        font: 'caveat',
        fontSize: 20,
        settings: { letterSpacingVar: 1.5, baselineVar: 0.8, rotationVar: 1.5, thickness: 1.1, shakiness: 0.2 }
    },
    {
        id: 'love',
        name: 'Love Letter',
        desc: 'Romantic, slow, and deeply connected.',
        font: 'dancing',
        fontSize: 24,
        settings: { slant: 5, letterSpacing: -1, thickness: 0.9, inkFlow: 'medium', rotationVar: 0.3 }
    },
    {
        id: 'memo',
        name: 'Quick Memo',
        desc: 'Compact, efficient, and direct.',
        font: 'patrick',
        fontSize: 16,
        settings: { letterSpacing: -1.5, lineHeight: 1.2, thickness: 1.0, speed: 'rushed' }
    },
    {
        id: 'calligraphy',
        name: 'Calligraphy Style',
        desc: 'Beautiful, formal, and precise.',
        font: 'marker',
        fontSize: 32,
        settings: { thickness: 2.5, inkFlow: 'wet', letterSpacingVar: 0.1, baselineVar: 0 }
    },
    { id: 'architect', name: 'Architect', desc: 'Angular, precise, and techy.', font: 'kalam', fontSize: 20, settings: { rotationVar: 0, baselineVar: 0, letterSpacing: 2 } },
    { id: 'minimalist', name: 'Minimalist', desc: 'Tiny, clean, and spacing-focused.', font: 'patrick', fontSize: 14, settings: { letterSpacing: 4, thickness: 0.8 } },
    { id: 'vintage', name: 'Vintage Ink', desc: 'Heavy bleeding and irregular flow.', font: 'marker', fontSize: 24, settings: { inkBleeding: true, thickness: 2, letterSpacingVar: 2 } },
    { id: 'lefty', name: 'Left-Handed', desc: 'Tilted back, slightly smudged.', font: 'caveat', fontSize: 22, settings: { slant: -12, rotationVar: 4 } },
    { id: 'fountain', name: 'Fountain Pen', desc: 'High variable pressure.', font: 'dancing', fontSize: 24, settings: { pressureVar: 0.8, thickness: 1.2 } },
    { id: 'pencil', name: 'Hb Pencil', desc: 'Thin strokes, slight grain.', font: 'shadows', fontSize: 20, settings: { thickness: 0.5, pressureVar: 0.5 } },
    { id: 'chalk', name: 'Chalkboard', desc: 'High jitter and thick characters.', font: 'marker', fontSize: 36, settings: { shakiness: 0.6, thickness: 4 } },
    { id: 'legal', name: 'Legal Disclaimer', desc: 'Uniform, dense, and serious.', font: 'kalam', fontSize: 12, settings: { letterSpacing: -2, lineHeight: 1 } },
    { id: 'postcard', name: 'Postcard Style', desc: 'Small, neat, and careful.', font: 'patrick', fontSize: 18, settings: { letterSpacing: 1, rotationVar: 1 } },
    { id: 'midnight', name: 'Midnight Scribble', desc: 'Dark, thick, and very messy.', font: 'shadows', fontSize: 28, settings: { thickness: 3, letterSpacingVar: 5, baselineVar: 4 } }
];

const fontMap: Record<string, string> = {
    caveat: 'Caveat',
    dancing: 'Dancing Script',
    indie: 'Indie Flower',
    shadows: 'Shadows Into Light',
    patrick: 'Patrick Hand',
    kalam: 'Kalam',
    marker: 'Permanent Marker',
};

export default function PresetsGallery() {
    const { handwritingStyle, setHandwritingStyle, updateSettings, setFontSize } = useStore();

    const applyPreset = (preset: Preset) => {
        setHandwritingStyle(preset.font);
        setFontSize(preset.fontSize);
        updateSettings(preset.settings);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[500px] overflow-y-auto pr-4 custom-scrollbar">
            {presets.map((preset) => (
                <motion.div
                    key={preset.id}
                    whileHover={{ y: -4 }}
                    onClick={() => applyPreset(preset)}
                    className={`p-6 border transition-all cursor-pointer flex flex-col justify-between ${handwritingStyle === preset.font ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-100 hover:border-gray-300'
                        }`}
                >
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${handwritingStyle === preset.font ? 'text-gray-500' : 'text-gray-400'}`}>
                                Preset {preset.id}
                            </span>
                            {handwritingStyle === preset.font && <Check size={12} />}
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-tight mb-2">{preset.name}</h3>
                        <p className={`text-[10px] leading-relaxed font-medium ${handwritingStyle === preset.font ? 'text-gray-400' : 'text-gray-500'}`}>
                            {preset.desc}
                        </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-current/10">
                        <span
                            className="text-2xl truncate block"
                            style={{ fontFamily: fontMap[preset.font] || preset.font }}
                        >
                            The quick brown fox
                        </span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
