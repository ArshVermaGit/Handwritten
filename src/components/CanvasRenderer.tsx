import { useEffect, useRef } from 'react';
import { useStore } from '../lib/store';
import { getFontFamily, renderHandwriting } from '../utils/handwriting';

export default function CanvasRenderer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {
        text,
        handwritingStyle,
        fontSize,
        lineSpacing,
        paperType,
        inkColor,
    } = useStore();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // ultra-high resolution for professional output (A4 aspect ratio)
        canvas.width = 1240;
        canvas.height = 1754;

        const fontFamily = getFontFamily(handwritingStyle);
        renderHandwriting(
            canvas,
            text,
            fontFamily,
            fontSize * 1.5, // Scale font for higher resolution
            lineSpacing,
            paperType,
            inkColor
        );
    }, [text, handwritingStyle, fontSize, lineSpacing, paperType, inkColor]);

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <canvas
                ref={canvasRef}
                className="max-w-full h-auto shadow-2xl bg-white border border-gray-100"
            />
        </div>
    );
}
