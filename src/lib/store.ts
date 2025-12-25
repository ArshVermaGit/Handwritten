import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, RenderingSettings, FontPreference, Page } from '../types';
import { humanizeText } from '../utils/humanizer';

const generateId = () => Math.random().toString(36).substring(2, 11);

const defaultSettings: RenderingSettings = {
    letterSpacingVar: 0.5,
    baselineVar: 0.5,
    rotationVar: 0.5,
    thickness: 1,
    pressureVar: 0.2,
    inkFlow: 'medium',
    slant: 0,
    shakiness: 0.1,
    speed: 'careful',
    inkBleeding: false,
    inkBleedingIntensity: 0.5,
    paperTexture: true,
    penSkip: false,
    smudgeMarks: false,
    marginViolations: false,
    spellingErrors: false,
    pressureSimulation: true,
    edgeWear: 0.2,
    wordSpacing: 1.2,
    letterSpacing: 0,
    lineHeight: 1.5,
    margins: { top: 80, right: 60, bottom: 80, left: 80 },
    lineColor: '#9ca3af',
    lineOpacity: 0.4,
    decorations: {
        holes: false,
        spiral: false,
        perforation: false,
        watermark: { enabled: false, text: 'InkPad', opacity: 0.05 },
        corners: 'none'
    },
    aging: {
        enabled: false,
        intensity: 0.5,
        sepia: 0.5,
        spots: 0.5,
        creases: 0.5,
        burnMarks: 0.5,
        waterStains: false,
        tornCorners: false,
        vignette: 0.5
    }
};

const initialState: Omit<AppState, 'reset' | 'setText' | 'setPages' | 'setCurrentPageIndex' | 'addPage' | 'removePage' | 'duplicatePage' | 'movePage' | 'setPreviousText' | 'setHandwritingStyle' | 'setFontSize' | 'setPaperMaterial' | 'setPaperPattern' | 'setPaperSize' | 'setPaperOrientation' | 'setInkColor' | 'setPageMargins' | 'updateSettings' | 'setQuality' | 'setLanguage' | 'setZoom' | 'setRotation' | 'setShowGrid' | 'setCompareMode' | 'setPan' | 'toggleLineNumbers' | 'addCustomFont' | 'removeCustomFont' | 'completeOnboarding' | 'completeTour' | 'setSidebarCollapsed' | 'setPreviewVisible' | 'setSettingsOpen' | 'setShowPaperLines' | 'setShowMarginLine' | 'setOutputEffect' | 'setOutputResolution' | 'setPagePreset' | 'setCustomBackground' | 'setHumanizeIntensity' | 'toggleHumanize' | 'applyHumanize'> = {
    text: '',
    pages: [{ id: generateId(), text: '' }],
    currentPageIndex: 0,
    handwritingStyle: 'caveat',
    fontSize: 24,
    inkColor: '#1e40af',
    paperMaterial: 'white',
    paperPattern: 'none',
    paperSize: 'a4',
    paperOrientation: 'portrait',
    customFonts: [],
    settings: defaultSettings,
    quality: 'high',
    language: 'en',
    zoom: 1,
    rotation: 0,
    showGrid: false,
    compareMode: false,
    previousText: '',
    pan: { x: 0, y: 0 },
    showLineNumbers: false,
    hasSeenOnboarding: false,
    hasSeenTour: false,
    isSidebarCollapsed: false,
    isPreviewVisible: true,
    isSettingsOpen: false,
    showPaperLines: false,
    showMarginLine: false,
    outputEffect: 'none',
    outputResolution: 'normal',
    pagePreset: 'white-page-1',
    customBackground: null,
    humanizeIntensity: 0.5,
    isHumanizeEnabled: false
};

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            ...initialState,

            // Actions
            setText: (text) => set({ text }),
            setPages: (pages) => set(() => ({
                pages: pages.map((p, i) => {
                    if (typeof p === 'string') return { id: `page-${i}`, text: p };
                    return p as Page;
                })
            })),
            setCurrentPageIndex: (index) => set({ currentPageIndex: index }),
            addPage: (index) => set((state) => {
                const newPages = [...state.pages];
                const insertIndex = index ?? newPages.length;
                newPages.splice(insertIndex, 0, { id: `page-${Date.now()}`, text: '' });
                return { pages: newPages };
            }),
            removePage: (index) => set((state) => {
                const newPages = state.pages.filter((_, i) => i !== index);
                return {
                    pages: newPages,
                    currentPageIndex: Math.min(state.currentPageIndex, newPages.length - 1)
                };
            }),
            duplicatePage: (index) => set((state) => {
                const pageToDuplicate = state.pages[index];
                if (!pageToDuplicate) return state;
                const newPages = [...state.pages];
                newPages.splice(index + 1, 0, { ...pageToDuplicate, id: `page-${Date.now()}` });
                return { pages: newPages };
            }),
            movePage: (from, to) => set((state) => {
                const newPages = [...state.pages];
                const [removed] = newPages.splice(from, 1);
                newPages.splice(to, 0, removed);
                return { pages: newPages };
            }),
            setPreviousText: (previousText) => set({ previousText }),
            setHandwritingStyle: (handwritingStyle) => set({ handwritingStyle }),
            setFontSize: (fontSize) => set({ fontSize }),
            setPaperMaterial: (paperMaterial) => set({ paperMaterial }),
            setPaperPattern: (paperPattern) => set({ paperPattern }),
            setPaperSize: (paperSize) => set({ paperSize }),
            setPaperOrientation: (paperOrientation) => set({ paperOrientation }),
            setInkColor: (inkColor) => set({ inkColor }),

            setPageMargins: (pageIndex, margins) => set((state) => {
                const newPages = [...state.pages];
                if (newPages[pageIndex]) {
                    newPages[pageIndex] = { ...newPages[pageIndex], margins };
                }
                return { pages: newPages };
            }),

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
            addCustomFont: (font) => set((state) => ({ customFonts: [...state.customFonts, font] })),
            removeCustomFont: (id) => set((state) => ({ customFonts: state.customFonts.filter(f => f.id !== id) })),
            completeOnboarding: () => set({ hasSeenOnboarding: true }),
            completeTour: () => set({ hasSeenTour: true }),
            setSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),
            setPreviewVisible: (isPreviewVisible) => set({ isPreviewVisible }),
            setSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),

            setShowPaperLines: (showPaperLines) => set({ showPaperLines }),
            setShowMarginLine: (showMarginLine) => set({ showMarginLine }),
            setOutputEffect: (outputEffect) => set({ outputEffect }),
            setOutputResolution: (outputResolution) => set({ outputResolution }),
            setPagePreset: (pagePreset) => set({ pagePreset }),
            setCustomBackground: (customBackground) => set({ customBackground }),

            // AI Humanizer Actions
            setHumanizeIntensity: (humanizeIntensity) => set({ humanizeIntensity }),
            toggleHumanize: () => set((state) => ({ isHumanizeEnabled: !state.isHumanizeEnabled })),
            applyHumanize: () => set((state) => ({
                text: humanizeText(state.text, state.humanizeIntensity)
            })),

            reset: () => set({
                ...initialState,
                pages: [{ id: generateId(), text: '' }],
                currentPageIndex: 0
            } as any),
        }),
        {
            name: 'inkpad-advanced-storage',
        }
    )
);

export const getAvailableFonts = (state: AppState) => {
    const defaultFonts: FontPreference[] = [
        { id: 'caveat', name: 'Caveat', family: 'Caveat', type: 'google' },
        { id: 'dancing', name: 'Dancing Script', family: 'Dancing Script', type: 'google' },
        { id: 'indie', name: 'Indie Flower', family: 'Indie Flower', type: 'google' },
        { id: 'shadows', name: 'Shadows Into Light', family: 'Shadows Into Light', type: 'google' },
        { id: 'patrick', name: 'Patrick Hand', family: 'Patrick Hand', type: 'google' },
        { id: 'kalam', name: 'Kalam', family: 'Kalam', type: 'google' },
        { id: 'marker', name: 'Permanent Marker', family: 'Permanent Marker', type: 'google' },
    ];
    return [...defaultFonts, ...state.customFonts];
};
