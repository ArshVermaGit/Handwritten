import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useStore } from '../lib/store';
import { ZoomIn, Download, Printer, FileText, Maximize2, ChevronLeft, ChevronRight, Settings2, Wand2 } from 'lucide-react';
import { getFontFamily, drawPaperBackground } from '../utils/handwriting';
import { noise } from '../utils/noise';
import { applyRealisticEffects, detectLanguage } from '../utils/rendering_pipeline';
import { getPresetMetadata } from '../constants/presets';
import { calculatePagination } from '../utils/pagination';
import ExportModal from './ExportModal';

export default function PreviewPanel() {
    const {
        text,
        pages,
        addPage,
        handwritingStyle,
        fontSize,
        inkColor,
        paperMaterial,
        paperPattern,
        paperSize,
        paperOrientation,
        customFonts,
        settings,
        zoom,
        setZoom,
        showPaperLines,
        showMarginLine,
        outputEffect,
        pagePreset,
        customBackground,
        isHumanizeEnabled
    } = useStore();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentDisplayPage, setCurrentDisplayPage] = useState(1);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const getDimensions = useCallback(() => {
        let width = 595;  // A4 at 72 DPI
        let height = 842;

        switch (paperSize) {
            case 'letter': width = 612; height = 792; break;
            case 'a5': width = 420; height = 595; break;
            case 'a6': width = 298; height = 420; break;
            case 'legal': width = 612; height = 1008; break;
            case 'tabloid': width = 792; height = 1224; break;
            case 'a4':
            default: width = 595; height = 842; break;
        }

        if (paperOrientation === 'landscape') {
            return { width: height, height: width };
        }
        return { width, height };
    }, [paperSize, paperOrientation]);

    const dimensions = getDimensions();

    const calculatePages = useCallback((text: string, width: number, height: number): string[] => {
        const pageTexts: string[] = [];
        const preset = getPresetMetadata(pagePreset);

        // Dynamic sizing based on preset or global settings
        const actualLineWidth = preset ? (width - (preset.marginLineX || settings.margins.left) - 40) : (width - settings.margins.left - settings.margins.right);
        const actualLineHeight = preset ? preset.lineSpacing : (fontSize * settings.lineHeight * 0.8);
        const actualFontSize = preset ? (preset.defaultFontSize || fontSize) : (fontSize * 0.8);

        const paragraphs = text.split('\n');
        let currentPageText = '';

        const getPageMargins = (idx: number) => {
            const pageData = pages[idx];
            const baseMargins = pageData?.margins || settings.margins;
            if (preset) {
                return {
                    top: preset.firstLineY - actualFontSize,
                    right: 40,
                    bottom: 40,
                    left: (preset.marginLineX || baseMargins.left)
                };
            }
            return {
                top: baseMargins.top * 0.5,
                right: baseMargins.right * 0.5,
                bottom: baseMargins.bottom * 0.5,
                left: baseMargins.left * 0.5
            };
        };

        let currentPageIndex = 0;
        let margins = getPageMargins(currentPageIndex);
        let currentY = margins.top + actualFontSize;
        let maxY = height - margins.bottom;

        paragraphs.forEach((paragraph, pIdx) => {
            if (!paragraph.trim()) {
                if (currentY + actualLineHeight > maxY) {
                    pageTexts.push(currentPageText);
                    currentPageText = '\n';
                    currentPageIndex++;
                    margins = getPageMargins(currentPageIndex);
                    currentY = margins.top + actualFontSize;
                } else {
                    currentPageText += '\n';
                    currentY += actualLineHeight;
                }
                return;
            }

            const words = paragraph.split(' ');
            let lineText = '';
            let currentLineWidth = 0;
            const avgCharWidth = actualFontSize * 0.45;

            words.forEach((word) => {
                const wordWidth = word.length * avgCharWidth;
                const spaceWidth = actualFontSize * 0.25 * settings.wordSpacing;

                if (currentLineWidth + wordWidth > actualLineWidth && lineText) {
                    if (currentY + actualLineHeight > maxY) {
                        pageTexts.push(currentPageText.trimEnd());
                        currentPageText = lineText.trimEnd() + '\n';
                        currentPageIndex++;
                        margins = getPageMargins(currentPageIndex);
                        currentY = margins.top + actualFontSize;
                    } else {
                        currentPageText += lineText.trimEnd() + '\n';
                        currentY += actualLineHeight;
                    }
                    lineText = word + ' ';
                    currentLineWidth = wordWidth + spaceWidth;
                } else {
                    lineText += word + ' ';
                    currentLineWidth += wordWidth + spaceWidth;
                }
            });

            if (lineText.trim()) {
                if (currentY + actualLineHeight > maxY) {
                    pageTexts.push(currentPageText.trimEnd());
                    currentPageText = lineText.trimEnd();
                    currentPageIndex++;
                    margins = getPageMargins(currentPageIndex);
                    currentY = margins.top + actualFontSize;
                } else {
                    currentPageText += lineText.trimEnd();
                }
            }

            if (pIdx < paragraphs.length - 1) {
                currentPageText += '\n';
                currentY += actualLineHeight;
            }
        });

        if (currentPageText.trim() || pageTexts.length === 0) {
            pageTexts.push(currentPageText);
        }

        return pageTexts;
    }, [fontSize, settings.lineHeight, settings.margins, settings.wordSpacing, pages, pagePreset]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const { width, height } = dimensions;

        const pageTexts = calculatePages(text, width, height);
        setTotalPages(pageTexts.length);

        if (pageTexts.length > pages.length) {
            for (let i = pages.length; i < pageTexts.length; i++) {
                addPage();
            }
        }

        const pageIndex = Math.min(currentDisplayPage - 1, pageTexts.length - 1);
        const currentPageText = pageTexts[pageIndex] || '';

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);

        const renderFrame = async () => {
            // 1. Draw Background
            if (pagePreset === 'custom' && customBackground) {
                const img = new Image();
                img.src = customBackground;
                await new Promise((resolve) => {
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0, width, height);
                        resolve(null);
                    };
                    img.onerror = () => resolve(null);
                });
            } else if (pagePreset && pagePreset !== 'custom') {
                const img = new Image();
                img.src = `/page_presets/${pagePreset}.jpg`;
                await new Promise((resolve) => {
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0, width, height);
                        resolve(null);
                    };
                    img.onerror = () => resolve(null);
                });
            } else {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);
            }

            // 2. Draw Overlays
            if (showPaperLines) {
                drawPaperBackground(ctx, width, height, paperMaterial, 'none', settings, true);
            }

            const preset = getPresetMetadata(pagePreset);
            const pageData = pages[pageIndex];
            const baseMargins = pageData?.margins || settings.margins;

            const actualFontSize = preset ? (preset.defaultFontSize || fontSize) : (fontSize * 0.8);
            const actualLineHeight = preset ? preset.lineSpacing : (fontSize * settings.lineHeight * 0.8);

            const margins = {
                top: preset ? (preset.firstLineY - actualFontSize) : (baseMargins.top * 0.5),
                right: 40,
                bottom: 40,
                left: preset ? (preset.marginLineX || baseMargins.left) : (baseMargins.left * 0.5)
            };

            if (showMarginLine) {
                const marginX = margins.left - 4;
                ctx.strokeStyle = preset ? 'rgba(239, 68, 68, 0.4)' : '#fca5a5';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(marginX, 0);
                ctx.lineTo(marginX, height);
                ctx.stroke();
            }

            // 3. Render Text
            const fontFamily = getFontFamily(handwritingStyle, customFonts);
            const lang = detectLanguage(currentPageText);
            const isRtl = lang === 'ar';

            ctx.fillStyle = inkColor;
            ctx.textAlign = isRtl ? 'right' : 'left';
            ctx.textBaseline = 'alphabetic'; // Better for handwriting snapping

            const paragraphsSplit = currentPageText.split('\n');
            let currentLineY = preset ? preset.firstLineY : (margins.top + actualFontSize);

            paragraphsSplit.forEach((paragraph, pIdx) => {
                if (!paragraph.trim()) {
                    currentLineY += actualLineHeight;
                    return;
                }

                const words = paragraph.split(' ');
                let currentX = isRtl ? width - margins.right : margins.left;

                words.forEach((word, wIdx) => {
                    ctx.font = `${actualFontSize}px ${fontFamily}`;
                    const wordWidth = ctx.measureText(word).width;

                    if (isRtl) {
                        if (currentX - wordWidth < margins.left) {
                            currentX = width - margins.right;
                            currentLineY += actualLineHeight;
                        }
                    } else {
                        if (currentX + wordWidth > width - margins.right) {
                            currentX = margins.left;
                            currentLineY += actualLineHeight;
                        }
                    }

                    if (currentLineY > height - margins.bottom) return;

                    const chars = word.split('');
                    chars.forEach((char, cIdx) => {
                        const seed = pIdx * 1000 + wIdx * 100 + cIdx;
                        const noiseVal = noise.noise(seed * 0.1);

                        // Snapping / Baseline Variance
                        const intensityShift = preset ? 0.3 : 1;
                        const baselineShift = noiseVal * settings.baselineVar * intensityShift;
                        const rotation = noiseVal * (settings.rotationVar * Math.PI / 180);
                        const letterSpacing = settings.letterSpacing + (noise.noise(seed * 0.5) * settings.letterSpacingVar);
                        const pressure = 1 - (Math.abs(noise.noise(seed * 0.2)) * settings.pressureVar);

                        const jitterX = (Math.random() - 0.5) * 0.4;
                        const jitterY = (Math.random() - 0.5) * 0.4;

                        ctx.save();
                        ctx.translate(currentX + jitterX, currentLineY + baselineShift + jitterY);
                        ctx.rotate(rotation);

                        if (settings.slant !== 0) {
                            ctx.transform(1, 0, Math.tan(settings.slant * Math.PI / 180), 1, 0, 0);
                        }

                        if (settings.pressureSimulation) {
                            const scale = 0.98 + (pressure * 0.04);
                            ctx.scale(scale, scale);
                        }

                        ctx.globalAlpha = pressure;

                        if (settings.inkBleeding) {
                            const bleedingIntensity = settings.inkBleedingIntensity || 0.5;
                            // Pass 1: Core
                            ctx.fillText(char, 0, 0);

                            // Pass 2: Bleed
                            ctx.save();
                            ctx.globalAlpha = pressure * 0.3 * bleedingIntensity;
                            ctx.filter = `blur(${0.5 * bleedingIntensity}px)`;
                            ctx.fillText(char, 0, 0);
                            ctx.restore();

                            // Pass 3: Micro-diffusion
                            if (bleedingIntensity > 0.6) {
                                ctx.save();
                                ctx.globalAlpha = pressure * 0.1;
                                ctx.filter = `blur(${1.2 * bleedingIntensity}px)`;
                                ctx.fillText(char, 0.2, 0.2);
                                ctx.restore();
                            }
                        } else {
                            ctx.fillText(char, 0, 0);
                        }

                        const charWidth = ctx.measureText(char).width;
                        ctx.restore();

                        if (isRtl) {
                            currentX -= (charWidth + letterSpacing);
                        } else {
                            currentX += charWidth + letterSpacing;
                        }
                    });

                    const spaceWidth = actualFontSize * 0.25 * settings.wordSpacing;
                    if (isRtl) currentX -= spaceWidth;
                    else currentX += spaceWidth;
                });

                currentLineY += actualLineHeight;
            });

            // 4. Post-processing
            applyRealisticEffects(ctx, width, height, settings);

            if (outputEffect === 'shadows') {
                ctx.save();
                const gradient = ctx.createLinearGradient(0, 0, width, 0);
                gradient.addColorStop(0, 'rgba(0,0,0,0.06)');
                gradient.addColorStop(0.02, 'rgba(0,0,0,0)');
                gradient.addColorStop(0.98, 'rgba(0,0,0,0)');
                gradient.addColorStop(1, 'rgba(0,0,0,0.06)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
                ctx.restore();
            }
        };

        renderFrame();
    }, [text, handwritingStyle, fontSize, inkColor, paperMaterial, paperPattern, paperSize, paperOrientation, customFonts, settings, dimensions, currentDisplayPage, pages, showPaperLines, showMarginLine, outputEffect, pagePreset, customBackground, calculatePages, addPage]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                if (currentDisplayPage > 1) setCurrentDisplayPage(currentDisplayPage - 1);
            } else if (e.key === 'ArrowRight') {
                if (currentDisplayPage < totalPages) setCurrentDisplayPage(currentDisplayPage + 1);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentDisplayPage, totalPages]);

    return (
        <div className="h-full flex flex-col bg-[#fcfcfc]">
            <div className="h-14 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center shadow-lg shadow-black/20">
                        <FileText size={18} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xs font-bold text-gray-900 tracking-tight">Paper Preview</h2>
                        <span className="text-[10px] text-gray-400 font-medium">Resolution: 300 DPI</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Page Navigation */}
                    <div className="flex items-center gap-1 bg-gray-50 rounded-full px-2 py-1 border border-gray-100">
                        <button
                            onClick={() => currentDisplayPage > 1 && setCurrentDisplayPage(currentDisplayPage - 1)}
                            disabled={currentDisplayPage <= 1}
                            className="p-1.5 hover:bg-white hover:shadow-sm rounded-full transition-all disabled:opacity-20 text-gray-600"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-[11px] font-bold text-gray-900 min-w-[50px] text-center">
                            Page {currentDisplayPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => currentDisplayPage < totalPages && setCurrentDisplayPage(currentDisplayPage + 1)}
                            disabled={currentDisplayPage >= totalPages}
                            className="p-1.5 hover:bg-white hover:shadow-sm rounded-full transition-all disabled:opacity-20 text-gray-600"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <button className="p-2.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-black transition-all border border-transparent hover:border-gray-100">
                        <Settings2 size={18} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-8 flex items-center justify-center relative perspective-1000">
                <div
                    className="bg-white shadow-[0_40px_100px_rgba(0,0,0,0.12)] rounded-sm overflow-hidden transition-all duration-500 hover:shadow-[0_50px_120px_rgba(0,0,0,0.15)]"
                    style={{
                        transform: `scale(${zoom * 0.42}) rotateX(2deg) rotateY(-1deg)`,
                        transformOrigin: 'center center',
                    }}
                >
                    <canvas ref={canvasRef} className="block" />
                </div>

                {/* AI Badge */}
                {isHumanizeEnabled && (
                    <div className="absolute top-10 right-10 flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-full shadow-2xl animate-bounce">
                        <Wand2 size={14} className="text-purple-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest">AI Humanized</span>
                    </div>
                )}
            </div>

            {/* Float Controls */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 z-20">
                {/* Zoom */}
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xl rounded-full px-3 py-1.5 shadow-2xl border border-white/20">
                    <button onClick={() => setZoom(Math.max(zoom - 0.15, 0.5))} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-black">
                        <ZoomIn size={16} className="rotate-180" />
                    </button>
                    <span className="text-[11px] font-bold text-gray-600 min-w-[40px] text-center">{(zoom * 100).toFixed(0)}%</span>
                    <button onClick={() => setZoom(Math.min(zoom + 0.15, 2))} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-black">
                        <ZoomIn size={16} />
                    </button>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <button onClick={() => setZoom(1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-black">
                        <Maximize2 size={16} />
                    </button>
                </div>

                {/* Actions */}
                <div className="bg-black text-white rounded-3xl p-2 shadow-2xl shadow-black/40 flex items-center gap-2 border border-white/10">
                    <button
                        onClick={() => setIsExportModalOpen(true)}
                        className="flex items-center gap-3 px-8 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-[13px] font-black uppercase tracking-wider hover:scale-[1.02] transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
                    >
                        <Download size={18} />
                        Export High-Res
                    </button>
                    <div className="w-px h-8 bg-white/10 mx-1" />
                    <div className="flex gap-1 pr-1">
                        <button className="w-14 h-14 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-2xl transition-all">
                            <Printer size={20} />
                        </button>
                        <button className="w-14 h-14 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-2xl transition-all">
                            <Wand2 size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {isExportModalOpen && (
                <ExportModal
                    isOpen={isExportModalOpen}
                    onClose={() => setIsExportModalOpen(false)}
                    totalPages={totalPages}
                    dimensions={dimensions}
                    canvasRef={canvasRef}
                />
            )}
        </div>
    );
}
