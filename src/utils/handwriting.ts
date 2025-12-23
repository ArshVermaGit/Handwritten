import { noise } from './noise';
import { applyRealisticEffects, detectLanguage } from './rendering_pipeline';
import type { RenderingSettings, PaperType } from '../types';

export const getFontFamily = (id: string, customFonts: any[] = []): string => {
    const custom = customFonts.find(f => f.id === id);
    if (custom) return `"${custom.family}", cursive`;

    const fonts: Record<string, string> = {
        caveat: 'Caveat, cursive',
        dancing: 'Dancing Script, cursive',
        indie: 'Indie Flower, cursive',
        shadows: 'Shadows Into Light, cursive',
        patrick: 'Patrick Hand, cursive',
        kalam: 'Kalam, cursive',
        marker: 'Permanent Marker, cursive',
    };
    return fonts[id] || 'Caveat, cursive';
};

export const drawPaperBackground = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    paperType: PaperType,
    settings: RenderingSettings
) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    if (paperType === 'lined') {
        const spacing = settings.lineHeight * 40;
        for (let y = settings.margins.top + spacing; y < height - settings.margins.bottom; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(settings.margins.left, y);
            ctx.lineTo(width - settings.margins.right, y);
            ctx.stroke();
        }
        ctx.strokeStyle = '#fca5a5';
        ctx.beginPath();
        ctx.moveTo(settings.margins.left - 10, 0);
        ctx.lineTo(settings.margins.left - 10, height);
        ctx.stroke();
    } else if (paperType === 'grid') {
        const spacing = 30;
        for (let x = settings.margins.left; x < width - settings.margins.right; x += spacing) {
            ctx.beginPath();
            ctx.moveTo(x, settings.margins.top);
            ctx.lineTo(x, height - settings.margins.bottom);
            ctx.stroke();
        }
        for (let y = settings.margins.top; y < height - settings.margins.bottom; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(settings.margins.left, y);
            ctx.lineTo(width - settings.margins.right, y);
            ctx.stroke();
        }
    }
};

export const renderHandwriting = (
    canvas: HTMLCanvasElement,
    text: string,
    fontFamily: string,
    fontSize: number,
    inkColor: string,
    settings: RenderingSettings,
    paperType: PaperType
) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Language Detection
    const lang = detectLanguage(text);
    const isRtl = lang === 'ar';

    drawPaperBackground(ctx, width, height, paperType, settings);

    ctx.fillStyle = inkColor;
    ctx.textAlign = isRtl ? 'right' : 'left';
    ctx.textBaseline = 'bottom';

    const paragraphs = text.split('\n');
    let currentY = settings.margins.top + fontSize;

    paragraphs.forEach((paragraph, pIdx) => {
        if (!paragraph.trim()) {
            currentY += fontSize * settings.lineHeight;
            return;
        }

        const words = paragraph.split(' ');
        let currentX = isRtl ? width - settings.margins.right : settings.margins.left;

        words.forEach((word, wIdx) => {
            ctx.font = `${fontSize}px ${fontFamily}`;
            const wordWidth = ctx.measureText(word).width;

            // Word Wrap
            if (isRtl) {
                if (currentX - wordWidth < settings.margins.left) {
                    currentX = width - settings.margins.right;
                    currentY += fontSize * settings.lineHeight;
                }
            } else {
                if (currentX + wordWidth > width - settings.margins.right) {
                    currentX = settings.margins.left;
                    currentY += fontSize * settings.lineHeight;
                }
            }

            if (currentY > height - settings.margins.bottom) return;

            const chars = word.split('');
            chars.forEach((char, cIdx) => {
                const seed = pIdx * 1000 + wIdx * 100 + cIdx;
                const noiseVal = noise.noise(seed * 0.1);

                const baselineShift = noiseVal * settings.baselineVar;
                const rotation = noiseVal * (settings.rotationVar * Math.PI / 180);
                const letterSpacing = settings.letterSpacing + (noise.noise(seed * 0.5) * settings.letterSpacingVar);
                const pressure = 1 - (Math.abs(noise.noise(seed * 0.2)) * settings.pressureVar);

                // Pen Skip Logic
                if (settings.penSkip && Math.random() < 0.01) return;

                ctx.save();
                ctx.translate(currentX, currentY + baselineShift);
                ctx.rotate(rotation);

                if (settings.slant !== 0) {
                    ctx.transform(1, 0, Math.tan(settings.slant * Math.PI / 180), 1, 0, 0);
                }

                ctx.globalAlpha = pressure;

                if (settings.inkBleeding) {
                    ctx.shadowBlur = settings.thickness * 0.5;
                    ctx.shadowColor = inkColor;
                }

                ctx.fillText(char, 0, 0);
                const charWidth = ctx.measureText(char).width;
                ctx.restore();

                if (isRtl) {
                    currentX -= (charWidth + letterSpacing);
                } else {
                    currentX += charWidth + letterSpacing;
                }
            });

            // Space
            const spaceWidth = fontSize * 0.3 * settings.wordSpacing;
            if (isRtl) currentX -= spaceWidth;
            else currentX += spaceWidth;
        });

        currentY += fontSize * settings.lineHeight;
    });

    // Apply final post-processing effects
    applyRealisticEffects(ctx, width, height, settings);
};
