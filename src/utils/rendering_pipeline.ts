import type { RenderingSettings } from '../types';

/**
 * Advanced post-processing filters for the canvas
 */
export const applyRealisticEffects = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    settings: RenderingSettings
) => {
    if (settings.smudgeMarks) {
        applySmudgeMarks(ctx, width, height);
    }

    if (settings.paperTexture) {
        applyPaperGrain(ctx, width, height);
    }
};

const applySmudgeMarks = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.filter = 'blur(4px)';

    for (let i = 0; i < 5; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const r = 20 + Math.random() * 50;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = '#666';
        ctx.fill();
    }
    ctx.restore();
};

const applyPaperGrain = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 5;
        data[i] += noise;     // R
        data[i + 1] += noise; // G
        data[i + 2] += noise; // B
    }

    ctx.putImageData(imageData, 0, 0);
};

export const detectLanguage = (text: string): string => {
    const arabicPattern = /[\u0600-\u06FF]/;
    const cyrillicPattern = /[\u0400-\u04FF]/;
    const devanagariPattern = /[\u0900-\u097F]/;

    if (arabicPattern.test(text)) return 'ar';
    if (cyrillicPattern.test(text)) return 'ru';
    if (devanagariPattern.test(text)) return 'hi';

    return 'en';
};
