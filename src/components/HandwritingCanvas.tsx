import { useRef, useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useStore } from '../lib/store';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';

interface HandwritingCanvasProps {
    text: string;
    onRenderComplete?: (totalPages: number) => void;
    currentPage: number;
}

const PAPER_CONFIG = {
    width: 210, // mm
    height: 297, // mm
    margins: {
        top: 120,    // px at 300 DPI
        bottom: 100, // px at 300 DPI
        left: 100,   // px at 300 DPI
        right: 100   // px at 300 DPI
    },
    ppi: 300,
    lineSpacing: 40 // Default px
};

// Convert mm to pixels at 300 PPI (approx 2480x3508 for A4)
const mmToPx = (mm: number) => Math.round((mm * PAPER_CONFIG.ppi) / 25.4);

interface Token {
    type: 'tag' | 'text';
    tagName?: string;
    isClosing?: boolean;
    attributes?: { src?: string };
    content?: string;
}

const tokenizeHTML = (html: string): Token[] => {
    const tokens: Token[] = [];
    const cleanHtml = html
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
        
    const regex = /(<[^>]+>|[^<]+)/g;
    let match;
    while ((match = regex.exec(cleanHtml)) !== null) {
        const part = match[0];
        if (part.startsWith('<')) {
            const lower = part.toLowerCase();
            const isClosing = lower.startsWith('</');
            const tagName = lower.replace(/[<>/]/g, '').split(' ')[0];
            
            const attributes: { src?: string } = {};
            if (tagName === 'img') {
                const srcMatch = part.match(/src="([^"]+)"/i);
                if (srcMatch) attributes.src = srcMatch[1];
            }
            
            tokens.push({ type: 'tag', tagName, isClosing, attributes });
        } else {
            const words = part.split(/(\s+)/);
            words.forEach(word => {
                if (word) tokens.push({ type: 'text', content: word });
            });
        }
    }
    return tokens;
};

// Export Types
export interface HandwritingCanvasHandle {
    exportPDF: () => Promise<jsPDF>;
    exportZIP: () => Promise<Blob>;
    exportPNG: () => Promise<string>;
}

// Font family mapping
const fontFamilies: Record<string, string> = {
    'caveat': 'Caveat',
    'gloria': 'Gloria Hallelujah',
    'indie': 'Indie Flower',
    'shadows': 'Shadows Into Light',
    'patrick': 'Patrick Hand',
    'marker': 'Permanent Marker',
    'kalam': 'Kalam'
};

// Baseline offsets (Ratio of font size to shift UP to sit ON the line)
const BASELINE_OFFSETS: Record<string, number> = {
    'caveat': 0.05,
    'gloria': 0.12,
    'indie': 0.08,
    'shadows': 0.15,
    'patrick': 0.10,
    'marker': 0.05,
    'kalam': 0.10
};

export const HandwritingCanvas = forwardRef<HandwritingCanvasHandle, HandwritingCanvasProps>(({ 
    text,
    onRenderComplete,
    currentPage
}, ref) => {
    const internalCanvasRef = useRef<HTMLCanvasElement>(null);
    const { 
        handwritingStyle, 
        fontSize, 
        letterSpacing, 
        wordSpacing,
        inkColor,
        paperMaterial,
        customPaperImage,
        paperShadow
    } = useStore();

    const [totalPages, setTotalPages] = useState(1);

    // Calculate canvas dimensions using 300 DPI as base
    const baseWidth = mmToPx(PAPER_CONFIG.width);
    const baseHeight = mmToPx(PAPER_CONFIG.height);
    
    // For display, we use a smaller size or fit to container
    const displayWidth = (PAPER_CONFIG.width * 96) / 25.4;
    const displayHeight = (PAPER_CONFIG.height * 96) / 25.4;

    const currentFontFamily = fontFamilies[handwritingStyle] || 'Caveat';

    // Main Render Loop
    // Defined BEFORE useImperativeHandle to avoid hoisting issues
    const renderContent = useCallback(async (ctx: CanvasRenderingContext2D, targetPage: number, isExport: boolean) => {
            // 1. SETUP CANVAS STYLES
            
            // 2. RENDER PAPER BACKGROUND
            const isVintage = paperMaterial === 'vintage';
            const isCream = (paperMaterial as string) === 'cream';
            
            // Global imperfections
            // Slant: ±5 degrees global (approx 0.087 rad)
            const globalSlant = (Math.random() - 0.5) * 0.174; 
            const driftAmplitude = 2 + Math.random(); 
            const driftWavelength = 500 + Math.random() * 300;
            
            // Ink Color Base with variations
            const getInkVariation = (baseColor: string) => {
                const color = baseColor.toLowerCase();
                const isBlue = color.includes('000080') || color.includes('0000cd') || color.includes('4169e1');
                const isBlack = color.includes('000000') || color.includes('1a1a1a') || color.includes('2b2b2b');

                if (Math.random() > 0.9) {
                    if (isBlue) {
                        const blueVariants = ['#000080', '#0000CD', '#4169E1'];
                        return blueVariants[Math.floor(Math.random() * blueVariants.length)];
                    }
                    if (isBlack) {
                        const blackVariants = ['#000000', '#1a1a1a', '#2b2b2b'];
                        return blackVariants[Math.floor(Math.random() * blackVariants.length)];
                    }
                    return adjustBrightness(baseColor, 0.85); 
                }
                return adjustBrightness(baseColor, 0.95 + Math.random() * 0.1); 
            };
            
            // Tokenize
            const tokens = tokenizeHTML(text);

            // Base fill
            ctx.fillStyle = isVintage ? '#f5f0e1' : isCream ? '#fffaf0' : '#ffffff';
            ctx.fillRect(0, 0, baseWidth, baseHeight);

            // Vintage/Aging aging
            if (isVintage || isCream) {
                ctx.save();
                // Yellowish tint
                ctx.fillStyle = isVintage ? 'rgba(255, 230, 150, 0.08)' : 'rgba(255, 245, 200, 0.04)';
                ctx.fillRect(0, 0, baseWidth, baseHeight);
                
                // Extra texture/noise for aged paper
                ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
                for (let i = 0; i < 50; i++) {
                    const x = Math.random() * baseWidth;
                    const y = Math.random() * baseHeight;
                    const r = Math.random() * 2;
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }

            // Custom Background
            if (paperMaterial === 'custom' && customPaperImage) {
                const img = new Image();
                img.src = customPaperImage;
                await new Promise((resolve) => {
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0, baseWidth, baseHeight);
                        resolve(null);
                    };
                });
            } 

            // 3. RULED LINES SYSTEM (Draw BEFORE text)
            const marginL = PAPER_CONFIG.margins.left;
            const marginR = PAPER_CONFIG.margins.right;
            const marginT = PAPER_CONFIG.margins.top;
            const marginB = PAPER_CONFIG.margins.bottom;
            const lineH = PAPER_CONFIG.lineSpacing;

            if (paperMaterial === 'ruled' || paperMaterial === 'white' || isVintage || isCream) {
                ctx.save();
                
                // 1. Horizontal Ruled Lines
                ctx.strokeStyle = '#d0d0d0'; // Light gray default
                // Temporary red lines for visual verification as requested
                // ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)'; 
                ctx.lineWidth = 1;
                
                // Draw lines from margin top to bottom
                // We interpret these lines as the EXACT BASELINES where text sits
                for (let y = marginT + lineH; y <= baseHeight - marginB; y += lineH) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(baseWidth, y);
                    ctx.stroke();
                }
                
                // 2. Vertical Margin Line (Notebook style)
                ctx.strokeStyle = 'rgba(255, 80, 80, 0.4)'; // Distinct red/pink
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(marginL, 0); 
                ctx.lineTo(marginL, baseHeight);
                ctx.stroke();
                
                ctx.restore();
            } else if (paperMaterial === 'graph') {
                ctx.strokeStyle = '#e0e0e0';
                ctx.lineWidth = 1;
                const step = 40;
                for (let x = 0; x < baseWidth; x += step) {
                    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, baseHeight); ctx.stroke();
                }
                for (let y = 0; y < baseHeight; y += step) {
                    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(baseWidth, y); ctx.stroke();
                }
            } else if (paperMaterial === 'dotted') {
                ctx.fillStyle = '#c0c0c0';
                const step = 30;
                for (let x = 30; x < baseWidth; x += step) {
                    for (let y = 30; y < baseHeight; y += step) {
                        ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
                    }
                }
            }

            // 4. REALISTIC PAPER NOISE
            const needsTexture = paperMaterial === 'white' || paperMaterial === 'ruled' || isVintage || isCream;
            if (needsTexture) {
                const noiseCanvas = document.createElement('canvas');
                const noiseSize = 256;
                noiseCanvas.width = noiseSize;
                noiseCanvas.height = noiseSize;
                const nCtx = noiseCanvas.getContext('2d')!;
                
                const imgData = nCtx.createImageData(noiseSize, noiseSize);
                const data = imgData.data;
                
                for (let i = 0; i < data.length; i += 4) {
                    const noise = Math.random() * 255;
                    data[i] = noise;     // R
                    data[i+1] = noise;   // G
                    data[i+2] = noise;   // B
                    data[i+3] = Math.random() * 12; // Very low opacity (approx 0.05 max)
                }
                nCtx.putImageData(imgData, 0, 0);

                ctx.save();
                ctx.fillStyle = ctx.createPattern(noiseCanvas, 'repeat')!;
                ctx.globalCompositeOperation = 'multiply';
                ctx.fillRect(0, 0, baseWidth, baseHeight);
                ctx.restore();
            }

            if (!text.trim()) {
                if (targetPage === 1) {
                    const cx = baseWidth / 2;
                    const cy = baseHeight / 2;
                    ctx.save();
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'rgba(0,0,0,0.1)';
                    ctx.font = `bold 60px ${currentFontFamily}`;
                    ctx.fillText('InkPad', cx, cy - 40);
                    ctx.fillStyle = 'rgba(0,0,0,0.2)';
                    ctx.font = `italic 16px sans-serif`;
                    ctx.fillText('Start typing in the editor...', cx, cy + 20);
                    ctx.restore();
                }
                return 1; // Only one page if no text
            }

            /* --- TEXT RENDERING ENGINE --- */
            
            // Helper: Color Adjustment
            const adjustBrightness = (hex: string, factor: number) => {
                const r = parseInt(hex.slice(1, 3), 16) || 0;
                const g = parseInt(hex.slice(3, 5), 16) || 0;
                const b = parseInt(hex.slice(5, 7), 16) || 0;
                const nr = Math.min(255, Math.max(0, Math.round(r * factor)));
                const ng = Math.min(255, Math.max(0, Math.round(g * factor)));
                const nb = Math.min(255, Math.max(0, Math.round(b * factor)));
                return `rgb(${nr}, ${ng}, ${nb})`;
            };

            // rendering Loop
            // We start writing on the FIRST ruled line (Line 1)
            let currentLineIndex = 1;
            let currentBaselineY = marginT + (lineH * currentLineIndex);
            
            // Baseline adjustment per font
            const getBaselineY = (y: number, fSize: number) => {
                const offset = BASELINE_OFFSETS[handwritingStyle] || 0.1;
                return y - (fSize * offset);
            };

            // Text starts 10px after vertical margin line (110px total)
            const textStartX = marginL + 10;
            // First line/paragraph indentation (140px total = +30px)
            let currentX = textStartX + 30;
            let pageNum = 1;

            let bold = false;
            let italic = false;
            // Base Font Size scaled to PPI
            const fontScale = PAPER_CONFIG.ppi / 96; 
            let baseFSize = fontSize * fontScale;

            ctx.textBaseline = 'alphabetic'; // Text sits ON the line

            const usableWidth = baseWidth - marginR - marginL;

            // DRAW CHAR FUNCTION (Scoped here to use local vars)
            const drawCharWithEffects = (char: string, x: number, lineY: number, bFSize: number, isBold: boolean, isItalic: boolean) => {
                // 1. Baseline Drift (Sinusoidal wave: A=2-3px, λ=500-800px)
                const driftY = driftAmplitude * Math.sin(x / driftWavelength);
                
                // 2. CHARACTER-LEVEL RANDOMIZATION
                // A. POSITION VARIATIONS (Hand wobble)
                const yVar = (Math.random() - 0.5) * 4; // ±2px
                const xVar = (Math.random() - 0.5) * 2; // ±1px
                
                // Rotation: Global slant + local variation (±1 degree)
                const localSlantVar = (Math.random() - 0.5) * 0.035; // ±1 degree
                const rotation = globalSlant + localSlantVar;

                // B. SIZE VARIATIONS
                const sizeVar = 1 + (Math.random() - 0.5) * 0.1; // ±5%
                const finalSize = bFSize * sizeVar;

                // C. INK EFFECTS & PRESSURE
                const charInk = getInkVariation(inkColor);
                const pressureOpacity = 0.85 + Math.random() * 0.15; // 0.85 - 1.0
                const bleeding = 0.3 + Math.random() * 0.5; // shadowBlur 0.3-0.8
                
                // Apply font-specific baseline offset
                const adjustedY = getBaselineY(lineY, bFSize) + driftY;

                ctx.save();
                
                // Set Font
                ctx.font = `${isItalic ? 'italic ' : ''}${isBold ? 'bold ' : ''}${finalSize}px "${currentFontFamily}"`;
                ctx.globalAlpha = pressureOpacity;
                
                // Apply Transformations
                ctx.translate(x + xVar, adjustedY + yVar);
                ctx.rotate(rotation);

                // --- LAYERED RENDERING ---
                
                // Layer 1: Ink Bleeding (Soft edge)
                ctx.shadowBlur = bleeding;
                ctx.shadowColor = charInk;
                
                // Layer 2: Main Character with Texture Gradient
                const gradient = ctx.createLinearGradient(0, -finalSize, 0, 0);
                gradient.addColorStop(0, charInk);
                gradient.addColorStop(1, adjustBrightness(charInk, 0.9));
                
                ctx.fillStyle = gradient;
                ctx.fillText(char, 0, 0);

                ctx.restore();

                // 3. Artifacts: Ink Dots / Splatter (5% chance)
                if (Math.random() < 0.05) {
                   ctx.save();
                   ctx.fillStyle = charInk;
                   ctx.globalAlpha = 0.4;
                   // Position randomly near baseline
                   const dx = x + Math.random() * 10 - 5;
                   const dy = adjustedY + (Math.random() * 6 - 3); 
                   ctx.beginPath();
                   ctx.arc(dx, dy, 0.5 + Math.random() * 0.5, 0, Math.PI * 2);
                   ctx.fill();
                   ctx.restore();
                }

                // Return actual width + Random Spacing variation
                const w = ctx.measureText(char).width;
                const spacingVar = (Math.random() - 0.5) * 3; // ±1.5px
                
                return w + letterSpacing + spacingVar;
            };

            for (const token of tokens) {
                if (token.type === 'tag') {
                    const tag = token.tagName;
                    if (tag === 'b' || tag === 'strong') bold = !token.isClosing;
                    else if (tag === 'i' || tag === 'em') italic = !token.isClosing;
                    else if (tag === 'h1') baseFSize = (token.isClosing ? fontSize : 28) * fontScale;
                    else if (tag === 'h2') baseFSize = (token.isClosing ? fontSize : 24) * fontScale;
                    else if (tag === 'h3') baseFSize = (token.isClosing ? fontSize : 20) * fontScale;
                    else if (tag === 'br' || tag === 'div' || tag === 'p') {
                        if (!token.isClosing || tag === 'br') {
                            const isParagraph = tag === 'p' || (tag === 'div' && !token.isClosing);
                            const linesToSkip = isParagraph ? 2 : 1;
                            
                            currentLineIndex += linesToSkip;
                            currentBaselineY = marginT + (lineH * currentLineIndex);
                            currentX = textStartX + (isParagraph ? 30 : 0);
                            
                            if (currentBaselineY > baseHeight - marginB) {
                                pageNum++;
                                currentLineIndex = 1;
                                currentBaselineY = marginT + (lineH * currentLineIndex);
                                currentX = textStartX + 30;
                            }
                        }
                    }
                        else if (tag === 'img' && token.attributes?.src) {
                        const img = new Image();
                        img.src = token.attributes.src;
                        await new Promise(r => img.onload = r);
                        
                        const iW = Math.min(img.width, usableWidth);
                        const iH = (img.height * iW) / img.width;
                        
                        // Check fit
                        if (currentBaselineY + iH > baseHeight - marginB) {
                            pageNum++;
                            currentBaselineY = marginT;
                            currentX = marginL;
                        }
                        
                        if (pageNum === targetPage) {
                            ctx.drawImage(img, currentX, currentBaselineY, iW, iH);
                        }
                        
                        const linesConsumed = Math.ceil((iH + 20) / lineH);
                        currentLineIndex += linesConsumed;
                        currentBaselineY = marginT + (lineH * currentLineIndex);
                        currentX = textStartX;
                    }
                } else if (token.type === 'text' && token.content) {
                    const words = token.content.split(/(\s+)/);
                    
                    for (let w = 0; w < words.length; w++) {
                        const word = words[w];
                        if (!word) continue;
                        const isSpace = /\s+/.test(word);

                        ctx.font = `${italic ? 'italic ' : ''}${bold ? 'bold ' : ''}${baseFSize}px "${currentFontFamily}"`;

                        if (isSpace) {
                            const spaceVar = (Math.random() - 0.5) * 8; // ±4px natural variation
                            const spaceW = ctx.measureText(' ').width + wordSpacing + spaceVar; 
                            currentX += spaceW;
                            continue;
                        }

                        const wordMetrics = ctx.measureText(word);
                        const wordWidth = wordMetrics.width + (word.length * letterSpacing);
                        
                        // Intelligent Word Wrapping
                        if (currentX + wordWidth > baseWidth - marginR) {
                            // Can we break the word? (Syllable-based or character-based if too long)
                            if (wordWidth > usableWidth) {
                                // Hyphenation for words longer than the entire line
                                const chars = word.split('');
                                for (const char of chars) {
                                    const charWidth = ctx.measureText(char).width + letterSpacing;
                                    
                                    if (currentX + charWidth > baseWidth - marginR) {
                                        // Draw Hyphen
                                        if (pageNum === targetPage) {
                                            ctx.save();
                                            ctx.fillStyle = inkColor;
                                            ctx.fillText('-', currentX, currentBaselineY);
                                            ctx.restore();
                                        }

                                        // Move to next line
                                        if (marginT + (lineH * (currentLineIndex + 1)) > baseHeight - marginB) { 
                                            pageNum++; 
                                            currentLineIndex = 1;
                                        } else {
                                            currentLineIndex++;
                                        }
                                        currentBaselineY = marginT + (lineH * currentLineIndex);
                                        currentX = textStartX;
                                    }

                                    if (pageNum === targetPage) {
                                        const w = drawCharWithEffects(char, currentX, currentBaselineY, baseFSize, bold, italic);
                                        currentX += w;
                                    } else {
                                        currentX += charWidth;
                                    }
                                }
                                continue; 
                            } else {
                                // Word fits on a line but not the current one - move to next line
                                if (marginT + (lineH * (currentLineIndex + 1)) > baseHeight - marginB) {
                                    pageNum++;
                                    currentLineIndex = 1;
                                } else {
                                    currentLineIndex++;
                                }
                                currentBaselineY = marginT + (lineH * currentLineIndex);
                                currentX = textStartX;
                            }
                        }

                        // Draw Word Normally
                        if (pageNum === targetPage) {
                            for (let i = 0; i < word.length; i++) {
                                const w = drawCharWithEffects(word[i], currentX, currentBaselineY, baseFSize, bold, italic);
                                currentX += w;
                            }
                        } else {
                            currentX += wordWidth;
                        }
                    }
                }
            }

            // 5. POST-PROCESSING IMPERFECTIONS (Only for screen render)
            if (!isExport) {
                // Vignette / Edge Shadow
                const grad = ctx.createRadialGradient(
                    baseWidth/2, baseHeight/2, baseHeight * 0.3,
                    baseWidth/2, baseHeight/2, baseHeight * 0.8
                );
                grad.addColorStop(0, 'rgba(0,0,0,0)');
                grad.addColorStop(1, 'rgba(0,0,0,0.08)'); // darkening edges
                
                ctx.save();
                ctx.fillStyle = grad;
                ctx.globalCompositeOperation = 'multiply';
                ctx.fillRect(0, 0, baseWidth, baseHeight);
                ctx.restore();
            }

            return pageNum; // Total pages encountered
    }, [fontSize, letterSpacing, wordSpacing, inkColor, paperMaterial, customPaperImage, baseWidth, baseHeight, currentFontFamily, text, handwritingStyle]);


    // Export & Rendering Logic
    const renderPageToCanvas = async (pageIndex: number, targetCanvas: HTMLCanvasElement) => {
        const ctx = targetCanvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        // Reset canvas for offline rendering
        targetCanvas.width = baseWidth * 2; // High res export
        targetCanvas.height = baseHeight * 2;
        ctx.scale(2, 2); // 2x scale for 300 DPI -> Export quality

        await renderContent(ctx, pageIndex, true); // true = force render specific page
    };

    useImperativeHandle(ref, () => ({
        exportPDF: async () => {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const offscreenCanvas = document.createElement('canvas');
            
            for (let i = 1; i <= totalPages; i++) {
                if (i > 1) pdf.addPage();
                await renderPageToCanvas(i, offscreenCanvas);
                const imgData = offscreenCanvas.toDataURL('image/jpeg', 0.95);
                pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
            }
            
            return pdf;
        },
        exportZIP: async () => {
            const zip = new JSZip();
            const offscreenCanvas = document.createElement('canvas');

            for (let i = 1; i <= totalPages; i++) {
                await renderPageToCanvas(i, offscreenCanvas);
                const blob = await new Promise<Blob>((resolve) => 
                    offscreenCanvas.toBlob(b => resolve(b!), 'image/png')
                );
                zip.file(`page-${i}.png`, blob);
            }
            
            return zip.generateAsync({ type: 'blob' });
        },
        exportPNG: async () => {
            const offscreenCanvas = document.createElement('canvas');
            await renderPageToCanvas(currentPage, offscreenCanvas);
            return offscreenCanvas.toDataURL('image/png');
        }
    }));

    useEffect(() => {
        const render = async () => {
            const canvas = internalCanvasRef.current;
            if (!canvas) return;

            // Wait for fonts to be ready before rendering
            if (typeof document !== 'undefined') {
                await document.fonts.ready;
            }

            const ctx = canvas.getContext('2d', { alpha: false });
            if (!ctx) return;

             // 1. SETUP CANVAS
            // Use window.devicePixelRatio * 2 for ultra-sharp rendering
            const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) * 2 : 2;
            
            // Set high resolution pixel dimensions (A4 @ 300 DPI)
            canvas.width = baseWidth * dpr;
            canvas.height = baseHeight * dpr;
            
            // Set CSS display size
            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;
            
            // Normalize coordinate system to 300 DPI equivalent
            // scale = dpr allows us to draw using baseWidth/baseHeight coordinates
            ctx.scale(dpr, dpr);

            const totalP = await renderContent(ctx, currentPage, false);
            if (totalP && totalP !== totalPages) {
                setTotalPages(totalP);
                onRenderComplete?.(totalP);
            }
        };

        render();
    }, [renderContent, currentPage, totalPages, displayWidth, displayHeight, onRenderComplete, baseWidth, baseHeight]);

    return (
        <div className="relative transition-all duration-500 ease-in-out">
            <div 
                className={`transform-gpu transition-all duration-500 rounded-sm overflow-hidden ${paperShadow ? 'shadow-[0_20px_50px_rgba(0,0,0,0.15)]' : ''}`}
                style={{
                    width: displayWidth,
                    height: displayHeight,
                    backgroundColor: paperMaterial === 'vintage' ? '#f5f0e1' : 
                                   (paperMaterial as string) === 'cream' ? '#fffaf0' : '#ffffff',
                    boxShadow: paperShadow ? '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : 'none'
                }}
            >
                <canvas
                    ref={internalCanvasRef}
                    className="w-full h-full"
                />
            </div>
            
            {/* Pagination Indicator */}
            <div className="absolute -bottom-10 left-0 right-0 flex justify-center items-center gap-4 text-sm text-gray-400 font-medium">
                <span>Page {currentPage} of {totalPages}</span>
            </div>
        </div>
    );
});

HandwritingCanvas.displayName = 'HandwritingCanvas';
