import jsPDF from 'jspdf';
import type { HandwritingStyle, FontPreference, PaperMaterial, PaperPattern, RenderingSettings } from '../types';
import { getFontFamily, renderHandwriting } from './handwriting';

export interface ExportOptions {
    filename?: string;
    pageRange?: string; // e.g. "1, 2-5"
    quality?: number; // 0 to 1
    dpi?: number;
    transparent?: boolean;
    password?: string;
    format: 'pdf' | 'png' | 'jpg' | 'svg';
}

/**
 * Parses a page range string into an array of page indices
 */
function parsePageRange(range: string, totalPages: number): number[] {
    if (!range || range.trim() === 'all') {
        return Array.from({ length: totalPages }, (_, i) => i);
    }

    const pages = new Set<number>();
    const parts = range.split(',');

    parts.forEach(part => {
        const [start, end] = part.trim().split('-').map(p => parseInt(p.trim()));
        if (!isNaN(start)) {
            if (!isNaN(end)) {
                for (let i = start; i <= end; i++) {
                    if (i >= 1 && i <= totalPages) pages.add(i - 1);
                }
            } else {
                if (start >= 1 && start <= totalPages) pages.add(start - 1);
            }
        }
    });

    return Array.from(pages).sort((a, b) => a - b);
}

/**
 * Advanced export to PDF
 */
export const exportToPDF = async (
    pages: { id: string, text: string }[],
    handwritingStyle: HandwritingStyle,
    customFonts: FontPreference[],
    fontSize: number,
    inkColor: string,
    settings: RenderingSettings,
    paperMaterial: PaperMaterial,
    paperPattern: PaperPattern,
    options: ExportOptions
) => {
    const totalPages = pages.length;
    const selectedIndices = parsePageRange(options.pageRange || 'all', totalPages);

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
        compress: (options.quality || 1) < 0.5 // Enable compression if quality is low
    });

    const tempCanvas = document.createElement('canvas');
    // A4 at 300 DPI is approx 2480 x 3508
    const scale = (options.dpi || 300) / 72;
    const baseWidth = 595.28;
    const baseHeight = 841.89;
    tempCanvas.width = baseWidth * scale;
    tempCanvas.height = baseHeight * scale;

    const fontFamily = getFontFamily(handwritingStyle, customFonts);

    for (let i = 0; i < selectedIndices.length; i++) {
        const idx = selectedIndices[i];
        if (i > 0) pdf.addPage();

        const ctx = tempCanvas.getContext('2d');
        if (ctx) {
            ctx.setTransform(scale, 0, 0, scale, 0, 0);
        }

        renderHandwriting(
            tempCanvas,
            pages[idx].text,
            fontFamily,
            fontSize,
            inkColor,
            settings,
            paperMaterial,
            paperPattern,
            { skipClear: false, regionWidth: baseWidth, regionHeight: baseHeight }
        );

        const imgData = tempCanvas.toDataURL('image/jpeg', options.quality || 0.85);
        pdf.addImage(imgData, 'JPEG', 0, 0, baseWidth, baseHeight);
    }

    pdf.save(options.filename || 'manuscript.pdf');
};

/**
 * Export current page or all pages to images
 */
export const exportToImages = async (
    pages: { id: string, text: string }[],
    handwritingStyle: HandwritingStyle,
    customFonts: FontPreference[],
    fontSize: number,
    inkColor: string,
    settings: RenderingSettings,
    paperMaterial: PaperMaterial,
    paperPattern: PaperPattern,
    options: ExportOptions,
    currentIndex: number
) => {
    const totalPages = pages.length;
    const selectedIndices = options.pageRange === 'current'
        ? [currentIndex]
        : parsePageRange(options.pageRange || 'all', totalPages);

    const tempCanvas = document.createElement('canvas');
    const scale = (options.dpi || 300) / 72;
    const baseWidth = 595.28;
    const baseHeight = 841.89;
    tempCanvas.width = baseWidth * scale;
    tempCanvas.height = baseHeight * scale;

    const fontFamily = getFontFamily(handwritingStyle, customFonts);

    for (const idx of selectedIndices) {
        const ctx = tempCanvas.getContext('2d');
        if (ctx) {
            ctx.setTransform(scale, 0, 0, scale, 0, 0);
            if (options.transparent) {
                ctx.clearRect(0, 0, baseWidth, baseHeight);
            }
        }

        renderHandwriting(
            tempCanvas,
            pages[idx].text,
            fontFamily,
            fontSize,
            inkColor,
            settings,
            paperMaterial,
            paperPattern,
            { skipClear: options.transparent, regionWidth: baseWidth, regionHeight: baseHeight }
        );

        const mimeType = options.format === 'jpg' ? 'image/jpeg' : 'image/png';
        const link = document.createElement('a');
        link.download = `${options.filename || 'page'}_${idx + 1}.${options.format}`;
        link.href = tempCanvas.toDataURL(mimeType, options.quality || 1);
        link.click();

        // Brief delay between downloads if batching
        if (selectedIndices.length > 1) {
            await new Promise(r => setTimeout(r, 500));
        }
    }
};

/**
 * Export to SVG (Basic wrapper around text)
 */
export const exportToSVG = (
    text: string,
    fontFamily: string,
    fontSize: number,
    inkColor: string,
    settings: RenderingSettings,
    filename: string = 'manuscript.svg'
) => {
    const width = 595.28;
    const height = 841.89;

    // Very simplified SVG - primarily for illustrative purposes as full handwriting engine
    // is canvas-based. For true scalable handwriting, we'd need to re-implement the 
    // rendering engine for SVG elements.
    const svg = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="white" />
            <text x="${settings.margins.left}" y="${settings.margins.top + fontSize}" 
                  font-family="${fontFamily}" font-size="${fontSize}" fill="${inkColor}">
                ${text.split('\n').map((line, i) => `<tspan x="${settings.margins.left}" dy="${i === 0 ? 0 : settings.lineHeight * fontSize}">${line}</tspan>`).join('')}
            </text>
        </svg>
    `;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

/**
 * Utility to trigger browser print
 */
export const printDocument = () => {
    window.print();
};
// Legacy Aliases for backwards compatibility
/** @deprecated Use exportToPDF */
export const exportAllPagesToPDF = exportToPDF;
/** @deprecated Use exportToImages */
export const exportToImage = async (canvas: HTMLCanvasElement, format: 'png' | 'jpg') => {
    const link = document.createElement('a');
    link.download = `exported-page.${format}`;
    link.href = canvas.toDataURL(format === 'jpg' ? 'image/jpeg' : 'image/png');
    link.click();
};
