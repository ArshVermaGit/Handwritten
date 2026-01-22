import { useRef, useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useStore } from '../lib/store';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';

interface HandwritingCanvasProps {
    text: string;
    onRenderComplete?: (totalPages: number) => void;
    currentPage: number;
}

// Page dimensions at 300 PPI (A4 size)
const PAGE_WIDTH = 2480;
const PAGE_HEIGHT = 3508;
const DISPLAY_SCALE = 0.32; // Scale for screen display

// Margins
const MARGIN_TOP = 120;
const MARGIN_BOTTOM = 100;
const MARGIN_LEFT = 120;
const MARGIN_RIGHT = 100;

// Font families mapping
const FONT_FAMILIES: Record<string, string> = {
    'caveat': 'Caveat, cursive',
    'gloria-hallelujah': 'Gloria Hallelujah, cursive',
    'indie-flower': 'Indie Flower, cursive',
    'shadows-into-light': 'Shadows Into Light, cursive',
    'patrick-hand': 'Patrick Hand, cursive',
    'permanent-marker': 'Permanent Marker, cursive',
    'kalam': 'Kalam, cursive',
    'homemade-apple': 'Homemade Apple, cursive',
    'reenie-beanie': 'Reenie Beanie, cursive',
    'nothing-you-could-do': 'Nothing You Could Do, cursive'
};

// Paper colors
const PAPER_COLORS: Record<string, string> = {
    'white': '#FFFFFF',
    'ruled': '#FFFFFF',
    'college': '#FFFFFF',
    'wide': '#FFFFFF',
    'graph': '#FFFFFF',
    'dotted': '#FFFFFF',
    'vintage': '#F5E6D3',
    'aged': '#E8DCC4',
    'cream': '#FFF8E7',
    'love-letter': '#FFF0F5',
    'birthday': '#FFFBF0',
    'christmas': '#F0FFF4',
    'professional': '#FFFFFF'
};

// Line spacing for ruled papers
const LINE_SPACING: Record<string, number> = {
    'ruled': 40,
    'college': 32,
    'wide': 50
};

export interface HandwritingCanvasHandle {
    exportPDF: () => Promise<jsPDF>;
    exportZIP: () => Promise<Blob>;
    exportPNG: (quality?: number, format?: 'image/png' | 'image/jpeg') => Promise<string>;
}

export const HandwritingCanvas = forwardRef<HandwritingCanvasHandle, HandwritingCanvasProps>(({
    text,
    onRenderComplete,
    currentPage
}, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [totalPages, setTotalPages] = useState(1);
    
    const {
        handwritingStyle,
        fontSize,
        letterSpacing,
        lineHeight,
        wordSpacing,
        inkColor,
        paperMaterial,
        paperShadow,
        paperTexture,
        setIsRendering
    } = useStore();

    // Get display dimensions
    const displayWidth = PAGE_WIDTH * DISPLAY_SCALE;
    const displayHeight = PAGE_HEIGHT * DISPLAY_SCALE;

    // Get the font family
    const fontFamily = FONT_FAMILIES[handwritingStyle] || 'Caveat, cursive';
    
    // Calculate actual font size (scaled for print resolution)
    const scaledFontSize = fontSize * 3; // Scale up for 300 PPI
    const actualLineHeight = scaledFontSize * lineHeight;

    // Calculate usable area
    const usableWidth = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
    const usableHeight = PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;
    const linesPerPage = Math.floor(usableHeight / actualLineHeight);

    // Strip HTML tags for plain text rendering
    const stripHTML = useCallback((html: string): string => {
        return html
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<\/div>/gi, '\n')
            .replace(/<\/li>/gi, '\n')
            .replace(/<\/h[1-6]>/gi, '\n\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"');
    }, []);

    // Word wrap function
    const wrapText = useCallback((ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
        const lines: string[] = [];
        const paragraphs = text.split('\n');
        
        for (const paragraph of paragraphs) {
            if (paragraph.trim() === '') {
                lines.push('');
                continue;
            }
            
            const words = paragraph.split(/\s+/);
            let currentLine = '';
            
            for (const word of words) {
                const testLine = currentLine ? `${currentLine} ${word}` : word;
                const metrics = ctx.measureText(testLine);
                
                if (metrics.width > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            
            if (currentLine) {
                lines.push(currentLine);
            }
        }
        
        return lines;
    }, []);

    // Draw paper background
    const drawPaperBackground = useCallback((ctx: CanvasRenderingContext2D) => {
        const paperColor = PAPER_COLORS[paperMaterial] || '#FFFFFF';
        ctx.fillStyle = paperColor;
        ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
        
        // Add subtle paper texture if enabled
        if (paperTexture) {
            ctx.save();
            ctx.globalAlpha = 0.03;
            for (let i = 0; i < 1000; i++) {
                const x = Math.random() * PAGE_WIDTH;
                const y = Math.random() * PAGE_HEIGHT;
                ctx.fillStyle = Math.random() > 0.5 ? '#000000' : '#FFFFFF';
                ctx.fillRect(x, y, 1, 1);
            }
            ctx.restore();
        }
    }, [paperMaterial, paperTexture]);

    // Draw ruled lines
    const drawRuledLines = useCallback((ctx: CanvasRenderingContext2D) => {
        const lineSpacing = LINE_SPACING[paperMaterial];
        
        if (lineSpacing) {
            ctx.save();
            ctx.strokeStyle = '#D0D0D0';
            ctx.lineWidth = 1;
            
            for (let y = MARGIN_TOP + lineSpacing; y < PAGE_HEIGHT - MARGIN_BOTTOM; y += lineSpacing) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(PAGE_WIDTH, y);
                ctx.stroke();
            }
            
            // Red margin line
            ctx.strokeStyle = 'rgba(229, 115, 115, 0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(MARGIN_LEFT - 20, 0);
            ctx.lineTo(MARGIN_LEFT - 20, PAGE_HEIGHT);
            ctx.stroke();
            
            ctx.restore();
        } else if (paperMaterial === 'graph') {
            ctx.save();
            const step = 40;
            
            for (let x = 0; x <= PAGE_WIDTH; x += step) {
                ctx.strokeStyle = x % (step * 5) === 0 ? '#C0C0C0' : '#E0E0E0';
                ctx.lineWidth = x % (step * 5) === 0 ? 1 : 0.5;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, PAGE_HEIGHT);
                ctx.stroke();
            }
            
            for (let y = 0; y <= PAGE_HEIGHT; y += step) {
                ctx.strokeStyle = y % (step * 5) === 0 ? '#C0C0C0' : '#E0E0E0';
                ctx.lineWidth = y % (step * 5) === 0 ? 1 : 0.5;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(PAGE_WIDTH, y);
                ctx.stroke();
            }
            
            ctx.restore();
        } else if (paperMaterial === 'dotted') {
            ctx.save();
            ctx.fillStyle = '#CCCCCC';
            const step = 40;
            
            for (let x = step; x < PAGE_WIDTH; x += step) {
                for (let y = step; y < PAGE_HEIGHT; y += step) {
                    ctx.beginPath();
                    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            ctx.restore();
        }
    }, [paperMaterial]);

    // Main render function
    const renderPage = useCallback((
        ctx: CanvasRenderingContext2D,
        plainText: string,
        pageNum: number,
        allLines: string[]
    ) => {
        // Clear and draw background
        drawPaperBackground(ctx);
        drawRuledLines(ctx);
        
        // Set up text rendering
        ctx.font = `${scaledFontSize}px ${fontFamily}`;
        ctx.fillStyle = inkColor;
        ctx.textBaseline = 'alphabetic';
        
        // Calculate which lines belong to this page
        const startLine = (pageNum - 1) * linesPerPage;
        const endLine = Math.min(startLine + linesPerPage, allLines.length);
        const pageLines = allLines.slice(startLine, endLine);
        
        // Render each line
        pageLines.forEach((line, index) => {
            const y = MARGIN_TOP + (index + 1) * actualLineHeight;
            
            // Add very subtle baseline wobble for realism
            const wobble = Math.sin(index * 0.5) * 2;
            
            // Render the line
            ctx.fillText(line, MARGIN_LEFT, y + wobble);
        });
        
        // Show placeholder if empty
        if (!plainText.trim() && pageNum === 1) {
            ctx.save();
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.font = `60px ${fontFamily}`;
            ctx.fillText('Start typing...', PAGE_WIDTH / 2, PAGE_HEIGHT / 2);
            ctx.restore();
        }
    }, [drawPaperBackground, drawRuledLines, scaledFontSize, fontFamily, inkColor, linesPerPage, actualLineHeight]);

    // Effect to render canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;
        
        setIsRendering(true);
        
        // Set canvas dimensions (high resolution)
        canvas.width = PAGE_WIDTH;
        canvas.height = PAGE_HEIGHT;
        
        // Get plain text and wrap lines
        const plainText = stripHTML(text);
        ctx.font = `${scaledFontSize}px ${fontFamily}`;
        const allLines = wrapText(ctx, plainText, usableWidth);
        
        // Calculate total pages
        const pages = Math.max(1, Math.ceil(allLines.length / linesPerPage));
        
        if (pages !== totalPages) {
            setTotalPages(pages);
            onRenderComplete?.(pages);
        }
        
        // Render current page
        renderPage(ctx, plainText, currentPage, allLines);
        
        setIsRendering(false);
    }, [
        text, currentPage, handwritingStyle, fontSize, lineHeight, 
        inkColor, paperMaterial, paperTexture, letterSpacing, wordSpacing,
        stripHTML, wrapText, renderPage, scaledFontSize, fontFamily, 
        usableWidth, linesPerPage, totalPages, onRenderComplete, setIsRendering
    ]);

    // Export handlers
    useImperativeHandle(ref, () => ({
        exportPDF: async () => {
            const widthMM = (PAGE_WIDTH * 25.4) / 300;
            const heightMM = (PAGE_HEIGHT * 25.4) / 300;
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [widthMM, heightMM]
            });
            
            const offscreen = document.createElement('canvas');
            offscreen.width = PAGE_WIDTH;
            offscreen.height = PAGE_HEIGHT;
            const ctx = offscreen.getContext('2d')!;
            
            const plainText = stripHTML(text);
            ctx.font = `${scaledFontSize}px ${fontFamily}`;
            const allLines = wrapText(ctx, plainText, usableWidth);
            
            for (let i = 1; i <= totalPages; i++) {
                if (i > 1) pdf.addPage([widthMM, heightMM], 'portrait');
                renderPage(ctx, plainText, i, allLines);
                const imgData = offscreen.toDataURL('image/jpeg', 0.95);
                pdf.addImage(imgData, 'JPEG', 0, 0, widthMM, heightMM);
            }
            
            return pdf;
        },
        
        exportZIP: async () => {
            const zip = new JSZip();
            const offscreen = document.createElement('canvas');
            offscreen.width = PAGE_WIDTH;
            offscreen.height = PAGE_HEIGHT;
            const ctx = offscreen.getContext('2d')!;
            
            const plainText = stripHTML(text);
            ctx.font = `${scaledFontSize}px ${fontFamily}`;
            const allLines = wrapText(ctx, plainText, usableWidth);
            
            for (let i = 1; i <= totalPages; i++) {
                renderPage(ctx, plainText, i, allLines);
                const blob = await new Promise<Blob>((resolve) => 
                    offscreen.toBlob(b => resolve(b!), 'image/png')
                );
                zip.file(`page-${i}.png`, blob);
            }
            
            return zip.generateAsync({ type: 'blob' });
        },
        
        exportPNG: async (quality = 1.0, format = 'image/png') => {
            const canvas = canvasRef.current;
            if (!canvas) throw new Error('Canvas not found');
            return canvas.toDataURL(format, quality);
        }
    }));

    return (
        <div className="relative">
            <div
                className={`rounded-sm overflow-hidden ${
                    paperShadow 
                        ? 'shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] ring-1 ring-black/5' 
                        : ''
                }`}
                style={{
                    width: displayWidth,
                    height: displayHeight,
                    backgroundColor: PAPER_COLORS[paperMaterial] || '#ffffff'
                }}
            >
                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    style={{ 
                        width: displayWidth, 
                        height: displayHeight 
                    }}
                />
            </div>
            
            {/* Page indicator */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
                <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-100 text-xs text-gray-500 font-medium">
                    Page {currentPage} of {totalPages}
                </span>
            </div>
        </div>
    );
});

HandwritingCanvas.displayName = 'HandwritingCanvas';
