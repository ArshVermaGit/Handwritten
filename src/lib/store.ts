import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, FontPreference, RenderingSettings } from '../types';

const defaultFonts: FontPreference[] = [
    { id: 'caveat', name: 'Caveat', family: 'Caveat', type: 'google' },
    { id: 'dancing', name: 'Dancing Script', family: 'Dancing Script', type: 'google' },
    { id: 'indie', name: 'Indie Flower', family: 'Indie Flower', type: 'google' },
    { id: 'shadows', name: 'Shadows Into Light', family: 'Shadows Into Light', type: 'google' },
    { id: 'patrick', name: 'Patrick Hand', family: 'Patrick Hand', type: 'google' },
    { id: 'kalam', name: 'Kalam', family: 'Kalam', type: 'google' },
    { id: 'marker', name: 'Permanent Marker', family: 'Permanent Marker', type: 'google' },
];

const defaultSettings: RenderingSettings = {
    letterSpacingVar: 1,
    baselineVar: 0.5,
    rotationVar: 1,
    thickness: 1.2,
    pressureVar: 0.2,
    inkFlow: 'medium',
    slant: 0,
    shakiness: 0.1,
    speed: 'careful',
    inkBleeding: false,
    paperTexture: true,
    penSkip: false,
    smudgeMarks: false,
    marginViolations: false,
    spellingErrors: false,
    wordSpacing: 1.5,
    letterSpacing: 1.0,
    lineHeight: 1.5,
    margins: { top: 60, right: 60, bottom: 60, left: 60 },
};

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            text: '',
            handwritingStyle: 'caveat',
            fontSize: 24,
            inkColor: '#030712',
            paperType: 'lined',
            customFonts: [],

            settings: defaultSettings,
            quality: 'medium',
            language: 'en',
            zoom: 1,
            rotation: 0,
            showGrid: false,
            compareMode: false,
            pan: { x: 0, y: 0 },
            showLineNumbers: false,

            setText: (text) => set({ text }),
            setHandwritingStyle: (handwritingStyle) => set({ handwritingStyle }),
            setFontSize: (fontSize) => set({ fontSize }),
            setPaperType: (paperType) => set({ paperType }),
            setInkColor: (inkColor) => set({ inkColor }),

            updateSettings: (newSettings) => set((state) => ({
                settings: { ...state.settings, ...newSettings }
            })),

            setQuality: (quality) => set({ quality }),
            setLanguage: (language) => set({ language }),
            setZoom: (zoom) => set({ zoom }),
            setRotation: (rotation) => set({ rotation }),
            setShowGrid: (showGrid) => set({ showGrid }),
            setCompareMode: (compareMode) => set({ compareMode }),
            setPan: (pan) => set({ pan }),
            toggleLineNumbers: () => set((state) => ({ showLineNumbers: !state.showLineNumbers })),

            addCustomFont: (font) => set((state) => ({
                customFonts: [...state.customFonts, font]
            })),

            removeCustomFont: (id) => set((state) => ({
                customFonts: state.customFonts.filter(f => f.id !== id),
                handwritingStyle: state.handwritingStyle === id ? 'caveat' : state.handwritingStyle
            })),

            reset: () => set({
                text: '',
                handwritingStyle: 'caveat',
                fontSize: 24,
                inkColor: '#030712',
                paperType: 'lined',
                customFonts: [],
                settings: defaultSettings,
                quality: 'medium',
                language: 'en',
                zoom: 1,
                rotation: 0,
                showGrid: false,
                compareMode: false,
                pan: { x: 0, y: 0 },
                showLineNumbers: false,
            }),
        }),
        {
            name: 'inkpad-advanced-storage',
        }
    )
);

export const getAvailableFonts = (state: AppState) => {
    return [...defaultFonts, ...state.customFonts];
};
