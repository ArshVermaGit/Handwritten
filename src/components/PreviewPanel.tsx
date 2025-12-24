import { useEffect, useRef, useState } from 'react';
import { useStore } from '../lib/store';
import { ZoomIn, ZoomOut, Download, Printer, FileText, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { getFontFamily, drawPaperBackground } from '../utils/handwriting';
import { noise } from '../utils/noise';
import { applyRealisticEffects, detectLanguage } from '../utils/rendering_pipeline';

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
        setPan,
        showPaperLines,
        showMarginLine,
        outputEffect,
        outputResolution,
        pagePreset,
        customBackground
    } = useStore();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentDisplayPage, setCurrentDisplayPage] = useState(1);

    // Get paper dimensions based on size and orientation
    const getDimensions = () => {
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
    };

    const dimensions = getDimensions();

    // Calculate how much text fits on a page and split accordingly
    const calculatePages = (text: string, width: number, height: number): string[] => {
        const pageTexts: string[] = [];
        const actualFontSize = fontSize * 0.8;
        const lineHeightPx = settings.lineHeight * actualFontSize;
        const margins = {
            top: settings.margins.top * 0.5,
            right: settings.margins.right * 0.5,
            bottom: settings.margins.bottom * 0.5,
            left: settings.margins.left * 0.5
        };

        const maxY = height - margins.bottom;
        const contentWidth = width - margins.left - margins.right;

        const paragraphs = text.split('\n');
        let currentPageText = '';
        let currentY = margins.top + actualFontSize;

        paragraphs.forEach((paragraph, pIdx) => {
            if (!paragraph.trim()) {
                if (currentY + lineHeightPx > maxY) {
                    pageTexts.push(currentPageText);
                    currentPageText = '\n';
                    currentY = margins.top + actualFontSize + lineHeightPx;
                } else {
                    currentPageText += '\n';
                    currentY += lineHeightPx;
                }
                return;
            }

            const words = paragraph.split(' ');
            let lineText = '';
            let lineWidth = 0;
            const avgCharWidth = actualFontSize * 0.5; // Approximate

            words.forEach((word) => {
                const wordWidth = word.length * avgCharWidth;
                const spaceWidth = actualFontSize * 0.3 * settings.wordSpacing;

                if (lineWidth + wordWidth > contentWidth && lineText) {
                    // Check if we need a new page
                    if (currentY + lineHeightPx > maxY) {
                        pageTexts.push(currentPageText.trimEnd());
                        currentPageText = lineText.trimEnd() + '\n';
                        currentY = margins.top + actualFontSize + lineHeightPx;
                    } else {
                        currentPageText += lineText.trimEnd() + '\n';
                        currentY += lineHeightPx;
                    }
                    lineText = word + ' ';
                    lineWidth = wordWidth + spaceWidth;
                } else {
                    lineText += word + ' ';
                    lineWidth += wordWidth + spaceWidth;
                }
            });

            // Add remaining line text
            if (lineText.trim()) {
                if (currentY + lineHeightPx > maxY) {
                    pageTexts.push(currentPageText.trimEnd());
                    currentPageText = lineText.trimEnd();
                    currentY = margins.top + actualFontSize;
                } else {
                    currentPageText += lineText.trimEnd();
                }
            }

            // Add paragraph break if not last
            if (pIdx < paragraphs.length - 1) {
                currentPageText += '\n';
                currentY += lineHeightPx;
            }
        });

        // Add final page
        if (currentPageText.trim() || pageTexts.length === 0) {
            pageTexts.push(currentPageText);
        }

        return pageTexts;
    };

    // Render handwriting on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const { width, height } = dimensions;

        // Calculate pages from text
        const pageTexts = calculatePages(text, width, height);
        setTotalPages(pageTexts.length);

        // Auto-add pages if needed
        if (pageTexts.length > pages.length) {
            for (let i = pages.length; i < pageTexts.length; i++) {
                addPage();
            }
        }

        // Get current page content
        const pageIndex = Math.min(currentDisplayPage - 1, pageTexts.length - 1);
        const currentPageText = pageTexts[pageIndex] || '';

        // Set canvas size with DPR scaling
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);

        // Nested rendering function to ensure background is drawn before text
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

            if (showMarginLine) {
                const marginX = settings.margins.left * 0.5 - 4;
                ctx.strokeStyle = '#fca5a5';
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
            ctx.textBaseline = 'bottom';

            const actualFontSize = fontSize * 0.8;
            const lineHeightPx = settings.lineHeight * actualFontSize;
            const margins = {
                top: settings.margins.top * 0.5,
                right: settings.margins.right * 0.5,
                bottom: settings.margins.bottom * 0.5,
                left: settings.margins.left * 0.5
            };

            let contentLeft = margins.left;
            let contentRight = margins.right;

            // Cornell/Todo patterns are legacy but keeping for logic if needed
            if (paperPattern === 'cornell') {
                contentLeft = width * 0.3 + 10;
            }
            if (paperPattern === 'todo') {
                contentLeft = margins.left + 25;
            }

            const paragraphs = currentPageText.split('\n');
            let currentY = margins.top + actualFontSize;

            paragraphs.forEach((paragraph, pIdx) => {
                if (!paragraph.trim()) {
                    currentY += lineHeightPx;
                    return;
                }

                const words = paragraph.split(' ');
                let currentX = isRtl ? width - contentRight : contentLeft;

                words.forEach((word, wIdx) => {
                    ctx.font = `${actualFontSize}px ${fontFamily}`;
                    const wordWidth = ctx.measureText(word).width;

                    // Line wrapping
                    if (isRtl) {
                        if (currentX - wordWidth < contentLeft) {
                            currentX = width - contentRight;
                            currentY += lineHeightPx;
                        }
                    } else {
                        if (currentX + wordWidth > width - contentRight) {
                            currentX = contentLeft;
                            currentY += lineHeightPx;
                        }
                    }

                    // Stop if beyond page
                    if (currentY > height - margins.bottom) return;

                    // Render each character with natural variation
                    const chars = word.split('');
                    chars.forEach((char, cIdx) => {
                        const seed = pIdx * 1000 + wIdx * 100 + cIdx;
                        const noiseVal = noise.noise(seed * 0.1);

                        const baselineShift = noiseVal * settings.baselineVar;
                        const rotation = noiseVal * (settings.rotationVar * Math.PI / 180);
                        const letterSpacing = settings.letterSpacing + (noise.noise(seed * 0.5) * settings.letterSpacingVar);
                        const pressure = 1 - (Math.abs(noise.noise(seed * 0.2)) * settings.pressureVar);

                        ctx.save();
                        ctx.translate(currentX, currentY + baselineShift);
                        ctx.rotate(rotation);

                        if (settings.slant !== 0) {
                            ctx.transform(1, 0, Math.tan(settings.slant * Math.PI / 180), 1, 0, 0);
                        }

                        ctx.globalAlpha = pressure;
                        ctx.fillText(char, 0, 0);
                        const charWidth = ctx.measureText(char).width;
                        ctx.restore();

                        if (isRtl) {
                            currentX -= (charWidth + letterSpacing);
                        } else {
                            currentX += charWidth + letterSpacing;
                        }
                    });

                    const spaceWidth = actualFontSize * 0.3 * settings.wordSpacing;
                    if (isRtl) currentX -= spaceWidth;
                    else currentX += spaceWidth;
                });

                currentY += lineHeightPx;
            });

            // 4. Post-processing effects
            applyRealisticEffects(ctx, width, height, settings);

            if (outputEffect === 'shadows') {
                ctx.save();
                const gradient = ctx.createLinearGradient(0, 0, width, 0);
                gradient.addColorStop(0, 'rgba(0,0,0,0.08)');
                gradient.addColorStop(0.02, 'rgba(0,0,0,0)');
                gradient.addColorStop(0.98, 'rgba(0,0,0,0)');
                gradient.addColorStop(1, 'rgba(0,0,0,0.08)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);

                const bottomGradient = ctx.createLinearGradient(0, height - 30, 0, height);
                bottomGradient.addColorStop(0, 'rgba(0,0,0,0)');
                bottomGradient.addColorStop(1, 'rgba(0,0,0,0.12)');
                ctx.fillStyle = bottomGradient;
                ctx.fillRect(0, height - 30, width, 30);
                ctx.restore();
            } else if (outputEffect === 'scanner') {
                ctx.save();
                ctx.globalCompositeOperation = 'overlay';
                ctx.fillStyle = 'rgba(0,0,0,0.03)';
                ctx.fillRect(0, 0, width, height);

                for (let i = 0; i < 500; i++) {
                    const x = Math.random() * width;
                    const y = Math.random() * height;
                    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.02})`;
                    ctx.fillRect(x, y, 1, 1);
                }
                ctx.restore();
            }
        };

        renderFrame();
    }, [text, handwritingStyle, fontSize, inkColor, paperMaterial, paperPattern, paperSize, paperOrientation, customFonts, settings, dimensions, currentDisplayPage, pages.length, showPaperLines, showMarginLine, outputEffect, outputResolution, pagePreset, customBackground]);

    const handleZoom = (delta: number) => {
        setZoom(Math.min(Math.max(zoom + delta, 0.5), 2));
    };

    const resetView = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    const handleDownloadPNG = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `inkpad-page-${currentDisplayPage}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const handleDownloadPDF = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const imgData = canvas.toDataURL('image/png');
        const { width, height } = dimensions;
        const pdf = new jsPDF({
            orientation: width > height ? 'landscape' : 'portrait',
            unit: 'pt',
            format: [width, height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save(`inkpad-page-${currentDisplayPage}.pdf`);
    };

    const handlePrint = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head><title>InkPad Print</title></head>
                    <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh;">
                        <img src="${canvas.toDataURL('image/png')}" style="max-width:100%; height:auto;" />
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.onload = () => {
                printWindow.print();
            };
        }
    };

    const goToPreviousPage = () => {
        if (currentDisplayPage > 1) setCurrentDisplayPage(currentDisplayPage - 1);
    };

    const goToNextPage = () => {
        if (currentDisplayPage < totalPages) setCurrentDisplayPage(currentDisplayPage + 1);
    };

    return (
        <div className="h-full flex flex-col bg-[#F5F5F5]">
            <div className="h-12 border-b border-gray-200 bg-white flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">Preview</span>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-black rounded-full">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-[9px] font-bold text-green-400 tracking-wider">LIVE</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentDisplayPage <= 1}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <span className="font-medium">{currentDisplayPage}/{totalPages}</span>
                    <button
                        onClick={goToNextPage}
                        disabled={currentDisplayPage >= totalPages}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-3 flex items-center justify-center bg-gray-100">
                <div
                    className="bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-sm"
                    style={{
                        transform: `scale(${zoom * 0.45})`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.2s ease'
                    }}
                >
                    <canvas ref={canvasRef} className="block" />
                </div>
            </div>

            <div className="flex justify-center pb-2">
                <div className="flex items-center gap-0.5 bg-white rounded-full px-1.5 py-1 shadow-lg border border-gray-100">
                    <button onClick={() => handleZoom(-0.15)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <ZoomOut size={14} />
                    </button>
                    <button onClick={resetView} className="px-2 py-1 text-[10px] font-bold text-gray-600 hover:text-black transition-colors min-w-[40px]">
                        {(zoom * 100).toFixed(0)}%
                    </button>
                    <button onClick={() => handleZoom(0.15)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <ZoomIn size={14} />
                    </button>
                    <button onClick={resetView} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                        <Maximize2 size={14} />
                    </button>
                </div>
            </div>

            <div className="p-3 pt-1 border-t border-gray-200 bg-white">
                <div className="grid grid-cols-3 gap-2">
                    <button onClick={handleDownloadPNG} className="flex items-center justify-center gap-1.5 h-10 bg-black text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-all active:scale-[0.98]">
                        <Download size={14} /> PNG
                    </button>
                    <button onClick={handleDownloadPDF} className="flex items-center justify-center gap-1.5 h-10 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-all">
                        <FileText size={14} /> PDF
                    </button>
                    <button onClick={handlePrint} className="flex items-center justify-center gap-1.5 h-10 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-all">
                        <Printer size={14} /> Print
                    </button>
                </div>
            </div>
        </div>
    );
}
