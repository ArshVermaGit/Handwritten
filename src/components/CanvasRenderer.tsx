import { useEffect, useRef, useState } from 'react';
import { useStore } from '../lib/store';
import { getFontFamily, renderHandwriting } from '../utils/handwriting';
import { Move } from 'lucide-react';

export default function CanvasRenderer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const {
        text,
        previousText,
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
        rotation,
        showGrid,
        compareMode,
        pan,
        setPan
    } = useStore();

    const [isPanning, setIsPanning] = useState(false);
    const [startPan, setStartPan] = useState({ x: 0, y: 0 });

    const getDimensions = () => {
        let width = 1240;
        let height = 1754;

        switch (paperSize) {
            case 'letter':
                width = 1275; height = 1650; break;
            case 'a5':
                width = 874; height = 1240; break;
            case 'a6':
                width = 620; height = 874; break;
            case 'legal':
                width = 1275; height = 2100; break;
            case 'tabloid':
                width = 1650; height = 2550; break;
            case 'a4':
            default:
                width = 1240; height = 1754; break;
        }

        if (paperOrientation === 'landscape') {
            return { width: height, height: width };
        }
        return { width, height };
    };

    const dimensions = getDimensions();
    const baseWidth = dimensions.width;
    const baseHeight = dimensions.height;

    const render = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        const effectiveWidth = compareMode ? baseWidth * 2 + 80 : baseWidth;

        canvas.width = effectiveWidth * dpr;
        canvas.height = baseHeight * dpr;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.scale(dpr, dpr);

        if (compareMode) {
            // Render Previous
            ctx.save();
            renderHandwriting(canvas, previousText || "No previous state captured.", getFontFamily(handwritingStyle, customFonts), fontSize, inkColor, settings, paperMaterial, paperPattern, {
                skipClear: false,
                regionWidth: baseWidth,
                regionHeight: baseHeight
            });

            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 20px Inter';
            ctx.fillText('HISTORICAL DRAFT', 60, baseHeight - 60);
            ctx.restore();

            // Divider
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(baseWidth, 0, 80, baseHeight);
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(baseWidth + 40, 0);
            ctx.lineTo(baseWidth + 40, baseHeight);
            ctx.stroke();

            // Render Current
            ctx.save();
            ctx.translate(baseWidth + 80, 0);
            renderHandwriting(canvas, text, getFontFamily(handwritingStyle, customFonts), fontSize, inkColor, settings, paperMaterial, paperPattern, {
                skipClear: false,
                regionWidth: baseWidth,
                regionHeight: baseHeight
            });

            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 20px Inter';
            ctx.fillText('LIVE SYNTHESIS', 60, baseHeight - 60);
            ctx.restore();
        } else {
            renderHandwriting(canvas, text, getFontFamily(handwritingStyle, customFonts), fontSize, inkColor, settings, paperMaterial, paperPattern, {
                skipClear: false,
                regionWidth: baseWidth,
                regionHeight: baseHeight
            });
        }

        if (showGrid) {
            ctx.save();
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 0.5;
            const step = 40;
            ctx.beginPath();
            for (let x = 0; x <= effectiveWidth; x += step) {
                ctx.moveTo(x, 0); ctx.lineTo(x, baseHeight);
            }
            for (let y = 0; y <= baseHeight; y += step) {
                ctx.moveTo(0, y); ctx.lineTo(effectiveWidth, y);
            }
            ctx.stroke();
            ctx.restore();
        }
    };

    useEffect(() => {
        const timer = setTimeout(render, 50);
        return () => clearTimeout(timer);
    }, [text, previousText, handwritingStyle, fontSize, inkColor, paperMaterial, paperPattern, paperSize, paperOrientation, settings, customFonts, showGrid, compareMode]);

    useEffect(() => {
        const handleEditorScroll = (e: any) => {
            if (scrollContainerRef.current) {
                const scrollPercent = e.detail;
                const maxScroll = scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight;
                scrollContainerRef.current.scrollTo({
                    top: maxScroll * scrollPercent,
                    behavior: 'auto'
                });
            }
        };

        window.addEventListener('editor-scroll', handleEditorScroll);
        return () => window.removeEventListener('editor-scroll', handleEditorScroll);
    }, []);

    const onMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0 && e.altKey) {
            setIsPanning(true);
            setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isPanning) return;
        setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    };

    const onMouseUp = () => setIsPanning(false);

    const effectiveWidth = compareMode ? baseWidth * 2 + 80 : baseWidth;

    return (
        <div
            ref={scrollContainerRef}
            className="w-full h-full overflow-auto custom-scrollbar bg-gray-100/30 selection:bg-transparent"
        >
            <div className="min-h-full min-w-full flex items-center justify-center p-24">
                <div
                    ref={containerRef}
                    className="relative cursor-grab active:cursor-grabbing shrink-0"
                    style={{
                        width: `${effectiveWidth * zoom}px`,
                        height: `${baseHeight * zoom}px`,
                        transform: `rotate(${rotation}deg) translate(${pan.x}px, ${pan.y}px)`,
                        transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
                    }}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                >
                    <canvas
                        ref={canvasRef}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        className="shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] bg-white"
                    />
                </div>
            </div>

            <div className="fixed bottom-6 right-6 z-20">
                <div className="bg-white border border-gray-100 px-4 py-2 text-[8px] font-black uppercase tracking-widest flex items-center gap-3 shadow-premium">
                    <Move size={12} className="text-gray-400" />
                    <span className="text-gray-400">Alt + Drag to Pan</span>
                </div>
            </div>
        </div>
    );
}
