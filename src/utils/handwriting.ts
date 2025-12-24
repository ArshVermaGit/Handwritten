import { noise } from './noise';
import { applyRealisticEffects, detectLanguage } from './rendering_pipeline';
import type { RenderingSettings, PaperMaterial, PaperPattern } from '../types';

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

const drawAgedTexture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#fdf6e3';
    ctx.fillRect(0, 0, width, height);

    const gradient = ctx.createRadialGradient(width / 2, height / 2, width * 0.2, width / 2, height / 2, width * 0.8);
    gradient.addColorStop(0, '#fdf6e300');
    gradient.addColorStop(1, '#d4c5a366');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 50; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const r = Math.random() * 20 + 5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160, 130, 80, ${Math.random() * 0.05})`;
        ctx.fill();
    }
};

const drawRecycledTexture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 800; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const len = Math.random() * 5 + 2;
        const angle = Math.random() * Math.PI * 2;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
        ctx.strokeStyle = `rgba(50, 50, 50, ${Math.random() * 0.1 + 0.05})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }

    for (let i = 0; i < 400; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.fillStyle = `rgba(100, 100, 100, ${Math.random() * 0.1})`;
        ctx.fillRect(x, y, 1, 1);
    }
};

const drawParchmentTexture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#e8dcc5';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < width; i += 4) {
        for (let j = 0; j < height; j += 4) {
            const n = noise.noise(i * 0.01) * noise.noise(j * 0.01);
            if (n > 0.2) {
                ctx.fillStyle = `rgba(180, 160, 120, ${n * 0.05})`;
                ctx.fillRect(i, j, 4, 4);
            }
        }
    }
};

const drawAgingEffects = (ctx: CanvasRenderingContext2D, width: number, height: number, settings: RenderingSettings) => {
    const { aging } = settings;
    if (!aging || !aging.enabled) return;

    const master = aging.intensity || 0.5;

    // 1. Sepia Tone
    if (aging.sepia > 0) {
        ctx.save();
        ctx.fillStyle = `rgba(112, 66, 20, ${aging.sepia * 0.3 * master})`;
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    // 2. Random Spots
    if (aging.spots > 0) {
        const count = Math.floor(width * height * 0.00005 * aging.spots * master);
        ctx.save();
        for (let i = 0; i < count; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = Math.random() * 3 + 1;
            ctx.beginPath();
            ctx.arc(x, y, r * Math.random(), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(101, 67, 33, ${Math.random() * 0.4})`;
            ctx.fill();
        }
        ctx.restore();
    }

    // 3. Creases
    if (aging.creases > 0) {
        ctx.save();
        const count = Math.floor(5 * aging.creases * master);
        for (let i = 0; i < count; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const len = Math.random() * 200 + 50;
            const angle = Math.random() * Math.PI * 2;

            ctx.strokeStyle = 'rgba(0,0,0,0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
            ctx.stroke();

            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.beginPath();
            ctx.moveTo(x + 1, y + 1);
            ctx.lineTo(x + Math.cos(angle) * len + 1, y + Math.sin(angle) * len + 1);
            ctx.stroke();
        }
        ctx.restore();
    }

    // 4. Burn Marks
    if (aging.burnMarks > 0) {
        const count = Math.floor(4 * aging.burnMarks * master);
        for (let i = 0; i < count; i++) {
            // Mostly near edges
            const edge = Math.random() > 0.5 ? 0 : width;
            const x = Math.random() > 0.5 ? edge + (Math.random() * 50 - 25) : Math.random() * width;
            const y = Math.random() * height;
            const r = 20 + Math.random() * 40;

            const g = ctx.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, 'rgba(40, 20, 10, 0.8)');
            g.addColorStop(0.5, 'rgba(100, 60, 30, 0.4)');
            g.addColorStop(1, 'rgba(100, 60, 30, 0)');

            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 5. Water Stains
    if (aging.waterStains) {
        const count = 3;
        for (let i = 0; i < count; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = 30 + Math.random() * 40;

            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180, 180, 150, 0.2)`;
            ctx.globalCompositeOperation = 'multiply';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(160, 160, 140, 0.4)`;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }
    }

    // 6. Torn Corners
    if (aging.tornCorners) {
        const size = 60;
        ctx.save();
        ctx.fillStyle = '#fff'; // Assuming background behind canvas is white/transparent
        // Top Left
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(size, 0);

        // Jagged line
        const steps = 10;
        const stepSize = size / steps;
        for (let i = 0; i <= steps; i++) {
            ctx.lineTo(size - i * stepSize + (Math.random() * 5), (i * stepSize) + (Math.random() * 5));
        }

        ctx.lineTo(0, size);
        ctx.closePath();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fill();
        ctx.restore();
    }

    // 7. Vignette
    if (aging.vignette > 0) {
        const g = ctx.createRadialGradient(width / 2, height / 2, width * 0.4, width / 2, height / 2, width * 0.8);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, `rgba(60, 40, 20, ${aging.vignette * 0.5 * master})`);

        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
    }
};

const drawPatterns = (ctx: CanvasRenderingContext2D, width: number, height: number, pattern: PaperPattern, settings: RenderingSettings) => {
    if (pattern === 'none') return;

    ctx.strokeStyle = settings.lineColor || '#9ca3af';
    ctx.globalAlpha = settings.lineOpacity || 0.6;
    ctx.lineWidth = 1;

    let spacing = 32;

    switch (pattern) {
        case 'wide': spacing = 42; break;
        case 'college': spacing = 32; break;
        case 'narrow': spacing = 24; break;
        case 'primary': spacing = 60; break;
        case 'french': spacing = 32; break;
        case 'music': spacing = 60; break;
        case 'graph': spacing = 30; break;
        case 'dot': spacing = 30; break;
        case 'engineer': spacing = 30; break;
        case 'isometric': spacing = 30; break;
        case 'hex': spacing = 40; break;
        case 'cornell': spacing = 32; break;
        case 'legal': spacing = 32; break;
        case 'squared': spacing = 30; break;
        case 'todo': spacing = 32; break;
        case 'letter': spacing = 32; break;
        default: spacing = 32;
    }

    // Cornell Notes
    if (pattern === 'cornell') {
        const cueWidth = width * 0.3;
        ctx.beginPath();
        ctx.moveTo(cueWidth, 0);
        ctx.lineTo(cueWidth, height);
        ctx.lineWidth = 2;
        ctx.stroke();

        const summaryHeight = height * 0.2;
        ctx.beginPath();
        ctx.moveTo(0, height - summaryHeight);
        ctx.lineTo(width, height - summaryHeight);
        ctx.stroke();

        const headerHeight = 100;
        ctx.beginPath();
        ctx.moveTo(0, headerHeight);
        ctx.lineTo(width, headerHeight);
        ctx.stroke();

        ctx.fillStyle = ctx.strokeStyle;
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText('CUES', 20, headerHeight + 20);
        ctx.fillText('NOTES', cueWidth + 20, headerHeight + 20);
        ctx.fillText('SUMMARY', 20, height - summaryHeight + 20);

        ctx.lineWidth = 1;
        for (let y = headerHeight + spacing; y < height - summaryHeight; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(cueWidth, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        return;
    }

    // Dot Grid
    if (pattern === 'dot') {
        const r = 1.5;
        ctx.fillStyle = ctx.strokeStyle;
        for (let x = settings.margins.left; x < width - settings.margins.right; x += spacing) {
            for (let y = settings.margins.top; y < height - settings.margins.bottom; y += spacing) {
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        return;
    }

    // Isometric Dot/Grid
    if (pattern === 'isometric') {
        const h = spacing * Math.sin(Math.PI / 3);
        const r = 1.5;
        ctx.fillStyle = ctx.strokeStyle;
        let row = 0;
        for (let y = settings.margins.top; y < height - settings.margins.bottom; y += h) {
            const offset = (row % 2 === 0) ? 0 : spacing / 2;
            for (let x = settings.margins.left + offset; x < width - settings.margins.right; x += spacing) {
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            row++;
        }
        return;
    }

    // Hexagonal Grid
    if (pattern === 'hex') {
        const a = 2 * Math.PI / 6;

        const drawHex = (x: number, y: number, r: number) => {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
            }
            ctx.closePath();
            ctx.stroke();
        };

        const size = spacing / 2;
        const xStep = size * Math.sqrt(3);
        const yStep = size * 1.5;

        for (let y = settings.margins.top; y < height - settings.margins.bottom; y += yStep) {
            const row = Math.round((y - settings.margins.top) / yStep);
            const xOffset = (row % 2) * (xStep / 2);
            for (let x = settings.margins.left + xOffset; x < width - settings.margins.right; x += xStep) {
                drawHex(x, y, size);
            }
        }
        return;
    }

    // Engineering Grid
    if (pattern === 'engineer') {
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = settings.lineOpacity * 0.5;
        const minor = spacing / 5;
        for (let x = settings.margins.left; x < width - settings.margins.right; x += minor) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = settings.margins.top; y < height - settings.margins.bottom; y += minor) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        ctx.lineWidth = 1.5;
        ctx.globalAlpha = settings.lineOpacity;
        for (let x = settings.margins.left; x < width - settings.margins.right; x += spacing) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = settings.margins.top; y < height - settings.margins.bottom; y += spacing) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }
        return;
    }

    // Graph / Squared
    if (pattern === 'graph' || pattern === 'squared') {
        for (let x = settings.margins.left; x < width - settings.margins.right; x += spacing) {
            ctx.beginPath(); ctx.moveTo(x, settings.margins.top); ctx.lineTo(x, height - settings.margins.bottom); ctx.stroke();
        }
        for (let y = settings.margins.top; y < height - settings.margins.bottom; y += spacing) {
            ctx.beginPath(); ctx.moveTo(settings.margins.left, y); ctx.lineTo(width - settings.margins.right, y); ctx.stroke();
        }
        return;
    }

    // To-Do List
    if (pattern === 'todo') {
        for (let y = settings.margins.top; y < height - settings.margins.bottom; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(settings.margins.left, y);
            ctx.lineTo(width - settings.margins.right, y);
            ctx.stroke();

            const boxSize = spacing * 0.6;
            ctx.strokeRect(settings.margins.left + 10, y - boxSize - (spacing - boxSize) / 2, boxSize, boxSize);
        }
        ctx.beginPath();
        ctx.moveTo(settings.margins.left + spacing * 1.5, 0);
        ctx.lineTo(settings.margins.left + spacing * 1.5, height);
        ctx.stroke();
        return;
    }

    // Letter Template
    if (pattern === 'letter') {
        const dateX = width - settings.margins.right - 200;
        const dateY = settings.margins.top;
        ctx.beginPath(); ctx.moveTo(dateX, dateY); ctx.lineTo(width - settings.margins.right, dateY); ctx.stroke();
        ctx.font = '10px Inter';
        ctx.fillText('DATE:', dateX, dateY + 12);

        for (let y = settings.margins.top + 100; y < height - settings.margins.bottom; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(settings.margins.left, y);
            ctx.lineTo(width - settings.margins.right, y);
            ctx.stroke();
        }
        return;
    }

    // Legal Pad
    if (pattern === 'legal') {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(settings.margins.left, 0); ctx.lineTo(settings.margins.left, height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(settings.margins.left - 6, 0); ctx.lineTo(settings.margins.left - 6, height); ctx.stroke();

        ctx.strokeStyle = settings.lineColor || '#9ca3af';
        ctx.fillStyle = settings.lineColor || '#9ca3af';
        ctx.font = '10px Inter';
        ctx.lineWidth = 1;

        let lineNum = 1;
        for (let y = settings.margins.top; y < height - settings.margins.bottom; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(settings.margins.left, y);
            ctx.lineTo(width - settings.margins.right, y);
            ctx.stroke();

            if (lineNum % 5 === 0 || lineNum === 1) {
                ctx.fillText(lineNum.toString(), settings.margins.left - 25, y - 5);
            }
            lineNum++;
        }
        return;
    }

    // Music Staff
    if (pattern === 'music') {
        const staffGap = 100;
        const lineGap = 12;

        for (let y = settings.margins.top; y < height - settings.margins.bottom - 50; y += staffGap) {
            for (let i = 0; i < 5; i++) {
                const ly = y + i * lineGap;
                ctx.beginPath();
                ctx.moveTo(settings.margins.left, ly);
                ctx.lineTo(width - settings.margins.right, ly);
                ctx.stroke();
            }
        }
        return;
    }

    // French Ruled
    if (pattern === 'french') {
        const subSpacing = spacing / 4;
        for (let x = settings.margins.left; x < width - settings.margins.right; x += spacing) {
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = settings.lineOpacity;
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }

        for (let y = settings.margins.top; y < height - settings.margins.bottom; y += spacing) {
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = settings.lineOpacity;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();

            ctx.lineWidth = 0.5;
            ctx.globalAlpha = settings.lineOpacity * 0.5;
            for (let i = 1; i < 4; i++) {
                const sy = y + subSpacing * i;
                ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(width, sy); ctx.stroke();
            }
        }

        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.moveTo(settings.margins.left, 0); ctx.lineTo(settings.margins.left, height); ctx.stroke();
        return;
    }

    // Poetry Frame
    if (pattern === 'poetry') {
        const frameGap = 40;
        ctx.lineWidth = 1;
        ctx.strokeRect(settings.margins.left - frameGap, settings.margins.top - frameGap,
            width - settings.margins.right - settings.margins.left + frameGap * 2,
            height - settings.margins.bottom - settings.margins.top + frameGap * 2);

        ctx.lineWidth = 0.5;
        ctx.strokeStyle = '#d1d5db';
        for (let y = settings.margins.top + spacing; y < height - settings.margins.bottom; y += spacing * 1.5) {
            ctx.beginPath();
            ctx.moveTo(settings.margins.left + 100, y);
            ctx.lineTo(width - settings.margins.right - 100, y);
            ctx.stroke();
        }
        return;
    }

    // Basic Lines Fallback
    if (['wide', 'college', 'narrow', 'primary'].includes(pattern)) {
        if (pattern === 'primary') {
            for (let y = settings.margins.top; y < height - settings.margins.bottom; y += spacing) {
                ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(settings.margins.left, y); ctx.lineTo(width - settings.margins.right, y); ctx.stroke();
                ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(settings.margins.left, y + spacing * 0.5); ctx.lineTo(width - settings.margins.right, y + spacing * 0.5); ctx.stroke();
                ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(settings.margins.left, y + spacing); ctx.lineTo(width - settings.margins.right, y + spacing); ctx.stroke();
            }
            ctx.setLineDash([]);
            return;
        }

        for (let y = settings.margins.top + spacing; y < height - settings.margins.bottom; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(settings.margins.left, y);
            ctx.lineTo(width - settings.margins.right, y);
            ctx.stroke();
        }

        ctx.strokeStyle = '#fca5a5';
        ctx.beginPath();
        ctx.moveTo(settings.margins.left - 20, 0);
        ctx.lineTo(settings.margins.left - 20, height);
        ctx.stroke();
    }
};

const drawDecorations = (ctx: CanvasRenderingContext2D, width: number, height: number, settings: RenderingSettings) => {
    const { decorations } = settings;
    if (!decorations) return;

    // Holes
    if (decorations.holes) {
        ctx.fillStyle = '#1f2937';
        const holeRadius = 12;
        const x = 30;
        const centerY = height / 2;
        const spacing = height * 0.25;
        const positions = [centerY - spacing, centerY, centerY + spacing];

        positions.forEach(y => {
            ctx.beginPath();
            ctx.arc(x, y, holeRadius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Spiral Binding
    if (decorations.spiral) {
        const spiralX = 15;
        const coilHeight = 30;
        const coilWidth = 20;
        ctx.lineCap = 'round';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#374151';

        for (let y = 40; y < height - 20; y += coilHeight * 1.5) {
            // Back loop
            ctx.beginPath();
            ctx.strokeStyle = '#9ca3af';
            ctx.moveTo(spiralX, y);
            ctx.quadraticCurveTo(spiralX - 10, y + coilHeight / 2, spiralX, y + coilHeight);
            ctx.stroke();

            // Front loop
            ctx.beginPath();
            ctx.strokeStyle = '#d1d5db';
            ctx.moveTo(spiralX, y);
            ctx.quadraticCurveTo(spiralX + coilWidth, y + coilHeight / 2, spiralX, y + coilHeight);
            ctx.stroke();
        }
    }

    // Perforation
    if (decorations.perforation) {
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1;
        const perfY = 120;
        ctx.moveTo(0, perfY);
        ctx.lineTo(width, perfY);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Watermark
    if (decorations.watermark && decorations.watermark.enabled) {
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(-Math.PI / 4);
        ctx.font = 'bold 80px Inter, sans-serif';
        ctx.fillStyle = `rgba(0, 0, 0, ${decorations.watermark.opacity || 0.05})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(decorations.watermark.text, 0, 0);
        ctx.restore();
    }

    // Corners
    if (decorations.corners === 'geometric') {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
        const size = 50;
        const padding = 20;

        ctx.beginPath(); ctx.moveTo(padding, padding + size); ctx.lineTo(padding, padding); ctx.lineTo(padding + size, padding); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(width - padding - size, padding); ctx.lineTo(width - padding, padding); ctx.lineTo(width - padding, padding + size); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(padding, height - padding - size); ctx.lineTo(padding, height - padding); ctx.lineTo(padding + size, height - padding); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(width - padding - size, height - padding); ctx.lineTo(width - padding, height - padding); ctx.lineTo(width - padding, height - padding - size); ctx.stroke();
    } else if (decorations.corners === 'floral') {
        const p = 40;
        ctx.save();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;

        const drawVine = (x: number, y: number, scaleX: number, scaleY: number) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(scaleX, scaleY);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(20, 0, 20, 40, 40, 40);
            ctx.stroke();
            ctx.beginPath(); ctx.ellipse(15, 5, 8, 4, Math.PI / 4, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.ellipse(30, 25, 8, 4, -Math.PI / 4, 0, Math.PI * 2); ctx.stroke();
            ctx.restore();
        };

        drawVine(p, p, 1, 1);
        drawVine(width - p - 40, p, -1, 1); // approximate mirroring
        drawVine(p, height - p - 40, 1, -1);
        drawVine(width - p - 40, height - p - 40, -1, -1);
        ctx.restore();
    }
};

export const drawPaperBackground = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    paperMaterial: PaperMaterial,
    paperPattern: PaperPattern,
    settings: RenderingSettings,
    skipClear: boolean = false
) => {
    if (!skipClear) {
        switch (paperMaterial) {
            case 'cream':
                ctx.fillStyle = '#FAF9F6';
                ctx.fillRect(0, 0, width, height);
                break;
            case 'yellow':
                ctx.fillStyle = '#FEF9C3';
                ctx.fillRect(0, 0, width, height);
                break;
            case 'aged':
                drawAgedTexture(ctx, width, height);
                break;
            case 'recycled':
                drawRecycledTexture(ctx, width, height);
                break;
            case 'parchment':
                drawParchmentTexture(ctx, width, height);
                break;
            case 'white':
            default:
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);
                break;
        }
    }

    drawAgingEffects(ctx, width, height, settings);
    drawPatterns(ctx, width, height, paperPattern, settings);
};

export const renderHandwriting = (
    canvas: HTMLCanvasElement,
    text: string,
    fontFamily: string,
    fontSize: number,
    inkColor: string,
    settings: RenderingSettings,
    paperMaterial: PaperMaterial,
    paperPattern: PaperPattern,
    options: { skipClear?: boolean; regionWidth?: number; regionHeight?: number } = {}
) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = options.regionWidth || canvas.width;
    const height = options.regionHeight || canvas.height;

    const lang = detectLanguage(text);
    const isRtl = lang === 'ar';

    drawPaperBackground(ctx, width, height, paperMaterial, paperPattern, settings, options.skipClear);
    // Draw decorations ON TOP of aging and patterns
    drawDecorations(ctx, width, height, settings);

    // ... text rendering logic ...
    ctx.fillStyle = inkColor;
    ctx.textAlign = isRtl ? 'right' : 'left';
    ctx.textBaseline = 'bottom';

    const paragraphs = text.split('\n');
    let currentY = settings.margins.top + fontSize;
    const lineHeightPx = settings.lineHeight * fontSize;

    let contentLeft = settings.margins.left;
    let contentRight = settings.margins.right;

    if (paperPattern === 'cornell') {
        contentLeft = width * 0.3 + 20;
    }
    if (paperPattern === 'todo') {
        contentLeft = settings.margins.left + 50;
    }

    paragraphs.forEach((paragraph, pIdx) => {
        if (!paragraph.trim()) {
            currentY += lineHeightPx;
            return;
        }

        const words = paragraph.split(' ');
        let currentX = isRtl ? width - contentRight : contentLeft;

        words.forEach((word, wIdx) => {
            ctx.font = `${fontSize}px ${fontFamily}`;
            const wordWidth = ctx.measureText(word).width;

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

            if (currentY > height - settings.margins.bottom) return;

            const chars = word.split('');
            chars.forEach((char, cIdx) => {
                const seed = pIdx * 1000 + wIdx * 100 + cIdx;
                const noiseVal = noise.noise(seed * 0.1);

                const baselineShift = noiseVal * settings.baselineVar;
                const rotation = noiseVal * (settings.rotationVar * Math.PI / 180);
                const letterSpacing = settings.letterSpacing + (noise.noise(seed * 0.5) * settings.letterSpacingVar);
                const pressure = 1 - (Math.abs(noise.noise(seed * 0.2)) * settings.pressureVar);

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

            const spaceWidth = fontSize * 0.3 * settings.wordSpacing;
            if (isRtl) currentX -= spaceWidth;
            else currentX += spaceWidth;
        });

        currentY += lineHeightPx;
    });

    applyRealisticEffects(ctx, width, height, settings);
};
