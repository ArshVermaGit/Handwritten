export type HandwritingStyle = string;

export interface FontPreference {
    id: string;
    name: string;
    family: string;
    type: 'google' | 'custom';
    url?: string;
}

export type PaperMaterial = 'white' | 'ruled' | 'graph' | 'dotted' | 'vintage' | 'custom';
export type PaperSize = 'a4' | 'letter' | 'a5' | 'a6' | 'legal' | 'tabloid';
export type PaperOrientation = 'portrait' | 'landscape';

export interface AppState {
    text: string;
    lastSaved: Date | null;
    zoom: number;
    editorMode: 'plain' | 'rich';
    uploadedFileName: string | null;
    handwritingStyle: HandwritingStyle;
    fontSize: number;
    letterSpacing: number;
    lineHeight: number;
    wordSpacing: number;
    inkColor: string;
    paperMaterial: PaperMaterial;
    paperSize: PaperSize;
    paperOrientation: PaperOrientation;
    customFonts: FontPreference[];
    customPaperImage: string | null;
    // Onboarding State
    hasSeenOnboarding: boolean;
    hasSeenTour: boolean;

    // UI State
    isSidebarCollapsed: boolean;
    isSettingsOpen: boolean;

    // Actions
    setText: (text: string) => void;
    setLastSaved: (date: Date | null) => void;
    setZoom: (zoom: number) => void;
    setEditorMode: (mode: 'plain' | 'rich') => void;
    setUploadedFileName: (name: string | null) => void;
    setHandwritingStyle: (style: HandwritingStyle) => void;
    setFontSize: (size: number) => void;
    setLetterSpacing: (spacing: number) => void;
    setLineHeight: (height: number) => void;
    setWordSpacing: (spacing: number) => void;
    setPaperMaterial: (material: PaperMaterial) => void;
    setPaperSize: (size: PaperSize) => void;
    setPaperOrientation: (orientation: PaperOrientation) => void;
    setInkColor: (color: string) => void;
    addCustomFont: (font: FontPreference) => void;
    removeCustomFont: (id: string) => void;
    resetTypography: () => void;
    setCustomPaperImage: (image: string | null) => void;

    // Onboarding Actions
    completeOnboarding: () => void;
    completeTour: () => void;

    // UI Actions
    setSidebarCollapsed: (collapsed: boolean) => void;
    setSettingsOpen: (open: boolean) => void;

    reset: () => void;
}
