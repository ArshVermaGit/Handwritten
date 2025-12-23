export type HandwritingStyle = string;

export interface FontPreference {
    id: string;
    name: string;
    family: string;
    type: 'google' | 'custom';
    url?: string;
}

export type PaperType = 'blank' | 'lined' | 'grid';

export interface RenderingSettings {
    // Natural Variations
    letterSpacingVar: number; // ±px
    baselineVar: number; // ±px
    rotationVar: number; // ±deg

    // Pen Simulation
    thickness: number;
    pressureVar: number; // 0 to 1
    inkFlow: 'dry' | 'medium' | 'wet';
    slant: number; // -15 to 15 deg
    shakiness: number; // 0 to 1
    speed: 'rushed' | 'careful';

    // Realism Effects
    inkBleeding: boolean;
    paperTexture: boolean;
    penSkip: boolean;
    smudgeMarks: boolean;
    marginViolations: boolean;
    spellingErrors: boolean;

    // Layout
    wordSpacing: number;
    letterSpacing: number;
    lineHeight: number;
    margins: { top: number; right: number; bottom: number; left: number };
}

export interface AppState {
    text: string;
    handwritingStyle: HandwritingStyle;
    fontSize: number;
    inkColor: string;
    paperType: PaperType;
    customFonts: FontPreference[];

    // Advanced Rendering & Customization
    settings: RenderingSettings;
    quality: 'low' | 'medium' | 'high' | 'ultra';
    language: string;

    // View State
    zoom: number;
    pan: { x: number; y: number };
    showLineNumbers: boolean;

    // Actions
    setText: (text: string) => void;
    setHandwritingStyle: (style: HandwritingStyle) => void;
    setFontSize: (size: number) => void;
    setPaperType: (type: PaperType) => void;
    setInkColor: (color: string) => void;
    updateSettings: (settings: Partial<RenderingSettings>) => void;
    setQuality: (quality: AppState['quality']) => void;
    setLanguage: (lang: string) => void;
    setZoom: (zoom: number) => void;
    setPan: (pan: AppState['pan']) => void;
    toggleLineNumbers: () => void;
    addCustomFont: (font: FontPreference) => void;
    removeCustomFont: (id: string) => void;
    reset: () => void;
}
